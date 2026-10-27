import { computed, type Ref } from "vue";
export type ArcSide = "top" | "bottom" | "left" | "right";
export interface ArcEntry { value: string; label: string; disabled?: boolean }
export const clampArc = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export function useArcLayout(props: { side: ArcSide; radius: number; itemHeight: number; visibleCount: number; disabled?: boolean }, measurements: Ref<{ width: number; labelWidth: number }>, position: Ref<number>) {
  const horizontal = computed(() => props.side === "top" || props.side === "bottom");
  const rowHeight = computed(() => Math.max(32, Number.isFinite(props.itemHeight) ? props.itemHeight : 48));
  const count = computed(() => Math.max(3, Number.isFinite(props.visibleCount) ? Math.floor(props.visibleCount) : 7));
  const radius = computed(() => Math.max(120, Number.isFinite(props.radius) ? props.radius : 280));
  const spacing = computed(() => horizontal.value ? Math.max(rowHeight.value, measurements.value.labelWidth + 48) : rowHeight.value);
  const curvature = computed(() => horizontal.value ? Math.max(radius.value, spacing.value * 2) : radius.value);
  const anchor = computed(() => { const { width, labelWidth } = measurements.value; const inset = Math.max(24, Math.min(width * .42, width - labelWidth - 24)); return width ? props.side === "left" ? width - inset : inset : props.side === "left" ? "58%" : "42%"; });
  const shown = computed(() => horizontal.value ? Math.min(count.value, Math.max(1, (measurements.value.width || count.value * spacing.value) / spacing.value)) : count.value);
  const height = computed(() => horizontal.value ? Math.ceil(Math.max(rowHeight.value * 2, curvature.value * (1 - Math.cos(Math.min(1.35, shown.value * spacing.value / (2 * curvature.value)))) + rowHeight.value + 24)) : count.value * rowHeight.value);
  const origin = computed(() => ({ top: horizontal.value ? props.side === "top" ? "36px" : "calc(100% - 36px)" : "50%", left: horizontal.value ? "50%" : typeof anchor.value === "number" ? `${anchor.value}px` : anchor.value }));
  function styleFor(index: number, option: ArcEntry) {
    const angle = clampArc((index - position.value) * spacing.value / curvature.value, -1.5, 1.5);
    const bend = curvature.value * (1 - Math.cos(angle));
    const along = curvature.value * Math.sin(angle);
    const x = horizontal.value ? along : props.side === "left" ? bend : -bend;
    const y = horizontal.value ? props.side === "top" ? bend : -bend : along;
    const rotation = (props.side === "left" || props.side === "bottom" ? -angle : angle) * 180 / Math.PI;
    const align = horizontal.value ? "-50%" : props.side === "left" ? "-100%" : "0%";
    const distance = Math.abs(index - position.value);
    return { ...origin.value, transformOrigin: horizontal.value ? "center" : props.side === "left" ? "right center" : "left center", maxWidth: horizontal.value ? "calc(100% - 4rem)" : "calc(100% - 3rem)", transform: `translate3d(${x}px,${y}px,0) translate(${align},-50%) rotate(${rotation}deg)`, opacity: clampArc((shown.value / 2 + .5 - distance) / 1.5, 0, 1) * (props.disabled || option.disabled ? .35 : 1), pointerEvents: distance < shown.value / 2 ? "auto" as const : "none" as const };
  }
  return { horizontal, rowHeight, count, spacing, height, origin, styleFor };
}
