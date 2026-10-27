<script setup lang="ts">
import { provide } from "vue";
import {
  createCompositionModel,
  compositionContext,
  type CompositionChartProps,
} from "./context";
import CompositionChartPlot from "./CompositionChartPlot.vue";
import CompositionChartLegend from "./CompositionChartLegend.vue";
const props = defineProps<CompositionChartProps>();
const emit = defineEmits(["update:period", "periodChange"]);
const chart = createCompositionModel(props, emit);
provide(compositionContext.key, chart);
</script>
<template>
  <section
    :aria-label="chart.label"
    :class="['@container w-full space-y-4', props.className]"
  >
    <slot><CompositionChartPlot /><CompositionChartLegend /></slot>
  </section>
</template>
