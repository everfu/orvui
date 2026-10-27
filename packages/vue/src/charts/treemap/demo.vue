<script setup lang="ts">
import { ref, useId } from "vue";
import { Tabs, TabsList, TabsTrigger } from "../../motion/tabs";
import {
  Treemap,
  TreemapPlot,
  TreemapTooltip,
  TreemapLegend,
  type TreemapNode,
} from "./index";
const sectors = [
  {
    id: "technology",
    label: "Technology",
    color: "#3454b5",
    companies: ["AAPL", "MSFT", "NVDA"],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    color: "#087e6c",
    companies: ["LLY", "UNH", "JNJ"],
  },
  {
    id: "finance",
    label: "Finance",
    color: "#7c3db5",
    companies: ["JPM", "V", "BAC"],
  },
  {
    id: "energy",
    label: "Energy",
    color: "#a35318",
    companies: ["XOM", "CVX", "SHEL"],
  },
];
const quarters = [
  {
    id: "q1",
    label: "Q1",
    values: [210, 190, 130, 128, 85, 45, 80, 95, 30, 74, 62, 44],
  },
  {
    id: "q2",
    label: "Q2",
    values: [170, 220, 175, 108, 50, 60, 90, 75, 56, 68, 69, 34],
  },
  {
    id: "q3",
    label: "Q3",
    values: [260, 205, 155, 100, 95, 46, 140, 150, 0, 40, 50, 25],
  },
];
const data: Record<string, readonly TreemapNode[]> = {};
for (const quarter of quarters)
  data[quarter.id] = sectors.map((sector, index) => ({
    id: sector.id,
    label: sector.label,
    color: sector.color,
    children: sector.companies.map((company, child) => ({
      id: company,
      label: company,
      value: quarter.values[index * 3 + child] * 1000,
    })),
  }));
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const formatValue = (value: number) => currency.format(value);
const quarter = ref("q1"),
  previewId = useId(),
  panelId = previewId + "-treemap";
</script>
<template>
  <div class="w-full max-w-2xl min-w-0 py-2">
    <Tabs v-model="quarter"
      ><div class="mb-5 flex items-center justify-between gap-3">
        <div class="space-y-1">
          <p class="text-sm font-medium">Portfolio allocation</p>
          <p class="text-xs text-muted-foreground">Demo data</p>
        </div>
        <TabsList
          aria-label="Portfolio quarter"
          wrapper-class-name="w-auto"
          class="bg-muted"
          ><TabsTrigger
            v-for="item in quarters"
            :key="item.id"
            :value="item.id"
            :id="`${previewId}-${item.id}`"
            :aria-controls="panelId"
            :tabindex="quarter === item.id ? 0 : -1"
            indicator-class-name="bg-background"
            class="min-h-8 px-3 py-1.5 text-xs [&_[data-tabs-label]]:text-foreground"
            >{{ item.label }}</TabsTrigger
          ></TabsList
        >
      </div>
      <div
        :id="panelId"
        role="tabpanel"
        :aria-labelledby="`${previewId}-${quarter}`"
      >
        <Treemap
          :data="data[quarter]"
          :format-value="formatValue"
          label="Portfolio allocation"
          ><TreemapPlot class="h-72 sm:h-80" /><TreemapTooltip /><TreemapLegend
        /></Treemap></div
    ></Tabs>
  </div>
</template>
