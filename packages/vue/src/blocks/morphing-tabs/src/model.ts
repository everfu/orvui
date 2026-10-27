export const DRAG_THRESHOLD = 5;
export const MAX_TAB_WIDTH = 176;
export const MIN_TAB_WIDTH = 96;
export const TAB_HEIGHT = 56;
export const TAB_TOP = 24;
export const TAB_RADIUS = 24;
export const RAIL_HEIGHT = 80;
export const SURFACE_INSET = 16;
export const LIQUID_JOIN = 24;
export const PANEL_RADIUS = 28;
export const sameOrder = (first: string[], second: string[]) =>
  first.length === second.length &&
  !first.some((id, index) => id !== second[index]);
export const safeId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "-");
export function moveItem(order: string[], from: number, to: number) {
  const next = Array.from(order);
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
export function tabGeometry(
  surfaceWidth: number,
  count: number,
  preferredGap: number,
) {
  if (!surfaceWidth || !count)
    return { width: MAX_TAB_WIDTH, gap: preferredGap };
  const available = surfaceWidth - 2 * SURFACE_INSET;
  const preferred = Math.floor(
    (available - preferredGap * (count - 1)) / count,
  );
  if (preferred >= MIN_TAB_WIDTH)
    return { width: Math.min(MAX_TAB_WIDTH, preferred), gap: preferredGap };
  if (count > 1 && Math.floor(available / count) >= MIN_TAB_WIDTH)
    return {
      width: MIN_TAB_WIDTH,
      gap: Math.max(
        0,
        Math.floor((available - MIN_TAB_WIDTH * count) / (count - 1)),
      ),
    };
  return { width: Math.max(0, Math.floor(available / count)), gap: 0 };
}
export function liquidTabPath(
  tabLeft: number,
  surfaceWidth: number,
  tabWidth: number,
) {
  const leftEdge = SURFACE_INSET,
    rightEdge = surfaceWidth - SURFACE_INSET;
  const x = Math.max(leftEdge, Math.min(rightEdge - tabWidth, tabLeft)),
    right = x + tabWidth;
  const joinStart = Math.max(leftEdge, x - LIQUID_JOIN),
    joinEnd = Math.min(rightEdge, right + LIQUID_JOIN);
  const l = Math.min(LIQUID_JOIN, x - joinStart),
    r = Math.min(LIQUID_JOIN, joinEnd - right);
  const rounding = [
    Math.min(PANEL_RADIUS, joinStart - leftEdge),
    Math.min(PANEL_RADIUS, rightEdge - joinEnd),
  ];
  const commands: [string, ...number[]][] = [
    ["M", leftEdge, RAIL_HEIGHT + PANEL_RADIUS],
    ["V", RAIL_HEIGHT + rounding[0]],
    ["Q", leftEdge, RAIL_HEIGHT, leftEdge + rounding[0], RAIL_HEIGHT],
    ["H", joinStart],
    [
      "C",
      joinStart + l * 0.55,
      RAIL_HEIGHT,
      x,
      RAIL_HEIGHT - l + l * 0.55,
      x,
      RAIL_HEIGHT - l,
    ],
    ["V", TAB_TOP + TAB_RADIUS],
    ["Q", x, TAB_TOP, x + TAB_RADIUS, TAB_TOP],
    ["H", right - TAB_RADIUS],
    ["Q", right, TAB_TOP, right, TAB_TOP + TAB_RADIUS],
    ["V", RAIL_HEIGHT - r],
    [
      "C",
      right,
      RAIL_HEIGHT - r + r * 0.55,
      joinEnd - r * 0.55,
      RAIL_HEIGHT,
      joinEnd,
      RAIL_HEIGHT,
    ],
    ["H", rightEdge - rounding[1]],
    ["Q", rightEdge, RAIL_HEIGHT, rightEdge, RAIL_HEIGHT + rounding[1]],
    ["V", RAIL_HEIGHT + PANEL_RADIUS],
    ["Z"],
  ];
  return commands
    .map(([command, ...values]) => command + values.join(" "))
    .join(" ");
}
