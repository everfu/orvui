import { onBeforeUnmount, onMounted, watch, type Ref } from "vue";
import { useMotionValue, useMotionValueEvent, useSpring } from "motion-v";
import { SPRING_GLIDE } from "../../../lib/ease";
export function useSliderMotion(percent: Ref<number>, reduced: Ref<boolean>) {
  const target = useMotionValue(percent.value);
  const spring = useSpring(target, SPRING_GLIDE);
  const position = useMotionValue(percent.value);
  watch(percent, value => target.set(value));
  useMotionValueEvent(target, "change", value => { if (reduced.value) position.set(value); });
  useMotionValueEvent(spring, "change", value => { if (!reduced.value) position.set(value); });
  watch(reduced, value => position.jump(value ? target.get() : spring.get()));
  return { target, spring, position };
}
export function observeSliderGeometry(elements: () => (HTMLElement | null)[], update: () => void) {
  let observer: ResizeObserver | undefined;
  onMounted(() => { update(); if (typeof ResizeObserver === "undefined") return; observer = new ResizeObserver(update); for (const element of elements()) if (element) observer.observe(element); });
  onBeforeUnmount(() => observer?.disconnect());
}
