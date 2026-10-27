<script setup lang="ts">
import { computed } from "vue";
import { useCandlestickChart } from "./context";
const chart = useCandlestickChart();
const candle = computed(() =>
  chart.active === null ? chart.candles.at(-1) : chart.candles[chart.active],
);
const change = computed(() =>
  candle.value?.open
    ? ((candle.value.close - candle.value.open) / candle.value.open) * 100
    : 0,
);
const tone = computed(() =>
  change.value >= 0
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400",
);
const terms = computed(() =>
  candle.value
    ? [
        ["O", chart.formatPrice(candle.value.open)],
        ["H", chart.formatPrice(candle.value.high)],
        ["L", chart.formatPrice(candle.value.low)],
        ["C", chart.formatPrice(candle.value.close)],
        ["Vol", chart.formatVolume(candle.value.volume)],
      ]
    : [],
);
</script>
<template>
  <slot v-if="candle" :candle="candle" :change="change"
    ><dl
      class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tabular-nums"
    >
      <dt class="sr-only">Candle</dt>
      <dd class="text-muted-foreground">{{ candle.label }}</dd>
      <div v-for="[term, value] in terms" :key="term" class="flex gap-1">
        <dt class="text-muted-foreground">{{ term }}</dt>
        <dd :class="term === 'Vol' ? undefined : tone">{{ value }}</dd>
      </div>
      <dd :class="tone">
        {{ change >= 0 ? "+" : "−" }}{{ Math.abs(change).toFixed(2) }}%
      </dd>
    </dl></slot
  >
</template>
