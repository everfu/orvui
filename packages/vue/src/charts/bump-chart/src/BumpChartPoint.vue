<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { motion, useTransform } from "motion-v";
import { EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
import { useBumpChart } from "./context";
import { PLOT } from "./model";
import type { BumpPosition } from "./use-geometry";
import ChartTooltip from "../../ChartTooltip.vue";
const props = defineProps<{
  seriesId: string;
  period: string;
  seriesIndex: number;
  position: BumpPosition;
}>();
const chart = useBumpChart();
const tooltipId = useId();
const anchor = ref<HTMLElement | null>(null),
  open = ref(false);
const row = computed(() =>
  chart.rows.find((item) => item.id === props.seriesId),
);
const index = computed(() => chart.periods.indexOf(props.period));
const rank = computed(() => row.value?.ranks[index.value]);
const previous = computed(() => row.value?.ranks[index.value - 1]);
const changeLabel = computed(() => {
  if (previous.value == null || rank.value == null) return "No previous rank";
  const delta = previous.value - rank.value;
  if (!delta) return "No change";
  return `${delta > 0 ? "Up" : "Down"} ${Math.abs(delta)} ${Math.abs(delta) === 1 ? "place" : "places"}`;
});
const transform = useTransform(
  [props.position.x, props.position.y],
  ([x, y]: number[]) =>
    `translate(${(x / PLOT.width) * 100}%,${(y / chart.height) * 100}%)`,
);
function focus() {
  chart.setFocused(props.seriesId);
  open.value = true;
}
function blur() {
  chart.setFocused(null);
  open.value = false;
}
function leave() {
  chart.setHovered(null);
  open.value = false;
}
function enter() {
  if (chart.canHover) {
    chart.setHovered(props.seriesId);
    open.value = true;
  }
}
function clear() {
  chart.select(null);
  chart.setFocused(null);
  chart.setHovered(null);
  open.value = false;
}
function select() {
  chart.select(chart.pinned === props.seriesId ? null : props.seriesId);
}
</script>
<template>
  <motion.div
    v-if="row && rank != null"
    class="pointer-events-none absolute inset-0"
    :style="{ transform }"
  >
    <div
      ref="anchor"
      class="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
      @pointerenter="enter"
      @pointerleave="leave"
    >
      <motion.button
        type="button"
        :aria-label="`${row.name}, ${period}: rank ${rank}`"
        :aria-pressed="chart.pinned === row.id"
        class="relative flex size-7 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        :style="{ color: row.color }"
        :initial="chart.reduce ? false : { scale: 0.85, opacity: 0 }"
        :animate="{
          scale: 1,
          opacity:
            chart.highlighted !== null && chart.highlighted !== row.id
              ? 0.22
              : 1,
        }"
        :transition="{
          scale: SPRING_PRESS,
          opacity: { duration: 0.18, ease: EASE_OUT },
        }"
        :while-hover="
          chart.canHover && !chart.reduce ? { scale: 1.12 } : undefined
        "
        @focus="focus"
        @blur="blur"
        @click="select"
        @keydown.esc="clear"
      >
        <motion.span
          aria-hidden="true"
          class="absolute inset-0 rounded-full bg-current"
          :initial="false"
          :animate="{ opacity: chart.highlighted === row.id ? 0.12 : 0 }"
          :transition="{ duration: 0.15, ease: EASE_OUT }"
        />
        <motion.span
          class="relative flex size-5 items-center justify-center rounded-full border-[1.5px] border-current bg-background font-mono text-[9px] font-medium"
          :initial="chart.reduce ? false : { scale: 0.85 }"
          :animate="{ scale: 1 }"
          :transition="
            chart.reduce
              ? { duration: 0 }
              : {
                  ...SPRING_PRESS,
                  delay:
                    Math.min(index, 8) * 0.025 +
                    Math.min(seriesIndex, 4) * 0.015,
                }
          "
          >{{ rank }}</motion.span
        >
      </motion.button>
      <ChartTooltip
        :id="tooltipId"
        :open="open"
        :anchor="anchor"
        @update:open="open = $event"
      >
        <span
          class="flex items-center justify-between gap-4 text-[10px] text-muted-foreground"
          ><span>{{ row.name }}</span
          ><span>{{ period }}</span></span
        >
        <span class="mt-2 flex items-baseline justify-between gap-4"
          ><span
            class="font-mono text-lg font-medium"
            :style="{ color: row.color }"
            >#{{ rank }}</span
          ><span>{{ changeLabel }}</span></span
        >
        <span
          v-if="previous != null"
          class="mt-1 block text-[10px] text-muted-foreground"
          >Previously #{{ previous }} in {{ chart.periods[index - 1] }}</span
        >
      </ChartTooltip>
    </div>
  </motion.div>
</template>
