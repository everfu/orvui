import type { DateRange } from "./types";
export const DAY = 86_400_000;
export function parse(date: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const valid = match && new Date(0);
  if (valid && match) {
    valid.setUTCHours(0, 0, 0, 0);
    valid.setUTCFullYear(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
    );
  }
  if (!valid || valid.toISOString().slice(0, 10) !== date)
    throw new Error(`Invalid calendar date: ${date}. Use YYYY-MM-DD.`);
  return valid.getTime();
}
export function iso(time: number) {
  return new Date(time).toISOString().slice(0, 10);
}
export function monthOf(date: string) {
  return date.slice(0, 7) + "-01";
}
export function shiftMonth(date: string, offset: number) {
  const source = new Date(parse(date));
  const serial = Math.max(
    0,
    Math.min(
      9999 * 12 + 11,
      source.getUTCFullYear() * 12 + source.getUTCMonth() + Math.trunc(offset),
    ),
  );
  const year = Math.floor(serial / 12),
    month = serial % 12;
  const target = new Date(0);
  target.setUTCFullYear(year, month + 1, 0);
  target.setUTCHours(0, 0, 0, 0);
  const last = target.getUTCDate();
  target.setUTCFullYear(year, month, Math.min(source.getUTCDate(), last));
  return iso(target.getTime());
}
export function ordered(a: string, b: string): Required<DateRange> {
  const [from, to] = [a, b].sort();
  return { from: from!, to: to! };
}
