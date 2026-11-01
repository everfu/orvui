---
title: "Liquidity Heatmap"
description: "Inspect liquidity across time and price through a grid with selectable intensity bands."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/liquidity-heatmap"
markdown: "https://orvui.efu.me/en/charts/liquidity-heatmap.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Liquidity Heatmap

> Inspect liquidity across time and price through a grid with selectable intensity bands.

<a id="when-to-use"></a>

## When to use it

- Use Liquidity Heatmap when the interface needs this behavior: inspect liquidity across time and price through a grid with selectable intensity bands.

<a id="install"></a>
## Install

### Liquidity Heatmap — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/liquidity-heatmap.json https://orvui.efu.me/beta/r/button.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the local Beta archive; see the Beta installation guide to build it.

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
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
### Liquidity Heatmap

**Registry source**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { RefreshCw } from "lucide-vue-next";
import { Button } from "@/components/orvui/motion/button";
import { LiquidityHeatmap, type LiquiditySnapshot } from "@/components/orvui/charts/liquidity-heatmap";
const phase = ref(0);
const snapshots = computed<LiquiditySnapshot[]>(() =>
  Array.from({ length: 24 }, (_, minute) => ({
    id: `minute-${minute}`,
    label: `14:${String(minute * 2).padStart(2, "0")}`,
    price:
      245.5 +
      Math.sin(minute * 0.27 + phase.value * 0.4) * 1.2 +
      minute * 0.035,
    levels: Array.from({ length: 18 }, (_, row) => {
      const upper = Math.exp(
        -((row - 4 - Math.sin(minute * 0.18 + phase.value) * 0.7) ** 2) / 0.8,
      );
      const lower = Math.exp(
        -((row - 13 + Math.cos(minute * 0.15 + phase.value) * 0.8) ** 2) / 1.2,
      );
      const noise =
        (Math.sin(row * 12.9 + minute * 7.3 + phase.value * 2.1) + 1) / 2;
      return {
        price: 250 - row * 0.5,
        size: Math.round(
          90 +
            noise * 350 +
            (upper + lower) *
              (1500 + Math.sin(minute * 0.3 + phase.value) * 450),
        ),
      };
    }),
  })),
);
const formatPrice = (price: number) => `$${price.toFixed(2)}`;
</script>
<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-medium">Where liquidity rests</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          SOL / USD · Simulated depth
        </p>
      </div>
      <Button variant="ghost" size="sm" class="gap-2" @click="phase++"
        ><RefreshCw aria-hidden="true" class="size-3.5" />Resimulate</Button
      >
    </div>
    <LiquidityHeatmap
      :snapshots="snapshots"
      :max-size="2400"
      unit="SOL"
      :format-price="formatPrice"
    />
    <p class="text-center text-[11px] text-muted-foreground">
      Brighter bands hold more liquidity · White line tracks price
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
import { LiquidityHeatmap, type LiquiditySnapshot } from "@orvui/vue/charts/liquidity-heatmap";
const phase = ref(0);
const snapshots = computed<LiquiditySnapshot[]>(() =>
  Array.from({ length: 24 }, (_, minute) => ({
    id: `minute-${minute}`,
    label: `14:${String(minute * 2).padStart(2, "0")}`,
    price:
      245.5 +
      Math.sin(minute * 0.27 + phase.value * 0.4) * 1.2 +
      minute * 0.035,
    levels: Array.from({ length: 18 }, (_, row) => {
      const upper = Math.exp(
        -((row - 4 - Math.sin(minute * 0.18 + phase.value) * 0.7) ** 2) / 0.8,
      );
      const lower = Math.exp(
        -((row - 13 + Math.cos(minute * 0.15 + phase.value) * 0.8) ** 2) / 1.2,
      );
      const noise =
        (Math.sin(row * 12.9 + minute * 7.3 + phase.value * 2.1) + 1) / 2;
      return {
        price: 250 - row * 0.5,
        size: Math.round(
          90 +
            noise * 350 +
            (upper + lower) *
              (1500 + Math.sin(minute * 0.3 + phase.value) * 450),
        ),
      };
    }),
  })),
);
const formatPrice = (price: number) => `$${price.toFixed(2)}`;
</script>
<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-medium">Where liquidity rests</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          SOL / USD · Simulated depth
        </p>
      </div>
      <Button variant="ghost" size="sm" class="gap-2" @click="phase++"
        ><RefreshCw aria-hidden="true" class="size-3.5" />Resimulate</Button
      >
    </div>
    <LiquidityHeatmap
      :snapshots="snapshots"
      :max-size="2400"
      unit="SOL"
      :format-price="formatPrice"
    />
    <p class="text-center text-[11px] text-muted-foreground">
      Brighter bands hold more liquidity · White line tracks price
    </p>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### LiquidityHeatmap

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `snapshots` | `readonly LiquiditySnapshot[]` | — | Yes | — |
| `maxSize` | `number` | — | No | — |
| `unit` | `string` | `"units"` | No | — |
| `label` | `string` | `"Liquidity heatmap"` | No | — |
| `formatPrice` | `(value: number) => string` | `formatNumber` | No | — |
| `formatSize` | `(value: number) => string` | `formatCompact` | No | — |
| `className` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### LiquidityHeatmapPlot

### LiquidityHeatmapLegend

<a id="about"></a>
## About Liquidity Heatmap

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Liquidity Heatmap?**

Configure Liquidity Heatmap through snapshots, maxSize, unit, label, formatPrice, formatSize, className. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Order Book](https://orvui.efu.me/en/charts/order-book): Inspect bid and ask levels, cumulative depth and price selections in a live book.
- [Bump Chart](https://orvui.efu.me/en/charts/bump-chart): Follow changes in series rank over time and pin a series for closer inspection.
- [Composition Chart](https://orvui.efu.me/en/charts/composition-chart): Compare contributions across categories with normalized bars or stacked areas.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/liquidity-heatmap.json
- Documentation: https://orvui.efu.me/en/charts/liquidity-heatmap
- `packages/vue/src/charts/liquidity-heatmap/src/LiquidityHeatmap.vue`
- `packages/vue/src/charts/liquidity-heatmap/src/LiquidityHeatmapPlot.vue`
- `packages/vue/src/charts/liquidity-heatmap/src/LiquidityHeatmapLegend.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
