export interface FunnelStage {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export function buildFunnel(stages: readonly FunnelStage[]) {
  const unique = new Map<string, FunnelStage>();
  let maximum = 0;
  for (const stage of stages) {
    if (
      unique.has(stage.id) ||
      !Number.isFinite(stage.value) ||
      stage.value < 0
    )
      continue;
    unique.set(stage.id, stage);
    maximum = Math.max(maximum, stage.value);
  }
  const values = [...unique.values()];
  const first = values[0]?.value ?? 0;
  const last = values.at(-1)?.value ?? 0;
  const rows = values.map((stage, index) => {
    const preceding = index > 0 ? values[index - 1].value : undefined;
    return {
      ...stage,
      proportion: maximum ? stage.value / maximum : 0,
      conversion: first ? (stage.value / first) * 100 : null,
      stepConversion:
        preceding !== undefined && preceding > 0
          ? (stage.value / preceding) * 100
          : null,
      change: preceding === undefined ? null : stage.value - preceding,
    };
  });
  return { rows, first, last, conversion: first ? (last / first) * 100 : null };
}

export function funnelPath(
  proportions: readonly number[],
  index: number,
  direction: "vertical" | "horizontal",
) {
  const own = proportions[index];
  const entry = index ? (proportions[index - 1] + own) / 2 : own;
  const exit =
    index + 1 < proportions.length ? (own + proportions[index + 1]) / 2 : own;
  const begin = index / proportions.length;
  const finish = (index + 1) / proportions.length;
  const center = (begin + finish) / 2;
  const quarter = (finish - begin) / 4;
  const at = (value: number, axis: number, side: -1 | 1) => {
    const cross = 0.5 + side * value * 0.46;
    return direction === "vertical"
      ? `${cross * 1000},${axis * 500}`
      : `${axis * 1000},${cross * 500}`;
  };
  return [
    `M${at(entry, begin, -1)} L${at(entry, begin, 1)}`,
    `C${at(entry, begin + quarter, 1)} ${at(own, center - quarter, 1)} ${at(own, center, 1)}`,
    `C${at(own, center + quarter, 1)} ${at(exit, finish - quarter, 1)} ${at(exit, finish, 1)}`,
    `L${at(exit, finish, -1)}`,
    `C${at(exit, finish - quarter, -1)} ${at(own, center + quarter, -1)} ${at(own, center, -1)}`,
    `C${at(own, center - quarter, -1)} ${at(entry, begin + quarter, -1)} ${at(entry, begin, -1)} Z`,
  ].join(" ");
}
