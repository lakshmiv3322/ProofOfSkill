// ─────────────────────────────────────────────────────────────
// Deterministic Rubric Engine
// Pure math calculation. LLMs are NOT allowed to decide the score.
// ─────────────────────────────────────────────────────────────
import { mockCalculateDTW } from './dtw';
import type { RubricConfig } from '@/types/database';

export interface RubricResult {
  overallScore: number;
  criteriaScores: Record<string, number>;
  metrics: Record<string, number>;
}

export function evaluateSubmission(
  submissionId: string,
  rubricConfig: RubricConfig
): RubricResult {
  // 1. Get raw mathematical variance from DTW ML pipeline
  const dtwResult = mockCalculateDTW(submissionId);
  
  const criteriaScores: Record<string, number> = {};
  let weightedTotal = 0;

  // 2. Map DTW outputs to rubric criteria based on strict rules
  rubricConfig.criteria.forEach((criterion) => {
    let score = 0;

    switch (criterion.id) {
      case 'cpr-rate': {
        // Target: 100-120 BPM. Let's say reference is 110.
        const actualBpm = 110 + dtwResult.rateVarianceBpm; // e.g., 102
        if (actualBpm >= 100 && actualBpm <= 120) score = 100;
        else if (actualBpm >= 90 && actualBpm < 100) score = 75;
        else if (actualBpm > 120 && actualBpm <= 130) score = 75;
        else score = 40;
        break;
      }
      case 'cpr-depth': {
        // Target: 5cm - 6cm. Let's say reference is 5.5cm.
        const actualDepth = 5.5 + dtwResult.depthVarianceCm; // e.g., 5.0
        if (actualDepth >= 5.0 && actualDepth <= 6.0) score = 100;
        else if (actualDepth >= 4.0 && actualDepth < 5.0) score = 60;
        else score = 0;
        break;
      }
      case 'cpr-recoil': {
        // Target: < 10% incomplete recoil
        if (dtwResult.releaseVariancePct <= 5) score = 100;
        else if (dtwResult.releaseVariancePct <= 15) score = 80;
        else score = 50;
        break;
      }
      case 'cpr-posture': {
        // Posture DTW distance (0 is perfect, < 20 is great)
        if (dtwResult.postureVarianceScore < 15) score = 100;
        else if (dtwResult.postureVarianceScore < 30) score = 80;
        else score = 60;
        break;
      }
      default:
        // Fallback for demo: assume a generic good score if criteria don't match exactly
        score = 85;
    }

    criteriaScores[criterion.id] = score;
    weightedTotal += (score * criterion.weight) / 100;
  });

  // Scale total against total_weight in config if needed (assuming 100 for now)
  const overallScore = Math.round((weightedTotal / rubricConfig.total_weight) * 100);

  return {
    overallScore,
    criteriaScores,
    metrics: {
      actualBpm: 110 + dtwResult.rateVarianceBpm,
      actualDepthCm: 5.5 + dtwResult.depthVarianceCm,
      recoilVariancePct: dtwResult.releaseVariancePct,
    }
  };
}
