export interface BumpSeries {
  id: string;
  name: string;
  ranks: readonly (number | null)[];
  color?: string;
}
export const BUMP_COLORS = [
  "#8b5cf6",
  "#0d9488",
  "#f59e0b",
  "#3b82f6",
  "#f43f5e",
  "#a3a33a",
];
export const PLOT = {
  width: 560,
  left: 32,
  right: 100,
  top: 28,
  bottom: 36,
  rowHeight: 44,
};

export function buildBumpChart(
  series: readonly BumpSeries[],
  periodCount: number,
) {
  const identities = new Set<string>();
  const distinctRanks = new Set<number>();
  const rows: (Omit<BumpSeries, "ranks" | "color"> & {
    color: string;
    ranks: (number | null)[];
  })[] = [];
  for (const seriesRow of series) {
    if (identities.has(seriesRow.id)) continue;
    identities.add(seriesRow.id);
    const ranks = Array.from({ length: periodCount }, (_, period) => {
      const candidate = seriesRow.ranks[period];
      if (
        candidate != null &&
        Number.isSafeInteger(candidate) &&
        candidate > 0
      ) {
        distinctRanks.add(candidate);
        return candidate;
      }
      return null;
    });
    rows.push({
      ...seriesRow,
      ranks,
      color: seriesRow.color ?? BUMP_COLORS[rows.length % BUMP_COLORS.length],
    });
  }
  const ranks = [...distinctRanks].sort((a, b) => a - b);
  const maxRank = ranks.at(-1) ?? 1;
  const drawingHeight = Math.max(1, Math.min(maxRank - 1, 8)) * PLOT.rowHeight;
  const drawingWidth = PLOT.width - PLOT.left - PLOT.right;
  function x(period: number) {
    return periodCount <= 1
      ? PLOT.left + drawingWidth / 2
      : PLOT.left + (period / (periodCount - 1)) * drawingWidth;
  }
  function y(rank: number) {
    return (
      PLOT.top +
      (maxRank === 1
        ? drawingHeight / 2
        : ((rank - 1) / (maxRank - 1)) * drawingHeight)
    );
  }
  return {
    rows,
    ranks,
    maxRank,
    height: PLOT.top + drawingHeight + PLOT.bottom,
    x,
    y,
  };
}

export function bumpPath(
  ranks: readonly (number | null)[],
  x: (i: number) => number,
  y: (rank: number) => number,
) {
  const commands: string[] = [];
  let last: [number, number] | undefined;
  for (let i = 0; i < ranks.length; i++) {
    const rank = ranks[i];
    if (rank === null || rank === undefined) {
      last = undefined;
      continue;
    }
    const current: [number, number] = [x(i), y(rank)];
    if (!last) commands.push(`M ${current[0]} ${current[1]}`);
    else {
      const middle = (last[0] + current[0]) / 2;
      commands.push(
        `C ${middle} ${last[1]}, ${middle} ${current[1]}, ${current[0]} ${current[1]}`,
      );
    }
    last = current;
  }
  return commands.join(" ");
}
