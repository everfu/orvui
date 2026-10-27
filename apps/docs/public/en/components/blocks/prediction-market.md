---
title: "Prediction Market"
description: "Inspect a market and compose a buy or sell ticket with outcomes and return estimates."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/prediction-market"
markdown: "https://orvui.efu.me/en/components/blocks/prediction-market.md"
license: "MIT"
productVersion: "0.1.0"
---

# Prediction Market

> Inspect a market and compose a buy or sell ticket with outcomes and return estimates.

## Install

### Prediction Market — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/prediction-market.json
```

### Market Cards — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/prediction-market-card.json
```

### Trade Ticket — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/prediction-market.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Prediction Market

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { PredictionMarket, type PredictionMarketOrderValue } from "@/components/orvui/blocks/prediction-market";
const outcomes = [
  { id: "yes", label: "Yes", price: 0.167 },
  { id: "no", label: "No", price: 0.834 },
];
const order = ref<PredictionMarketOrderValue>({
  mode: "buy",
  outcomeId: "yes",
  amount: "115",
});
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <PredictionMarket
      v-model="order"
      :outcomes="outcomes"
      :balance="500"
      :positions="{ yes: 125, no: 48 }"
      :quick-amounts="[1, 5, 10, 100]"
    />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { PredictionMarket, type PredictionMarketOrderValue } from "@orvui/vue/blocks/prediction-market";
const outcomes = [
  { id: "yes", label: "Yes", price: 0.167 },
  { id: "no", label: "No", price: 0.834 },
];
const order = ref<PredictionMarketOrderValue>({
  mode: "buy",
  outcomeId: "yes",
  amount: "115",
});
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <PredictionMarket
      v-model="order"
      :outcomes="outcomes"
      :balance="500"
      :positions="{ yes: 125, no: 48 }"
      :quick-amounts="[1, 5, 10, 100]"
    />
  </div>
