<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { useHeatCalendar } from "./context";
import { fmtDay, fmtRange } from "./utils";
const calendar = useHeatCalendar();
</script>
<template>
  <AnimatePresence
    ><motion.div
      v-if="calendar.tooltip"
      :id="calendar.tooltipId"
      role="tooltip"
      class="pointer-events-none absolute top-0 left-0 z-20 w-max max-w-64 rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-lg"
      :initial="{ opacity: 0 }"
      :animate="{
        opacity: 1,
        x: Math.max(0, calendar.tipX - 70),
        y: calendar.tipY - 62,
      }"
      :exit="{ opacity: 0 }"
      :transition="calendar.reduce ? { duration: 0 } : SPRING_LAYOUT"
      ><slot :tooltip="calendar.tooltip"
        ><p class="font-mono">
          {{
            calendar.tooltip.days > 1
              ? calendar.tooltip.total
              : calendar.tooltip.count
          }}
          {{ calendar.unit }}
        </p>
        <p class="mt-1 text-[10px] text-muted-foreground">
          {{
            calendar.tooltip.days > 1
              ? `${fmtRange.format(calendar.tooltip.startDate)} – ${fmtRange.format(calendar.tooltip.endDate)} · ${calendar.tooltip.days} days`
              : fmtDay.format(calendar.tooltip.date)
          }}
        </p></slot
      ></motion.div
    ></AnimatePresence
  >
</template>
