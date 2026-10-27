import {
  computed,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
  type ComputedRef,
} from "vue";
import { animate, motionValue, type MotionValue } from "motion-v";
import { SPRING_LAYOUT } from "../../../lib/ease";
export type BumpPosition = { x: MotionValue<number>; y: MotionValue<number> };
export type BumpTarget = { key: string; x: number; y: number };
export const pointKey = (series: string, period: string) =>
  JSON.stringify([series, period]);
type Running = ReturnType<typeof animate>;
export function useBumpGeometry(
  targets: ComputedRef<BumpTarget[]>,
  reduce: () => boolean,
) {
  const positions = shallowRef(new Map<string, BumpPosition>());
  const animations = new Map<string, Running[]>();
  let mounted = false;
  function stop(key: string) {
    animations.get(key)?.forEach((animation) => animation.stop());
    animations.delete(key);
  }
  function sync() {
    const next = new Map<string, BumpPosition>();
    for (const target of targets.value) {
      const existing = positions.value.get(target.key);
      const point = existing ?? {
        x: motionValue(target.x),
        y: motionValue(target.y),
      };
      stop(target.key);
      const controls: Running[] = [];
      for (const axis of ["x", "y"] as const) {
        if (!mounted || reduce()) point[axis].jump(target[axis]);
        else controls.push(animate(point[axis], target[axis], SPRING_LAYOUT));
      }
      animations.set(target.key, controls);
      next.set(target.key, point);
    }
    for (const [key, point] of positions.value)
      if (!next.has(key)) {
        stop(key);
        point.x.destroy();
        point.y.destroy();
      }
    positions.value = next;
  }
  watch(() => JSON.stringify([targets.value, reduce()]), sync, {
    immediate: true,
    flush: "sync",
  });
  onMounted(() => {
    mounted = true;
    sync();
  });
  onBeforeUnmount(() => {
    mounted = false;
    for (const [key, point] of positions.value) {
      stop(key);
      point.x.destroy();
      point.y.destroy();
    }
    positions.value.clear();
  });
  return computed(() => positions.value);
}
