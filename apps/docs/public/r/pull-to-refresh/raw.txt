<script setup lang="ts">
import { computed, ref, type Component, type VNodeChild } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import RenderContent from "../../../lib/RenderContent";
import RefreshBuddy from "./RefreshBuddy.vue";
import { usePullState } from "./pull-state";
const props = withDefaults(defineProps<{ onRefresh?: () => void | Promise<void>; refreshing?: boolean; disabled?: boolean; threshold?: number; maxPull?: number; holdDistance?: number; pullingLabel?: VNodeChild | Component; releaseLabel?: VNodeChild | Component; refreshingLabel?: VNodeChild | Component; ariaLabel?: string; contentClassName?: string; indicatorClassName?: string }>(), { threshold: 76, maxPull: 132, holdDistance: 68, pullingLabel: "Pull to refresh", releaseLabel: "Release to refresh", refreshingLabel: "Refreshing", ariaLabel: "Refreshable content" });
const emit = defineEmits<{ error: [error: unknown] }>();
const root = ref<HTMLElement | null>(null);
const reduce = useReducedMotion();
const { status, refreshing, y, progress, opacity, scale, amount, down, move, end } = usePullState(root, props, reduce, error => emit("error", error));
const label = computed(() => status.value === "refreshing" ? props.refreshingLabel : status.value === "ready" ? props.releaseLabel : props.pullingLabel);
</script>
<template>
  <section ref="root" :aria-label="ariaLabel" :aria-busy="refreshing" :data-state="status" :data-disabled="disabled || undefined" @pointerdown="down" @pointermove="move" @pointerup="end" @pointercancel="end" :class="cn('relative w-full overflow-y-auto overscroll-contain bg-background [-webkit-touch-callout:none] pointer-coarse:select-none', status === 'pulling' || status === 'ready' ? 'cursor-grabbing select-none' : 'cursor-grab', (disabled || refreshing) && 'cursor-default')">
    <motion.div aria-live="polite" aria-atomic="true" :style="reduce ? { opacity } : { opacity, scale }" :class="cn('pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[4.25rem] flex-col items-center justify-center gap-0.5 bg-gradient-to-b from-background via-background/95 to-transparent text-[11px] font-medium text-muted-foreground', indicatorClassName)"><RefreshBuddy :progress="progress" :status="status" :reduce="reduce" /><span class="relative h-4 min-w-24 text-center"><AnimatePresence :initial="false" mode="wait"><motion.span :key="status" :initial="reduce ? { opacity: 0 } : { opacity: 0, y: 3 }" :animate="reduce ? { opacity: 1 } : { opacity: 1, y: 0 }" :exit="reduce ? { opacity: 0 } : { opacity: 0, y: -3 }" :transition="{ duration: .16, ease: EASE_OUT }" class="absolute inset-x-0 whitespace-nowrap"><RenderContent :node="label" /></motion.span></AnimatePresence></span></motion.div>
    <motion.div :style="reduce ? undefined : { y }" :class="cn('relative z-10 min-h-full bg-inherit will-change-transform', contentClassName)"><slot :status="status" :progress="amount" /></motion.div>
  </section>
</template>
