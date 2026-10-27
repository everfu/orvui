<script setup lang="ts">
import { computed, ref } from "vue";
import {
  DonutChart,
  DonutChartCenter,
  DonutChartLegend,
  DonutChartPlot,
  type DonutSegment,
} from "./index";
const plans: DonutSegment[] = [
  { id: "team", name: "Team", value: 42900, color: "#2563eb" },
  { id: "business", name: "Business", value: 31250, color: "#38bdf8" },
  { id: "enterprise", name: "Enterprise", value: 22600, color: "#0d9488" },
  { id: "starter", name: "Starter", value: 18400, color: "#fbbf24" },
];
const selected = ref<string | null>(null);
const message = computed(() =>
  selected.value
    ? `Filtering by ${plans.find((plan) => plan.id === selected.value)?.name}`
    : "Select a plan to filter",
);
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const formatValue = (value: number) => currency.format(value);
function select(id: string) {
  selected.value = id === selected.value ? null : id;
}
</script>

<template>
  <div class="w-full max-w-xl space-y-3">
    <DonutChart
      :segments="plans"
      :format-value="formatValue"
      :selected-id="selected"
      label="Monthly revenue by plan"
      @select="select"
    >
      <div class="grid items-center gap-6 sm:grid-cols-[minmax(0,15rem)_1fr]">
        <DonutChartPlot
          ><DonutChartCenter total-label="Monthly revenue"
        /></DonutChartPlot>
        <DonutChartLegend />
      </div>
    </DonutChart>
    <p aria-live="polite" class="px-1 text-xs text-muted-foreground">
      {{ message }}
    </p>
  </div>
</template>
