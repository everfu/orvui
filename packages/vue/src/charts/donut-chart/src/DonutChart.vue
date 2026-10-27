<script setup lang="ts">
import { provide } from "vue";
import {
  createDonutModel,
  donutContext,
  type DonutChartProps,
} from "./context";
import DonutChartPlot from "./DonutChartPlot.vue";
import DonutChartCenter from "./DonutChartCenter.vue";
import DonutChartLegend from "./DonutChartLegend.vue";
const props = defineProps<DonutChartProps>();
const emit = defineEmits(["update:activeId", "activeChange", "select"]);
const chart = createDonutModel(props, emit);
provide(donutContext.key, chart);
</script>

<template>
  <section :class="['w-full', props.className]" :aria-label="chart.label">
    <slot>
      <div class="grid items-center gap-6 sm:grid-cols-[minmax(0,16rem)_1fr]">
        <DonutChartPlot><DonutChartCenter /></DonutChartPlot>
        <DonutChartLegend />
      </div>
    </slot>
  </section>
</template>
