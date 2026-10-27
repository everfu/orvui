import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useMotionState } from "../../state";
import { resolveElement } from "../../../lib/composables";

const bounded = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const precise = (value: number) => Number(value.toFixed(6));

/** The upper endpoint is legal even when it is between regular grid points. */
export function snapSliderValue(next: number, min: number, max: number, step: number): number {
  if (max <= min) return min;
  if (!(step > 0)) return bounded(next, min, max);
  const count = Math.floor(precise((max - min) / step));
  const nearby = Math.min(count, Math.max(0, Math.round((next - min) / step)));
  const grid = precise(min + nearby * step);
  return precise(Math.abs(max - next) <= Math.abs(grid - next) ? max : grid);
}
export interface SliderOptions {
  modelValue?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  ariaLabel?: string;
  formatValueText?: (value: number) => string;
}
export function useSlider(props: SliderOptions, emit: (...args: any[]) => void) {
  const value = useMotionState(props, emit, "modelValue", props.defaultValue ?? 0);
  const min = computed(() => props.min ?? 0);
  const max = computed(() => Math.max(min.value, props.max ?? 100));
  const step = computed(() => props.step && props.step > 0 ? props.step : 1);
  const current = computed(() => bounded(value.value, min.value, max.value));
  const percent = computed(() => max.value === min.value ? 0 : 100 * (current.value - min.value) / (max.value - min.value));
  const dragging = ref(false);
  const trackRef = ref<HTMLElement | null>(null), sliderRef = ref<HTMLElement | null>(null);
  let capture: { element: HTMLElement; pointer: number } | null = null;
  function commit(request: number) {
    if (!props.disabled) value.value = snapSliderValue(request, min.value, max.value, step.value);
  }
  function atPointer(event: PointerEvent) {
    const bounds = resolveElement<HTMLElement>(trackRef.value)?.getBoundingClientRect();
    if (!bounds?.width) return;
    const fraction = bounded((event.clientX - bounds.left) / bounds.width, 0, 1);
    commit(min.value + fraction * (max.value - min.value));
  }
  function releaseCapture() {
    const previous = capture;
    capture = null;
    if (previous) {
      try { previous.element.releasePointerCapture(previous.pointer); } catch { /* Detached or already released. */ }
    }
  }
  function finish() {
    if (!dragging.value) return;
    dragging.value = false;
    releaseCapture();
    emit("valueCommit", current.value);
  }
  function begin(event: PointerEvent) {
    if (props.disabled || event.button !== 0 || dragging.value) return;
    const element = event.currentTarget as HTMLElement;
    capture = { element, pointer: event.pointerId };
    dragging.value = true;
    try { element.setPointerCapture(event.pointerId); } catch { /* Capture is optional for synthetic events. */ }
    resolveElement<HTMLElement>(sliderRef.value)?.focus({ preventScroll: true });
    atPointer(event);
  }
  function move(event: PointerEvent) {
    if (dragging.value && !props.disabled && event.pointerId === capture?.pointer) atPointer(event);
  }
  function end(event: PointerEvent) {
    if (!capture || event.pointerId === capture.pointer) finish();
  }
  function key(event: KeyboardEvent) {
    if (props.disabled) return;
    let request: number;
    switch (event.key) {
      case "Home": request = min.value; break;
      case "End": request = max.value; break;
      case "ArrowRight": case "ArrowUp": request = current.value + step.value; break;
      case "ArrowLeft": case "ArrowDown": request = current.value - step.value; break;
      case "PageUp": request = current.value + 10 * step.value; break;
      case "PageDown": request = current.value - 10 * step.value; break;
      default: return;
    }
    event.preventDefault();
    commit(request);
    emit("valueCommit", current.value);
  }
  watch(() => props.disabled, disabled => {
    if (!disabled) return;
    dragging.value = false;
    releaseCapture();
  });
  onBeforeUnmount(() => { dragging.value = false; releaseCapture(); });
  const trackProps = { onPointerdown: begin, onPointermove: move, onPointerup: end, onPointercancel: end, onLostpointercapture: end };
  const sliderProps = computed(() => ({
    role: "slider", tabindex: props.disabled ? -1 : 0,
    "aria-label": props.ariaLabel, "aria-valuemin": min.value, "aria-valuemax": max.value,
    "aria-valuenow": current.value, "aria-valuetext": props.formatValueText?.(current.value),
    "aria-disabled": props.disabled || undefined, onKeydown: key,
  }));
  return { value, current, percent, dragging, min, max, step, commit, trackRef, sliderRef, trackProps, sliderProps };
}
