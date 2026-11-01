---
title: "Bump Chart"
description: "Follow changes in series rank over time and pin a series for closer inspection."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/bump-chart"
markdown: "https://orvui.efu.me/en/charts/bump-chart.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Bump Chart

> Follow changes in series rank over time and pin a series for closer inspection.

<a id="when-to-use"></a>

## When to use it

- Use Bump Chart when the interface needs this behavior: follow changes in series rank over time and pin a series for closer inspection.

<a id="install"></a>
## Install

### Bump Chart — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/bump-chart.json https://orvui.efu.me/r/button.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
```

```bash
pnpm add lucide-vue-next@^0.468.0
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

<a id="examples"></a>
## Usage

<a id="default"></a>
### Bump Chart

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Shuffle } from "lucide-vue-next";
import { Button } from "@/components/orvui/motion/button";
import { BumpChart } from "@/components/orvui/charts/bump-chart";
const periods = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const series = ref([
  { id: "studio", name: "Studio", ranks: [4, 3, 2, 3, 2, 1], color: "#8b5cf6" },
  { id: "canvas", name: "Canvas", ranks: [1, 1, 3, 2, 1, 2], color: "#0d9488" },
  { id: "layers", name: "Layers", ranks: [3, 2, 1, 1, 3, 3], color: "#f59e0b" },
  { id: "orbit", name: "Orbit", ranks: [2, 4, 5, 4, 5, 4], color: "#3b82f6" },
  { id: "frame", name: "Frame", ranks: [5, 5, 4, 5, 4, 5], color: "#f43f5e" },
]);
function shuffle() {
  const columns = periods.map(() => {
    const order = series.value.map((_, index) => index + 1);
    for (let remaining = order.length; remaining > 1; remaining--) {
      const index = Math.floor(Math.random() * remaining);
      [order[index], order[remaining - 1]] = [
        order[remaining - 1],
        order[index],
      ];
    }
    return order;
  });
  series.value = series.value.map((row, index) => ({
    ...row,
    ranks: columns.map((column) => column[index]),
  }));
}
</script>
<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 px-2">
      <div>
        <h3 class="text-sm font-medium text-foreground">The leaderboard</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          Five products. Six months. Every move.
        </p>
      </div>
      <Button variant="ghost" size="sm" class="shrink-0 gap-2" @click="shuffle"
        ><Shuffle class="size-3.5" aria-hidden="true" />Shuffle rankings</Button
      >
    </div>
    <BumpChart
      :series="series"
      :periods="periods"
      label="Illustrative product rankings, April to September"
    />
    <p class="text-center text-[11px] text-muted-foreground">
      Inspect a dot for details · Select to pin a product
    </p>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Shuffle } from "lucide-vue-next";
import { Button } from "@orvui/vue/motion/button";
import { BumpChart } from "@orvui/vue/charts/bump-chart";
const periods = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const series = ref([
  { id: "studio", name: "Studio", ranks: [4, 3, 2, 3, 2, 1], color: "#8b5cf6" },
  { id: "canvas", name: "Canvas", ranks: [1, 1, 3, 2, 1, 2], color: "#0d9488" },
  { id: "layers", name: "Layers", ranks: [3, 2, 1, 1, 3, 3], color: "#f59e0b" },
  { id: "orbit", name: "Orbit", ranks: [2, 4, 5, 4, 5, 4], color: "#3b82f6" },
  { id: "frame", name: "Frame", ranks: [5, 5, 4, 5, 4, 5], color: "#f43f5e" },
]);
function shuffle() {
  const columns = periods.map(() => {
    const order = series.value.map((_, index) => index + 1);
    for (let remaining = order.length; remaining > 1; remaining--) {
      const index = Math.floor(Math.random() * remaining);
      [order[index], order[remaining - 1]] = [
        order[remaining - 1],
        order[index],
      ];
    }
    return order;
  });
  series.value = series.value.map((row, index) => ({
    ...row,
    ranks: columns.map((column) => column[index]),
  }));
}
</script>
<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 px-2">
      <div>
        <h3 class="text-sm font-medium text-foreground">The leaderboard</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          Five products. Six months. Every move.
        </p>
      </div>
      <Button variant="ghost" size="sm" class="shrink-0 gap-2" @click="shuffle"
        ><Shuffle class="size-3.5" aria-hidden="true" />Shuffle rankings</Button
      >
    </div>
    <BumpChart
      :series="series"
      :periods="periods"
      label="Illustrative product rankings, April to September"
    />
    <p class="text-center text-[11px] text-muted-foreground">
      Inspect a dot for details · Select to pin a product
    </p>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `BumpChart` | `v-model:active` | `null \| string` | `update:active` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### BumpChart

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `series` | `readonly BumpSeries[]` | — | Yes | — |
| `periods` | `readonly string[]` | — | Yes | — |
| `active` | `null \| string` | — | No | — |
| `defaultActive` | `null \| string` | `null` | No | — |
| `label` | `string` | `"Rankings over time"` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:active` | — | — |
| `activeChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### BumpChartPlot

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | — |

### BumpChartLegend

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | — |

<a id="about"></a>
## About Bump Chart

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Bump Chart?**

Configure Bump Chart through series, periods, active, defaultActive, label, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:active, activeChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Status Bar](https://orvui.efu.me/en/charts/status-bar): Summarize counts across named states in a proportional segmented bar.
- [Composition Chart](https://orvui.efu.me/en/charts/composition-chart): Compare contributions across categories with normalized bars or stacked areas.
- [Funnel Chart](https://orvui.efu.me/en/charts/funnel-chart): Follow successive stages and inspect conversion or loss between adjacent steps.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/bump-chart.json
- Documentation: https://orvui.efu.me/en/charts/bump-chart
- `packages/vue/src/charts/bump-chart/src/BumpChart.vue`
- `packages/vue/src/charts/bump-chart/src/BumpChartPlot.vue`
- `packages/vue/src/charts/bump-chart/src/BumpChartLegend.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
