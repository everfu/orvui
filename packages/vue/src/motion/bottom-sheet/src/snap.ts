/** Resolve a detent step from vertical drag distance and release velocity. */
export function resolveBottomSheetSnap(current: number, count: number, offset: number, velocity: number, dismissThreshold = 120): number | null {
  const descending = velocity > 600 || offset > dismissThreshold;
  if (descending) {
    const canStepDown = current > 0 && velocity < 800 && offset < dismissThreshold * 1.6;
    return canStepDown ? current - 1 : null;
  }
  if (velocity < -500) return Math.min(current + 1, count - 1);
  const adjustment = offset > 80 && current > 0 ? -1 : offset < -80 && current + 1 < count ? 1 : 0;
  return current + adjustment;
}
