<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "../../motion/button";
import {
  CandlestickChart,
  CandlestickChartLegend,
  CandlestickChartPlot,
  type Candle,
} from "./index";
const label = (seconds: number) =>
  `${String(Math.floor(seconds / 3600) % 24).padStart(2, "0")}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}`;
function initial(): Candle[] {
  let previous = 2380;
  return Array.from({ length: 48 }, (_, index) => {
    const open = previous,
      close =
        open *
        (1 + Math.sin(index * 0.7) * 0.004 + Math.cos(index * 0.23) * 0.003);
    const reach =
        Math.abs(close - open) * 0.6 +
        1.5 +
        Math.abs(Math.sin(index * 1.9)) * 3,
      start = 43200 + index * 300;
    previous = close;
    return {
      id: String(start),
      label: label(start),
      open,
      close,
      high: Math.max(open, close) + reach * Math.abs(Math.cos(index * 1.3)),
      low: Math.min(open, close) - reach * Math.abs(Math.sin(index * 0.9)),
      volume: 120 + Math.abs(Math.sin(index * 0.6)) * 420,
    };
  });
}
const playing = ref(true),
  state = ref({ tick: 0, candles: initial() });
function advance() {
  const tick = state.value.tick + 1,
    candles = state.value.candles,
    last = candles.at(-1)!;
  const price =
    last.close *
    (1 + Math.sin(tick * 1.7) * 0.0012 + Math.cos(tick * 0.6) * 0.0006);
  const next = [
    ...candles.slice(0, -1),
    {
      ...last,
      close: price,
      high: Math.max(last.high, price),
      low: Math.min(last.low, price),
      volume: last.volume + 12 + Math.abs(Math.sin(tick)) * 30,
    },
  ];
  if (tick % 8 === 0) {
    next.shift();
    const start = Number(last.id) + 300;
    next.push({
      id: String(start),
      label: label(start),
      open: price,
      close: price,
      high: price,
      low: price,
      volume: 0,
    });
  }
  state.value = { tick, candles: next };
}
function step() {
  playing.value = false;
  advance();
}
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => {
    if (playing.value && !document.hidden) advance();
  }, 650);
});
onBeforeUnmount(() => clearInterval(timer));
const price = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatPrice = (value: number) => price.format(value);
</script>
<template>
  <div class="w-full max-w-3xl space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3 px-1">
      <div class="flex items-center gap-2 text-sm font-medium">
        ETH / USD · 5m<span
          class="rounded border border-border px-1.5 py-0.5 text-[9px] font-normal uppercase tracking-wider text-muted-foreground"
          >Simulated</span
        >
      </div>
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="sm" @click="playing = !playing">{{
          playing ? "Pause" : "Resume"
        }}</Button
        ><Button variant="ghost" size="sm" @click="step">Step</Button>
      </div>
    </div>
    <CandlestickChart
      :candles="state.candles"
      :last-price="state.candles.at(-1)?.close"
      label="Simulated ETH / USD, 5 minute candles"
      :format-price="formatPrice"
      ><CandlestickChartLegend /><CandlestickChartPlot
        :height="320"
        class="mt-4"
    /></CandlestickChart>
  </div>
</template>
