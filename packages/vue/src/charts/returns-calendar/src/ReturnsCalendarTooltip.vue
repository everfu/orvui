<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { useReturnsCalendar } from "./context";
import { signed } from "./utils";
const calendar = useReturnsCalendar();
</script>
<template>
  <AnimatePresence
    ><motion.div
      v-if="calendar.tip"
      :id="calendar.tooltipId"
      role="tooltip"
      class="pointer-events-none absolute z-20 w-max max-w-64 rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-lg"
      :style="{
        left: Math.min(70, ((calendar.tip.m + 1) / 14) * 100) + '%',
        top: '-60px',
      }"
      :initial="{ opacity: 0, y: 4 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0 }"
      :transition="calendar.reduce ? { duration: 0 } : SPRING_LAYOUT"
      ><slot
        :label="calendar.tipLabel"
        :value="calendar.tipValue"
        :note="calendar.tipNote"
        ><p class="text-muted-foreground">{{ calendar.tipLabel }}</p>
        <p
          class="mt-1 font-mono text-base"
          :style="{
            color:
              calendar.tipValue >= 0 ? 'var(--success)' : 'var(--destructive)',
          }"
        >
          {{ signed(calendar.tipValue, 2) }}%
        </p>
        <p
          v-if="calendar.tipNote"
          class="mt-1 text-[10px] text-muted-foreground"
        >
          {{ calendar.tipNote }}
        </p></slot
      ></motion.div
    ></AnimatePresence
  >
</template>
