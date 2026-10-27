<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { usePicker, CHECKERBOARD, COLOR_MORPH } from "./context";
const state = usePicker();
const anchor = state.anchor;
const reduced = useReducedMotion();
const text = ref<HTMLElement | null>(null);
const width = ref<number | null>(null);
const alpha = computed(() => state.hex.value.slice(7));
let observer: ResizeObserver | undefined;
function measure() {
  if (text.value) width.value = text.value.offsetWidth;
}
onMounted(() => {
  measure();
  if (text.value && typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(measure);
    observer.observe(text.value);
  }
});
onBeforeUnmount(() => observer?.disconnect());
function toggle() {
  if (!state.disabled.value) state.open.value = !state.open.value;
}
</script>
<template>
  <button
    ref="anchor"
    type="button"
    data-color-picker-trigger=""
    :disabled="state.disabled.value"
    aria-haspopup="dialog"
    :aria-expanded="state.open.value"
    :aria-controls="state.open.value ? `${state.id}-content` : undefined"
    @click="toggle"
    class="inline-flex h-10 w-fit items-center gap-2.5 rounded-xl border border-border bg-background pr-3.5 pl-2.5 text-sm text-foreground outline-none transition-colors hover:border-foreground/20 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
  >
    <span aria-hidden="true" class="relative size-6 shrink-0"
      ><span
        class="absolute inset-0 rounded-md border border-dashed border-foreground/20" /><motion.span
        v-if="!state.open.value"
        :layout-id="reduced ? undefined : `${state.id}-chip`"
        :transition="COLOR_MORPH"
        class="absolute inset-0 overflow-hidden"
        :style="{ borderRadius: '6px', background: CHECKERBOARD }"
        ><span
          class="absolute inset-0 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]"
          :style="{
            backgroundColor: state.hex.value,
            borderRadius: '6px',
          }" /></motion.span></span
    ><slot
      ><motion.span
        class="relative inline-flex overflow-hidden"
        :initial="false"
        :animate="{ width: width ?? 'auto' }"
        :transition="reduced ? { duration: 0 } : SPRING_LAYOUT"
        ><span
          ref="text"
          class="relative inline-flex shrink-0 whitespace-nowrap font-mono uppercase tabular-nums"
          >{{ state.hex.value.slice(0, 7)
          }}<AnimatePresence mode="popLayout" :initial="false"
            ><motion.span
              v-if="alpha"
              key="alpha"
              class="text-muted-foreground"
              :initial="{
                opacity: 0,
                x: reduced ? 0 : -4,
                filter: reduced ? 'blur(0px)' : 'blur(3px)',
              }"
              :animate="{ opacity: 1, x: 0, filter: 'blur(0px)' }"
              :exit="{
                opacity: 0,
                filter: reduced ? 'blur(0px)' : 'blur(3px)',
                transition: { duration: 0.12 },
              }"
              :transition="SPRING_LAYOUT"
              >{{ alpha }}</motion.span
            ></AnimatePresence
          ></span
        ></motion.span
      ></slot
    >
  </button>
</template>
