<script setup lang="ts">
import { motion } from "motion-v";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { useDonutChart } from "./context";
const chart = useDonutChart();
const transformOrigin = {
  transformBox: "view-box",
  transformOrigin: "100px 100px",
} as const;
function transition(index: number) {
  return chart.reduce
    ? { duration: 0 }
    : {
        opacity: { duration: 0.4, delay: 0.15 + index * 0.06, ease: EASE_OUT },
        scale: SPRING_LAYOUT,
      };
}
function hover(id: string | null) {
  if (chart.canHover) chart.setActive(id);
}
</script>

<template>
  <div class="relative mx-auto aspect-square w-full max-w-64">
    <svg
      class="size-full overflow-visible"
      viewBox="0 0 200 200"
      role="img"
      :aria-label="chart.label"
    >
      <circle
        class="stroke-muted"
        cx="100"
        cy="100"
        :r="chart.radius"
        fill="none"
        :stroke-width="chart.thickness"
        opacity="0.6"
      />
      <motion.g
        :style="transformOrigin"
        :initial="
          chart.reduce ? false : { rotate: -90, scale: 0.88, opacity: 0 }
        "
        :while-in-view="{ rotate: 0, scale: 1, opacity: 1 }"
        :in-view-options="{ once: true, amount: 0.4 }"
        :transition="{ duration: chart.reduce ? 0 : 0.9, ease: EASE_OUT }"
      >
        <motion.path
          v-for="(segment, index) in chart.placed"
          :key="segment.id"
          :d="segment.path"
          :stroke="segment.color"
          :stroke-width="chart.thickness"
          fill="none"
          stroke-linecap="round"
          pointer-events="none"
          aria-hidden="true"
          :style="transformOrigin"
          :initial="chart.reduce ? false : { opacity: 0 }"
          :animate="{
            opacity:
              chart.active !== null && chart.active !== segment.id ? 0.3 : 1,
            scale: chart.active === segment.id ? 1.05 : 1,
          }"
          :transition="transition(index)"
        />
      </motion.g>
      <path
        v-for="segment in chart.placed"
        :key="segment.id"
        :d="segment.path"
        class="cursor-pointer"
        fill="none"
        stroke="transparent"
        stroke-linecap="round"
        :stroke-width="chart.thickness + 8"
        pointer-events="stroke"
        @pointerenter="hover(segment.id)"
        @pointerleave="hover(null)"
        @click="chart.select(segment.id)"
      />
    </svg>
    <div
      v-if="$slots.default"
      class="pointer-events-none absolute inset-0 flex items-center justify-center text-center"
    >
      <slot />
    </div>
  </div>
</template>
