export interface LiquiditySnapshot {
  id: string;
  label: string;
  levels: readonly { price: number; size: number }[];
  price?: number;
}

export function buildLiquidityHeatmap(snapshots: readonly LiquiditySnapshot[]) {
  const snapshotsById = new Map<string, LiquiditySnapshot>();
  for (const snapshot of snapshots)
    if (!snapshotsById.has(snapshot.id))
      snapshotsById.set(snapshot.id, snapshot);
  const priceLevels = new Set<number>();
  let maximum = 0;
  const columns = [...snapshotsById.values()].map((snapshot) => {
    const levels = new Map<number, number>();
    for (const observation of snapshot.levels) {
      const { price, size } = observation;
      if (
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isFinite(size) ||
        size < 0
      )
        continue;
      const summed = (levels.get(price) ?? 0) + size;
      if (Number.isFinite(summed)) levels.set(price, summed);
    }
    for (const [price, size] of levels) {
      priceLevels.add(price);
      maximum = Math.max(maximum, size);
    }
    return { ...snapshot, levels };
  });
  return { columns, prices: [...priceLevels].sort((a, b) => b - a), maximum };
}

export function pricePosition(price: number, prices: readonly number[]) {
  const last = prices.length - 1;
  if (
    !Number.isFinite(price) ||
    last < 0 ||
    price > prices[0] ||
    price < prices[last]
  )
    return null;
  if (price === prices[last]) return last + 0.5;
  let lower = 0;
  let upper = last;
  while (upper - lower > 1) {
    const middle = (lower + upper) >>> 1;
    if (price > prices[middle]) upper = middle;
    else lower = middle;
  }
  return (
    lower + 0.5 + (prices[lower] - price) / (prices[lower] - prices[upper])
  );
}
