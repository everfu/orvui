<script setup lang="ts">
import { provide } from "vue";
import { cn } from "../../../lib/utils";
import { bumpContext, createBumpModel, type BumpChartProps } from "./context";
import BumpChartPlot from "./BumpChartPlot.vue";
import BumpChartLegend from "./BumpChartLegend.vue";
const props = defineProps<BumpChartProps>();
const emit = defineEmits(["update:active", "activeChange"]);
const chart = createBumpModel(props, emit);
provide(bumpContext.key, chart);
</script>
<template>
  <section
    :aria-label="chart.label"
    :class="cn('w-full space-y-5', props.className)"
  >
    <slot><BumpChartPlot /><BumpChartLegend /></slot>
  </section>
</template>
