export interface DonutSegment {
  id: string;
  name: string;
  color: string;
  value: number;
}
export type PlacedSegment = DonutSegment & { share: number; path: string };
export const DONUT_SIZE = 200;

type RingOptions = { radius: number; thickness: number; gap: number };
function coordinate(radius: number, angle: number): [number, number] {
  const radians = (angle * Math.PI) / 180;
  return [
    DONUT_SIZE / 2 + radius * Math.sin(radians),
    DONUT_SIZE / 2 - radius * Math.cos(radians),
  ];
}
function arc(radius: number, from: number, to: number) {
  const start = coordinate(radius, from);
  const end = coordinate(radius, to);
  return `M ${start[0]} ${start[1]} A ${radius} ${radius} 0 ${to - from > 180 ? 1 : 0} 1 ${end[0]} ${end[1]}`;
}
export function buildDonut(
  segments: readonly DonutSegment[],
  options: RingOptions,
) {
  const values: DonutSegment[] = [];
  let total = 0;
  for (const segment of segments) {
    if (Number.isFinite(segment.value) && segment.value > 0) {
      values.push(segment);
      total += segment.value;
    }
  }
  const { radius, thickness, gap } = options;
  let angle = 0;
  const inset = gap / 2 + ((thickness / (2 * radius)) * 180) / Math.PI;
  const placed: PlacedSegment[] = [];
  for (const segment of values) {
    const share = total ? segment.value / total : 0;
    const nextAngle = angle + share * 360;
    let path: string;
    if (values.length === 1) {
      const start = coordinate(radius, 0);
      const opposite = coordinate(radius, 180);
      path = `M ${start[0]} ${start[1]} A ${radius} ${radius} 0 1 1 ${opposite[0]} ${opposite[1]} A ${radius} ${radius} 0 1 1 ${start[0]} ${start[1]}`;
    } else {
      const startAngle = angle + inset;
      path = arc(
        radius,
        startAngle,
        Math.max(startAngle + 0.01, nextAngle - inset),
      );
    }
    placed.push({ ...segment, share, path });
    angle = nextAngle;
  }
  return { placed, total };
}
