import type { ReturnsCalendarCell } from "./types";
export const UP = "var(--success)",
  DOWN = "var(--destructive)";
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const COLS = MONTHS.map((name, m) => ({ name, initial: name[0], m }));
export const YEAR = 12;
export function compound(run: number[]) {
  let product = 1;
  for (const percentage of run) product *= 1 + percentage / 100;
  return (product - 1) * 100;
}
export const signed = (value: number, precision: number) =>
  `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(precision)}`;
export const ink = (color: string) =>
  `oklch(from ${color} min(l, var(--ink-l, 1)) c h)`;
export const tint = (value: number, range: number, on: boolean) =>
  `color-mix(in srgb, ${value >= 0 ? UP : DOWN} ${Math.round(Math.min(Math.abs(value) / range, 1) * 55 + (on ? 24 : 8))}%, transparent)`;
export const same = (cell: ReturnsCalendarCell | null, y: number, m: number) =>
  cell?.y === y && cell?.m === m;
export const RING = "inset 0 0 0 1.5px var(--foreground)";
