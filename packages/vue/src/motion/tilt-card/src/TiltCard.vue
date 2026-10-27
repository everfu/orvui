<script setup lang="ts">
import { computed, watch } from "vue";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion-v";
import { SPRING_MOUSE } from "../../../lib/ease";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";

const props = withDefaults(defineProps<{ max?: number; glare?: boolean }>(), { max: 12, glare: true });
const reduced = useReducedMotion();
const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
const enabled = computed(() => finePointer.value && !reduced.value);
const pitch = useMotionValue(0), yaw = useMotionValue(0);
const lightX = useMotionValue(50), lightY = useMotionValue(50);
const rotationX = useSpring(pitch, SPRING_MOUSE), rotationY = useSpring(yaw, SPRING_MOUSE);
const transform = useMotionTemplate`perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
const lighting = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, var(--foreground), transparent 50%)`;
function reset() { pitch.set(0); yaw.set(0); }
function track(event: MouseEvent) {
  if (!enabled.value) return;
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
  if (bounds.width <= 0 || bounds.height <= 0) return;
  const horizontal = (event.clientX - bounds.left) / bounds.width;
  const vertical = (event.clientY - bounds.top) / bounds.height;
  yaw.set((horizontal - 0.5) * props.max);
  pitch.set((0.5 - vertical) * props.max);
  lightX.set(100 * horizontal);
  lightY.set(100 * vertical);
}
watch(enabled, active => { if (!active) { reset(); rotationX.jump(0); rotationY.jump(0); } });
</script>

<template>
  <motion.div class="relative overflow-hidden rounded-2xl will-change-transform"
    :style="{ transform, transformStyle: 'preserve-3d' }" @mousemove="track" @mouseleave="reset">
    <slot />
    <motion.div v-if="glare && enabled" aria-hidden="true" :style="{ background: lighting }"
      class="pointer-events-none absolute inset-0 opacity-10" />
  </motion.div>
</template>
