type Point = { x: number; y: number };

/** Keep consecutive preset transitions curving toward the same visual side. */
export function createPresetArc() {
  let curvature: number | undefined;
  return (from: Point, to: Point) => {
    const horizontal = to.x - from.x;
    const vertical = to.y - from.y;
    const horizontalTravel = Math.abs(horizontal) >= Math.abs(vertical);
    const dominant = horizontalTravel ? horizontal : vertical;
    let bend = dominant < 0 ? 0.3 : -0.3;
    let normalX = -vertical * bend;
    let normalY = horizontal * bend;
    const side = Math.sign(horizontalTravel ? normalY : normalX);
    if (curvature === undefined && side !== 0) curvature = side;
    else if (side !== 0 && curvature !== side) {
      normalX = -normalX;
      normalY = -normalY;
    }
    return (progress: number): Point => {
      const bow = 2 * progress * (1 - progress);
      return {
        x: from.x + horizontal * progress + normalX * bow,
        y: from.y + vertical * progress + normalY * bow,
      };
    };
  };
}
