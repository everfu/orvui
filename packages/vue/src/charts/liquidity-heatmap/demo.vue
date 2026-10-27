<script setup lang="ts">
import { computed, ref } from "vue";
import { RefreshCw } from "lucide-vue-next";
import { Button } from "../../motion/button";
import { LiquidityHeatmap, type LiquiditySnapshot } from "./index";
const phase = ref(0);
const snapshots = computed<LiquiditySnapshot[]>(() =>
  Array.from({ length: 24 }, (_, minute) => ({
    id: `minute-${minute}`,
    label: `14:${String(minute * 2).padStart(2, "0")}`,
    price:
      245.5 +
      Math.sin(minute * 0.27 + phase.value * 0.4) * 1.2 +
      minute * 0.035,
    levels: Array.from({ length: 18 }, (_, row) => {
      const upper = Math.exp(
        -((row - 4 - Math.sin(minute * 0.18 + phase.value) * 0.7) ** 2) / 0.8,
      );
      const lower = Math.exp(
        -((row - 13 + Math.cos(minute * 0.15 + phase.value) * 0.8) ** 2) / 1.2,
      );
      const noise =
        (Math.sin(row * 12.9 + minute * 7.3 + phase.value * 2.1) + 1) / 2;
      return {
        price: 250 - row * 0.5,
        size: Math.round(
          90 +
            noise * 350 +
            (upper + lower) *
              (1500 + Math.sin(minute * 0.3 + phase.value) * 450),
        ),
      };
    }),
  })),
);
const formatPrice = (price: number) => `$${price.toFixed(2)}`;
</script>
<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-medium">Where liquidity rests</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          SOL / USD · Simulated depth
        </p>
      </div>
      <Button variant="ghost" size="sm" class="gap-2" @click="phase++"
        ><RefreshCw aria-hidden="true" class="size-3.5" />Resimulate</Button
      >
    </div>
    <LiquidityHeatmap
      :snapshots="snapshots"
      :max-size="2400"
      unit="SOL"
      :format-price="formatPrice"
    />
    <p class="text-center text-[11px] text-muted-foreground">
      Brighter bands hold more liquidity · White line tracks price
    </p>
  </div>
</template>
