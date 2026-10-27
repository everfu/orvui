<script setup lang="ts">
import { provide } from "vue";
import {
  createSankeyModel,
  sankeyContext,
  type SankeyChartProps,
} from "./context";
import SankeyChartPlot from "./SankeyChartPlot.vue";
import SankeyChartTooltip from "./SankeyChartTooltip.vue";
const props = defineProps<SankeyChartProps>();
const emit = defineEmits(["update:activeId", "activeChange"]);
const chart = createSankeyModel(props, emit);
provide(sankeyContext.key, chart);
</script>
<template>
  <section
    :aria-label="chart.label"
    :class="['relative w-full min-w-0', props.className]"
    data-slot="sankey-chart"
  >
    <slot><SankeyChartPlot /><SankeyChartTooltip /></slot>
    <div class="sr-only">
      <table>
        <caption>
          {{
            chart.label
          }}
          data
        </caption>
        <thead>
          <tr>
            <th>Flow</th>
            <th>Value</th>
            <th>Share of source</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="link in chart.links" :key="link.id">
            <th>{{ link.source.label }} to {{ link.target.label }}</th>
            <td>{{ chart.formatValue(link.value) }}</td>
            <td>{{ (link.share * 100).toFixed(1) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
