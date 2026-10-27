<script setup lang="ts">
import { computed, provide, watchEffect } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";

const props = withDefaults(defineProps<{ ratio?: number; animated?: boolean; contentClassName?: string }>(), { ratio: 1, animated: true });
const reduced = useReducedMotion();
const animateLayout = computed(() => props.animated && !reduced.value);
watchEffect(() => {
  if (!(props.ratio > 0) || !Number.isFinite(props.ratio))
    throw new RangeError("AspectRatio: ratio must be a finite, positive number.");
});
provide("orvui-aspect", computed(() => ({ ratio: props.ratio, animated: animateLayout.value })));
</script>

<template>
  <motion.div class="relative w-full min-w-0 overflow-hidden" :style="{ aspectRatio: ratio }"
    :layout="animateLayout" :transition="{ layout: SPRING_LAYOUT }">
    <div :class="cn('absolute inset-0', contentClassName)"><slot /></div>
  </motion.div>
</template>
