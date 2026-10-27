import type {
  ReturnsCalendarProps,
  ReturnsCalendarCell,
  ReturnsCalendarSelection,
} from "./types";
import { compound, MONTHS, YEAR } from "./utils";
export function buildReturnsCalendar(
  props: ReturnsCalendarProps,
  requested: ReturnsCalendarSelection | null,
  hovered: ReturnsCalendarCell | null,
) {
  const years = props.years ?? [],
    values = props.returns ?? [];
  const valid = (cell: ReturnsCalendarCell) =>
    Number.isInteger(cell.y) &&
    Number.isInteger(cell.m) &&
    cell.y >= 0 &&
    cell.y < years.length &&
    cell.m >= 0 &&
    cell.m <= YEAR;
  const sameTrack = (first: ReturnsCalendarCell, second: ReturnsCalendarCell) =>
    (first.m === YEAR) === (second.m === YEAR);
  const selection =
    requested &&
    valid(requested.start) &&
    (!requested.end ||
      (valid(requested.end) && sameTrack(requested.start, requested.end)))
      ? requested
      : null;
  const hover = hovered && valid(hovered) ? hovered : null,
    pinned = selection?.start ?? null,
    spanEnd = selection?.end ?? null;
  const rows = years.map((_, y) => MONTHS.map((_, m) => values[y]?.[m] ?? 0)),
    totals = rows.map(compound),
    flat = rows.flat();
  const valueAt = (y: number, m: number) => values[y]?.[m] ?? 0;
  const ordinal = (cell: ReturnsCalendarCell) => cell.y * 12 + cell.m;
  const yearAnchored = pinned !== null && pinned.m === YEAR;
  const monthAnchored = pinned !== null && !yearAnchored;
  const monthTo =
    spanEnd ?? (monthAnchored && hover && hover.m !== YEAR ? hover : null);
  const yearTo =
    spanEnd ?? (yearAnchored && hover && hover.m === YEAR ? hover : null);
  const span =
    monthAnchored && pinned
      ? {
          lo: Math.min(ordinal(pinned), ordinal(monthTo ?? pinned)),
          hi: Math.max(ordinal(pinned), ordinal(monthTo ?? pinned)),
        }
      : null;
  const yearSpan =
    yearAnchored && pinned
      ? {
          lo: Math.min(pinned.y, (yearTo ?? pinned).y),
          hi: Math.max(pinned.y, (yearTo ?? pinned).y),
        }
      : null;
  const hot = hover ?? spanEnd ?? pinned,
    tip = spanEnd ?? hover ?? pinned;
  const showMonths = span !== null && span.lo !== span.hi,
    showYears = yearSpan !== null && yearSpan.lo !== yearSpan.hi;
  let tipValue = 0,
    tipLabel = "",
    tipNote: string | null = null;
  const monthLabel = (index: number) =>
    `${MONTHS[index % 12]} ${years[Math.floor(index / 12)]}`;
  if (showYears && yearSpan) {
    tipValue = compound(flat.slice(yearSpan.lo * 12, (yearSpan.hi + 1) * 12));
    tipLabel = `${years[yearSpan.lo]} – ${years[yearSpan.hi]}`;
    tipNote = `${yearSpan.hi - yearSpan.lo + 1} years`;
  } else if (showMonths && span) {
    tipValue = compound(flat.slice(span.lo, span.hi + 1));
    tipLabel = `${monthLabel(span.lo)} – ${monthLabel(span.hi)}`;
    tipNote = `${span.hi - span.lo + 1} months`;
  } else if (tip) {
    tipValue = tip.m === YEAR ? totals[tip.y] : valueAt(tip.y, tip.m);
    tipLabel =
      tip.m === YEAR ? `${years[tip.y]}` : `${MONTHS[tip.m]} ${years[tip.y]}`;
    tipNote = tip.m === YEAR ? "for the year" : null;
  }
  return {
    years,
    hover,
    pinned,
    spanEnd,
    totals,
    valueAt,
    range: 8,
    span,
    yearSpan,
    hot,
    tip,
    sweepRow: !yearAnchored && hot?.m === YEAR ? hot.y : null,
    tipValue,
    tipLabel,
    tipNote,
    selection,
    valid,
    sameTrack,
  };
}
