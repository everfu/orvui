<script setup lang="ts">
import { provide } from "vue";
import {
  createTreemapModel,
  treemapContext,
  type TreemapProps,
} from "./context";
import TreemapPlot from "./TreemapPlot.vue";
import TreemapTooltip from "./TreemapTooltip.vue";
import TreemapLegend from "./TreemapLegend.vue";
const props = defineProps<TreemapProps>();
const emit = defineEmits(["update:activeId", "activeChange"]);
const chart = createTreemapModel(props, emit);
provide(treemapContext.key, chart);
</script>
<template>
  <section
    :aria-label="chart.label"
    :class="['relative w-full min-w-0 space-y-4', props.className]"
    data-slot="treemap"
  >
    <slot><TreemapPlot /><TreemapLegend /><TreemapTooltip /></slot>
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
            <th>Item</th>
            <th>Value</th>
            <th>Share</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in chart.items" :key="item.id">
            <th scope="row">{{ item.path.join(" / ") }}</th>
            <td>{{ chart.formatValue(item.value) }}</td>
            <td>{{ (item.share * 100).toFixed(1) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
