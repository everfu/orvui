import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";
import { createTickPlayer } from "./tick-sound";
export type DrumOption = string | { label: string; value: string };
const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));
const easeOut = (progress: number) => 1 - (1 - progress) ** 3;
const easeBack = (progress: number) => { const t = progress - 1; return 1 + 2.35 * t * t * t + 1.35 * t * t; };
export function useDrumState(props: { options: DrumOption[]; visibleCount: number; itemHeight: number; disabled?: boolean; sound?: boolean }, accepted: Ref<string | undefined>, reduced: Ref<boolean>, container: Ref<HTMLElement | null>, drum: Ref<HTMLElement | null>, band: Ref<HTMLElement | null>) {
  const options = computed(() => props.options.map(option => typeof option === "string" ? { label: option, value: option } : option));
  const last = computed(() => Math.max(0, options.value.length - 1));
  const geometry = computed(() => { const half = Math.max(1, Math.floor(props.visibleCount / 2)); const cutoff = half + 1; const angle = 90 / cutoff; const radius = props.itemHeight / Math.tan(angle * Math.PI / 180); return { angle, radius, hideBeyond: cutoff, height: Math.round(2 * radius * Math.sin(half * angle * Math.PI / 180) + props.itemHeight) }; });
  const grabbing = ref(false);
  const indexOf = (value: string | undefined) => Math.max(0, options.value.findIndex(option => option.value === value));
  let position = indexOf(accepted.value);
  let published = accepted.value;
  let soundedRow = position;
  let glideFrame = 0;
  let dragFrame = 0;
  let wheelTimer: ReturnType<typeof setTimeout> | undefined;
  let audio: ReturnType<typeof createTickPlayer> | undefined;
  let latestY = 0;
  let gesture: { y: number; position: number; samples: [number, number][] } | undefined;
  let bound: HTMLElement | null = null;
  let disposed = false;
  function sound() { return audio ??= createTickPlayer(); }
  function paint(value: number) { const transform = `translateZ(${-geometry.value.radius}px) rotateX(${geometry.value.angle * value}deg)`; for (const list of [drum.value, band.value]) { if (!list) continue; list.style.transform = transform; for (const child of list.children) { const element = child as HTMLElement; const visibility = Math.abs(Number(element.dataset.index) - value) > geometry.value.hideBeyond ? "hidden" : "visible"; if (element.style.visibility !== visibility) element.style.visibility = visibility; } } }
  function publish(index: number) { const value = options.value[clamp(index, 0, last.value)]?.value; if (value === undefined || value === published) return; published = value; if (props.sound && reduced.value) sound().play(); accepted.value = value; }
  function tick(value: number) { const row = clamp(Math.round(value), 0, last.value); if (props.sound && !reduced.value && row !== soundedRow) sound().play(); soundedRow = row; }
  function stop() { cancelAnimationFrame(glideFrame); glideFrame = 0; }
  function update(value: number) { position = value; paint(value); tick(value); }
  function glide(target: number, duration: number, easing = easeOut) {
    stop(); const from = position; const delta = target - from;
    if (!delta || duration <= 0) { update(target); publish(target); return; }
    const started = performance.now();
    function frame(time: number) { if (disposed) return; const progress = (time - started) / duration; if (progress >= 1) { update(target); publish(target); glideFrame = 0; return; } update(from + delta * easing(progress)); glideFrame = requestAnimationFrame(frame); }
    glideFrame = requestAnimationFrame(frame);
  }
  function fling(velocity: number) { if (position < 0 || position > last.value) { glide(clamp(Math.round(position), 0, last.value), 260); return; } const projection = Math.sign(velocity) * velocity ** 2 / (2 * .00042); const target = clamp(Math.round(position + projection), 0, last.value); const duration = clamp(Math.sqrt(Math.abs(target - position)) * 300 + 240, 280, 1700); glide(target, duration, easeBack); }
  function begin(y: number) { stop(); if (props.sound) sound().prepare(); grabbing.value = true; gesture = { y, position, samples: [[y, performance.now()]] }; }
  function move(y: number) { if (!gesture) return; latestY = y; gesture.samples.push([y, performance.now()]); if (gesture.samples.length > 8) gesture.samples.shift(); if (dragFrame) return; dragFrame = requestAnimationFrame(() => { dragFrame = 0; if (!gesture) return; const raw = gesture.position + (gesture.y - latestY) / props.itemHeight; const value = raw < 0 ? raw * .3 : raw > last.value ? last.value + (raw - last.value) * .3 : raw; update(value); publish(Math.round(clamp(value, 0, last.value))); }); }
  function end() { if (!gesture) return; const samples = gesture.samples; gesture = undefined; grabbing.value = false; cancelAnimationFrame(dragFrame); dragFrame = 0; let velocity = 0; if (samples.length > 1) { const latest = samples.at(-1)!; const reference = samples.find(point => latest[1] - point[1] <= 90) ?? samples[0]; const elapsed = latest[1] - reference[1]; if (elapsed > 0) velocity = clamp((reference[0] - latest[0]) / props.itemHeight / elapsed, -.18, .18); } fling(velocity); }
  function pointerDown(event: PointerEvent) { if (props.disabled || reduced.value || event.pointerType === "touch") return; begin(event.clientY); try { container.value?.setPointerCapture(event.pointerId); } catch {} }
  function pointerMove(event: PointerEvent) { if (event.pointerType !== "touch") move(event.clientY); }
  function pointerEnd(event: PointerEvent) { if (event.pointerType === "touch") return; try { container.value?.releasePointerCapture(event.pointerId); } catch {} end(); }
  function wheel(event: WheelEvent) { if (props.disabled || reduced.value) return; event.preventDefault(); if (props.sound) sound().prepare(); stop(); const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : 1); update(clamp(position + pixels * .012, 0, last.value)); publish(Math.round(position)); clearTimeout(wheelTimer); wheelTimer = setTimeout(() => glide(clamp(Math.round(position), 0, last.value), 240, easeBack), 110); }
  function keyboard(event: KeyboardEvent) { if (props.disabled) return; const index = Math.round(position); const direction: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, Home: -index, End: last.value - index }; if (!(event.key in direction)) return; event.preventDefault(); if (props.sound) sound().prepare(); glide(clamp(Math.round(position) + direction[event.key], 0, last.value), 300, easeBack); }
  function touchStart(event: TouchEvent) { if (!props.disabled && !reduced.value && event.touches[0]) begin(event.touches[0].clientY); }
  function touchMove(event: TouchEvent) { if (!gesture || !event.touches[0]) return; event.preventDefault(); move(event.touches[0].clientY); }
  function unbind() { if (!bound) return; bound.removeEventListener("touchstart", touchStart); bound.removeEventListener("touchmove", touchMove); bound.removeEventListener("touchend", end); bound.removeEventListener("touchcancel", end); bound.removeEventListener("wheel", wheel); bound = null; }
  function bind() { unbind(); bound = container.value; if (!bound || reduced.value || props.disabled) return; bound.addEventListener("touchstart", touchStart, { passive: true }); bound.addEventListener("touchmove", touchMove, { passive: false }); bound.addEventListener("touchend", end); bound.addEventListener("touchcancel", end); bound.addEventListener("wheel", wheel, { passive: false }); }
  function follow() { if (gesture) return; const target = indexOf(accepted.value); published = accepted.value; if (Math.abs(Math.round(position) - target) < .001) paint(position); else glide(target, 260); }
  watch([accepted, options, geometry, reduced, () => props.sound], follow, { flush: "post" });
  watch([reduced, () => props.disabled], () => { void nextTick(() => { if (!disposed) bind(); }); });
  onMounted(() => { bind(); paint(position); });
  onBeforeUnmount(() => { disposed = true; stop(); cancelAnimationFrame(dragFrame); clearTimeout(wheelTimer); audio?.dispose(); gesture = undefined; unbind(); });
  function rowStyle(index: number) { return { top: `${-props.itemHeight / 2}px`, height: `${props.itemHeight}px`, transform: `rotateX(${-geometry.value.angle * index}deg) translateZ(${geometry.value.radius}px)` }; }
  return { options, geometry, grabbing, publish, pointerDown, pointerMove, pointerEnd, keyboard, rowStyle };
}
