import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";
import { animate, useMotionValue, useTransform } from "motion-v";
import { SPRING_PANEL } from "../../../lib/ease";
interface PullOptions { onRefresh?: () => void | Promise<void>; refreshing?: boolean; disabled?: boolean; threshold: number; maxPull: number; holdDistance: number }
export type PullPhase = "idle" | "pulling" | "ready" | "refreshing";
export function usePullState(root: Ref<HTMLElement | null>, props: PullOptions, reduced: Ref<boolean>, emitError: (error: unknown) => void) {
  const pending = ref(false);
  const status = ref<PullPhase>("idle");
  const threshold = computed(() => Math.max(24, props.threshold));
  const limit = computed(() => Math.max(props.maxPull, threshold.value + 24));
  const rest = computed(() => Math.min(Math.max(0, props.holdDistance), threshold.value));
  const refreshing = computed(() => props.refreshing || pending.value);
  const y = useMotionValue(0);
  const thresholdMotion = useMotionValue(threshold.value);
  const progress = useTransform(() => Math.max(0, Math.min(1, y.get() / thresholdMotion.get())));
  const opacity = useTransform(() => { const distance = y.get(); return distance < 10 ? Math.max(0, distance / 10 * .45) : Math.min(1, .45 + (distance - 10) / (thresholdMotion.get() - 10) * .55); });
  const scale = useTransform(progress, value => .86 + value * .14);
  const amount = ref(0);
  const unsubscribe = progress.on("change", value => amount.value = value);
  let gesture: { x: number; y: number; id: number | null } | undefined;
  let animation: { stop: () => void } | undefined;
  let disposed = false;
  let host: HTMLElement | null = null;
  watch(threshold, value => thresholdMotion.set(value), { flush: "sync" });
  function settle(value: number) { animation?.stop(); if (reduced.value) y.set(value); else animation = animate(y, value, SPRING_PANEL); }
  function releaseCapture() { if (gesture?.id != null && root.value) try { if (root.value.hasPointerCapture(gesture.id)) root.value.releasePointerCapture(gesture.id); } catch {} gesture = undefined; }
  function pull(distance: number) { if (props.disabled || refreshing.value) return; animation?.stop(); const resisted = limit.value * -Math.expm1(-Math.max(0, distance) / limit.value); y.set(resisted); status.value = resisted >= threshold.value ? "ready" : "pulling"; }
  async function refresh() { if (props.disabled || refreshing.value) return; pending.value = true; status.value = "refreshing"; settle(rest.value); try { await props.onRefresh?.(); } catch (error) { if (!disposed) emitError(error); } finally { if (!disposed) { pending.value = false; if (!props.refreshing) { status.value = "idle"; settle(0); } } } }
  function finish() { const accepted = y.get() >= threshold.value && !props.disabled && !refreshing.value; releaseCapture(); if (accepted) void refresh(); else { status.value = "idle"; settle(0); } }
  function canBegin() { return !!root.value && root.value.scrollTop <= 0 && !props.disabled && !refreshing.value; }
  function down(event: PointerEvent) { if (event.pointerType === "touch" || event.button !== 0 || !canBegin()) return; gesture = { x: event.clientX, y: event.clientY, id: event.pointerId }; try { root.value!.setPointerCapture(event.pointerId); } catch {} }
  function move(event: PointerEvent) { if (!gesture || gesture.id !== event.pointerId) return; const dy = event.clientY - gesture.y; if (dy < 0 || Math.abs(event.clientX - gesture.x) > dy) return; event.preventDefault(); pull(dy); }
  function end(event: PointerEvent) { if (gesture?.id === event.pointerId) finish(); }
  function touchStart(event: TouchEvent) { if (event.touches.length !== 1 || !canBegin()) return; const touch = event.touches[0]; gesture = { x: touch.clientX, y: touch.clientY, id: null }; }
  function touchMove(event: TouchEvent) { const touch = event.touches[0]; if (!gesture || !touch) return; const dy = touch.clientY - gesture.y; if ((root.value?.scrollTop ?? 0) > 0 || dy < 0) { gesture = undefined; return; } if (Math.abs(touch.clientX - gesture.x) > dy) return; event.preventDefault(); pull(dy); }
  function touchEnd() { if (gesture) finish(); }
  watch([refreshing, rest, reduced], ([busy]) => { if (busy) { status.value = "refreshing"; settle(rest.value); } else if (status.value === "refreshing") { status.value = "idle"; settle(0); } });
  onMounted(() => { host = root.value; if (refreshing.value) { status.value = "refreshing"; settle(rest.value); } host?.addEventListener("touchstart", touchStart, { passive: true }); host?.addEventListener("touchmove", touchMove, { passive: false }); host?.addEventListener("touchend", touchEnd); host?.addEventListener("touchcancel", touchEnd); });
  onBeforeUnmount(() => { disposed = true; releaseCapture(); animation?.stop(); unsubscribe(); host?.removeEventListener("touchstart", touchStart); host?.removeEventListener("touchmove", touchMove); host?.removeEventListener("touchend", touchEnd); host?.removeEventListener("touchcancel", touchEnd); });
  return { status, refreshing, y, progress, opacity, scale, amount, down, move, end };
}
