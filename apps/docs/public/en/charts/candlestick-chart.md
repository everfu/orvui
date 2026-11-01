---
title: "Candlestick Chart"
description: "Inspect open, high, low, close and volume values with pointer or keyboard crosshairs."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/candlestick-chart"
markdown: "https://orvui.efu.me/en/charts/candlestick-chart.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Candlestick Chart

> Inspect open, high, low, close and volume values with pointer or keyboard crosshairs.

<a id="when-to-use"></a>

## When to use it

- Use Candlestick Chart when the interface needs this behavior: inspect open, high, low, close and volume values with pointer or keyboard crosshairs.

<a id="install"></a>
## Install

### Candlestick Chart — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/candlestick-chart.json https://orvui.efu.me/r/button.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `tailwind-merge@^3.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Candlestick Chart

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "@/components/orvui/motion/button";
import {
  CandlestickChart,
  CandlestickChartLegend,
  CandlestickChartPlot,
  type Candle,
} from "@/components/orvui/charts/candlestick-chart";
const label = (seconds: number) =>
  `${String(Math.floor(seconds / 3600) % 24).padStart(2, "0")}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}`;
function initial(): Candle[] {
  let previous = 2380;
  return Array.from({ length: 48 }, (_, index) => {
    const open = previous,
      close =
        open *
        (1 + Math.sin(index * 0.7) * 0.004 + Math.cos(index * 0.23) * 0.003);
    const reach =
        Math.abs(close - open) * 0.6 +
        1.5 +
        Math.abs(Math.sin(index * 1.9)) * 3,
      start = 43200 + index * 300;
    previous = close;
    return {
      id: String(start),
      label: label(start),
      open,
      close,
      high: Math.max(open, close) + reach * Math.abs(Math.cos(index * 1.3)),
      low: Math.min(open, close) - reach * Math.abs(Math.sin(index * 0.9)),
      volume: 120 + Math.abs(Math.sin(index * 0.6)) * 420,
    };
  });
}
const playing = ref(true),
  state = ref({ tick: 0, candles: initial() });
function advance() {
  const tick = state.value.tick + 1,
    candles = state.value.candles,
    last = candles.at(-1)!;
  const price =
    last.close *
    (1 + Math.sin(tick * 1.7) * 0.0012 + Math.cos(tick * 0.6) * 0.0006);
  const next = [
    ...candles.slice(0, -1),
    {
      ...last,
      close: price,
      high: Math.max(last.high, price),
      low: Math.min(last.low, price),
      volume: last.volume + 12 + Math.abs(Math.sin(tick)) * 30,
    },
  ];
  if (tick % 8 === 0) {
    next.shift();
    const start = Number(last.id) + 300;
    next.push({
      id: String(start),
      label: label(start),
      open: price,
      close: price,
      high: price,
      low: price,
      volume: 0,
    });
  }
  state.value = { tick, candles: next };
}
function step() {
  playing.value = false;
  advance();
}
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => {
    if (playing.value && !document.hidden) advance();
  }, 650);
});
onBeforeUnmount(() => clearInterval(timer));
const price = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatPrice = (value: number) => price.format(value);
</script>
<template>
  <div class="w-full max-w-3xl space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3 px-1">
      <div class="flex items-center gap-2 text-sm font-medium">
        ETH / USD · 5m<span
          class="rounded border border-border px-1.5 py-0.5 text-[9px] font-normal uppercase tracking-wider text-muted-foreground"
          >Simulated</span
        >
      </div>
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="sm" @click="playing = !playing">{{
          playing ? "Pause" : "Resume"
        }}</Button
        ><Button variant="ghost" size="sm" @click="step">Step</Button>
      </div>
    </div>
    <CandlestickChart
      :candles="state.candles"
      :last-price="state.candles.at(-1)?.close"
      label="Simulated ETH / USD, 5 minute candles"
      :format-price="formatPrice"
      ><CandlestickChartLegend /><CandlestickChartPlot
        :height="320"
        class="mt-4"
    /></CandlestickChart>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "@orvui/vue/motion/button";
import { CandlestickChart, CandlestickChartLegend, CandlestickChartPlot, type Candle } from "@orvui/vue/charts/candlestick-chart";
const label = (seconds: number) =>
  `${String(Math.floor(seconds / 3600) % 24).padStart(2, "0")}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}`;
