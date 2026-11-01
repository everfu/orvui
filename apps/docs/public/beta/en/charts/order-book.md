---
title: "Order Book"
description: "Inspect bid and ask levels, cumulative depth and price selections in a live book."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/order-book"
markdown: "https://orvui.efu.me/en/charts/order-book.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Order Book

> Inspect bid and ask levels, cumulative depth and price selections in a live book.

<a id="when-to-use"></a>

## When to use it

- Use Order Book when the interface needs this behavior: inspect bid and ask levels, cumulative depth and price selections in a live book.

<a id="install"></a>
## Install

### Order Book — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/order-book.json https://orvui.efu.me/beta/r/button.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the local Beta archive; see the Beta installation guide to build it.

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
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
### Order Book

**Registry source**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "@/components/orvui/motion/button";
import {
  OrderBook,
  OrderBookHeader,
  OrderBookSide,
  OrderBookSpread,
  OrderBookBalance,
  OrderBookDepthSummary,
} from "@/components/orvui/charts/order-book";
const sizes = {
  ask: [284, 574, 363, 278, 1800, 2200, 1100, 1200, 782],
  bid: [194, 543, 314, 592, 715, 744, 789, 735, 1100],
};
const playing = ref(true),
  selected = ref<number | null>(null),
  tick = ref(0);
function levels(side: "ask" | "bid") {
  const direction = side === "ask" ? 1 : -1;
  return sizes[side].map((size, index) => {
    const phase = (index + (direction === 1 ? 1 : 0)) % 3;
    const updated = tick.value - ((tick.value + phase) % 3);
    return {
      price: Number((245.85 + direction * (index + 1) * 0.15).toFixed(2)),
      size:
        updated <= 0
          ? size
          : Math.round(
              size *
                (1 + Math.sin(updated * 1.3 + index * 2.1 + direction) * 0.32),
            ),
    };
  });
}
const book = computed(() => ({ asks: levels("ask"), bids: levels("bid") }));
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => {
    if (playing.value && !document.hidden) tick.value++;
  }, 950);
});
onBeforeUnmount(() => clearInterval(timer));
function step() {
  playing.value = false;
  tick.value++;
}
</script>
<template>
  <div class="w-full max-w-[520px] space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3 px-1">
      <div class="text-sm font-medium">
        SOL / USD
        <span
          class="ml-2 rounded border border-border px-1.5 py-0.5 text-[9px] uppercase text-muted-foreground"
          >Simulated</span
        >
      </div>
      <div class="flex gap-2">
        <Button variant="ghost" size="sm" @click="playing = !playing">{{
          playing ? "Pause" : "Resume"
        }}</Button
        ><Button variant="ghost" size="sm" @click="step">Step</Button>
      </div>
    </div>
    <OrderBook
      :bids="book.bids"
      :asks="book.asks"
      base-symbol="SOL"
      quote-symbol="USD"
      label="Simulated SOL / USD order book"
      @level-select="selected = $event.price"
      ><OrderBookHeader /><OrderBookSide
        side="ask" /><OrderBookSpread /><OrderBookSide
        side="bid" /><OrderBookDepthSummary /><OrderBookBalance
    /></OrderBook>
    <p aria-live="polite" class="px-1 text-xs text-muted-foreground">
      {{
        selected === null
          ? "Click a price to use it, for example in an order ticket."
          : `Selected ${selected.toFixed(2)} USD`
      }}
    </p>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "@orvui/vue/motion/button";
import { OrderBook, OrderBookHeader, OrderBookSide, OrderBookSpread, OrderBookBalance, OrderBookDepthSummary } from "@orvui/vue/charts/order-book";
const sizes = {
  ask: [284, 574, 363, 278, 1800, 2200, 1100, 1200, 782],
  bid: [194, 543, 314, 592, 715, 744, 789, 735, 1100],
};
const playing = ref(true),
  selected = ref<number | null>(null),
  tick = ref(0);
