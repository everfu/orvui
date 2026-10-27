---
title: "Volume Profile"
description: "Compare traded volume by price level with horizontal bidirectional bars."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/volume-profile"
markdown: "https://orvui.efu.me/en/charts/volume-profile.md"
license: "MIT"
productVersion: "0.1.0"
---

# Volume Profile

> Compare traded volume by price level with horizontal bidirectional bars.

## Install

### Volume Profile — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/volume-profile.json https://orvui.efu.me/r/tabs.json
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

### Volume Profile

**Registry source**

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
import {
  VolumeProfile,
  VolumeProfilePlot,
  VolumeProfileTooltip,
  VolumeProfileSummary,
  type VolumeProfileBin,
} from "@/components/orvui/charts/volume-profile";
const sessions = [
  {
    id: "today",
    label: "Today",
    volumes: [
      18, 27, 36, 52, 70, 96, 135, 172, 205, 241, 278, 225, 192, 146, 108, 79,
      56, 42, 31, 22, 16, 11, 8, 5,
    ],
  },
  {
    id: "previous",
    label: "Previous",
    volumes: [
      6, 9, 13, 18, 27, 40, 56, 74, 95, 114, 146, 188, 242, 286, 253, 208, 165,
      126, 92, 65, 42, 30, 21, 14,
    ],
  },
  {
    id: "week",
    label: "Week",
    volumes: [
      75, 104, 143, 214, 305, 382, 494, 626, 795, 902, 1028, 1182, 1097, 973,
      825, 695, 589, 481, 372, 289, 195, 154, 119, 84,
    ],
  },
];
const data: Record<string, readonly VolumeProfileBin[]> = {};
for (const session of sessions)
  data[session.id] = session.volumes.map((volume, index) => ({
    id: `price-${64000 + index * 100}`,
    priceLow: 64000 + index * 100,
    priceHigh: 64100 + index * 100,
    volume,
  }));
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const formatPrice = (price: number) => currency.format(price),
  formatVolume = (volume: number) => amount.format(volume);
const session = ref("today"),
  previewId = useId(),
  panelId = previewId + "-profile";
</script>
<template>
  <div class="w-full max-w-xl min-w-0 py-2">
    <Tabs v-model="session"
      ><div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div class="space-y-1">
          <p class="text-sm font-medium">BTC / USD</p>
          <p class="text-xs text-muted-foreground">
            Volume by price · Demo data
          </p>
        </div>
        <TabsList
          aria-label="Profile session"
          wrapper-class-name="w-auto"
          class="bg-muted"
          ><TabsTrigger
            v-for="item in sessions"
            :key="item.id"
            :value="item.id"
            :id="`${previewId}-${item.id}`"
            :aria-controls="panelId"
            :tabindex="session === item.id ? 0 : -1"
            indicator-class-name="bg-background"
            class="min-h-8 px-3 py-1.5 text-xs [&_[data-tabs-label]]:text-foreground"
            >{{ item.label }}</TabsTrigger
          ></TabsList
        >
      </div>
      <div
        :id="panelId"
        role="tabpanel"
        :aria-labelledby="`${previewId}-${session}`"
      >
        <VolumeProfile
          :data="data[session]"
          :format-price="formatPrice"
          :format-volume="formatVolume"
          unit="BTC"
          label="BTC volume profile"
          ><VolumeProfilePlot
            class="h-72 sm:h-80" /><VolumeProfileTooltip /><VolumeProfileSummary
        /></VolumeProfile></div
    ></Tabs>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
