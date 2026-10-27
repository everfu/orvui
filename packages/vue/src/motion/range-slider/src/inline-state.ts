import { computed, onBeforeUnmount, ref, watch, type Ref } from "vue";
import { animate, useMotionValue, useTransform } from "motion-v";
import { SPRING_GLIDE } from "../../../lib/ease";
import { snapSliderValue, useSlider, type SliderOptions } from "./useSlider";
import { observeSliderGeometry } from "./visual-state";
export function useInlineSlider(props: SliderOptions & { showTicks: boolean }, emit: (...args: any[]) => void, reduced: Ref<boolean>) {
  const precision = computed(() => (props.step ?? 1).toFixed(6).replace(/0+$/, "").split(".")[1]?.length ?? 0);
  const options = new Proxy(props, { get: (target, key) => key === "step" ? 10 ** -precision.value : Reflect.get(target, key) });
  const slider = useSlider(options, emit);
  const labelRef = ref<HTMLElement | null>(null);
  const readoutRef = ref<HTMLElement | null>(null);
  const geometry = ref({ width: 292, labelWidth: 22, readoutWidth: 24 });
  const width = useMotionValue(292);
  const labelWidth = useMotionValue(22);
  const readoutWidth = useMotionValue(24);
  observeSliderGeometry(() => [slider.trackRef.value, labelRef.value, readoutRef.value], () => { const track = slider.trackRef.value; if (!track || !labelRef.value || !readoutRef.value) return; const measured = track.getBoundingClientRect().width; if (!measured) return; const bounds = { width: measured, labelWidth: labelRef.value.getBoundingClientRect().width, readoutWidth: readoutRef.value.getBoundingClientRect().width }; geometry.value = bounds; width.set(bounds.width); labelWidth.set(bounds.labelWidth); readoutWidth.set(bounds.readoutWidth); });
  const endX = computed(() => Math.max(8, geometry.value.width - 12));
  const stops = computed(() => { const step = props.step && props.step > 0 ? props.step : 1; const values = Array.from(new Set(Array.from({ length: 10 }, (_, index) => snapSliderValue(slider.min.value + index / 9 * (slider.max.value - slider.min.value), slider.min.value, slider.max.value, step)))); return values.map((value, index) => ({ value, x: values.length === 1 ? 8 : 8 + index / (values.length - 1) * (endX.value - 8) })); });
  function map(point: number, from: "x" | "value", to: "x" | "value") { const rows = stops.value; const index = rows.findIndex(stop => stop[from] >= point); const upper = rows[index < 0 ? rows.length - 1 : index]; const lower = rows[Math.max(0, index - 1)]; return lower[from] === upper[from] ? upper[to] : lower[to] + (point - lower[from]) / (upper[from] - lower[from]) * (upper[to] - lower[to]); }
  const restingX = computed(() => map(slider.current.value, "value", "x"));
  const handleX = useMotionValue(restingX.value);
  const dragging = ref(false);
  let animation: ReturnType<typeof animate> | undefined;
  let frame = 0;
  let pending: number | undefined;
  let gesture: { id: number; element: HTMLElement; left: number; offset: number; x: number } | undefined;
  function settle(target: number) { animation?.stop(); if (reduced.value) handleX.jump(target); else animation = animate(handleX, target, { type: "spring", ...SPRING_GLIDE }); }
  watch(restingX, value => { if (!gesture) settle(value); });
  const fillX = useTransform(() => { const x = handleX.get(); const w = width.get(); return (x >= Math.max(8, w - 12) ? w - 2 : x + 8) - w + 2; });
  const split = useTransform(() => { const x = handleX.get(); const w = width.get(); const overlap = (start: number, end: number) => Math.max(0, Math.min(1, (x + 4 - start) / 6, (end - x) / 6)); return Math.max(overlap(20, 20 + labelWidth.get()), overlap(w - 20 - readoutWidth.get(), w - 20)); });
  const stemOpacity = useTransform(split, value => 1 - value);
  const capTop = useTransform(split, value => -value);
  const capBottom = useTransform(split, value => value);
  const ticks = computed(() => props.showTicks ? stops.value.map(stop => stop.x).filter(x => !(x + 2 >= 20 && x - 2 <= 20 + geometry.value.labelWidth) && !(x + 2 >= geometry.value.width - 20 - geometry.value.readoutWidth && x - 2 <= geometry.value.width - 20)) : []);
  function cancelQueue() { cancelAnimationFrame(frame); frame = 0; pending = undefined; }
  function queue(value: number) { pending = value; if (frame) return; frame = requestAnimationFrame(() => { frame = 0; if (pending !== undefined) slider.commit(pending); pending = undefined; }); }
  function down(event: PointerEvent) { if (props.disabled || event.button !== 0 || gesture) return; const element = event.currentTarget as HTMLElement; const bounds = element.getBoundingClientRect(); if (!bounds.width) return; event.preventDefault(); const point = event.clientX - bounds.left; const thumb = handleX.get(); gesture = { id: event.pointerId, element, left: bounds.left, offset: Math.abs(point - thumb - 2) <= 12 ? point - thumb : 2, x: thumb }; dragging.value = true; handleX.stop(); cancelQueue(); try { element.setPointerCapture(event.pointerId); } catch {} slider.sliderRef.value?.focus({ preventScroll: true }); }
  function move(event: PointerEvent) { if (!gesture || gesture.id !== event.pointerId || props.disabled) return; const point = Math.max(8, Math.min(endX.value, event.clientX - gesture.left - gesture.offset)); gesture.x = point; handleX.set(point); queue(map(point, "x", "value")); }
  function release() { const current = gesture; gesture = undefined; if (current) try { if (current.element.hasPointerCapture(current.id)) current.element.releasePointerCapture(current.id); } catch {} return current; }
  function end(event: PointerEvent) { if (!gesture || gesture.id !== event.pointerId) return; const current = release()!; cancelQueue(); dragging.value = false; if (!props.disabled && geometry.value.width > 0) { const point = event.type === "pointerup" ? event.clientX - current.left - current.offset : current.x; const stop = stops.value.reduce((nearest, candidate) => Math.abs(candidate.x - point) < Math.abs(nearest.x - point) ? candidate : nearest); slider.commit(stop.value); emit("valueCommit", stop.value); settle(props.modelValue === undefined ? stop.x : restingX.value); } else settle(restingX.value); }
  function key(event: KeyboardEvent) { if (props.disabled) return; const higher = stops.value.find(stop => stop.value > slider.current.value)?.value ?? slider.max.value; const lower = stops.value.slice().reverse().find(stop => stop.value < slider.current.value)?.value ?? slider.min.value; const keys: Record<string, number> = { ArrowRight: higher, ArrowUp: higher, ArrowLeft: lower, ArrowDown: lower, Home: slider.min.value, End: slider.max.value, PageUp: slider.max.value, PageDown: slider.min.value }; if (!(event.key in keys)) return; event.preventDefault(); slider.commit(keys[event.key]); emit("valueCommit", keys[event.key]); }
  onBeforeUnmount(() => { release(); animation?.stop(); handleX.stop(); cancelQueue(); });
  return { ...slider, labelRef, readoutRef, dragging, handleX, fillX, stemOpacity, capTop, capBottom, ticks, down, move, end, key };
}
