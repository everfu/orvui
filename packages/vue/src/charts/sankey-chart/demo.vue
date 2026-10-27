<script setup lang="ts">
import { ref } from "vue";
import { Tabs, TabsList, TabsTrigger } from "../../motion/tabs";
import { SankeyChart, type SankeyNode, type SankeyLink } from "./index";
const nodes: SankeyNode[] = [
  { id: "subscriptions", label: "Subscriptions", color: "#2563eb" },
  { id: "services", label: "Services", color: "#38bdf8" },
  { id: "marketplace", label: "Marketplace", color: "#6366f1" },
  { id: "revenue", label: "Revenue", color: "#64748b" },
  { id: "cost", label: "Cost of revenue", color: "#e11d48" },
  { id: "gross", label: "Gross profit", color: "#0d9488" },
  { id: "rnd", label: "R&D", color: "#f59e0b" },
  { id: "sales", label: "Sales & marketing", color: "#fb923c" },
  { id: "admin", label: "G&A", color: "#fbbf24" },
  { id: "operating", label: "Operating profit", color: "#16a34a" },
];
function income([
  subscriptions,
  services,
  marketplace,
  cost,
  rnd,
  sales,
  admin,
]: number[]): SankeyLink[] {
  const revenue = subscriptions + services + marketplace,
    gross = revenue - cost;
  return [
    { source: "subscriptions", target: "revenue", value: subscriptions },
    { source: "services", target: "revenue", value: services },
    { source: "marketplace", target: "revenue", value: marketplace },
    { source: "revenue", target: "cost", value: cost },
    { source: "revenue", target: "gross", value: gross },
    { source: "gross", target: "rnd", value: rnd },
    { source: "gross", target: "sales", value: sales },
    { source: "gross", target: "admin", value: admin },
    {
      source: "gross",
      target: "operating",
      value: gross - rnd - sales - admin,
    },
  ];
}
const quarters = {
  q2: income([62, 18, 10, 34, 20, 16, 7]),
  q3: income([70, 17, 14, 36, 22, 17, 7]),
};
const quarter = ref<keyof typeof quarters>("q3");
const currency = (value: number) => `$${value.toLocaleString("en-US")}M`;
</script>
<template>
  <div class="w-full max-w-3xl space-y-4">
    <Tabs v-model="quarter" variant="segment"
      ><TabsList
        ><TabsTrigger value="q2">Q2</TabsTrigger
        ><TabsTrigger value="q3">Q3</TabsTrigger></TabsList
      ></Tabs
    ><SankeyChart
      :nodes="nodes"
      :links="quarters[quarter]"
      :format-value="currency"
      :label="`Income statement, ${quarter.toUpperCase()}`"
    />
  </div>
</template>
