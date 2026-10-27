<script setup lang="ts">
import { NumberTicker } from "../../../motion/number";
import { usePriceTargetFan } from "./context";
import { ink, UP, LOW } from "./utils";
const chart = usePriceTargetFan();
</script>
<template>
  <div class="mb-1 flex items-end justify-between px-1">
    <slot
      ><div class="flex flex-wrap items-center gap-2" aria-live="polite">
        <NumberTicker
          :value="Math.round(chart.head.price * 100)"
          :format="(value) => (value / 100).toFixed(2)"
          prefix="$"
          :duration="0.5"
          class="font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums"
        /><span
          class="font-mono text-xs font-medium tabular-nums"
          :style="{
            color: ink(chart.head.color ?? (chart.headPct >= 0 ? UP : LOW)),
          }"
          ><NumberTicker
            :value="Math.round(Math.abs(chart.headPct) * 10)"
            :format="(value) => (value / 10).toFixed(1)"
            :prefix="chart.headPct >= 0 ? '+' : '−'"
            suffix="%"
            :duration="0.5" /></span
        ><span class="text-xs text-muted-foreground"
          >{{ chart.head.key }} target</span
        >
      </div></slot
    >
  </div>
</template>
