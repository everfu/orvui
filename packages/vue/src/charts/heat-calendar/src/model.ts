import type {
  HeatCalendarProps,
  HeatCalendarCell,
  HeatCalendarSelection,
} from "./types";
import {
  addDays,
  CELL,
  EMPTY,
  fmtMonth,
  GAP,
  MONTH_ROW,
  mondayOf,
  PITCH,
  STEPS,
  startOfDay,
} from "./utils";
export function buildHeatCalendar(
  props: HeatCalendarProps,
  today: Date | null,
  requested: HeatCalendarSelection | null,
  hovered: HeatCalendarCell | null,
) {
  const weeks = props.weeks ?? 16,
    maxCount = props.maxCount ?? 14,
    color = props.color ?? "var(--accent)";
  const end = props.endDate ? startOfDay(props.endDate) : today;
  const start = end ? addDays(mondayOf(end), -(weeks - 1) * 7) : null;
  const level = (w: number, d: number) =>
    Math.max(0, Math.min(1, props.values?.[w]?.[d] ?? 0));
  const bucket = (intensity: number) => Math.min(4, Math.floor(intensity * 5));
  const fill = (index: number) =>
    index === 0
      ? EMPTY
      : `color-mix(in srgb, ${color} ${STEPS[index]}%, transparent)`;
  const count = (intensity: number) => Math.round(intensity * maxCount);
  const dateOf = (w: number, d: number) =>
    start ? addDays(start, w * 7 + d) : null;
  function future(w: number, d: number) {
    const date = dateOf(w, d);
    return end !== null && date !== null && date > end;
  }
  function valid(cell: HeatCalendarCell) {
    return (
      Number.isInteger(cell.w) &&
      Number.isInteger(cell.d) &&
      cell.w >= 0 &&
      cell.w < weeks &&
      cell.d >= 0 &&
      cell.d < 7 &&
      !future(cell.w, cell.d)
    );
  }
  const selection =
    requested &&
    valid(requested.start) &&
    (!requested.end || valid(requested.end))
      ? requested
      : null;
  const pinned = selection?.start ?? null,
    spanEnd = selection?.end ?? null,
    hover = hovered && valid(hovered) ? hovered : null;
  const ordinal = (cell: HeatCalendarCell) => cell.w * 7 + cell.d;
  const spanTo = spanEnd ?? (pinned ? (hover ?? pinned) : null);
  const span =
    pinned && spanTo
      ? {
          lo: Math.min(ordinal(pinned), ordinal(spanTo)),
          hi: Math.max(ordinal(pinned), ordinal(spanTo)),
        }
      : null;
  let spanTotal = 0;
  if (span)
    for (let index = span.lo; index <= span.hi; index++) {
      const week = Math.floor(index / 7),
        day = index % 7;
      if (future(week, day)) break;
      spanTotal += count(level(week, day));
    }
  const cols = Array.from({ length: weeks }, (_, w) => {
    const date = start ? addDays(start, w * 7) : null,
      m = date?.getUTCMonth() ?? -1;
    const fresh =
      start !== null &&
      date !== null &&
      (w === 0 || addDays(start, (w - 1) * 7).getUTCMonth() !== m);
    return {
      id: `w${w}`,
      w,
      m,
      label: fresh && date ? fmtMonth.format(date) : null,
    };
  });
  if (cols[1]?.label || cols[2]?.label) cols[0].label = null;
  const hot = hover ?? spanEnd ?? pinned,
    tip = spanEnd ?? hover ?? pinned,
    tipDate = tip ? dateOf(tip.w, tip.d) : null;
  const tooltip =
    tip && tipDate
      ? {
          date: tipDate,
          count: count(level(tip.w, tip.d)),
          total: spanTotal,
          startDate: start && span ? addDays(start, span.lo) : tipDate,
          endDate: start && span ? addDays(start, span.hi) : tipDate,
          days: span ? span.hi - span.lo + 1 : 1,
        }
      : null;
  return {
    unit: props.unit ?? "commits",
    weeks,
    start,
    end,
    level,
    bucket,
    fill,
    count,
    dateOf,
    future,
    cols,
    selection,
    pinned,
    spanEnd,
    hover,
    span,
    spanTotal,
    hot,
    tip,
    hotMonth: hot ? (dateOf(hot.w, hot.d)?.getUTCMonth() ?? null) : null,
    tipX: tip ? tip.w * PITCH + CELL / 2 : 0,
    tipY: tip ? MONTH_ROW + GAP + tip.d * PITCH : 0,
    tooltip,
    valid,
    ordinal,
  };
}
