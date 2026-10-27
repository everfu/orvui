export function sidebarTrajectory(from: { x: number; y: number }, toY: number) {
  const distance = toY - from.y, travel = Math.abs(distance);
  const longJump = Math.max(0, Math.min(1, (travel - 48) / 120));
  const bow = Math.min(0.26, 40 / Math.max(1, travel)) * travel;
  return {
    transition: { type: "spring" as const, stiffness: 280 - 60 * longJump, damping: 18 + longJump, mass: 0.3 + 0.15 * longJump },
    at(progress: number) { return { x: from.x * (1 - progress) - 2 * bow * progress * (1 - progress), y: from.y + distance * progress }; },
  };
}
