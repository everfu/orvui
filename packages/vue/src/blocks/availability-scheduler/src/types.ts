export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type TimeRange = { id: string; start: string; end: string };
export type DayAvailability = { enabled: boolean; ranges: TimeRange[] };
export type WeekAvailability = Record<DayKey, DayAvailability>;
export type TimeOption = { value: string; label: string };
export const WEEKDAYS: { key: DayKey; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
];
export const panelKey = (day: DayKey, id: string, edge: "start" | "end") =>
  `${day}:${id}:${edge}`;
export function toMinutes(value: string) {
  const parts = value.split(":");
  return Number(parts[0]) * 60 + Number(parts[1]);
}
export function toValue(minutes: number) {
  const bounded = Math.max(0, Math.min(1439, minutes));
  return `${String(Math.floor(bounded / 60)).padStart(2, "0")}:${String(bounded % 60).padStart(2, "0")}`;
}
export function label12(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;
}
export function buildOptions(step: number): TimeOption[] {
  const options: TimeOption[] = [];
  for (let minutes = 0; minutes < 1440; minutes += step) {
    const value = toValue(minutes);
    options.push({ value, label: label12(value) });
  }
  return options;
}
function withCurrent(
  options: TimeOption[],
  all: TimeOption[],
  current?: string,
) {
  if (!current || options.some((option) => option.value === current))
    return options;
  return [
    ...options,
    all.find((option) => option.value === current) ?? {
      value: current,
      label: label12(current),
    },
  ].sort((a, b) => toMinutes(a.value) - toMinutes(b.value));
}
export function clampRange(
  start: string,
  end: string,
  options: TimeOption[],
  changed: "start" | "end" = "start",
) {
  if (!options.length || toMinutes(end) > toMinutes(start))
    return { start, end };
  const slots = options.map((option) => toMinutes(option.value));
  const nearest = (value: string) => {
    const target = toMinutes(value);
    return slots.reduce(
      (best, slot) =>
        Math.abs(slot - target) < Math.abs(best - target) ? slot : best,
      slots[0],
    );
  };
  if (changed === "end") {
    const kept = nearest(end);
    const earlier = slots.filter((slot) => slot < kept).at(-1);
    if (earlier === undefined && slots.length > 1)
      return { start: toValue(slots[0]), end: toValue(slots[1]) };
    return { start: toValue(earlier ?? nearest(start)), end: toValue(kept) };
  }
  const kept = nearest(start),
    later = slots.find((slot) => slot > kept);
  if (later === undefined && slots.length > 1)
    return { start: toValue(slots.at(-2)!), end: toValue(slots.at(-1)!) };
  return { start: toValue(kept), end: toValue(later ?? nearest(end)) };
}
export function startOptions(
  options: TimeOption[],
  end: string,
  current?: string,
) {
  const earlier = options.filter(
    (option) => toMinutes(option.value) < toMinutes(end),
  );
  return withCurrent(
    earlier.length ? earlier : options.slice(0, 1),
    options,
    current,
  );
}
export function endOptions(
  options: TimeOption[],
  start: string,
  current?: string,
) {
  const later = options.filter(
    (option) => toMinutes(option.value) > toMinutes(start),
  );
  return withCurrent(
    later.length ? later : options.slice(-1),
    options,
    current,
  );
}
export function defaultWeek(): WeekAvailability {
  return Object.fromEntries(
    WEEKDAYS.map(({ key }, index) => [
      key,
      {
        enabled: index < 5,
        ranges: [{ id: `${key}-0`, start: "09:00", end: "17:00" }],
      },
    ]),
  ) as WeekAvailability;
}
