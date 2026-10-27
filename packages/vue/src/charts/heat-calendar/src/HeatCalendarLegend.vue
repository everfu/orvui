<script setup lang="ts">
import { useHeatCalendar } from "./context";
import { fmtRange, STEPS } from "./utils";
const calendar = useHeatCalendar();
</script>
<template>
  <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
    <span class="text-xs text-muted-foreground">{{
      calendar.start && calendar.end
        ? fmtRange.format(calendar.start) +
          " – " +
          fmtRange.format(calendar.end)
        : "\u00a0"
    }}</span
    ><span
      class="flex items-center gap-1"
      @pointerleave="calendar.setStep(null)"
      ><span class="mr-0.5 text-xs text-muted-foreground">less</span
      ><button
        v-for="(step, index) in STEPS"
        :key="step"
        type="button"
        :aria-label="`Show activity level ${index}`"
        :aria-pressed="calendar.step === index"
        class="size-3 rounded-[3px] transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        :style="{
          background: calendar.fill(index),
          transform:
            !calendar.reduce && calendar.step === index
              ? 'scale(1.25)'
              : undefined,
        }"
        @pointerenter="calendar.canHover && calendar.setStep(index)"
        @focus="calendar.setStep(index)"
        @blur="calendar.setStep(null)"
        @click="calendar.setStep(calendar.step === index ? null : index)"
      /><span class="ml-0.5 text-xs text-muted-foreground">more</span></span
    >
  </div>
</template>
