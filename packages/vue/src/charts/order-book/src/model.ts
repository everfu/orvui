export type DepthLevel = { price: number; size: number; total: number };
type Level = { price: number; size: number };
export type DepthSummary = {
  side: "bid" | "ask";
  levels: number;
  size: number;
  quote: number;
  averagePrice: number;
};

function sideDepth(
  source: readonly Level[],
  descending: boolean,
  count: number,
): DepthLevel[] {
  const sizes = new Map<number, number>();
  source.forEach(({ price, size }) => {
    if (
      price > 0 &&
      size > 0 &&
      Number.isFinite(price) &&
      Number.isFinite(size)
    )
      sizes.set(price, (sizes.get(price) ?? 0) + size);
  });
  const prices = [...sizes.keys()]
    .sort((a, b) => (descending ? b - a : a - b))
    .slice(0, count);
  const result: DepthLevel[] = [];
  let cumulative = 0;
  for (const price of prices) {
    const size = sizes.get(price)!;
    cumulative += size;
    result.push({ price, size, total: cumulative });
  }
  return result;
}

export function summarizeDepth(
  levels: readonly DepthLevel[],
  side: "bid" | "ask",
): DepthSummary {
  let size = 0;
  let quote = 0;
  for (const level of levels) {
    size += level.size;
    quote += level.price * level.size;
  }
  return {
    side,
    levels: levels.length,
    size,
    quote,
    averagePrice: size ? quote / size : 0,
  };
}

export function buildOrderBook(
  bids: readonly Level[],
  asks: readonly Level[],
  levels: number,
) {
  const count = Number.isFinite(levels) ? Math.max(0, Math.floor(levels)) : 9;
  const result = {
    bids: sideDepth(bids, true, count),
    asks: sideDepth(asks, false, count),
  };
  const bidTotal = result.bids.at(-1)?.total ?? 0;
  const askTotal = result.asks.at(-1)?.total ?? 0;
  const bid = result.bids[0];
  const ask = result.asks[0];
  return {
    ...result,
    bidTotal,
    askTotal,
    maxTotal: Math.max(bidTotal, askTotal),
    midpoint: bid && ask ? (bid.price + ask.price) / 2 : null,
    spread: bid && ask ? ask.price - bid.price : null,
  };
}
