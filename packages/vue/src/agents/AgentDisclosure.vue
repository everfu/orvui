<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { EASE_OUT } from "../lib/ease";
import { useReduced } from "./shared";
const props = withDefaults(
  defineProps<{
    open: boolean;
    maxHeight?: number;
    openHeight?: string | number;
  }>(),
  { openHeight: "auto" },
);
const reduce = useReduced();
const height = computed(() =>
  !props.open
    ? "0px"
    : typeof props.openHeight === "number"
      ? `${props.openHeight}px`
      : props.openHeight,
);
const animation = computed(() => {
  const opacity = Number(props.open);
  if (reduce.value) return { opacity };
  return {
    opacity,
    y: props.open ? 0 : -4,
    clipPath: `inset(0 0 ${props.open ? 0 : 100}% 0)`,
  };
});
</script>
<template>
  <motion.div
    class="overflow-hidden"
    :initial="false"
    :animate="animation"
    :aria-hidden="!open"
    :inert="!open || undefined"
    :transition="{ ease: EASE_OUT, duration: reduce ? 0 : open ? 0.22 : 0.14 }"
    :style="{
      height,
      pointerEvents: open ? undefined : 'none',
      transformOrigin: 'top',
    }"
  >
    <div
      v-if="maxHeight"
      class="overflow-auto"
      :style="{ maxHeight: `${maxHeight}px` }"
    >
      <slot />
    </div>
    <slot v-else />
  </motion.div>
</template>