import { VolumeProfile, VolumeProfilePlot, VolumeProfileTooltip, VolumeProfileSummary, type VolumeProfileBin } from "@orvui/vue/charts/volume-profile";
const sessions = [
  {
    id: "today",
    label: "Today",
    volumes: [
      18, 27, 36, 52, 70, 96, 135, 172, 205, 241, 278, 225, 192, 146, 108, 79,
      56, 42, 31, 22, 16, 11, 8, 5,
    ],
  },
  {
    id: "previous",
    label: "Previous",
    volumes: [
      6, 9, 13, 18, 27, 40, 56, 74, 95, 114, 146, 188, 242, 286, 253, 208, 165,
      126, 92, 65, 42, 30, 21, 14,
    ],
  },
  {
    id: "week",
    label: "Week",
    volumes: [
      75, 104, 143, 214, 305, 382, 494, 626, 795, 902, 1028, 1182, 1097, 973,
      825, 695, 589, 481, 372, 289, 195, 154, 119, 84,
    ],
  },
];
const data: Record<string, readonly VolumeProfileBin[]> = {};
for (const session of sessions)
  data[session.id] = session.volumes.map((volume, index) => ({
    id: `price-${64000 + index * 100}`,
    priceLow: 64000 + index * 100,
    priceHigh: 64100 + index * 100,
    volume,
  }));
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const formatPrice = (price: number) => currency.format(price),
  formatVolume = (volume: number) => amount.format(volume);
const session = ref("today"),
  previewId = useId(),
  panelId = previewId + "-profile";
</script>
<template>
  <div class="w-full max-w-xl min-w-0 py-2">
    <Tabs v-model="session"
      ><div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div class="space-y-1">
          <p class="text-sm font-medium">BTC / USD</p>
          <p class="text-xs text-muted-foreground">
            Volume by price · Demo data
          </p>
        </div>
        <TabsList
          aria-label="Profile session"
          wrapper-class-name="w-auto"
          class="bg-muted"
          ><TabsTrigger
            v-for="item in sessions"
            :key="item.id"
            :value="item.id"
            :id="`${previewId}-${item.id}`"
            :aria-controls="panelId"
            :tabindex="session === item.id ? 0 : -1"
            indicator-class-name="bg-background"
            class="min-h-8 px-3 py-1.5 text-xs [&_[data-tabs-label]]:text-foreground"
            >{{ item.label }}</TabsTrigger
          ></TabsList
        >
      </div>
      <div
        :id="panelId"
        role="tabpanel"
        :aria-labelledby="`${previewId}-${session}`"
      >
        <VolumeProfile
          :data="data[session]"
          :format-price="formatPrice"
          :format-volume="formatVolume"
          unit="BTC"
          label="BTC volume profile"
          ><VolumeProfilePlot
            class="h-72 sm:h-80" /><VolumeProfileTooltip /><VolumeProfileSummary
        /></VolumeProfile></div
    ></Tabs>
  </div>
</template>
```

## API Reference

### VolumeProfile

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data` | `readonly VolumeProfileBin[]` | — | Yes | — |
| `label` | `string` | `"Volume profile"` | No | — |
| `unit` | `string` | `"units"` | No | — |
| `formatPrice` | `(value: number) => string` | `formatNumber` | No | — |
| `formatVolume` | `(value: number) => string` | `formatNumber` | No | — |
| `valueArea` | `number \| false` | `undefined` | No | — |
| `color` | `string` | `"#6366f1"` | No | — |
| `pocColor` | `string` | `"#f59e0b"` | No | — |
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

### VolumeProfilePlot

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `barClassName` | `string` | — | No | — |
| `showAxes` | `boolean` | `true` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### VolumeProfileTooltip

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `row: profile.active` | — |

### VolumeProfileSummary

## About Volume Profile

Compare traded volume by price level with horizontal bidirectional bars.

### When to use it

- Use Volume Profile when the interface needs this behavior: compare traded volume by price level with horizontal bidirectional bars.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Volume Profile?**

Configure Volume Profile through data, label, unit, formatPrice, formatVolume, valueArea, color, pocColor, activeId, defaultActiveId, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:activeId, activeChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/volume-profile.json
- Documentation: https://orvui.efu.me/en/charts/volume-profile
- `packages/vue/src/charts/volume-profile/src/VolumeProfile.vue`
- `packages/vue/src/charts/volume-profile/src/VolumeProfilePlot.vue`
- `packages/vue/src/charts/volume-profile/src/VolumeProfileTooltip.vue`
- `packages/vue/src/charts/volume-profile/src/VolumeProfileSummary.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
