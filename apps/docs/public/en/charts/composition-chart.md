---
title: "Composition Chart"
description: "Compare contributions across categories with normalized bars or stacked areas."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/composition-chart"
markdown: "https://orvui.efu.me/en/charts/composition-chart.md"
license: "MIT"
productVersion: "0.1.0"
---

# Composition Chart

> Compare contributions across categories with normalized bars or stacked areas.

## Install

### Composition Chart — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/composition-chart.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

## Usage

### Composition Chart

**Registry source**

```vue
<script setup lang="ts">
import { CompositionChart } from "@/components/orvui/charts/composition-chart";
const dates = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const periods = Array.from({ length: 36 }, (_, index) =>
  dates.format(new Date(Date.UTC(2026, 7, index + 1))),
);
const channels = [
  {
    id: "organic",
    name: "Organic search",
    color: "#2563eb",
    base: 46,
    trend: -0.45,
  },
  { id: "direct", name: "Direct", color: "#38bdf8", base: 24, trend: 0.12 },
  {
    id: "referral",
    name: "Referrals",
    color: "#0d9488",
    base: 10,
    trend: 0.32,
  },
  { id: "social", name: "Social", color: "#fbbf24", base: 12, trend: 0.06 },
  { id: "email", name: "Email", color: "#a78bfa", base: 5, trend: 0.09 },
  { id: "other", name: "Other", color: "#a1a1aa", base: 3, trend: 0.02 },
];
const series = channels.map(({ base, trend, ...channel }, index) => ({
  ...channel,
  values: periods.map((_, day) =>
    Math.round(
      (base +
        day * trend +
        Math.sin(day * 1.7 + index * 2) * Math.min(base / 3, 5)) *
        120,
    ),
  ),
}));
const formatVisits = (value: number) => `${value.toLocaleString("en")} visits`;
</script>
<template>
  <div class="w-full space-y-10">
    <CompositionChart
      view="bar"
      :series="series"
      :periods="periods"
      label="Illustrative acquisition channel shares"
      :format-value="formatVisits"
    />
    <div class="border-t border-border pt-10">
      <CompositionChart
        view="area"
        :series="series"
        :periods="periods"
        label="Illustrative acquisition channel shares"
        :format-value="formatVisits"
      />
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { CompositionChart } from "@orvui/vue/charts/composition-chart";
const dates = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const periods = Array.from({ length: 36 }, (_, index) =>
  dates.format(new Date(Date.UTC(2026, 7, index + 1))),
);
const channels = [
  {
    id: "organic",
    name: "Organic search",
    color: "#2563eb",
    base: 46,
    trend: -0.45,
  },
  { id: "direct", name: "Direct", color: "#38bdf8", base: 24, trend: 0.12 },
  {
    id: "referral",
    name: "Referrals",
    color: "#0d9488",
    base: 10,
    trend: 0.32,
  },
  { id: "social", name: "Social", color: "#fbbf24", base: 12, trend: 0.06 },
  { id: "email", name: "Email", color: "#a78bfa", base: 5, trend: 0.09 },
  { id: "other", name: "Other", color: "#a1a1aa", base: 3, trend: 0.02 },
];
const series = channels.map(({ base, trend, ...channel }, index) => ({
  ...channel,
  values: periods.map((_, day) =>
    Math.round(
      (base +
        day * trend +
        Math.sin(day * 1.7 + index * 2) * Math.min(base / 3, 5)) *
        120,
    ),
  ),
}));
const formatVisits = (value: number) => `${value.toLocaleString("en")} visits`;
</script>
<template>
  <div class="w-full space-y-10">
    <CompositionChart
      view="bar"
      :series="series"
      :periods="periods"
      label="Illustrative acquisition channel shares"
      :format-value="formatVisits"
    />
    <div class="border-t border-border pt-10">
      <CompositionChart
        view="area"
        :series="series"
        :periods="periods"
        label="Illustrative acquisition channel shares"
        :format-value="formatVisits"
      />
    </div>
  </div>
</template>
```

## API Reference

### CompositionChart

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `series` | `readonly CompositionSeries[]` | — | Yes | — |
| `periods` | `readonly string[]` | — | Yes | — |
| `view` | `"bar" \| "area"` | `"bar"` | No | — |
| `period` | `string` | — | No | — |
| `defaultPeriod` | `string` | `""` | No | — |
| `formatValue` | `(value: number) => string` | `formatNumber` | No | — |
| `label` | `string` | `"Composition over time"` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:period` | — | — |
| `periodChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### CompositionChartPlot

### CompositionTooltipContent

### CompositionChartLegend

## About Composition Chart

Compare contributions across categories with normalized bars or stacked areas.

### When to use it

- Use Composition Chart when the interface needs this behavior: compare contributions across categories with normalized bars or stacked areas.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Composition Chart?**

Configure Composition Chart through series, periods, view, period, defaultPeriod, formatValue, label, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:period, periodChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/composition-chart.json
- Documentation: https://orvui.efu.me/en/charts/composition-chart
- `packages/vue/src/charts/composition-chart/src/CompositionChart.vue`
- `packages/vue/src/charts/composition-chart/src/CompositionChartPlot.vue`
- `packages/vue/src/charts/composition-chart/src/CompositionTooltipContent.vue`
- `packages/vue/src/charts/composition-chart/src/CompositionChartLegend.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
