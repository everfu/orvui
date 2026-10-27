type Point = { x: number; y: number };
type Box = { left: number; top: number; right: number; bottom: number };
const cross = (a: Point, b: Point, c: Point) =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
const squared = (a: Point, b: Point) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
/** Gift-wrap the two rectangles into the convex pointer-travel corridor. */
export function graceArea(exit: Point, box: Box): Point[] {
  const points = [
    { x: exit.x - 5, y: exit.y - 5 },
    { x: exit.x + 5, y: exit.y - 5 },
    { x: exit.x + 5, y: exit.y + 5 },
    { x: exit.x - 5, y: exit.y + 5 },
    { x: box.left, y: box.top },
    { x: box.right, y: box.top },
    { x: box.right, y: box.bottom },
    { x: box.left, y: box.bottom },
  ].filter(
    (point, index, all) =>
      all.findIndex((other) => other.x === point.x && other.y === point.y) ===
      index,
  );
  const start = points.reduce((best, point) =>
    point.x < best.x || (point.x === best.x && point.y < best.y) ? point : best,
  );
  const hull: Point[] = [];
  let current = start;
  do {
    hull.push(current);
    let next = points.find((point) => point !== current)!;
    for (const point of points) {
      if (point === current) continue;
      const direction = cross(current, next, point);
      if (
        direction < 0 ||
        (direction === 0 && squared(current, point) > squared(current, next))
      )
        next = point;
    }
    current = next;
  } while (current !== start && hull.length <= points.length);
  return hull;
}
export function inBox(point: Point, box: Box) {
  return (
    box.left <= point.x &&
    point.x <= box.right &&
    box.top <= point.y &&
    point.y <= box.bottom
  );
}
export function inPolygon(point: Point, polygon: Point[]) {
  if (polygon.length < 3) return false;
  // All corridor polygons are convex. A point lies inside every oriented edge.
  let orientation = 0;
  for (let index = 0; index < polygon.length; index++) {
    const side = Math.sign(
      cross(polygon[index]!, polygon[(index + 1) % polygon.length]!, point),
    );
    if (!side) continue;
    if (orientation && side !== orientation) return false;
    orientation = side;
  }
  return true;
}