function levels(side: "ask" | "bid") {
  const direction = side === "ask" ? 1 : -1;
  return sizes[side].map((size, index) => {
    const phase = (index + (direction === 1 ? 1 : 0)) % 3;
    const updated = tick.value - ((tick.value + phase) % 3);
    return {
      price: Number((245.85 + direction * (index + 1) * 0.15).toFixed(2)),
      size:
        updated <= 0
          ? size
          : Math.round(
              size *
                (1 + Math.sin(updated * 1.3 + index * 2.1 + direction) * 0.32),
            ),
    };
  });
}
const book = computed(() => ({ asks: levels("ask"), bids: levels("bid") }));
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => {
    if (playing.value && !document.hidden) tick.value++;
  }, 950);
});
onBeforeUnmount(() => clearInterval(timer));
function step() {
  playing.value = false;
  tick.value++;
}
</script>
<template>
  <div class="w-full max-w-[520px] space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3 px-1">
      <div class="text-sm font-medium">
        SOL / USD
        <span
          class="ml-2 rounded border border-border px-1.5 py-0.5 text-[9px] uppercase text-muted-foreground"
          >Simulated</span
        >
      </div>
      <div class="flex gap-2">
        <Button variant="ghost" size="sm" @click="playing = !playing">{{
          playing ? "Pause" : "Resume"
        }}</Button
        ><Button variant="ghost" size="sm" @click="step">Step</Button>
      </div>
    </div>
    <OrderBook
      :bids="book.bids"
      :asks="book.asks"
      base-symbol="SOL"
      quote-symbol="USD"
      label="Simulated SOL / USD order book"
      @level-select="selected = $event.price"
      ><OrderBookHeader /><OrderBookSide
        side="ask" /><OrderBookSpread /><OrderBookSide
        side="bid" /><OrderBookDepthSummary /><OrderBookBalance
    /></OrderBook>
    <p aria-live="polite" class="px-1 text-xs text-muted-foreground">
      {{
        selected === null
          ? "Click a price to use it, for example in an order ticket."
          : `Selected ${selected.toFixed(2)} USD`
      }}
    </p>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `OrderBook` | `v-model:activeLevel` | `null \| { side: "bid" \| "ask"; price: number; }` | `update:activeLevel` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### OrderBook

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `bids` | `readonly OrderBookLevel[]` | — | Yes | — |
| `asks` | `readonly OrderBookLevel[]` | — | Yes | — |
| `levels` | `number` | `9` | No | — |
| `lastPrice` | `number` | — | No | — |
| `label` | `string` | `"Order book"` | No | — |
| `baseSymbol` | `string` | `""` | No | — |
| `quoteSymbol` | `string` | `"USD"` | No | — |
| `formatPrice` | `(value: number) => string` | `((value: number) => priceFormat.format(value))` | No | — |
| `formatSize` | `(value: number) => string` | `formatCompact` | No | — |
| `activeLevel` | `null \| { side: "bid" \| "ask"; price: number; }` | — | No | — |
| `defaultActiveLevel` | `null \| { side: "bid" \| "ask"; price: number; }` | `null` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:activeLevel` | — | — |
| `activeLevelChange` | — | — |
| `levelSelect` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### OrderBookHeader

### OrderBookSide

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | `"bid" \| "ask"` | — | Yes | — |

### OrderBookSpread

### OrderBookBalance

### OrderBookDepthSummary

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Hover a level to see the cost of filling up to it"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `summary: book.summary` | — |

### OrderBookDepthRow

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `row` | `DepthLevel` | — | Yes | — |
| `side` | `"bid" \| "ask"` | — | Yes | — |
| `inRange` | `boolean` | `false` | No | — |
| `fraction` | `number` | — | Yes | — |
| `entranceIndex` | `number` | — | Yes | — |

<a id="about"></a>
## About Order Book

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Order Book?**

Configure Order Book through bids, asks, levels, lastPrice, label, baseSymbol, quoteSymbol, formatPrice, formatSize, activeLevel, defaultActiveLevel, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:activeLevel, activeLevelChange, levelSelect to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Liquidity Heatmap](https://orvui.efu.me/en/charts/liquidity-heatmap): Inspect liquidity across time and price through a grid with selectable intensity bands.
- [Candlestick Chart](https://orvui.efu.me/en/charts/candlestick-chart): Inspect open, high, low, close and volume values with pointer or keyboard crosshairs.
- [Volume Profile](https://orvui.efu.me/en/charts/volume-profile): Compare traded volume by price level with horizontal bidirectional bars.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/order-book.json
- Documentation: https://orvui.efu.me/en/charts/order-book
- `packages/vue/src/charts/order-book/src/OrderBook.vue`
- `packages/vue/src/charts/order-book/src/OrderBookHeader.vue`
- `packages/vue/src/charts/order-book/src/OrderBookSide.vue`
- `packages/vue/src/charts/order-book/src/OrderBookSpread.vue`
- `packages/vue/src/charts/order-book/src/OrderBookBalance.vue`
- `packages/vue/src/charts/order-book/src/OrderBookDepthSummary.vue`
- `packages/vue/src/charts/order-book/src/OrderBookDepthRow.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
