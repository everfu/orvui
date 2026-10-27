import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";
import { animate, useMotionValue, useSpring } from "motion-v";
import { SPRING_GLIDE, SPRING_LAYOUT } from "../../../lib/ease";
import { clampArc, useArcLayout, type ArcEntry, type ArcSide } from "./arc-layout";
export function useArcControl(props: { options: readonly ArcEntry[]; modelValue?: string; side: ArcSide; radius: number; itemHeight: number; visibleCount: number; disabled?: boolean }, candidate: Ref<string>, reduced: Ref<boolean>, root: Ref<HTMLElement | null>) {
  const selected = computed(() => props.options.some(option => option.value === candidate.value && !option.disabled) ? candidate.value : props.options.find(option => !option.disabled)?.value);
  const selectedIndex = computed(() => Math.max(0, props.options.findIndex(option => option.value === selected.value)));
  const enabled = computed(() => props.options.flatMap((option, index) => option.disabled ? [] : [{ option, index }]));
  const position = ref(selectedIndex.value);
  const measurements = ref({ width: 0, labelWidth: 0 });
  const layout = useArcLayout(props, measurements, position);
  const buttons = new Map<string, HTMLButtonElement>();
  const focusWithin = ref(false);
  const suppressClick = ref(false);
  const activity = useMotionValue(0);
  const expansion = useSpring(activity, SPRING_GLIDE);
  const frameTarget = useMotionValue(0);
  const frameWidth = useSpring(frameTarget, SPRING_LAYOUT);
  const frameSize = ref(0);
  const frameExpand = ref(0);
  const unwidth = frameWidth.on("change", value => frameSize.value = value);
  const unexpand = expansion.on("change", value => frameExpand.value = value);
  let measured = false;
  let instant = false;
  let tracking = false;
  let requested = selected.value;
  let animation: ReturnType<typeof animate> | undefined;
  let wheelTimer: ReturnType<typeof setTimeout> | undefined;
  let wheelTarget: number | null = null;
  let reconcile = 0;
  let observer: ResizeObserver | undefined;
  let disposed = false;
  let revision = 0;
  let drag: { id: number; coordinate: number; position: number; previous: number; time: number; velocity: number; moved: boolean } | undefined;
  function measureFrame() { const width = buttons.get(selected.value ?? "")?.offsetWidth ?? 0; frameTarget.set(width); if (!measured || instant || reduced.value) { frameWidth.jump(width); frameSize.value = width; } measured = true; }
  function measure() { if (!root.value) return; measurements.value = { width: root.value.clientWidth, labelWidth: Math.max(0, ...Array.from(buttons.values(), button => button.offsetWidth)) }; measureFrame(); }
  function stop() { ++revision; animation?.stop(); animation = undefined; clearTimeout(wheelTimer); wheelTarget = null; cancelAnimationFrame(reconcile); tracking = false; activity.set(0); if (reduced.value) { expansion.jump(0); frameExpand.value = 0; } const pointer = drag; drag = undefined; if (pointer) try { root.value?.releasePointerCapture(pointer.id); } catch {} }
  function settle(index: number, immediate = false) { animation?.stop(); const version = ++revision; const complete = () => { if (version !== revision) return; tracking = false; animation = undefined; wheelTarget = null; activity.set(0); }; if (immediate || reduced.value) { position.value = index; complete(); } else animation = animate(position.value, index, { ...SPRING_LAYOUT, onUpdate: value => { if (!disposed && version === revision) position.value = value; }, onComplete: complete }); }
  function publish(index: number, keyboard = false) { const option = props.options[index]; if (!option || option.disabled || props.disabled || option.value === requested) return; requested = option.value; candidate.value = option.value; if (props.modelValue === undefined) return; cancelAnimationFrame(reconcile); reconcile = requestAnimationFrame(() => { reconcile = requestAnimationFrame(() => { if (disposed || requested !== option.value || selected.value === option.value) return; stop(); requested = selected.value; settle(selectedIndex.value, keyboard); if ((keyboard || focusWithin.value) && selected.value !== undefined) buttons.get(selected.value)?.focus({ preventScroll: true }); }); }); }
  function select(index: number, keyboard = false) { const option = props.options[index]; if (!option || option.disabled || props.disabled) return; stop(); instant = keyboard; if (keyboard) { expansion.jump(0); frameExpand.value = 0; frameWidth.jump(frameTarget.get()); frameSize.value = frameTarget.get(); } publish(index, keyboard); settle(index, keyboard); if (keyboard) buttons.get(option.value)?.focus({ preventScroll: true }); }
  function nearest(at: number) { let index = -1; let distance = Infinity; props.options.forEach((option, next) => { if (!option.disabled && Math.abs(next - at) < distance) { index = next; distance = Math.abs(next - at); } }); return index; }
  watch(position, at => { if (!tracking || props.disabled) return; const next = nearest(at); if (next < 0) return; const previous = props.options.findIndex(option => option.value === requested); if (previous < 0 || previous === next) publish(next); else { const direction = next > previous ? 1 : -1; for (let index = previous + direction; direction > 0 ? index <= next : index >= next; index += direction) publish(index); } }, { flush: "sync" });
  const config = computed(() => JSON.stringify([props.options.map(option => [option.value, !!option.disabled]), props.side, layout.spacing.value, props.disabled, reduced.value]));
  let previousConfig = config.value;
  watch([selected, config], async () => { const changed = previousConfig !== config.value; previousConfig = config.value; if (changed || !tracking || selected.value !== requested) { stop(); requested = selected.value; settle(selectedIndex.value, instant || props.disabled || reduced.value); } if (changed) suppressClick.value = false; instant = false; await nextTick(); if (disposed) return; measureFrame(); if (focusWithin.value && selected.value !== undefined && !props.disabled) buttons.get(selected.value)?.focus({ preventScroll: true }); });
  function wheel(event: WheelEvent) { if (props.disabled || event.ctrlKey || drag?.moved || !enabled.value.length || !root.value) return; const useX = Math.abs(event.deltaX) > Math.abs(event.deltaY); if (!layout.horizontal.value && useX) return; const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? layout.horizontal.value ? root.value.clientWidth : root.value.clientHeight : 1; const delta = (layout.horizontal.value && useX ? event.deltaX : event.deltaY) * unit; if (!delta) return; const first = enabled.value[0].index; const last = enabled.value.at(-1)!.index; const from = wheelTarget ?? position.value; if (from <= first && delta < 0 || from >= last && delta > 0) return; event.preventDefault(); clearTimeout(wheelTimer); if (reduced.value) { const at = enabled.value.findIndex(({ option }) => option.value === requested); const next = enabled.value[clampArc(at + Math.sign(delta), 0, enabled.value.length - 1)]; if (next) select(next.index, true); } else { if (wheelTarget === null) { animation?.stop(); animation = undefined; } instant = false; tracking = true; activity.set(1); const next = clampArc(from + delta / layout.spacing.value, first, last); wheelTarget = next; position.value = next; wheelTimer = setTimeout(() => { wheelTarget = null; settle(nearest(next)); }, 120); } }
  function keyboard(event: KeyboardEvent) { if (event.defaultPrevented || props.disabled || !enabled.value.length) return; const at = Math.max(0, enabled.value.findIndex(({ option }) => option.value === requested)); const increment = event.shiftKey ? 5 : 1; const keys: Record<string, number> = { ArrowDown: at + increment, ArrowRight: at + increment, ArrowUp: at - increment, ArrowLeft: at - increment, Home: 0, End: enabled.value.length - 1, PageDown: at + 5, PageUp: at - 5 }; if (!(event.key in keys)) return; event.preventDefault(); const next = enabled.value[clampArc(keys[event.key], 0, enabled.value.length - 1)]; if (next) select(next.index, true); }
  function down(event: PointerEvent) { if (event.defaultPrevented || props.disabled || selected.value === undefined || event.button !== 0 || event.isPrimary === false) return; stop(); suppressClick.value = false; const coordinate = layout.horizontal.value ? event.clientX : event.clientY; drag = { id: event.pointerId, coordinate, position: position.value, previous: coordinate, time: performance.now(), velocity: 0, moved: false }; }
  function move(event: PointerEvent) { const current = drag; if (event.defaultPrevented || !current || current.id !== event.pointerId) return; const coordinate = layout.horizontal.value ? event.clientX : event.clientY; const delta = coordinate - current.coordinate; if (!current.moved && Math.abs(delta) < 6) return; current.moved = true; tracking = true; instant = false; activity.set(reduced.value ? 0 : 1); try { root.value?.setPointerCapture(event.pointerId); } catch {} const now = performance.now(); current.velocity = current.velocity * .35 + (current.previous - coordinate) / layout.spacing.value / Math.max(8, now - current.time) * 1000 * .65; current.previous = coordinate; current.time = now; const next = clampArc(current.position - delta / layout.spacing.value, 0, Math.max(0, props.options.length - 1)); position.value = reduced.value ? Math.round(next) : next; }
  function release(event: PointerEvent, cancelled = false) { if (drag?.id !== event.pointerId) return; const current = drag; drag = undefined; try { root.value?.releasePointerCapture(event.pointerId); } catch {} if (!current.moved) return; suppressClick.value = true; if (cancelled) { tracking = false; activity.set(0); settle(selectedIndex.value); } else settle(nearest(position.value + (reduced.value ? 0 : (performance.now() - current.time > 100 ? 0 : current.velocity) * .18))); }
  function click(event: MouseEvent) { if (suppressClick.value && event.detail > 0) { event.preventDefault(); event.stopPropagation(); suppressClick.value = false; } }
  function bracket(leading: boolean) { const amount = clampArc(frameExpand.value, 0, 1); const size = frameSize.value; const extent = layout.horizontal.value ? size / 2 : leading ? props.side === "left" ? size : 0 : props.side === "right" ? size : 0; return { transform: `translate3d(${(leading ? -1 : 1) * (extent + 4 + amount * 6)}px,-50%,0) scaleY(${1 - amount * .08})`, opacity: size > 0 ? .85 : 0 }; }
  const frameStyle = computed(() => ({ ...layout.origin.value, visibility: selected.value === undefined ? "hidden" as const : "visible" as const }));
  let host: HTMLElement | null = null;
  onMounted(() => { host = root.value; if (typeof ResizeObserver !== "undefined") { observer = new ResizeObserver(measure); if (host) observer.observe(host); for (const button of buttons.values()) observer.observe(button); } host?.addEventListener("wheel", wheel, { passive: false }); measure(); });
  watch(() => JSON.stringify(props.options.map(option => option.label)), () => { void nextTick(() => { if (!disposed) measure(); }); });
  onBeforeUnmount(() => { disposed = true; stop(); observer?.disconnect(); host?.removeEventListener("wheel", wheel); unwidth(); unexpand(); activity.destroy(); frameTarget.destroy(); });
  return { ...layout, selected, buttons, focusWithin, frameStyle, bracket, keyboard, down, move, release, click, select };
}
