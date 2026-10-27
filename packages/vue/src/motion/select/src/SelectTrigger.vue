<script setup lang="ts">
import { motion, useTransform } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import { useSelect } from "./context";
defineProps<{ className?: string }>();
const state = useSelect();
const trigger = state.trigger;
const nearRadius = useTransform(
  state.progress,
  [0, 0.2, 0.4, 1],
  ["12px", "0px", "0px", "12px"],
);
const rotate = useTransform(
  () =>
    (state.reduce.value
      ? Number(state.open.value)
      : Math.max(0, Math.min(1, state.progress.get()))) * 180,
);
function openWithArrow(event: KeyboardEvent) {
  if (
    event.defaultPrevented ||
    state.disabled.value ||
    state.open.value ||
    !["ArrowDown", "ArrowUp"].includes(event.key)
  )
    return;
  event.preventDefault();
  state.open.value = true;
}
</script>
<template>
  <motion.button
    ref="trigger"
    type="button"
    data-trigger
    :id="state.triggerId"
    :disabled="state.disabled.value"
    aria-haspopup="listbox"
    :aria-expanded="state.open.value"
    :aria-controls="state.listId"
    @click="!state.disabled.value && (state.open.value = !state.open.value)"
    @keydown="openWithArrow"
    :style="{
      borderTopLeftRadius:
        state.reduce.value || state.placement.value !== 'top'
          ? '12px'
          : nearRadius,
      borderTopRightRadius:
        state.reduce.value || state.placement.value !== 'top'
          ? '12px'
          : nearRadius,
      borderBottomLeftRadius:
        state.reduce.value || state.placement.value === 'top'
          ? '12px'
          : nearRadius,
      borderBottomRightRadius:
        state.reduce.value || state.placement.value === 'top'
          ? '12px'
          : nearRadius,
    }"
    :class="[
      'relative z-10 flex w-full items-center justify-between gap-2 border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors hover:border-(--color-border-strong) focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:pointer-events-none disabled:opacity-50',
      className,
    ]"
    ><slot /><motion.span
      aria-hidden="true"
      :style="{ rotate }"
      class="text-muted-foreground"
      ><ChevronDown class="h-4 w-4" /></motion.span
  ></motion.button>
</template>