function initial(): Candle[] {
  let previous = 2380;
  return Array.from({ length: 48 }, (_, index) => {
    const open = previous,
      close =
        open *
        (1 + Math.sin(index * 0.7) * 0.004 + Math.cos(index * 0.23) * 0.003);
    const reach =
        Math.abs(close - open) * 0.6 +
        1.5 +
        Math.abs(Math.sin(index * 1.9)) * 3,
      start = 43200 + index * 300;
    previous = close;
    return {
      id: String(start),
      label: label(start),
      open,
      close,
      high: Math.max(open, close) + reach * Math.abs(Math.cos(index * 1.3)),
      low: Math.min(open, close) - reach * Math.abs(Math.sin(index * 0.9)),
      volume: 120 + Math.abs(Math.sin(index * 0.6)) * 420,
    };
  });
}
const playing = ref(true),
  state = ref({ tick: 0, candles: initial() });
function advance() {
  const tick = state.value.tick + 1,
    candles = state.value.candles,
    last = candles.at(-1)!;
  const price =
    last.close *
    (1 + Math.sin(tick * 1.7) * 0.0012 + Math.cos(tick * 0.6) * 0.0006);
  const next = [
    ...candles.slice(0, -1),
    {
      ...last,
      close: price,
      high: Math.max(last.high, price),
      low: Math.min(last.low, price),
      volume: last.volume + 12 + Math.abs(Math.sin(tick)) * 30,
    },
  ];
  if (tick % 8 === 0) {
    next.shift();
    const start = Number(last.id) + 300;
    next.push({
      id: String(start),
      label: label(start),
      open: price,
      close: price,
      high: price,
      low: price,
      volume: 0,
    });
  }
  state.value = { tick, candles: next };
}
function step() {
  playing.value = false;
  advance();
}
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => {
    if (playing.value && !document.hidden) advance();
  }, 650);
});
onBeforeUnmount(() => clearInterval(timer));
const price = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatPrice = (value: number) => price.format(value);
</script>
<template>
  <div class="w-full max-w-3xl space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3 px-1">
      <div class="flex items-center gap-2 text-sm font-medium">
        ETH / USD · 5m<span
          class="rounded border border-border px-1.5 py-0.5 text-[9px] font-normal uppercase tracking-wider text-muted-foreground"
          >Simulated</span
        >
      </div>
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="sm" @click="playing = !playing">{{
          playing ? "Pause" : "Resume"
        }}</Button
        ><Button variant="ghost" size="sm" @click="step">Step</Button>
      </div>
    </div>
    <CandlestickChart
      :candles="state.candles"
      :last-price="state.candles.at(-1)?.close"
      label="Simulated ETH / USD, 5 minute candles"
      :format-price="formatPrice"
      ><CandlestickChartLegend /><CandlestickChartPlot
        :height="320"
        class="mt-4"
    /></CandlestickChart>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `CandlestickChart` | `v-model:activeId` | `null \| string` | `update:activeId` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### CandlestickChart

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `candles` | `readonly Candle[]` | — | Yes | — |
| `lastPrice` | `number` | — | No | — |
| `activeId` | `null \| string` | — | No | — |
| `defaultActiveId` | `null \| string` | `null` | No | — |
| `formatPrice` | `(value: number) => string` | `formatNumber` | No | — |
| `formatVolume` | `(value: number) => string` | `formatCompact` | No | — |
| `label` | `string` | `"Candlestick chart"` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:activeId` | — | — |
| `activeIdChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### CandlestickChartLegend

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `candle: candle`, `change: change` | — |

### CandlestickChartPlot

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `height` | `number` | `320` | No | — |

<a id="about"></a>
## About Candlestick Chart

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Candlestick Chart?**

Configure Candlestick Chart through candles, lastPrice, activeId, defaultActiveId, formatPrice, formatVolume, label, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:activeId, activeIdChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Volume Profile](https://orvui.efu.me/en/charts/volume-profile): Compare traded volume by price level with horizontal bidirectional bars.
- [Price Target Fan](https://orvui.efu.me/en/charts/price-target-fan): Compare price forecasts around a shared origin using projected target paths.
- [Order Book](https://orvui.efu.me/en/charts/order-book): Inspect bid and ask levels, cumulative depth and price selections in a live book.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/candlestick-chart.json
- Documentation: https://orvui.efu.me/en/charts/candlestick-chart
- `packages/vue/src/charts/candlestick-chart/src/CandlestickChart.vue`
- `packages/vue/src/charts/candlestick-chart/src/CandlestickChartLegend.vue`
- `packages/vue/src/charts/candlestick-chart/src/CandlestickChartPlot.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
