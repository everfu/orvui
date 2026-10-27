<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, onBeforeUnmount } from "vue";
import {
  motion,
  AnimatePresence,
  useVelocity,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion-v";
import { SPRING_PRESS, EASE_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { CHECKERBOARD } from "./context";
const props = defineProps<{
  dragging: boolean;
  color: string;
  glide: MotionValue<number>;
  x: MotionValue<string>;
  y?: MotionValue<string>;
  setThumb?: (node: HTMLElement | null) => void;
}>();
const reduced = useReducedMotion();
const velocity = useVelocity(props.glide);
const leaning = useTransform(velocity, (value) =>
  Math.max(-16, Math.min(16, -value * 0.04)),
);
const tilt = useSpring(leaning, SPRING_PRESS);
const lifted = computed(() => props.dragging && !reduced.value);
onBeforeUnmount(() => {
  tilt.destroy();
  leaning.destroy();
  velocity.destroy();
});
</script>
<template>
  <motion.div class="pointer-events-none absolute inset-0" :style="y ? { x, y } : { x }"
    ><div
      v-bind="$attrs"
      :ref="(node) => setThumb?.(node as HTMLElement | null)"
      :class="[
        'absolute left-0 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground',
        y ? 'top-0' : 'top-1/2',
      ]"
    >
      <motion.span
        aria-hidden="true"
        :animate="{ scale: lifted ? 0.78 : 1 }"
        :transition="SPRING_PRESS"
        class="block size-full rounded-full border-[2px] border-white shadow-[0_0_0_1px_rgb(0_0_0/0.12),0_2px_6px_rgb(0_0_0/0.25)]"
        :style="{ backgroundColor: color }"
      /><AnimatePresence
        ><motion.span
          v-if="lifted"
          aria-hidden="true"
          data-color-picker-loupe=""
          class="pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 z-10 -ml-5 block size-10"
          :style="{ rotate: tilt, originX: 0.5, originY: 1.3 }"
          :initial="{ opacity: 0, scale: 0.3, y: 16 }"
          :animate="{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              type: 'spring',
              stiffness: 520,
              damping: 24,
              mass: 0.6,
            },
          }"
          :exit="{
            opacity: 0,
            scale: 0.3,
            y: 16,
            transition: { duration: 0.12, ease: EASE_OUT },
          }"
          ><span
            class="absolute inset-0 -rotate-45 overflow-hidden rounded-[50%_50%_50%_0] border-[3px] border-white shadow-[0_0_0_1px_rgb(0_0_0/0.1),0_6px_16px_rgb(0_0_0/0.28)]"
            :style="{ background: CHECKERBOARD }"
            ><span
              class="absolute inset-0"
              :style="{ background: color }" /></span></motion.span
      ></AnimatePresence></div
  ></motion.div>
</template>
