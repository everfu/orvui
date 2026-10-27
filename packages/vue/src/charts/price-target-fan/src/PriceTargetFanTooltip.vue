<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { SPRING_PANEL } from "../../../lib/ease";
import { usePriceTargetFan } from "./context";
import { H, W, ink } from "./utils";
const chart = usePriceTargetFan();
</script>
<template>
  <AnimatePresence
    ><motion.div
      v-if="chart.overlay"
      :id="chart.tooltipId"
      role="tooltip"
      class="pointer-events-none absolute z-20 w-40 rounded-xl border border-border bg-popover p-3 text-xs shadow-lg"
      :style="{
        left:
          Math.max(0, Math.min(65, (chart.overlay.px / W) * 100 - 20)) + '%',
        top: Math.max(0, (chart.overlay.py / H) * 100 - 40) + '%',
      }"
      :initial="{ opacity: 0, scale: 0.96 }"
      :animate="{ opacity: 1, scale: 1 }"
      :exit="{ opacity: 0, scale: 0.96 }"
      :transition="chart.reduce ? { duration: 0 } : SPRING_PANEL"
      ><slot :overlay="chart.overlay"
        ><p class="mb-2 text-[10px] text-muted-foreground">
          {{ chart.overlay.title }}
        </p>
        <div
          v-for="metric in chart.overlay.metrics"
          :key="metric.label"
          class="flex justify-between gap-4 py-1"
        >
          <span class="text-muted-foreground">{{ metric.label }}</span
          ><span class="font-mono">{{ metric.value }}</span>
        </div>
        <div
          v-if="chart.overlay.accent"
          class="mt-1 flex justify-between gap-4 border-t border-border pt-2"
        >
          <span class="text-muted-foreground">{{
            chart.overlay.accent.label
          }}</span
          ><span
            class="font-mono"
            :style="{ color: ink(chart.overlay.accent.color) }"
            >{{ chart.overlay.accent.value }}</span
          >
        </div></slot
      ></motion.div
    ></AnimatePresence
  >
</template>
