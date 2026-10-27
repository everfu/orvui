import type { PriceHistoryPoint } from "./types";
export const fmtScrubDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "short",
  month: "short",
  day: "numeric",
});
export const UP = "var(--success)",
  MID = "var(--accent)",
  LOW = "var(--warning)";
export const W = 520,
  H = 236,
  PAD = { l: 36, r: 108, t: 16, b: 28 };
export const ink = (color: string) =>
  `oklch(from ${color} min(l, var(--ink-l, 1)) c h)`;
export const EMPTY_HISTORY: PriceHistoryPoint[] = [];
const axis = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  year: "numeric",
});
export const fmtAxisDate = (date: string) => axis.format(new Date(date));
