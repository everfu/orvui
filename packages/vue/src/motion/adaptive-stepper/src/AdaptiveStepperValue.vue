<script setup lang="ts">
import { computed, inject } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import LiquidItem from "./LiquidItem.vue";
import type { StepperContext } from "./context";
const state = inject<StepperContext>("orvui-stepper");
if (!state) throw new Error("AdaptiveStepperValue must be inside AdaptiveStepper");
const box = computed(() => {
  if (state.atMin.value) return { x: 0, width: state.atMax.value ? 216 : 152 };
  return { x: 64, width: state.atMax.value ? 152 : 88 };
});
const distance = computed(() => state.reduce.value ? 0 : state.direction.value * 32);
</script>
<template><LiquidItem :x="box.x" :width="box.width">
  <motion.output aria-live="polite" aria-atomic="true" class="flex size-full min-w-0 items-center justify-center overflow-hidden rounded-full border border-transparent bg-transparent bg-clip-padding px-4 text-lg font-semibold tabular-nums text-foreground">
    <span class="sr-only">{{ state.valueText.value }}</span><span aria-hidden="true" class="relative grid min-h-[1.1em] min-w-[1ch] place-items-center overflow-hidden leading-none">
      <AnimatePresence :initial="false" mode="popLayout"><motion.span :key="state.value.value"
        :initial="{ opacity: state.reduce.value ? 1 : 0.35, filter: state.reduce.value ? 'blur(0px)' : 'blur(2px)', transform: `translateY(${distance}%)` }"
        :animate="{ opacity: 1, filter: 'blur(0px)', transform: 'translateY(0%)' }"
        :exit="{ opacity: state.reduce.value ? 1 : 0, filter: state.reduce.value ? 'blur(0px)' : 'blur(2px)', transform: `translateY(${-distance}%)`, transition: { duration: state.reduce.value ? 0 : 0.12, ease: EASE_OUT } }"
        :transition="{ duration: state.reduce.value ? 0 : 0.18, ease: EASE_OUT }" class="col-start-1 row-start-1 will-change-[transform,filter,opacity]"><slot :value="state.value.value">{{ state.value.value }}</slot></motion.span></AnimatePresence>
    </span>
  </motion.output>
</LiquidItem></template>
