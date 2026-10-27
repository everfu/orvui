<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "../../motion/button";
import {
  OrderBook,
  OrderBookHeader,
  OrderBookSide,
  OrderBookSpread,
  OrderBookBalance,
  OrderBookDepthSummary,
} from "./index";
const sizes = {
  ask: [284, 574, 363, 278, 1800, 2200, 1100, 1200, 782],
  bid: [194, 543, 314, 592, 715, 744, 789, 735, 1100],
};
const playing = ref(true),
  selected = ref<number | null>(null),
  tick = ref(0);
function levels(side: "ask" | "bid") {
  const direction = side === "ask" ? 1 : -1;
  return sizes[side].map((size, index) => {
    const phase = (index + (direction === 1 ? 1 : 0)) % 3;
    const updated = tick.value - ((tick.value + phase) % 3);
    return {
      price: Number((245.85 + direction * (index + 1) * 0.15).toFixed(2)),
      size:
        updated <= 0
          ? size
          : Math.round(
              size *
                (1 + Math.sin(updated * 1.3 + index * 2.1 + direction) * 0.32),
            ),
    };
  });
}
const book = computed(() => ({ asks: levels("ask"), bids: levels("bid") }));
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => {
    if (playing.value && !document.hidden) tick.value++;
  }, 950);
});
onBeforeUnmount(() => clearInterval(timer));
function step() {
  playing.value = false;
  tick.value++;
}
</script>
<template>
  <div class="w-full max-w-[520px] space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3 px-1">
      <div class="text-sm font-medium">
        SOL / USD
        <span
          class="ml-2 rounded border border-border px-1.5 py-0.5 text-[9px] uppercase text-muted-foreground"
          >Simulated</span
        >
      </div>
      <div class="flex gap-2">
        <Button variant="ghost" size="sm" @click="playing = !playing">{{
          playing ? "Pause" : "Resume"
        }}</Button
        ><Button variant="ghost" size="sm" @click="step">Step</Button>
      </div>
    </div>
    <OrderBook
      :bids="book.bids"
      :asks="book.asks"
      base-symbol="SOL"
      quote-symbol="USD"
      label="Simulated SOL / USD order book"
      @level-select="selected = $event.price"
      ><OrderBookHeader /><OrderBookSide
        side="ask" /><OrderBookSpread /><OrderBookSide
        side="bid" /><OrderBookDepthSummary /><OrderBookBalance
    /></OrderBook>
    <p aria-live="polite" class="px-1 text-xs text-muted-foreground">
      {{
        selected === null
          ? "Click a price to use it, for example in an order ticket."
          : `Selected ${selected.toFixed(2)} USD`
      }}
    </p>
  </div>
</template>