</template>
```

### Market Cards

Compare listed markets, inspect odds and returns, and bookmark individual cards.

**Registry source**

```vue
<script setup lang="ts">
import { h, ref } from "vue";
import { PredictionMarketCard } from "@/components/orvui/blocks/prediction-market";
import { Button } from "@/components/orvui/motion/button";
// Synthetic club emblems authored for this demonstration; no external team marks.
function badge(label: string, color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path fill="${color}" d="M32 3 57 17v30L32 61 7 47V17Z"/><path fill="none" stroke="white" stroke-opacity=".6" stroke-width="2" d="m32 9 20 11v24L32 55 12 44V20Z"/><text x="32" y="39" fill="white" text-anchor="middle" font-family="system-ui,sans-serif" font-size="21" font-weight="700">${label}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
const boston = badge("GH", "#15803d"), lakers = badge("GD", "#b45309"), rays = badge("BB", "#2563eb"), braves = badge("RS", "#be123c");
const markets = [
  {
    id: "basketball",
    title: "Green Harbor vs. Golden District",
    category: "Basketball",
    status: "Sunday · 7:30 PM",
    volume: "$2.4M",
    live: false,
    image: boston,
    history: [12, 18, 15, 26, 20, 32, 29, 38, 34, 48, 43, 58],
    outcomes: [
      {
        id: "boston",
        label: "Harbor",
        probability: 0.51,
        next: 0.56,
        color: "#34d399",
        image: boston,
      },
      {
        id: "lakers",
        label: "District",
        probability: 0.49,
        next: 0.44,
        color: "#fbbf24",
        image: lakers,
      },
    ],
  },
  {
    id: "baseball",
    title: "Blue Bay vs. Rose Summit",
    category: "MLB",
    status: "Mid 6th",
    volume: "$458K",
    live: true,
    image: rays,
    history: [8, 12, 10, 19, 15, 28, 23, 34, 30, 40, 36, 45],
    outcomes: [
      {
        id: "rays",
        label: "Blue Bay",
        probability: 0.46,
        next: 0.52,
        color: "#60a5fa",
        image: rays,
      },
      {
        id: "braves",
        label: "Summit",
        probability: 0.54,
        next: 0.48,
        color: "#fb7185",
        image: braves,
      },
    ],
  },
  {
    id: "rates",
    title: "Where will interest rates land by the end of the year?",
    category: "Economics",
    status: "Dec 31",
    volume: "$347K",
    live: false,
    image:
      badge("RB", "#475569"),
    history: [15, 11, 17, 14, 24, 21, 30, 25, 32, 29, 39, 42],
    outcomes: [
      {
        id: "below",
        label: "Below 3.5%",
        probability: 0.68,
        next: 0.72,
        color: "#34d399",
        image: null,
      },
      {
        id: "above",
        label: "Above 4.0%",
        probability: 0.23,
        next: 0.18,
        color: "#60a5fa",
        image: null,
      },
    ],
  },
];
const updated = ref(false),
  saved = ref<Record<string, boolean>>({});
const icon =
  (url: string, classes: string, size = 32) =>
  () =>
    h("img", { src: url, alt: "", width: size, height: size, class: classes });
</script>
<template>
  <div class="@container w-full max-w-3xl space-y-5">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-sm font-medium">On the radar</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Demo markets · simulated prices
        </p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        class="shrink-0"
        @click="updated = !updated"
        >Update odds</Button
      >
    </div>
    <div class="grid auto-rows-fr gap-4 @min-[640px]:grid-cols-2">
      <PredictionMarketCard
        v-for="market in markets"
        :key="market.id"
        :title="market.title"
        :category="market.category"
        :status="market.status"
        :live="market.live"
        :icon="
          icon(
            market.image,
            market.id === 'rates'
              ? 'size-full bg-white object-contain p-1'
              : 'size-full object-contain p-1',
            48,
          )
        "
        :volume="market.volume"
        :volume-history="market.history"
        :bookmarked="saved[market.id] ?? false"
        :outcomes="
          market.outcomes.map((outcome) => ({
            ...outcome,
            probability: updated ? outcome.next : outcome.probability,
            icon: outcome.image
              ? icon(outcome.image, 'size-full object-contain p-0.5')
              : undefined,
          }))
        "
        @bookmark-change="saved = { ...saved, [market.id]: $event }"
      />
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { h, ref } from "vue";
import { PredictionMarketCard } from "@orvui/vue/blocks/prediction-market";
import { Button } from "@orvui/vue/motion/button";
// Synthetic club emblems authored for this demonstration; no external team marks.
function badge(label: string, color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path fill="${color}" d="M32 3 57 17v30L32 61 7 47V17Z"/><path fill="none" stroke="white" stroke-opacity=".6" stroke-width="2" d="m32 9 20 11v24L32 55 12 44V20Z"/><text x="32" y="39" fill="white" text-anchor="middle" font-family="system-ui,sans-serif" font-size="21" font-weight="700">${label}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
const boston = badge("GH", "#15803d"), lakers = badge("GD", "#b45309"), rays = badge("BB", "#2563eb"), braves = badge("RS", "#be123c");
const markets = [
  {
    id: "basketball",
    title: "Green Harbor vs. Golden District",
    category: "Basketball",
    status: "Sunday · 7:30 PM",
    volume: "$2.4M",
    live: false,
    image: boston,
    history: [12, 18, 15, 26, 20, 32, 29, 38, 34, 48, 43, 58],
    outcomes: [
      {
        id: "boston",
        label: "Harbor",
        probability: 0.51,
        next: 0.56,
        color: "#34d399",
        image: boston,
      },
      {
        id: "lakers",
        label: "District",
        probability: 0.49,
        next: 0.44,
        color: "#fbbf24",
        image: lakers,
      },
    ],
  },
  {
    id: "baseball",
    title: "Blue Bay vs. Rose Summit",
    category: "MLB",
    status: "Mid 6th",
    volume: "$458K",
    live: true,
    image: rays,
    history: [8, 12, 10, 19, 15, 28, 23, 34, 30, 40, 36, 45],
    outcomes: [
      {
        id: "rays",
        label: "Blue Bay",
        probability: 0.46,
        next: 0.52,
        color: "#60a5fa",
        image: rays,
      },
      {
        id: "braves",
        label: "Summit",
        probability: 0.54,
        next: 0.48,
        color: "#fb7185",
        image: braves,
      },
    ],
  },
  {
    id: "rates",
    title: "Where will interest rates land by the end of the year?",
    category: "Economics",
    status: "Dec 31",
    volume: "$347K",
    live: false,
    image:
      badge("RB", "#475569"),
    history: [15, 11, 17, 14, 24, 21, 30, 25, 32, 29, 39, 42],
    outcomes: [
      {
        id: "below",
        label: "Below 3.5%",
        probability: 0.68,
        next: 0.72,
        color: "#34d399",
        image: null,
      },
      {
        id: "above",
        label: "Above 4.0%",
        probability: 0.23,
        next: 0.18,
        color: "#60a5fa",
        image: null,
      },
    ],
  },
];
const updated = ref(false),
  saved = ref<Record<string, boolean>>({});
const icon =
  (url: string, classes: string, size = 32) =>
  () =>
    h("img", { src: url, alt: "", width: size, height: size, class: classes });
</script>
<template>
  <div class="@container w-full max-w-3xl space-y-5">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-sm font-medium">On the radar</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Demo markets · simulated prices
        </p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        class="shrink-0"
        @click="updated = !updated"
        >Update odds</Button
      >
    </div>
    <div class="grid auto-rows-fr gap-4 @min-[640px]:grid-cols-2">
      <PredictionMarketCard
        v-for="market in markets"
        :key="market.id"
        :title="market.title"
        :category="market.category"
        :status="market.status"
        :live="market.live"
        :icon="
          icon(
            market.image,
            market.id === 'rates'
              ? 'size-full bg-white object-contain p-1'
              : 'size-full object-contain p-1',
            48,
          )
        "
        :volume="market.volume"
        :volume-history="market.history"
        :bookmarked="saved[market.id] ?? false"
        :outcomes="
          market.outcomes.map((outcome) => ({
            ...outcome,
            probability: updated ? outcome.next : outcome.probability,
            icon: outcome.image
              ? icon(outcome.image, 'size-full object-contain p-0.5')
              : undefined,
          }))
        "
        @bookmark-change="saved = { ...saved, [market.id]: $event }"
      />
    </div>
  </div>
</template>
```

### Trade Ticket

Choose an outcome and compose a buy or sell amount with visible order feedback.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { PredictionMarket, type PredictionMarketOrderValue } from "@/components/orvui/blocks/prediction-market";
const outcomes = [
  { id: "yes", label: "Yes", price: 0.167 },
  { id: "no", label: "No", price: 0.834 },
];
const order = ref<PredictionMarketOrderValue>({
  mode: "buy",
  outcomeId: "yes",
  amount: "115",
});
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <PredictionMarket
      v-model="order"
      :outcomes="outcomes"
      :balance="500"
      :positions="{ yes: 125, no: 48 }"
      :quick-amounts="[1, 5, 10, 100]"
    />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { PredictionMarket, type PredictionMarketOrderValue } from "@orvui/vue/blocks/prediction-market";
const outcomes = [
  { id: "yes", label: "Yes", price: 0.167 },
  { id: "no", label: "No", price: 0.834 },
];
const order = ref<PredictionMarketOrderValue>({
  mode: "buy",
  outcomeId: "yes",
  amount: "115",
});
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <PredictionMarket
      v-model="order"
      :outcomes="outcomes"
      :balance="500"
      :positions="{ yes: 125, no: 48 }"
      :quick-amounts="[1, 5, 10, 100]"
    />
  </div>
</template>
```

## API Reference

### PredictionMarket

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `outcomes` | `PredictionMarketOutcome[]` | `() => [ { id: "up", label: "Up", price: 0.09 }, { id: "down", label: "Down", price: 0.91 }, ]` | No | — |
| `modelValue` | `PredictionMarketOrderValue` | — | No | — |
| `defaultValue` | `Partial<PredictionMarketOrderValue>` | — | No | — |
| `authenticated` | `boolean` | `true` | No | — |
| `orderTypeLabel` | `string` | `"Market"` | No | — |
| `balance` | `number` | `500` | No | — |
| `positions` | `Record<string, number>` | `() => ({ up: 24, down: 16 })` | No | — |
| `quickAmounts` | `number[]` | `() => [10, 50, 100, 500]` | No | — |
| `minTrade` | `number` | `1` | No | — |
| `classNames` | `PredictionMarketClassNames` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `[value: PredictionMarketOrderValue]` | — |
| `valueChange` | `[value: PredictionMarketOrderValue]` | — |
| `trade` | `[order: PredictionMarketOrderValue, quote: PredictionMarketQuote]` | — |
| `signIn` | `[]` | — |

### PredictionMarketCard

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | — | Yes | — |
| `icon` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |
| `category` | `string` | — | No | — |
| `volume` | `string` | — | Yes | — |
| `volumeHistory` | `number[]` | `() => []` | No | — |
| `status` | `string` | — | No | — |
| `live` | `boolean` | `false` | No | — |
| `outcomes` | `PredictionMarketCardOutcome[]` | — | Yes | — |
| `bookmarked` | `boolean` | `undefined` | No | — |
| `defaultBookmarked` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `outcomeClick` | `[selection: PredictionMarketCardSelection]` | — |
| `update:bookmarked` | `[bookmarked: boolean]` | — |
| `bookmarkChange` | `[bookmarked: boolean]` | — |

## About Prediction Market

Inspect a market and compose a buy or sell ticket with outcomes and return estimates.

### When to use it

- Use Prediction Market when the interface needs this behavior: inspect a market and compose a buy or sell ticket with outcomes and return estimates.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Prediction Market?**

Configure Prediction Market through outcomes, modelValue, defaultValue, authenticated, orderTypeLabel, balance, positions, quickAmounts, minTrade, classNames. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valueChange, trade, signIn to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/prediction-market.json
- Documentation: https://orvui.efu.me/en/components/blocks/prediction-market
- `packages/vue/src/blocks/prediction-market/src/PredictionMarket.vue`
- `packages/vue/src/blocks/prediction-market/src/PredictionMarketCard.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
