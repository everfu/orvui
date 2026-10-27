<script setup lang="ts">
import { computed } from "vue";
import { NumberTicker } from "../../../motion/number";
import ChartTooltip from "../../ChartTooltip.vue";
import { useSankeyChart } from "./context";
withDefaults(defineProps<{ side?: "top" | "right" | "bottom" | "left" }>(), {
  side: "top",
});
const chart = useSankeyChart();
const point = computed(() => {
  const selected = chart.active;
  if (!selected) return { x: 0.5, y: 0.5 };
  if (selected.type === "node")
    return {
      x: (selected.node.x0 + selected.node.x1) / 2 / chart.size.width,
      y: selected.node.y0 / chart.size.height,
    };
  return {
    x: (selected.link.x0 + selected.link.x1) / 2 / chart.size.width,
    y: (selected.link.y0 + selected.link.y1) / 2 / chart.size.height,
  };
});
function nodeValue() {
  return chart.formatValue(
    chart.active?.type === "node" ? chart.active.node.value : 0,
  );
}
</script>
<template>
  <ChartTooltip
    :open="chart.tooltipOpen && chart.active !== null"
    :anchor="chart.plotRef"
    :id="chart.tooltipId"
    :point="point"
    :side="side"
    :follow-cursor="true"
    @update:open="chart.tooltipOpen = $event"
    ><slot v-if="chart.active" :active="chart.active"
      ><template v-if="chart.active.type === 'node'"
        ><p class="font-medium">{{ chart.active.node.label }}</p>
        <p class="mt-1 font-mono">
          <NumberTicker
            :value="chart.active.node.value"
            :format="nodeValue"
            :start-on-view="false"
            :duration="0.2"
            :stagger="0"
          />
        </p>
        <p class="text-muted-foreground">
          In {{ chart.formatValue(chart.active.node.inValue) }} · Out
          {{ chart.formatValue(chart.active.node.outValue) }}
        </p>
        <p
          v-if="chart.active.node.description"
          class="mt-1 text-muted-foreground"
        >
          {{ chart.active.node.description }}
        </p></template
      ><template v-else
        ><p>
          {{ chart.active.link.source.label }} →
          {{ chart.active.link.target.label }}
        </p>
        <p class="mt-1 font-mono">
          {{ chart.formatValue(chart.active.link.value) }} ·
          {{ (chart.active.link.share * 100).toFixed(1) }}%
        </p></template
      ></slot
    ></ChartTooltip
  >
</template>
