export type Side = "top" | "bottom";
export type Align = "start" | "center" | "end";
export interface Rect { x: number; y: number; w: number; h: number; r: number }
export interface Geo {
  layerW: number; layerH: number; left: number; top: number;
  trigger: Rect; panel: Rect;
}

/** Place both surfaces in the bounding box of their union. */
export function buildGeo(tW: number, tH: number, cW: number, cH: number, side: Side, align: Align, gap: number, panelRadius: number, position?: { x: number; y: number }): Geo {
  const horizontal = position?.x ?? { start: 0, center: (tW - cW) / 2, end: tW - cW }[align];
  const vertical = position?.y ?? (side === "top" ? -cH - gap : tH + gap);
  const left = Math.min(0, horizontal), top = Math.min(0, vertical);
  const layerW = Math.max(tW, horizontal + cW) - left;
  const layerH = Math.max(tH, vertical + cH) - top;
  return {
    layerW, layerH, left, top,
    trigger: { x: -left, y: -top, w: tW, h: tH, r: Math.min(tH / 2, panelRadius) },
    panel: { x: horizontal - left, y: vertical - top, w: cW, h: cH, r: panelRadius },
  };
}
export function positionPopover(
  trigger: { left: number; top: number; width: number; height: number },
  content: { width: number; height: number },
  viewport: { width: number; height: number },
  options: { side: Side; align: Align; gap: number; radius: number },
) {
  const gutter = 12;
  const free = {
    top: Math.max(0, trigger.top - options.gap - gutter),
    bottom: Math.max(0, viewport.height - trigger.top - trigger.height - options.gap - gutter),
  };
  const alternative = options.side === "top" ? "bottom" : "top";
  const side = content.height > free[options.side] && free[alternative] > free[options.side] ? alternative : options.side;
  const height = Math.min(content.height, free[side]);
  const preferred = trigger.left + { start: 0, center: (trigger.width - content.width) / 2, end: trigger.width - content.width }[options.align];
  const left = Math.max(gutter, Math.min(preferred, viewport.width - content.width - gutter));
  const top = side === "top" ? trigger.top - options.gap - height : trigger.top + trigger.height + options.gap;
  return {
    side, availableHeight: free[side],
    geometry: buildGeo(trigger.width, trigger.height, content.width, height, side, options.align, options.gap, options.radius, { x: left - trigger.left, y: top - trigger.top }),
  };
}
export function rectAtProgress(geo: Geo, progress: number): Rect {
  const interpolate = (key: keyof Rect) => geo.trigger[key] * (1 - progress) + geo.panel[key] * progress;
  return { x: interpolate("x"), y: interpolate("y"), w: interpolate("w"), h: interpolate("h"), r: interpolate("r") };
}
export function insetFor(rect: Rect, layerW: number, layerH: number) {
  const edges = [rect.y, layerW - rect.x - rect.w, layerH - rect.y - rect.h, rect.x];
  return `inset(${edges.map(edge => `${edge}px`).join(" ")} round ${rect.r}px)`;
}
function outline(rect: Rect) {
  const radius = Math.max(0, Math.min(rect.r, rect.w / 2, rect.h / 2));
  const left = rect.x, top = rect.y, right = rect.x + rect.w, bottom = rect.y + rect.h;
  const handles = radius * 0.5523;
  return {
    radius, start: [left + radius, top],
    corners: [
      { line: [right - radius, top], end: [right, top + radius], a: [right - radius + handles, top], b: [right, top + radius - handles] },
      { line: [right, bottom - radius], end: [right - radius, bottom], a: [right, bottom - radius + handles], b: [right - radius + handles, bottom] },
      { line: [left + radius, bottom], end: [left, bottom - radius], a: [left + radius - handles, bottom], b: [left, bottom - radius + handles] },
      { line: [left, top + radius], end: [left + radius, top], a: [left, top + radius - handles], b: [left + radius - handles, top] },
    ],
  };
}
export function roundedRectShape(rect: Rect) {
  const shape = outline(rect);
  const point = (coordinates: number[]) => coordinates.map(coordinate => `${coordinate.toFixed(3)}px`).join(" ");
  const commands = shape.corners.flatMap(corner => [
    `line to ${point(corner.line)}`,
    `curve to ${point(corner.end)} with ${point(corner.a)} / ${point(corner.b)}`,
  ]);
  return `shape(from ${point(shape.start)}, ${commands.join(", ")}, close)`;
}
export function clipForProgress(geo: Geo, progress: number, supportsShape: boolean) {
  const surface = rectAtProgress(geo, progress);
  return supportsShape ? roundedRectShape(surface) : insetFor(surface, geo.layerW, geo.layerH);
}
export function roundedRectPath(rect: Rect) {
  const shape = outline(rect);
  const point = (coordinates: number[]) => coordinates.map(coordinate => coordinate.toFixed(3)).join(" ");
  const arc = `A${shape.radius.toFixed(3)} ${shape.radius.toFixed(3)} 0 0 1`;
  let path = `M${point(shape.start)}`;
  shape.corners.forEach((corner, index) => {
    const axis = index % 2 === 0 ? 0 : 1;
    path += `${axis === 0 ? "H" : "V"}${corner.line[axis]!.toFixed(3)}${arc} ${point(corner.end)}`;
  });
  return path + "Z";
}
/** An even-odd path leaves the real trigger visible through the goo surface. */
export function triggerCutout(geo: Geo, padding = 0) {
  const bounds: Rect = { x: -padding, y: -padding, w: geo.layerW + padding * 2, h: geo.layerH + padding * 2, r: 0 };
  return `path(evenodd, "${roundedRectPath(bounds)} ${roundedRectPath(geo.trigger)}")`;
}
