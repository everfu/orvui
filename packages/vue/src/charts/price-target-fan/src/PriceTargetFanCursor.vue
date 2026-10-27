<script setup lang="ts">
import { motion } from "motion-v";
import { SPRING_GLIDE } from "../../../lib/ease";
import { usePriceTargetFan } from "./context";
import { H, PAD } from "./utils";
const chart = usePriceTargetFan();
</script>
<template>
  <g
    ><g v-if="chart.scrub !== null" pointer-events="none"
      ><motion.line
        :y1="PAD.t"
        :y2="H - PAD.b"
        :stroke="`url(#${chart.fadeId})`"
        stroke-width="1"
        :initial="false"
        :animate="{
          x1: chart.geo.hx(chart.scrub),
          x2: chart.geo.hx(chart.scrub),
        }"
        :transition="
          chart.reduce ? { duration: 0 } : { type: 'spring', ...SPRING_GLIDE }
        " /><motion.circle
        r="3.2"
        fill="var(--foreground)"
        stroke="var(--background)"
        stroke-width="1.5"
        :initial="false"
        :animate="{
          cx: chart.geo.hx(chart.scrub),
          cy: chart.y(chart.hist[chart.scrub]),
        }"
        :transition="
          chart.reduce ? { duration: 0 } : { type: 'spring', ...SPRING_GLIDE }
        " /></g
  ></g>
</template>
