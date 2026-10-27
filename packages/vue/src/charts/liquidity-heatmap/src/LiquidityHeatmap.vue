<script setup lang="ts">
import { provide } from "vue";
import {
  createLiquidityModel,
  liquidityContext,
  type LiquidityHeatmapProps,
} from "./context";
import LiquidityHeatmapPlot from "./LiquidityHeatmapPlot.vue";
import LiquidityHeatmapLegend from "./LiquidityHeatmapLegend.vue";
const props = defineProps<LiquidityHeatmapProps>();
const heatmap = createLiquidityModel(props);
provide(liquidityContext.key, heatmap);
</script>
<template>
  <section
    :aria-label="heatmap.label"
    :class="['w-full space-y-4', props.className]"
  >
    <slot><LiquidityHeatmapPlot /><LiquidityHeatmapLegend /></slot>
  </section>
</template>
