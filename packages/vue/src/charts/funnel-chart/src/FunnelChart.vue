<script setup lang="ts">
import { provide } from "vue";
import {
  createFunnelModel,
  funnelContext,
  type FunnelChartProps,
} from "./context";
import FunnelChartPlot from "./FunnelChartPlot.vue";
import FunnelChartSummary from "./FunnelChartSummary.vue";
const props = defineProps<FunnelChartProps>();
const funnel = createFunnelModel(props);
provide(funnelContext.key, funnel);
</script>

<template>
  <section
    :aria-label="funnel.label"
    :class="['w-full space-y-6', props.className]"
  >
    <slot><FunnelChartPlot /><FunnelChartSummary /></slot>
  </section>
</template>
