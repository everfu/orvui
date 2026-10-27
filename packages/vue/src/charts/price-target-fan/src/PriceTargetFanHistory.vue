<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { usePriceTargetFan } from "./context";
const chart = usePriceTargetFan();
const selected = computed(() => chart.scrub ?? chart.hist.length - 1);
function keydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    chart.setActive(null);
    return;
  }
  const destinations: Record<string, number> = {
    Home: 0,
    End: chart.hist.length - 1,
    ArrowLeft: selected.value - 1,
    ArrowRight: selected.value + 1,
  };
  if (!(event.key in destinations)) return;
  event.preventDefault();
  chart.setScrub(
    Math.max(0, Math.min(chart.hist.length - 1, destinations[event.key])),
  );
}
</script>
<template>
  <g
    ><g
      v-if="chart.hist.length"
      role="slider"
      tabindex="0"
      aria-label="Price history"
      :aria-valuemin="0"
      :aria-valuemax="chart.hist.length - 1"
      :aria-valuenow="selected"
      :aria-valuetext="`${chart.history[selected].date}: ${chart.fmt(chart.hist[selected])}`"
      :aria-describedby="chart.scrub !== null ? chart.tooltipId : undefined"
      @focus="chart.setScrub(chart.hist.length - 1)"
      @blur="chart.setActive(null)"
      @keydown="keydown"
      ><motion.path
        data-price-history=""
        :d="chart.geo.line"
        fill="none"
        stroke="var(--foreground)"
        stroke-width="1.5"
        stroke-linecap="round"
        :initial="{ pathLength: chart.reduce ? 1 : 0 }"
        :animate="{ pathLength: 1 }"
        :transition="
          chart.reduce ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT }
        " /></g
  ></g>
</template>
