# Donut Chart · orvui 0.1.1

## Selection and composition

Choose by data relationship: Donut for proportions, Funnel for stage conversion and Sankey for flows. Keep time, units and axis ranges consistent in financial charts.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Donut Chart"
description: "Compare parts of a total with a ring, selectable legend and central value."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/donut-chart"
markdown: "https://orvui.efu.me/en/charts/donut-chart.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Donut Chart

> Compare parts of a total with a ring, selectable legend and central value.

<a id="when-to-use"></a>

## When to use it

- Use Donut Chart when the interface needs this behavior: compare parts of a total with a ring, selectable legend and central value.

<a id="install"></a>
## Install

### Donut Chart — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/donut-chart.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Donut Chart

**Registry source**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import {
  DonutChart,
  DonutChartCenter,
  DonutChartLegend,
  DonutChartPlot,
  type DonutSegment,
} from "@/components/orvui/charts/donut-chart";
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
```

**Package**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { DonutChart, DonutChartCenter, DonutChartLegend, DonutChartPlot, type DonutSegment } from "@orvui/vue/charts/donut-chart";
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
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `DonutChart` | `v-model:activeId` | `null \| string` | `update:activeId` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### DonutChart

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `segments` | `readonly DonutSegment[]` | — | Yes | — |
| `thickness` | `number` | `22` | No | — |
| `gap` | `number` | `3` | No | — |
| `activeId` | `null \| string` | — | No | — |
| `defaultActiveId` | `null \| string` | `null` | No | — |
| `selectedId` | `null \| string` | `null` | No | — |
| `formatValue` | `(value: number) => string` | `formatNumber` | No | — |
| `label` | `string` | `"Donut chart"` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:activeId` | — | — |
| `activeChange` | — | — |
| `select` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DonutChartCenter

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `totalLabel` | `string` | `"Total"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `segment: segment`, `total: chart.total` | — |

### DonutChartLegend

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `value` | — | `segment: segment` | — |
| `detail` | — | `segment: segment` | — |

### DonutChartPlot

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Donut Chart

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Donut Chart?**

Configure Donut Chart through segments, thickness, gap, activeId, defaultActiveId, selectedId, formatValue, label, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:activeId, activeChange, select to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Composition Chart](https://orvui.efu.me/en/charts/composition-chart): Compare contributions across categories with normalized bars or stacked areas.
- [Treemap](https://orvui.efu.me/en/charts/treemap): Compare hierarchical values using nested rectangles whose area follows each value.
- [Status Bar](https://orvui.efu.me/en/charts/status-bar): Summarize counts across named states in a proportional segmented bar.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/donut-chart.json
- Documentation: https://orvui.efu.me/en/charts/donut-chart
- `packages/vue/src/charts/donut-chart/src/DonutChart.vue`
- `packages/vue/src/charts/donut-chart/src/DonutChartCenter.vue`
- `packages/vue/src/charts/donut-chart/src/DonutChartLegend.vue`
- `packages/vue/src/charts/donut-chart/src/DonutChartPlot.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

