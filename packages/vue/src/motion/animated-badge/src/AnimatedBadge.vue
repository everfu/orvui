<script setup lang="ts">
import { Comment, Text, computed, useSlots } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { Check, Circle, Info, LoaderCircle, TriangleAlert, X } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_LAYOUT, SPRING_SWAP } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
const props = withDefaults(defineProps<{
  status?: "neutral" | "info" | "success" | "warning" | "danger" | "loading";
  size?: "sm" | "md"; icon?: any; showIcon?: boolean; pulse?: boolean; contentKey?: string | number;
}>(), { status: "neutral", size: "md", showIcon: true, pulse: undefined });
const slots = useSlots(), reduced = useReducedMotion();
const icon = computed(() => props.icon ?? ({ neutral: Circle, info: Info, success: Check, warning: TriangleAlert, danger: X, loading: LoaderCircle })[props.status]);
const color = computed(() => ({
  neutral: "border-border bg-card text-muted-foreground", info: "border-primary/40 bg-muted text-primary",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "border-destructive/40 bg-destructive/10 text-destructive", loading: "border-primary/40 bg-muted text-primary",
})[props.status]);
const iconSize = computed(() => props.size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5");
function labelNodes() { return slots.default?.().filter(node => node.type !== Comment) ?? []; }
function hasLabel() { return labelNodes().some(node => node.type !== Text || String(node.children ?? "").length > 0); }
function labelKey() {
  if (props.contentKey !== undefined) return props.contentKey;
  const nodes = labelNodes();
  return nodes.length === 1 && nodes[0]!.type === Text ? String(nodes[0]!.children) : props.status;
}
const atRest = { opacity: 1, y: 0, filter: "blur(0px)" };
const quietExit = { opacity: 0, transition: { duration: 0 } };
function poses(distance: number | string, exitDistance: number | string) {
  return {
    initial: { opacity: 0, y: distance, filter: "blur(3px)" },
    animate: { opacity: 1, y: typeof distance === "string" ? "0%" : 0, filter: "blur(0px)", transition: SPRING_SWAP },
    exit: { opacity: 0, y: exitDistance, filter: "blur(3px)", transition: { duration: 0.14, ease: EASE_OUT } },
  };
}
const iconPoses = poses(12, -12), textPoses = poses("90%", "-90%");
</script>
<template>
  <motion.span :layout="!reduced" :transition="SPRING_LAYOUT"
    :class="cn('relative inline-flex shrink-0 items-center overflow-hidden whitespace-nowrap rounded-full border font-medium tabular-nums transition-colors duration-300', color, size === 'sm' ? 'h-6 gap-1.5 px-2 text-[11px]' : 'h-8 gap-2 px-3 text-xs')">
    <motion.span v-if="(pulse ?? status === 'loading') && !reduced" aria-hidden="true" class="absolute inset-0 rounded-full bg-current"
      :initial="{ opacity: 0.06 }" :animate="{ opacity: [0.06, 0.18, 0.06] }" :transition="{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }" />
    <motion.span v-if="showIcon" :layout="reduced ? false : 'position'" :transition="SPRING_LAYOUT"
      class="relative z-10 inline-grid shrink-0 place-items-center overflow-hidden">
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span :key="status" aria-hidden="true" data-badge-icon="" :variants="iconPoses"
          :initial="reduced ? false : 'initial'" :animate="reduced ? atRest : 'animate'" :exit="reduced ? quietExit : 'exit'"
          class="col-start-1 row-start-1 inline-flex items-center justify-center">
          <slot name="icon">
            <motion.span v-if="status === 'loading' && !reduced && !props.icon" :animate="{ rotate: 360 }"
              :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }" class="inline-flex"><LoaderCircle :class="iconSize" /></motion.span>
            <component v-else :is="icon" :class="iconSize" />
          </slot>
        </motion.span>
      </AnimatePresence>
    </motion.span>
    <motion.span v-if="hasLabel()" :layout="reduced ? false : 'position'" :transition="SPRING_LAYOUT"
      class="relative z-10 inline-flex" :style="{ clipPath: 'inset(0 -999px)' }">
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span :key="labelKey()" data-badge-label="" :variants="textPoses"
          :initial="reduced ? false : 'initial'" :animate="reduced ? atRest : 'animate'" :exit="reduced ? quietExit : 'exit'" class="inline-block"><slot /></motion.span>
      </AnimatePresence>
    </motion.span>
  </motion.span>
</template>
