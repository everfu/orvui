<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { motion } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { usePriceTargetFan } from "./context";
import { H, PAD, W } from "./utils";
import PriceTargetFanAxes from "./PriceTargetFanAxes.vue";
import PriceTargetFanHistory from "./PriceTargetFanHistory.vue";
import PriceTargetFanTargets from "./PriceTargetFanTargets.vue";
import PriceTargetFanNow from "./PriceTargetFanNow.vue";
import PriceTargetFanCursor from "./PriceTargetFanCursor.vue";
const chart = usePriceTargetFan(),
  element = ref<SVGSVGElement | null>(null);
onMounted(() => {
  chart.svgRef.value = element.value;
});
onBeforeUnmount(() => {
  if (chart.svgRef.value === element.value) chart.svgRef.value = null;
});
</script>
<template>
  <svg
    ref="element"
    :viewBox="`0 0 ${W} ${H}`"
    class="block h-auto w-full cursor-crosshair [&_*]:cursor-crosshair"
    role="group"
    :aria-label="`${chart.label}: mean ${chart.fmt(chart.mean.price)}, now ${chart.fmt(chart.current)}`"
    @pointermove="chart.onMove"
    @pointerleave="$event.pointerType !== 'touch' && chart.setActive(null)"
  >
    <defs>
      <linearGradient
        :id="chart.fadeId"
        gradientUnits="userSpaceOnUse"
        x1="0"
        :y1="PAD.t"
        x2="0"
        :y2="H - PAD.b"
      >
        <stop offset="0" stop-color="var(--border-strong)" stop-opacity="0" />
        <stop offset=".45" stop-color="var(--border-strong)" stop-opacity="1" />
        <stop offset="1" stop-color="var(--border-strong)" stop-opacity="1" />
      </linearGradient>
      <clipPath :id="chart.clipId">
        <motion.rect
          :x="chart.geo.nowX"
          y="0"
          :height="H"
          :initial="{ width: chart.reduce ? W - chart.geo.nowX : 0 }"
          :animate="{ width: W - chart.geo.nowX }"
          :transition="
            chart.reduce
              ? { duration: 0 }
              : { duration: 0.8, ease: EASE_OUT, delay: 0.85 }
          "
        />
      </clipPath>
    </defs>
    <slot>
      <PriceTargetFanAxes />
      <PriceTargetFanHistory />
      <PriceTargetFanTargets />
      <PriceTargetFanNow />
      <PriceTargetFanCursor />
    </slot>
  </svg>
</template>
