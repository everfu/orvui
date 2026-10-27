export const STEPS = [0, 24, 46, 70, 94] as const;
export const EMPTY = "color-mix(in srgb, var(--foreground) 6%, transparent)";
export const CELL = 16,
  GAP = 4,
  PITCH = CELL + GAP,
  MONTH_ROW = 12;
export const DAYS = Array.from({ length: 7 }, (_, d) => ({ id: `d${d}`, d }));
export const LIFT = [1.3, 1.08, 1.03];
export function startOfDay(value: Date) {
  const day = new Date(value);
  day.setUTCHours(0, 0, 0, 0);
  return day;
}
export function addDays(value: Date, count: number) {
  const day = new Date(value);
  day.setUTCDate(day.getUTCDate() + count);
  return day;
}
export function mondayOf(value: Date) {
  const day = startOfDay(value);
  return addDays(day, -((day.getUTCDay() + 6) % 7));
}
const utc = { timeZone: "UTC" };
export const fmtDay = new Intl.DateTimeFormat("en-US", {
  ...utc,
  weekday: "short",
  month: "short",
  day: "numeric",
});
export const fmtMonth = new Intl.DateTimeFormat("en-US", {
  ...utc,
  month: "short",
});
export const fmtRange = new Intl.DateTimeFormat("en-US", {
  ...utc,
  month: "short",
  day: "numeric",
});
