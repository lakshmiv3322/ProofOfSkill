// ─────────────────────────────────────────────────────────────
// LLM Feedback Generator with Fail-safe
// ─────────────────────────────────────────────────────────────

const FALLBACK_TEMPLATES: Record<string, (metrics: Record<string, number>) => string> = {
  'cpr-rate': (m) => 
    `Your compression rate averaged ${m.actualBpm} BPM. The target range is 100-120 BPM.`,
  'cpr-depth': (m) => 
    `Your compression depth averaged ${m.actualDepthCm.toFixed(1)} cm. The target depth is 5-6 cm.`,
  'cpr-recoil': (m) => 
    `You had incomplete recoil on ${m.recoilVariancePct}% of compressions. Ensure full chest release.`,
  'cpr-posture': () => 
    `Maintain straight arms and position your shoulders directly over your hands.`,
  'default': () => 
    `Performance assessed against rubric standard.`,
};

/**
 * Simulates a call to Claude API to generate coaching feedback.
 */
async function simulateLLMCall(criterionId: string, score: number, metrics: Record<string, number>): Promise<string> {
  return new Promise((resolve) => {
    // Simulate network delay (1000ms - 3000ms)
    // If it goes over 2000ms, the Promise.race will catch it.
    const delay = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
      let narrative = "";
      if (criterionId === 'cpr-rate') {
        narrative = score === 100 
          ? `Excellent rhythm! You maintained an optimal rate of ${metrics.actualBpm} BPM throughout the cycle, ensuring effective blood flow.`
          : `You were slightly outside the optimal zone at ${metrics.actualBpm} BPM. Focus on keeping a steady, slightly faster rhythm—think of the beat to 'Stayin' Alive'.`;
      } else if (criterionId === 'cpr-depth') {
        narrative = score === 100
          ? `Great compression depth (${metrics.actualDepthCm.toFixed(1)} cm). You are pushing hard enough to be effective without risking unnecessary injury.`
          : `Your depth averaged ${metrics.actualDepthCm.toFixed(1)} cm. Make sure you are using your core weight to push down at least 5 cm.`;
      } else {
         narrative = `AI analysis complete for ${criterionId}. Score: ${score}/100.`;
      }
      resolve(narrative);
    }, delay);
  });
}

/**
 * Generates feedback using LLM, but falls back to static templates if > 2000ms.
 */
export async function generateFeedback(
  criterionId: string, 
  score: number, 
  metrics: Record<string, number>
): Promise<{ text: string; isFallback: boolean }> {
  
  const fallbackFn = FALLBACK_TEMPLATES[criterionId] || FALLBACK_TEMPLATES['default'];
  const fallbackText = fallbackFn(metrics);

  const timeoutPromise = new Promise<{ text: string; isFallback: boolean }>((resolve) => {
    setTimeout(() => {
      console.warn(`[Fail-safe] LLM timeout for ${criterionId}, using template.`);
      resolve({ text: fallbackText, isFallback: true });
    }, 2000);
  });

  const llmPromise = simulateLLMCall(criterionId, score, metrics)
    .then((text) => ({ text, isFallback: false }));

  // Race the LLM call against the 2-second timeout
  return Promise.race([llmPromise, timeoutPromise]);
}
