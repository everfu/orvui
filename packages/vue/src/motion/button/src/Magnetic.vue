<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { motion, useMotionValue, useSpring } from "motion-v";
import { SPRING_MOUSE } from "../../../lib/ease";
import { resolveElement, useMediaQuery, useReducedMotion } from "../../../lib/composables";
const props = withDefaults(defineProps<{ strength?: number }>(), { strength: 0.35 });
const element = ref<HTMLElement | null>(null), reduced = useReducedMotion();
const hover = useMediaQuery("(hover: hover) and (pointer: fine)");
const enabled = computed(() => hover.value && !reduced.value);
const x = useMotionValue(0), y = useMotionValue(0);
const springX = useSpring(x, SPRING_MOUSE), springY = useSpring(y, SPRING_MOUSE);
function reset() { x.set(0); y.set(0); }
function track(event: MouseEvent) {
  if (!enabled.value || !element.value) return;
  const bounds = element.value.getBoundingClientRect();
  x.set(props.strength * (event.clientX - bounds.left - bounds.width / 2));
  y.set(props.strength * (event.clientY - bounds.top - bounds.height / 2));
}
watch(enabled, active => { if (!active) { reset(); springX.jump(0); springY.jump(0); } });
onBeforeUnmount(() => { x.destroy(); y.destroy(); });
defineExpose({ x, y });
</script>
<template><motion.div :ref="node => element = resolveElement<HTMLElement>(node)" @mousemove="track" @mouseleave="reset"
  :style="{ x: springX, y: springY }" class="inline-block"><slot /></motion.div></template>
