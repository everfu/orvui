<script setup lang="ts">
import {
  CompositionChart,
  CompositionChartLegend,
  type CompositionChartSeries,
} from "../../../../packages/vue/src/charts/composition-chart";
import HomeTrendPlot from "./HomeTrendPlot.vue";
defineProps<{
  series: CompositionChartSeries[];
  periods: string[];
  label: string;
  bars?: boolean;
  compact?: boolean;
  period?: string;
  formatValue?: (value: number) => string;
}>();
const emit = defineEmits<{ "update:period": [value: string] }>();
</script>
<template>
  <CompositionChart
    :series="series"
    :periods="periods"
    :label="label"
    :period="period"
    :format-value="formatValue"
    @update:period="emit('update:period', $event)"
    ><HomeTrendPlot :bars="bars" :compact="compact" /><CompositionChartLegend
      v-if="!compact && series.length > 1"
  /></CompositionChart>
</template>
