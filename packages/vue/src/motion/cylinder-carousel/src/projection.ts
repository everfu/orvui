export interface CylinderLayout { width: number; itemSize: number; visibleItems: number; minScale: number; variant: "concave" | "convex"; arc?: number }
export function cylinderSize(layout: CylinderLayout) {
  const edge = (layout.visibleItems + 1) / 2;
  let occupied = 0;
  for (let slot = 0; slot < layout.visibleItems; slot++) {
    const distance = Math.abs(slot - (layout.visibleItems - 1) / 2) / edge;
    occupied += layout.variant === "convex" ? 1 - (1 - layout.minScale) * distance : layout.minScale + (1 - layout.minScale) * distance;
  }
  return Math.min(layout.itemSize, layout.width * .65 / occupied);
}
export function cylinderProjection(index: number, position: number, count: number, layout: CylinderLayout, size: number) {
  const cycle = Math.max(1, count);
  const delta = index - position;
  const distance = delta - Math.round(delta / cycle) * count;
  const edge = (layout.visibleItems + 1) / 2;
  const edgeAngle = Math.PI * 72 / 180;
  const limit = Math.PI * 95 / 180;
  const cosine = Math.cos(edgeAngle);
  const camera = Math.max(.2, (layout.minScale - cosine) / (1 - layout.minScale));
  const radius = layout.width / 2 * (cosine + camera) / Math.sin(edgeAngle);
  const angle = Math.max(-limit, Math.min(limit, distance / edge * edgeAngle));
  const convex = layout.variant === "convex";
  const x = convex ? distance * layout.width / (layout.visibleItems + 1) : radius * Math.sin(angle) / (Math.cos(angle) + camera);
  const falloff = Math.min(Math.abs(distance) / edge, limit / edgeAngle);
  const scale = convex ? 1 - (1 - layout.minScale) * falloff : layout.minScale + (1 - layout.minScale) * falloff;
  const arc = (layout.arc ?? size * .35) * (.5 - (x / (layout.width / 2)) ** 2);
  return { x, y: convex ? -arc : arc, scale, visibility: Math.abs(x) > layout.width / 2 + size ? "hidden" as const : "visible" as const };
}
