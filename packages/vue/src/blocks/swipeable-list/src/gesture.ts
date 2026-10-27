import type { SwipeSide } from "./SwipeableList.vue";
export function resolveSwipeSide(
  position: number,
  velocity: number,
  open: SwipeSide | null,
  left: number,
  right: number,
  threshold: number,
): SwipeSide | null {
  if (open === "left")
    return position < left * 0.72 || velocity < -320 ? null : "left";
  if (open === "right")
    return Math.abs(position) < right * 0.72 || velocity > 320 ? null : "right";
  if (
    left > 0 &&
    position > 0 &&
    (position > Math.max(threshold, left * 0.46) ||
      (velocity > 720 && position > 14))
  )
    return "left";
  if (
    right > 0 &&
    position < 0 &&
    (position < -Math.max(threshold, right * 0.46) ||
      (velocity < -720 && position < -14))
  )
    return "right";
  return null;
}
