---
title: "Sankey Chart"
description: "Trace weighted flows across stages using connected nodes and proportional ribbons."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/sankey-chart"
markdown: "https://orvui.efu.me/en/charts/sankey-chart.md"
license: "MIT"
productVersion: "0.1.0"
---

# Sankey Chart

> Trace weighted flows across stages using connected nodes and proportional ribbons.

Trace weighted flows across stages using connected nodes and proportional ribbons.

## When to use it

- Use Sankey Chart when the interface needs this behavior: trace weighted flows across stages using connected nodes and proportional ribbons.

## Install

### Sankey Chart — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/sankey-chart.json https://orvui.efu.me/r/tabs.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

After npm publication, use the package command below. Before publication, install the verified local archive.

```bash
pnpm add @orvui/vue
```

```bash
pnpm add ./orvui-vue-0.1.0.tgz
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `@floating-ui/dom@^1.7.0`
- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

## Usage

### Sankey Chart

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
import { SankeyChart, type SankeyNode, type SankeyLink } from "@/components/orvui/charts/sankey-chart";
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
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
import { SankeyChart, type SankeyNode, type SankeyLink } from "@orvui/vue/charts/sankey-chart";
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
```

## API Reference

### SankeyChart

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `nodes` | `readonly SankeyNode[]` | — | Yes | — |
| `links` | `readonly SankeyLink[]` | — | Yes | — |
| `label` | `string` | `"Sankey chart"` | No | — |
| `formatValue` | `(value: number) => string` | `formatNumber` | No | — |
| `colors` | `readonly string[]` | `SANKEY_COLORS` | No | — |
| `nodeWidth` | `number` | `12` | No | — |
| `nodePadding` | `number` | `16` | No | — |
| `activeId` | `null \| string` | — | No | — |
| `defaultActiveId` | `null \| string` | `null` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:activeId` | — | — |
| `activeChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SankeyChartPlot

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `showValues` | `boolean` | `true` | No | — |

### SankeyChartTooltip

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `active: chart.active` | — |

## About Sankey Chart

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Sankey Chart?**

Configure Sankey Chart through nodes, links, label, formatValue, colors, nodeWidth, nodePadding, activeId, defaultActiveId, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:activeId, activeChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/sankey-chart.json
- Documentation: https://orvui.efu.me/en/charts/sankey-chart
- `packages/vue/src/charts/sankey-chart/src/SankeyChart.vue`
- `packages/vue/src/charts/sankey-chart/src/SankeyChartPlot.vue`
- `packages/vue/src/charts/sankey-chart/src/SankeyChartTooltip.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
