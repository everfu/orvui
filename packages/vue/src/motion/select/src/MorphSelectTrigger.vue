<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { motion, AnimatePresence } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import { MORPH, ROW, useSelect } from "./context";
defineProps<{ className?: string }>();
const state = useSelect();
const trigger = state.trigger;
function open() {
  if (!state.disabled.value) state.open.value = true;
}
function key(event: KeyboardEvent) {
  if (!event.defaultPrevented && ["ArrowDown", "ArrowUp"].includes(event.key)) {
    event.preventDefault();
    open();
  }
}
</script>
<template>
  <div
    aria-hidden="true"
    inert
    :class="[ROW, 'invisible rounded-xl border border-border']"
  >
    <slot /><ChevronDown class="h-4 w-4" />
  </div>
  <AnimatePresence :initial="false" mode="popLayout"
    ><motion.button
      v-if="!state.open.value"
      key="trigger"
      ref="trigger"
      v-bind="$attrs"
      :layout-id="state.layoutId"
      type="button"
      :id="state.triggerId"
      :disabled="state.disabled.value"
      aria-haspopup="listbox"
      :aria-expanded="state.open.value"
      :aria-controls="state.listId"
      @click="open"
      @keydown="key"
      :transition="state.reduce.value ? { duration: 0 } : MORPH"
      :style="{ borderRadius: '12px' }"
      :class="[
        ROW,
        'absolute inset-x-0 top-0 z-10 border border-border bg-background text-foreground outline-none transition-colors hover:border-(--color-border-strong) focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:pointer-events-none disabled:opacity-50',
        className,
      ]"
      ><motion.span layout="position" class="min-w-0 truncate"
        ><slot /></motion.span
      ><motion.span layout="position" class="text-muted-foreground"
        ><ChevronDown class="h-4 w-4" /></motion.span></motion.button
  ></AnimatePresence>
</template>
