---
title: "Treemap"
description: "Compare hierarchical values using nested rectangles whose area follows each value."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/treemap"
markdown: "https://orvui.efu.me/en/charts/treemap.md"
license: "MIT"
productVersion: "0.1.0"
---

# Treemap

> Compare hierarchical values using nested rectangles whose area follows each value.

## Install

### Treemap — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/treemap.json https://orvui.efu.me/r/tabs.json
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

### Treemap

**Registry source**

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
import {
  Treemap,
  TreemapPlot,
  TreemapTooltip,
  TreemapLegend,
  type TreemapNode,
} from "@/components/orvui/charts/treemap";
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
```

**Package**

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
import { Treemap, TreemapPlot, TreemapTooltip, TreemapLegend, type TreemapNode } from "@orvui/vue/charts/treemap";
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
```

## API Reference

### Treemap

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data` | `readonly TreemapNode[]` | — | Yes | — |
| `label` | `string` | `"Treemap"` | No | — |
| `formatValue` | `(value: number) => string` | `formatNumber` | No | — |
| `colors` | `readonly string[]` | `TREEMAP_COLORS` | No | — |
| `textColor` | `string` | `"#ffffff"` | No | — |
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

### TreemapPlot

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `tileClassName` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `tile` | — | `v-bind: scope` | — |

### TreemapTooltip

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `item: chart.active` | — |

### TreemapLegend

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `showValues` | `boolean` | `false` | No | — |

### TreemapCell

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `tile` | `TreemapTile` | — | Yes | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `tile: tile` | — |

## About Treemap

Compare hierarchical values using nested rectangles whose area follows each value.

### When to use it

- Use Treemap when the interface needs this behavior: compare hierarchical values using nested rectangles whose area follows each value.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Treemap?**

Configure Treemap through data, label, formatValue, colors, textColor, activeId, defaultActiveId, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:activeId, activeChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/treemap.json
- Documentation: https://orvui.efu.me/en/charts/treemap
- `packages/vue/src/charts/treemap/src/Treemap.vue`
- `packages/vue/src/charts/treemap/src/TreemapPlot.vue`
- `packages/vue/src/charts/treemap/src/TreemapTooltip.vue`
- `packages/vue/src/charts/treemap/src/TreemapLegend.vue`
- `packages/vue/src/charts/treemap/src/TreemapCell.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
