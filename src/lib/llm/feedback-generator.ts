// ─────────────────────────────────────────────────────────────
// LLM Narrative Layer with Fail-safe
// ─────────────────────────────────────────────────────────────
// Architecture:
//  1. `generateFullFeedback` accepts the rubric's CriterionDelta[]
//     from the deterministic engine — it never sets or reads the score.
//  2. For each criterion, it races a simulated Claude API call against
//     a 2-second timeout.
//  3. If the simulated LLM call takes >2 s, the rule-based fallback
//     template fires automatically so processing never stalls.
// ─────────────────────────────────────────────────────────────
import type { CriterionDelta } from '@/lib/scoring/rubric-engine';

// ── Types ──────────────────────────────────────────────────────

export interface FeedbackSection {
  criterionId: string;
  label: string;
  text: string;
  isFallback: boolean;
}

export interface FullFeedback {
  sections: FeedbackSection[];
  anyFallback: boolean;
}

// ── Fallback templates (rule-based, criterion-id-mapped) ──────
// Each template function receives the delta string so it can echo
// the exact measurement back to the learner.

const FALLBACK_TEMPLATES: Record<string, (delta: string) => string> = {
  'cpr-rate': (delta) => {
    if (delta.includes('Too Slow') || delta.includes('Significantly Too Slow')) {
      const bpm = extractNumber(delta, 'BPM:');
      return `Your compression rate averaged ${bpm} BPM, which is below the 100–120 BPM target. ` +
        `Try using a mental cue like the beat of 'Stayin' Alive' (♩≈103 BPM) or set a metronome app to 110 BPM. ` +
        `A consistent, slightly faster rhythm will significantly improve perfusion pressure.`;
    }
    if (delta.includes('Too Fast')) {
      const bpm = extractNumber(delta, 'BPM:');
      return `Your rate of ${bpm} BPM slightly exceeds the 120 BPM ceiling. ` +
        `Compressions that are too rapid allow insufficient ventricular filling between cycles. ` +
        `Slow your pace by roughly one compression every second — a quiet countdown helps.`;
    }
    return `Your compression rate is within the optimal 100–120 BPM range. Excellent rhythm control.`;
  },

  'cpr-depth': (delta) => {
    if (delta.includes('Too Shallow') || delta.includes('Critically Shallow')) {
      const depth = extractNumber(delta, 'Depth:');
      return `Your average compression depth was ${depth} cm, which is below the minimum 5 cm threshold. ` +
        `Drive your body weight forward from your hips rather than pushing with your arms alone. ` +
        `Imagine pressing to at least one-third the depth of the chest — you will feel the sternum flex.`;
    }
    if (delta.includes('Too Deep')) {
      const depth = extractNumber(delta, 'Depth:');
      return `At ${depth} cm your compressions exceed the 6 cm maximum. ` +
        `While rare, excessive depth increases rib fracture risk. ` +
        `Focus on feeling the sternum fully compressed without the chest collapsing entirely.`;
    }
    return `Excellent compression depth — you are consistently achieving 5–6 cm, which optimises stroke volume.`;
  },

  'cpr-recoil': (delta) => {
    const pct = extractNumber(delta, 'Recoil:');
    if (pct > 15) {
      return `On ${pct}% of compressions your hands or body weight remained in contact with the chest between strokes. ` +
        `This "leaning" prevents the heart from refilling and reduces cardiac output by up to 40%. ` +
        `After each compression, consciously let your arms rise fully before the next downstroke.`;
    }
    if (pct > 5) {
      return `${pct}% of your compressions showed minor incomplete recoil. ` +
        `Check that your arms fully straighten and that you feel a slight lift between each compression. ` +
        `This is a small but meaningful correction.`;
    }
    return `Full chest recoil achieved on virtually every compression — outstanding technique.`;
  },

  'cpr-posture': (delta) => {
    const dist = extractNumber(delta, 'Posture:');
    if (dist >= 35) {
      return `Posture analysis detected significant deviation (score: ${dist}): shoulders are not directly over your hands, ` +
        `causing force to be applied at an angle and reducing efficiency. ` +
        `Reposition yourself so your arms are vertical, lock your elbows, and engage your core throughout the cycle.`;
    }
    if (dist >= 15) {
      return `Minor posture variance detected (score: ${dist}). Ensure your elbows remain fully locked throughout each compression. ` +
        `Bent elbows absorb force that should go into the chest.`;
    }
    return `Posture is excellent — arms locked, shoulders over hands. Your mechanical advantage is maximised.`;
  },

  default: (delta) =>
    `Analysis complete for this criterion. ${delta}. ` +
    `Review the rubric indicators and reference video clip for detailed technique guidance.`,
};

