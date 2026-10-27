<script setup lang="ts">
import { useLiquidityHeatmap, LIQUIDITY_COLORS } from "./context";
const heatmap = useLiquidityHeatmap();
</script>
<template>
  <div
    class="flex flex-wrap items-center justify-between gap-3 text-[10px] text-muted-foreground"
  >
    <span>Resting liquidity · {{ heatmap.unit }}</span
    ><span class="flex items-center gap-2"
      ><span>0</span
      ><span aria-hidden="true" class="flex gap-0.5"
        ><span
          v-for="color in LIQUIDITY_COLORS"
          :key="color"
          class="h-2 w-5 rounded-[1px]"
          :style="{ backgroundColor: color }" /></span
      ><span>{{ heatmap.formatSize(heatmap.ceiling) }}+</span></span
    >
  </div>
</template>
