---
title: "Funnel Chart"
description: "Follow successive stages and inspect conversion or loss between adjacent steps."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/funnel-chart"
markdown: "https://orvui.efu.me/en/charts/funnel-chart.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Funnel Chart

> Follow successive stages and inspect conversion or loss between adjacent steps.

<a id="when-to-use"></a>

## When to use it

- Use Funnel Chart when the interface needs this behavior: follow successive stages and inspect conversion or loss between adjacent steps.

<a id="install"></a>
## Install

### Funnel Chart — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/funnel-chart.json https://orvui.efu.me/r/button.json
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

```bash
pnpm add lucide-vue-next@^0.468.0
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Funnel Chart

**Registry source**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { RefreshCw } from "lucide-vue-next";
import { Button } from "@/components/orvui/motion/button";
import { FunnelChart } from "@/components/orvui/charts/funnel-chart";
const labels = [
  "Visitors",
  "Signed up",
  "Activated",
  "Started trial",
  "Subscribed",
];
const cohorts = [
  [24000, 15600, 10800, 7200, 4320],
  [28000, 18200, 13650, 9100, 6370],
  [22000, 13200, 7920, 4752, 2376],
];
const direction = ref<"vertical" | "horizontal">("vertical");
const cohort = ref(0);
const stages = computed(() =>
  labels.map((label, index) => ({
    id: label,
    label,
    value: cohorts[cohort.value][index],
  })),
);
const directions = ["vertical", "horizontal"] as const;
function nextCohort() {
  cohort.value = (cohort.value + 1) % cohorts.length;
}
</script>

<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-medium">From first visit to first payment</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          Product conversion · Sample cohorts
        </p>
      </div>
      <Button variant="ghost" size="sm" class="gap-2" @click="nextCohort"
        ><RefreshCw class="size-3.5" aria-hidden="true" />Next cohort</Button
      >
    </div>
    <fieldset
      aria-label="Funnel direction"
      class="inline-flex gap-1 rounded-full bg-muted/50 p-1"
    >
      <Button
        v-for="orientation in directions"
        :key="orientation"
        variant="ghost"
        size="sm"
        :aria-pressed="direction === orientation"
        :class="
          direction === orientation
            ? 'bg-background shadow-sm'
            : 'text-muted-foreground'
        "
        @click="direction = orientation"
        >{{ orientation === "vertical" ? "Vertical" : "Horizontal" }}</Button
      >
    </fieldset>
    <FunnelChart :direction="direction" :stages="stages" />
    <p class="text-center text-[11px] text-muted-foreground">
      Inspect a stage to see conversion and drop-off
    </p>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { RefreshCw } from "lucide-vue-next";
import { Button } from "@orvui/vue/motion/button";
import { FunnelChart } from "@orvui/vue/charts/funnel-chart";
const labels = [
  "Visitors",
  "Signed up",
  "Activated",
  "Started trial",
  "Subscribed",
];
const cohorts = [
  [24000, 15600, 10800, 7200, 4320],
  [28000, 18200, 13650, 9100, 6370],
  [22000, 13200, 7920, 4752, 2376],
];
const direction = ref<"vertical" | "horizontal">("vertical");
const cohort = ref(0);
const stages = computed(() =>
  labels.map((label, index) => ({
    id: label,
    label,
    value: cohorts[cohort.value][index],
  })),
);
const directions = ["vertical", "horizontal"] as const;
function nextCohort() {
  cohort.value = (cohort.value + 1) % cohorts.length;
}
</script>

<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-medium">From first visit to first payment</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          Product conversion · Sample cohorts
        </p>
      </div>
      <Button variant="ghost" size="sm" class="gap-2" @click="nextCohort"
        ><RefreshCw class="size-3.5" aria-hidden="true" />Next cohort</Button
      >
    </div>
    <fieldset
      aria-label="Funnel direction"
      class="inline-flex gap-1 rounded-full bg-muted/50 p-1"
    >
      <Button
        v-for="orientation in directions"
        :key="orientation"
        variant="ghost"
        size="sm"
        :aria-pressed="direction === orientation"
        :class="
          direction === orientation
            ? 'bg-background shadow-sm'
            : 'text-muted-foreground'
        "
        @click="direction = orientation"
        >{{ orientation === "vertical" ? "Vertical" : "Horizontal" }}</Button
      >
    </fieldset>
    <FunnelChart :direction="direction" :stages="stages" />
    <p class="text-center text-[11px] text-muted-foreground">
      Inspect a stage to see conversion and drop-off
    </p>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### FunnelChart

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `stages` | `readonly FunnelStage[]` | — | Yes | — |
| `direction` | `"vertical" \| "horizontal"` | `"vertical"` | No | — |
| `unit` | `string` | `"people"` | No | — |
| `label` | `string` | `"Conversion funnel"` | No | — |
| `formatValue` | `(value: number) => string` | `formatNumber` | No | — |
| `className` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### FunnelChartPlot

### FunnelChartSummary

<a id="about"></a>
## About Funnel Chart

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Funnel Chart?**

Configure Funnel Chart through stages, direction, unit, label, formatValue, className. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Bump Chart](https://orvui.efu.me/en/charts/bump-chart): Follow changes in series rank over time and pin a series for closer inspection.
- [Liquidity Heatmap](https://orvui.efu.me/en/charts/liquidity-heatmap): Inspect liquidity across time and price through a grid with selectable intensity bands.
- [Sankey Chart](https://orvui.efu.me/en/charts/sankey-chart): Trace weighted flows across stages using connected nodes and proportional ribbons.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/funnel-chart.json
- Documentation: https://orvui.efu.me/en/charts/funnel-chart
- `packages/vue/src/charts/funnel-chart/src/FunnelChart.vue`
- `packages/vue/src/charts/funnel-chart/src/FunnelChartPlot.vue`
- `packages/vue/src/charts/funnel-chart/src/FunnelChartSummary.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