// ── Simulated Claude API connector ───────────────────────────

/**
 * Simulates a Claude API call that takes the delta string from the
 * rubric engine and returns a rich coaching narrative.
 * Delay is uniformly random between 800 ms – 3200 ms so roughly
 * 40 % of calls will exceed the 2 s failsafe threshold.
 */
async function simulateLLMCall(
  criterionId: string,
  delta: string
): Promise<string> {
  return new Promise((resolve) => {
    const delay = 800 + Math.random() * 2400; // 800–3200 ms

    setTimeout(() => {
      // Compose a richer narrative from the delta string (mimics Claude output)
      const fallbackFn =
        FALLBACK_TEMPLATES[criterionId] ?? FALLBACK_TEMPLATES['default'];
      const base = fallbackFn(delta);

      // Add a "Claude-style" motivational suffix to distinguish LLM path from fallback
      const suffixes: Record<string, string> = {
        'cpr-rate':
          ' Remember: in a real cardiac arrest, every 10 BPM outside the window can halve effective perfusion.',
        'cpr-depth':
          ' Visualise pressing a car horn — firm, deliberate, and fully released each time.',
        'cpr-recoil':
          ' Practice with a CPR feedback device to receive real-time recoil coaching.',
        'cpr-posture':
          ' Great posture also protects your back during extended resuscitation cycles.',
      };

      resolve(base + (suffixes[criterionId] ?? ''));
    }, delay);
  });
}

// ── Helper ───────────────────────────────────────────────────

/** Extracts the first numeric value that follows a keyword in the delta string. */
function extractNumber(delta: string, after: string): number {
  const idx = delta.indexOf(after);
  if (idx === -1) return 0;
  const match = delta.slice(idx + after.length).match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

// ── Single-criterion failsafe (kept for backward compat) ─────

/**
 * @deprecated Use `generateFullFeedback` for the full rubric sweep.
 */
export async function generateFeedback(
  criterionId: string,
  _score: number,
  metrics: Record<string, number>
): Promise<{ text: string; isFallback: boolean }> {
  const delta = `BPM: ${metrics.actualBpm ?? 0}`;
  const fallbackFn =
    FALLBACK_TEMPLATES[criterionId] ?? FALLBACK_TEMPLATES['default'];
  const fallbackText = fallbackFn(delta);

  const timeoutPromise = new Promise<{ text: string; isFallback: boolean }>((resolve) => {
    setTimeout(() => {
      console.warn(`[Fail-safe] LLM timeout for ${criterionId}, using template.`);
      resolve({ text: fallbackText, isFallback: true });
    }, 2000);
  });

  const llmPromise = simulateLLMCall(criterionId, delta).then((text) => ({
    text,
    isFallback: false,
  }));

  return Promise.race([llmPromise, timeoutPromise]);
}

// ── Full rubric sweep ─────────────────────────────────────────

/**
 * Generates a coaching narrative section for every criterion in the rubric.
 * Each criterion independently races the simulated LLM against a 2-second
 * failsafe timeout, so the overall function always resolves quickly.
 *
 * CRITICAL: This function reads `delta` strings from the rubric engine output
 * and never reads or modifies numeric scores. Score integrity is maintained.
 */
export async function generateFullFeedback(
  deltas: CriterionDelta[]
): Promise<FullFeedback> {
  const sectionPromises = deltas.map(({ criterionId, label, delta }) => {
    const fallbackFn =
      FALLBACK_TEMPLATES[criterionId] ?? FALLBACK_TEMPLATES['default'];
    const fallbackText = fallbackFn(delta);

    // Per-criterion 2-second failsafe
    const timeoutPromise = new Promise<FeedbackSection>((resolve) => {
      setTimeout(() => {
        console.warn(`[Fail-safe] LLM timeout for criterion "${criterionId}" — using template.`);
        resolve({ criterionId, label, text: fallbackText, isFallback: true });
      }, 2000);
    });

    const llmPromise = simulateLLMCall(criterionId, delta).then(
      (text): FeedbackSection => ({ criterionId, label, text, isFallback: false })
    );

    return Promise.race([llmPromise, timeoutPromise]);
  });

  const sections = await Promise.all(sectionPromises);
  const anyFallback = sections.some((s) => s.isFallback);

  return { sections, anyFallback };
}
