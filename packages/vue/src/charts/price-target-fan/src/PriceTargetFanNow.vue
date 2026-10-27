<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { EASE_OUT, SPRING_PANEL } from "../../../lib/ease";
import { usePriceTargetFan } from "./context";
const chart = usePriceTargetFan();
const origin = computed(() => ({
  transformOrigin: `${chart.geo.nowX}px ${chart.geo.nowY}px`,
}));
</script>
<template>
  <g
    ><motion.circle
      :cx="chart.geo.nowX"
      :cy="chart.geo.nowY"
      r="3.2"
      fill="var(--foreground)"
      :initial="{ opacity: chart.reduce ? 1 : 0, scale: chart.reduce ? 1 : 0 }"
      :animate="{ opacity: 1, scale: 1 }"
      :transition="
        chart.reduce ? { duration: 0 } : { ...SPRING_PANEL, delay: 0.85 }
      "
      :style="origin" /><motion.circle
      v-if="!chart.reduce"
      :cx="chart.geo.nowX"
      :cy="chart.geo.nowY"
      r="3.2"
      fill="none"
      stroke="var(--foreground)"
      stroke-width="1"
      :initial="{ opacity: 0, scale: 1 }"
      :animate="{ opacity: [0.45, 0], scale: [1, 2.8] }"
      :transition="{
        duration: 2.2,
        ease: EASE_OUT,
        repeat: Infinity,
        repeatDelay: 1.6,
        delay: 1.6,
      }"
      :style="origin"
  /></g>
</template>
