<script setup lang="ts">
import { computed, ref } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { ActionSwapText } from "../../../motion/action-swap";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import { SPRING_PRESS } from "../../../lib/ease";
import { probability } from "./utils";
import type { PredictionMarketCardOutcome } from "./PredictionMarketCard.vue";
const props = defineProps<{
    positive: boolean;
    outcome: PredictionMarketCardOutcome;
  }>(),
  reduce = useReducedMotion(),
  hover = useMediaQuery("(hover:hover) and (pointer:fine)"),
  hovered = ref(false),
  focused = ref(false);
const show = computed(() => (hover.value && hovered.value) || focused.value),
  cents = computed(() =>
    Math.round(probability(props.outcome.probability) * 100),
  );
</script>
<template>
  <motion.button
    type="button"
    :aria-label="`Trade ${outcome.label} at ${cents}%`"
    :while-press="reduce ? undefined : { scale: 0.96 }"
    :transition="SPRING_PRESS"
    :class="
      cn(
        'relative flex min-h-10 min-w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground shadow-[0_3px_0] transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        positive
          ? 'shadow-emerald-500/20 border-emerald-500/25 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400'
          : 'shadow-rose-500/20 border-rose-500/25 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 dark:text-rose-400',
      )
    "
    @pointerenter="$event.pointerType !== 'touch' && (hovered = true)"
    @pointerleave="hovered = false"
    @focus="
      focused = ($event.currentTarget as HTMLElement).matches(':focus-visible')
    "
    @blur="focused = false"
    ><ActionSwapText
      :value="show ? 'action' : String(cents)"
      animation="roll"
      >{{ show ? (positive ? "Yes" : "No") : `${cents}%` }}</ActionSwapText
    ></motion.button
  >
</template>
