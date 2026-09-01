// ─────────────────────────────────────────────────────────────
// DTW (Dynamic Time Warping) Mock
// In a real system, this runs on the Python server to compare 
// two time-series arrays (trainee skeleton vs reference skeleton).
// ─────────────────────────────────────────────────────────────

/**
 * Mocks a DTW result between a trainee and expert reference.
 * Returns numeric variances representing the "distance" between the two.
 */
export function mockCalculateDTW(traineeVideoId: string) {
  // Simulate standard CPR performance characteristics
  // A perfect performance would have 0 variance.
  
  // We'll hardcode a slightly imperfect but passing mock result
  return {
    rateVarianceBpm: -8, // Trainee was 8 BPM slower than target
    depthVarianceCm: -0.5, // Trainee was 0.5 cm shallower than target
    releaseVariancePct: 5, // 5% of compressions lacked full recoil
    postureVarianceScore: 12, // 12 "distance" units off perfect posture (lower is better)
  };
}
