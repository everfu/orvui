<script setup lang="ts">
import { computed } from "vue";
import { NumberTicker } from "../../../motion/number";
import ChartTooltip from "../../ChartTooltip.vue";
import { useTreemap } from "./context";
withDefaults(defineProps<{ side?: "top" | "right" | "bottom" | "left" }>(), {
  side: "top",
});
const chart = useTreemap();
const point = computed(() =>
  chart.active
    ? {
        x: (chart.active.x + chart.active.width / 2) / chart.size.width,
        y: (chart.active.y + chart.active.height / 2) / chart.size.height,
      }
    : { x: 0.5, y: 0.5 },
);
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
    ><slot v-if="chart.active" :item="chart.active"
      ><p class="text-muted-foreground">{{ chart.active.path.join(" / ") }}</p>
      <p class="mt-1 font-mono">
        <NumberTicker
          :value="chart.active.value"
          :format="() => chart.formatValue(chart.active!.value)"
          :start-on-view="false"
          :duration="0.2"
          :stagger="0"
        />
        · {{ (chart.active.share * 100).toFixed(1) }}%
      </p>
      <p v-if="chart.active.description" class="mt-1 text-muted-foreground">
        {{ chart.active.description }}
      </p></slot
    ></ChartTooltip
  >
</template>
