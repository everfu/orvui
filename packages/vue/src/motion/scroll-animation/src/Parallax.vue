<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";
import { motion, useMotionValue, useSpring } from "motion-v";
import { resolveElement, useReducedMotion } from "../../../lib/composables";

const props = withDefaults(defineProps<{
  speed?: number; axis?: "x" | "y"; container?: HTMLElement | Ref<HTMLElement | null> | null; spring?: boolean;
}>(), { speed: 0.3, axis: "y", spring: true });
const reduced = useReducedMotion();
const element = ref<HTMLElement | null>(null);
const drift = useMotionValue(props.speed * 100);
const eased = useSpring(drift, { stiffness: 120, damping: 30, mass: 0.6 });
const displacement = computed(() => props.spring && !reduced.value ? eased : drift);
let surface: Window | HTMLElement | undefined;
let revision = 0, disposed = false;
function update() {
  const target = element.value;
  if (disposed || !target) return;
  const parent = resolveElement<HTMLElement>(props.container);
  const bounds = target.getBoundingClientRect(), frame = parent?.getBoundingClientRect();
  const viewport = parent?.clientHeight ?? window.innerHeight;
  const top = bounds.top - (frame?.top ?? 0) - (props.axis === "y" ? displacement.value.get() : 0);
  const progress = Math.min(1, Math.max(0, (viewport - top) / (viewport + bounds.height)));
  drift.set(props.speed * 100 * (1 - 2 * progress));
}
async function bind() {
  surface?.removeEventListener("scroll", update);
  const version = ++revision;
  await nextTick();
  if (disposed || version !== revision) return;
  surface = resolveElement<HTMLElement>(props.container) ?? window;
  surface.addEventListener("scroll", update, { passive: true });
  update();
}
onMounted(() => { void bind(); window.addEventListener("resize", update); });
watch(() => resolveElement<HTMLElement>(props.container), bind, { flush: "post" });
watch(() => [props.speed, props.axis, props.spring, reduced.value], update, { flush: "post" });
onBeforeUnmount(() => {
  disposed = true; revision += 1;
  surface?.removeEventListener("scroll", update);
  window.removeEventListener("resize", update);
  drift.destroy();
});
</script>
<template>
  <motion.div :ref="node => element = resolveElement<HTMLElement>(node)"
    :style="reduced ? {} : axis === 'x' ? { x: displacement } : { y: displacement }"><slot /></motion.div>
</template>
