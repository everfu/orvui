import type {
  PredictionMarketOrderValue,
  PredictionMarketOutcome,
  PredictionMarketQuote,
} from "./types";
export function sanitizeAmount(value: string) {
  let whole = "",
    fraction = "",
    decimal = false;
  for (const char of value) {
    if (char === "." && !decimal) {
      decimal = true;
      continue;
    }
    if (char < "0" || char > "9") continue;
    if (!decimal) whole += char;
    else if (fraction.length < 2) fraction += char;
  }
  return whole + (decimal ? "." + fraction : "");
}
export const parseAmount = (value: string) => Number(value) || 0;
export const formatCurrency = (value: number, maximumFractionDigits = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);
export const formatCompactCurrency = (value: number) =>
  formatCurrency(value, value >= 100 || value % 1 === 0 ? 0 : 2);
export function formatCents(value: number) {
  const cents = value * 100;
  return cents.toFixed(Number.isInteger(cents) ? 0 : 1) + "¢";
}
export function buildQuote({
  order,
  outcome,
  balance,
  position,
  minTrade,
}: {
  order: PredictionMarketOrderValue;
  outcome: PredictionMarketOutcome;
  balance: number;
  position: number;
  minTrade: number;
}): PredictionMarketQuote {
  const amount = parseAmount(order.amount),
    price = Math.min(0.99, Math.max(0.01, outcome.price));
  const shares = order.mode === "buy" ? amount / price : amount,
    payout = order.mode === "buy" ? shares : amount * price;
  if (amount <= 0)
    return {
      valid: false,
      amount,
      price,
      shares: 0,
      payout: 0,
      error: "Enter an amount",
    };
  const error =
    order.mode === "buy"
      ? amount < minTrade
        ? `Minimum ${formatCompactCurrency(minTrade)}`
        : amount > balance
          ? "Insufficient balance"
          : undefined
      : amount > position
        ? "Not enough shares"
        : undefined;
  return {
    valid: error === undefined,
    amount,
    price,
    shares,
    payout,
    ...(error ? { error } : {}),
  };
}
export function keyedAmountChars(value: string) {
  const occurrences: Record<string, number> = Object.create(null);
  return Array.from(value, (char) => {
    const occurrence = occurrences[char] ?? 0;
    occurrences[char] = occurrence + 1;
    return { id: `${char}-${occurrence}`, char };
  });
}
export function amountInputSize(value: string) {
  const count = Array.from(value).filter(
    (char) => char >= "0" && char <= "9",
  ).length;
  return count >= 10
    ? "text-3xl sm:text-4xl"
    : count >= 8
      ? "text-4xl sm:text-5xl"
      : count >= 6
        ? "text-[44px] sm:text-[56px]"
        : "text-5xl sm:text-6xl";
}
export function payoutTickerSize(value: number) {
  const count = formatCurrency(value).length;
  return count >= 16
    ? "text-xl sm:text-2xl"
    : count >= 13
      ? "text-2xl"
      : count >= 10
        ? "text-3xl"
        : "text-4xl";
}
export const probability = (value: number) =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
export function historyPoints(values: number[]) {
  const samples = values.filter(Number.isFinite);
  if (samples.length < 2) return null;
  let low = Infinity,
    high = -Infinity;
  for (const sample of samples) {
    low = Math.min(low, sample);
    high = Math.max(high, sample);
  }
  return samples
    .map(
      (value, index) =>
        `${2 + (44 * index) / (samples.length - 1)},${18 - 14 * (high === low ? 0.5 : (value - low) / (high - low))}`,
    )
    .join(" ");
}
