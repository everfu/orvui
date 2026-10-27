<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import type { TodoItemStatus } from "./TodoList.vue";
const props = defineProps<{ status: TodoItemStatus; progress?: number }>();
const reduced = useReducedMotion();
const advancing = computed(() => props.status === "in-progress");
const indeterminate = computed(
  () => advancing.value && props.progress === undefined && !reduced.value,
);
const fraction = computed(() =>
  props.progress === undefined
    ? 0.68
    : Math.max(0, Math.min(100, props.progress)) / 100,
);
const strokeThrough = (points: readonly (readonly [number, number])[]) =>
  points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join("");
// Own normalized status marks, independent of the earlier copied path strings.
const marks = [
  {
    state: "completed",
    path: strokeThrough([
      [7.8, 12],
      [10.7, 15],
      [16.4, 9.3],
    ]),
    duration: 0.24,
  },
  {
    state: "cancelled",
    path:
      strokeThrough([
        [8.8, 8.8],
        [15.2, 15.2],
      ]) +
      strokeThrough([
        [15.2, 8.8],
        [8.8, 15.2],
      ]),
    duration: 0.2,
  },
];
</script>
<template>
  <motion.svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    :initial="false"
    :class="
      cn(
        'mx-0.5 size-5 shrink-0 overflow-visible text-muted-foreground',
        advancing && 'text-foreground',
        status === 'cancelled' && 'text-rose-600 dark:text-rose-400',
      )
    "
  >
    <motion.circle
      cx="12"
      cy="12"
      r="9"
      fill="currentColor"
      stroke="currentColor"
      :stroke-width="1.5"
      :stroke-dasharray="status === 'pending' ? '2 3' : undefined"
      stroke-linecap="round"
      :initial="false"
      :animate="{ fillOpacity: status === 'completed' ? 0.06 : 0 }"
      :transition="
        reduced ? { duration: 0 } : { duration: 0.18, ease: EASE_OUT }
      "
      :class="advancing && 'opacity-20'"
    />
    <motion.circle
      cx="12"
      cy="12"
      r="9"
      pathLength="1"
      fill="none"
      stroke="currentColor"
      :stroke-width="2"
      stroke-linecap="round"
      :initial="false"
      :animate="{
        pathLength: advancing ? fraction : 0,
        opacity: Number(advancing),
        rotate: indeterminate ? 360 : -90,
      }"
      :transition="
        indeterminate
          ? { rotate: { duration: 1.1, repeat: Infinity, ease: 'linear' } }
          : reduced
            ? { duration: 0 }
            : SPRING_LAYOUT
      "
      :style="{ transformOrigin: '12px 12px' }"
    />
    <motion.path
      v-for="mark in marks"
      :key="mark.state"
      :d="mark.path"
      fill="none"
      stroke="currentColor"
      :stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      :initial="false"
      :animate="{
        pathLength: Number(status === mark.state),
        opacity: Number(status === mark.state),
      }"
      :transition="
        reduced ? { duration: 0 } : { duration: mark.duration, ease: EASE_OUT }
      "
    />
  </motion.svg>
</template>
