<script setup lang="ts">
import { motion } from "motion-v";
import { EASE_OUT, SPRING_PANEL } from "../../../lib/ease";
import { usePriceTargetFan } from "./context";
import { ink } from "./utils";
const chart = usePriceTargetFan();
function toggle(index: number) {
  chart.setHotT(chart.hotT === index ? null : index);
}
function touch(event: PointerEvent, index: number) {
  if (event.pointerType === "touch") {
    event.preventDefault();
    toggle(index);
  }
}
function keydown(event: KeyboardEvent, index: number) {
  if (event.key === "Escape") {
    event.preventDefault();
    chart.setActive(null);
  } else if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggle(index);
  }
}
</script>
<template>
  <g
    ><g :clip-path="`url(#${chart.clipId})`"
      ><motion.g
        v-for="(target, index) in chart.geo.proj"
        :key="target.key"
        role="button"
        tabindex="0"
        :aria-label="`${target.key} target ${chart.fmt(target.price)}, ${target.analysts} analysts`"
        class="outline-none"
        :aria-pressed="chart.hotT === index"
        :aria-describedby="chart.hotT === index ? chart.tooltipId : undefined"
        :initial="{ opacity: 1 }"
        :animate="{
          opacity: chart.hotT !== null && chart.hotT !== index ? 0.3 : 1,
        }"
        :transition="
          chart.reduce ? { duration: 0 } : { duration: 0.25, ease: EASE_OUT }
        "
        @focus="chart.setHotT(index)"
        @blur="chart.setHotT(null)"
        @pointerenter="chart.setHotT(index)"
        @pointerdown="touch($event, index)"
        @keydown="keydown($event, index)"
        ><path
          :d="target.d"
          fill="none"
          stroke="transparent"
          stroke-width="16"
        /><path
          :d="target.d"
          fill="none"
          :stroke="target.color"
          :stroke-width="chart.hotT === index ? 2.2 : 1.4"
          :stroke-opacity="chart.hotT === index ? 1 : 0.75"
          stroke-dasharray="2 4"
          stroke-linecap="round"
        /><motion.path
          v-if="chart.hotT === index"
          :d="target.d"
          fill="none"
          :stroke="target.color"
          stroke-width="2.2"
          stroke-linecap="round"
          :initial="{ pathLength: chart.reduce ? 1 : 0 }"
          :animate="{ pathLength: 1 }"
          :transition="
            chart.reduce ? { duration: 0 } : { duration: 0.35, ease: EASE_OUT }
          "
        /><motion.circle
          :cx="chart.geo.endX"
          :cy="target.ty"
          fill="var(--background)"
          :stroke="target.color"
          stroke-width="1.6"
          r="3.2"
          :animate="{ r: chart.hotT === index ? 4.5 : 3.2 }"
          :transition="chart.reduce ? { duration: 0 } : SPRING_PANEL"
        /><text
          :x="chart.geo.endX + 10"
          :y="target.ty + 4"
          font-size="11"
          font-weight="600"
          :fill="ink(target.color)"
          class="font-mono tabular-nums"
          >{{ target.price }}</text
        ></motion.g
      ></g
    ></g
  >
</template>
