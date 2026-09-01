// ─────────────────────────────────────────────────────────────
// DTW (Dynamic Time Warping) Mock
// In a real system, this runs on the Python server to compare
// two time-series arrays (trainee skeleton vs reference skeleton)
// via fastdtw or tslearn. Each variance field represents the
// "distance" between the trainee and the certified reference clip.
// ─────────────────────────────────────────────────────────────

export interface DTWResult {
  /** BPM delta vs 110 BPM reference. Negative = too slow. */
  rateVarianceBpm: number;
  /** Depth delta vs 5.5 cm reference. Negative = too shallow. */
  depthVarianceCm: number;
  /** Percentage of compressions with incomplete recoil (0–100). */
  releaseVariancePct: number;
  /** Posture DTW distance (0 = perfect; <15 = great; >30 = poor). */
  postureVarianceScore: number;
}

/**
 * Minimal seeded LCG (Linear Congruential Generator) so each call
 * produces different but reproducible variance.  The seed defaults
 * to `Date.now()` so live demo runs feel live.
 */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff; // [0, 1)
  };
}

/**
 * Maps a [0,1) value to the range [min, max].
 */
function range(rand: number, min: number, max: number): number {
  return +(min + rand * (max - min)).toFixed(2);
}

/**
 * Mocks a server-side DTW comparison between a trainee submission
 * and the certified CPR reference clip (`ref-002`).
 *
 * @param _submissionId  The trainee submission ID (used for logging in prod).
 * @param seed           Optional seed for reproducibility in tests.
 *                       Defaults to Date.now() for realistic per-run variance.
 */
export function mockCalculateDTW(
  _submissionId: string,
  seed: number = Date.now()
): DTWResult {
  const rand = lcg(seed);

  // Realistic variance distributions for a learner who is decent but not perfect.
  // Positive rateVarianceBpm = too fast; negative = too slow.
  const rateVarianceBpm  = range(rand(), -18, 12);   // e.g. -8 → 102 BPM
  const depthVarianceCm  = range(rand(), -1.5, 0.5); // e.g. -0.4 → 5.1 cm
  const releaseVariancePct = range(rand(), 0, 25);   // % of bad recoils
  const postureVarianceScore = range(rand(), 5, 40); // DTW distance units

  return {
    rateVarianceBpm,
    depthVarianceCm,
    releaseVariancePct,
    postureVarianceScore,
  };
}
