---
title: "Price Target Fan"
description: "Compare price forecasts around a shared origin using projected target paths."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/price-target-fan"
markdown: "https://orvui.efu.me/en/charts/price-target-fan.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Price Target Fan

> Compare price forecasts around a shared origin using projected target paths.

<a id="when-to-use"></a>

## When to use it

- Use Price Target Fan when the interface needs this behavior: compare price forecasts around a shared origin using projected target paths.

<a id="install"></a>
## Install

### Price Target Fan — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/price-target-fan.json
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
### Price Target Fan

**Registry source**

```vue
<script setup lang="ts">
import { PriceTargetFan, type PriceTarget } from "@/components/orvui/charts/price-target-fan";
const prices = [
  158.4, 164.2, 160.8, 173.1, 170.6, 181.3, 175.8, 183.7, 178.2, 184.1, 180.5,
  177.3, 178.52,
];
const history = prices.map((price, index) => ({
  date: new Date(Date.UTC(2025, 8 + index, 14)).toISOString().slice(0, 10),
  price,
}));
const targets: [PriceTarget, PriceTarget, PriceTarget] = [
  { key: "High", price: 232, analysts: 9 },
  { key: "Mean", price: 205, analysts: 34 },
  { key: "Low", price: 168, analysts: 6 },
];
</script>
<template>
  <PriceTargetFan
    :current="178.52"
    :history="history"
    :targets="targets"
    :dates="{ horizon: 'Sep 2027' }"
  />
</template>
```

**Package**

```vue
<script setup lang="ts">
import { PriceTargetFan, type PriceTarget } from "@orvui/vue/charts/price-target-fan";
const prices = [
  158.4, 164.2, 160.8, 173.1, 170.6, 181.3, 175.8, 183.7, 178.2, 184.1, 180.5,
  177.3, 178.52,
];
const history = prices.map((price, index) => ({
  date: new Date(Date.UTC(2025, 8 + index, 14)).toISOString().slice(0, 10),
  price,
}));
const targets: [PriceTarget, PriceTarget, PriceTarget] = [
  { key: "High", price: 232, analysts: 9 },
  { key: "Mean", price: 205, analysts: 34 },
  { key: "Low", price: 168, analysts: 6 },
];
</script>
<template>
  <PriceTargetFan
    :current="178.52"
    :history="history"
    :targets="targets"
    :dates="{ horizon: 'Sep 2027' }"
  />
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `PriceTargetFan` | `v-model:active` | `null \| { type: "history"; date: string; } \| { type: "target"; key: string; }` | `update:active` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### PriceTargetFan

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Price target · 12 months"` | No | Accessible name of the chart. |
| `current` | `number` | — | Yes | Last traded price; the history walks to this point. |
| `targets` | `[PriceTarget, PriceTarget, PriceTarget]` | — | Yes | High, mean and low targets, in that order. |
| `dates` | `{ start?: string; mid?: string; horizon?: string; }` | `{}` | No | Axis labels, oldest to horizon. |
| `history` | `PriceHistoryPoint[]` | `[]` | No | Actual prices, oldest first, using ISO dates. Empty history renders only the current price and targets. |
| `active` | `null \| { type: "history"; date: string; } \| { type: "target"; key: string; }` | — | No | — |
| `defaultActive` | `null \| { type: "history"; date: string; } \| { type: "target"; key: string; }` | `null` | No | — |
| `onActiveChange` | `(active: PriceTargetFanActive \| null) => void` | — | No | — |
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

### PriceTargetFanHeader

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### PriceTargetFanPlot

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `(props: {}) => any` | — | — |

### PriceTargetFanSvg

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### PriceTargetFanAxes

### PriceTargetFanHistory

### PriceTargetFanTargets

### PriceTargetFanNow

### PriceTargetFanCursor

### PriceTargetFanTooltip

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `overlay: chart.overlay` | — |

<a id="about"></a>
## About Price Target Fan

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Price Target Fan?**

Configure Price Target Fan through label, current, targets, dates, history, active, defaultActive, onActiveChange, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:active, activeChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Heat Calendar](https://orvui.efu.me/en/charts/heat-calendar): Show daily activity in a compact calendar grid with exact values available on inspection.
- [Returns Calendar](https://orvui.efu.me/en/charts/returns-calendar): Compare signed daily returns with a calendar, month totals and optional day content.
- [Candlestick Chart](https://orvui.efu.me/en/charts/candlestick-chart): Inspect open, high, low, close and volume values with pointer or keyboard crosshairs.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/price-target-fan.json
- Documentation: https://orvui.efu.me/en/charts/price-target-fan
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFan.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanHeader.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanPlot.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanSvg.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanAxes.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanHistory.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanTargets.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanNow.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanCursor.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanTooltip.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
