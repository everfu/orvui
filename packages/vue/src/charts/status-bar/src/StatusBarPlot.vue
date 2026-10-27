<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
import { useStatusBar } from "./context";
withDefaults(defineProps<{ barClassName?: string; showLabels?: boolean }>(), {
  showLabels: true,
});
const history = useStatusBar();
const anchor = ref<HTMLElement | null>(null);
const pointer = ref(false);
const focused = ref(false);
const selected = computed(() => history.rows[Math.max(0, history.activeIndex)]);
const valueText = computed(() =>
  selected.value
    ? [
        selected.value.datum.label,
        selected.value.status.label,
        selected.value.datum.description,
      ]
        .filter(Boolean)
        .join(". ")
    : "",
);
onMounted(() => {
  history.plotRef = anchor.value;
});
watch(
  anchor,
  (element) => {
    history.plotRef = element;
  },
  { flush: "post" },
);
onBeforeUnmount(() => {
  if (history.plotRef === anchor.value) history.plotRef = null;
});
function inspect(event: PointerEvent) {
  const element = event.currentTarget as HTMLElement;
  const bounds = element.getBoundingClientRect();
  if (!bounds.width || !history.rows.length) return;
  const fraction = Math.max(
    0,
    Math.min(1, (event.clientX - bounds.left) / bounds.width),
  );
  const index = Math.min(
    history.rows.length - 1,
    Math.floor(fraction * history.rows.length),
  );
  history.setActive(history.rows[index].datum.id);
  history.tooltipOpen = true;
}
function focus() {
  focused.value = true;
  if (!pointer.value && selected.value) {
    history.setActive(selected.value.datum.id);
    history.tooltipOpen = true;
  }
}
function blur() {
  focused.value = false;
  pointer.value = false;
  history.tooltipOpen = false;
}
function input(event: Event) {
  if (pointer.value) return;
  const row = history.rows[Number((event.target as HTMLInputElement).value)];
  if (row) {
    history.setActive(row.datum.id);
    history.tooltipOpen = true;
  }
}
function keydown(event: KeyboardEvent) {
  pointer.value = false;
  history.tooltipOpen = event.key !== "Escape";
}
function reveal(index: number) {
  return {
    opacity: {
      duration: history.reduce ? 0.15 : 0.24,
      ease: EASE_OUT,
      delay: history.reduce
        ? 0
        : (index / Math.max(history.rows.length - 1, 1)) * 0.18,
    },
    y: SPRING_PRESS,
    scaleY: SPRING_PRESS,
  };
}
</script>

<template>
  <p v-if="!history.rows.length" class="py-4 text-sm text-muted-foreground">
    No status data
  </p>
  <div v-else data-slot="status-bar-plot" class="min-w-0 space-y-1.5">
    <div
      ref="anchor"
      class="relative h-11 rounded-md has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-ring"
    >
      <div aria-hidden="true" class="flex h-full items-center gap-0.5 sm:gap-1">
        <motion.span
          v-for="({ datum, status }, index) in history.rows"
          :key="datum.id"
          :data-status-period="datum.id"
          :data-status="status.id"
          :class="[
            'relative block h-8 min-w-0 flex-1 rounded-full',
            barClassName,
          ]"
          :initial="{ opacity: 0 }"
          :while-in-view="
            history.reduce
              ? { opacity: 1 }
              : { opacity: 1, y: [4, 0], scaleY: [0.9, 1] }
          "
          :in-view-options="{ once: true }"
          :transition="reveal(index)"
        >
          <AnimatePresence :initial="false">
            <motion.span
              :key="status.id + ':' + status.color"
              class="pointer-events-none absolute inset-0 rounded-[inherit]"
              :style="{ backgroundColor: status.color }"
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :exit="{ opacity: 0 }"
              :transition="{ duration: 0.16, ease: EASE_OUT }"
            />
          </AnimatePresence>
          <motion.span
            class="pointer-events-none absolute -inset-0.5 rounded-[inherit] ring-1 ring-foreground/60"
            :initial="false"
            :animate="{
              opacity:
                history.tooltipOpen && history.activeIndex === index ? 1 : 0,
            }"
            :transition="{ duration: 0.1, ease: EASE_OUT }"
          />
        </motion.span>
      </div>
      <input
        type="range"
        :aria-label="history.label + ': inspect period'"
        min="0"
        :max="history.rows.length - 1"
        step="1"
        :value="Math.max(0, history.activeIndex)"
        :aria-valuetext="valueText"
        :aria-describedby="
          history.tooltipOpen && history.activeIndex >= 0
            ? history.tooltipId
            : undefined
        "
        class="absolute inset-0 m-0 size-full cursor-crosshair opacity-0"
        @focus="focus"
        @blur="blur"
        @input="input"
        @keydown="keydown"
        @pointerenter="history.canHover && inspect($event)"
        @pointermove="
          (history.canHover || $event.buttons === 1) && inspect($event)
        "
        @pointerleave="(!focused || pointer) && (history.tooltipOpen = false)"
        @pointerdown="
          pointer = true;
          inspect($event);
        "
        @pointercancel="
          pointer = false;
          history.tooltipOpen = false;
        "
        @click="pointer = false"
      />
    </div>
    <div
      v-if="showLabels"
      class="flex justify-between gap-4 text-xs text-muted-foreground"
    >
      <span>{{ history.rows[0].datum.label }}</span
      ><span>{{ history.rows.at(-1)?.datum.label }}</span>
    </div>
    <slot />
  </div>
</template>
