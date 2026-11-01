---
title: "Cylinder Carousel"
description: "Arrange gallery items on a concave or convex cylinder controlled by dragging."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/cylinder-carousel"
markdown: "https://orvui.efu.me/en/components/motion/cylinder-carousel.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Cylinder Carousel

> Arrange gallery items on a concave or convex cylinder controlled by dragging.

<a id="when-to-use"></a>

## When to use it

- Use Cylinder Carousel when the interface needs this behavior: arrange gallery items on a concave or convex cylinder controlled by dragging.

<a id="install"></a>
## Install

### Cylinder Carousel — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/cylinder-carousel.json https://orvui.efu.me/r/shader-background.json https://orvui.efu.me/r/tabs.json
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
- `@paper-design/shaders@^0.0.76`
- `clsx@^2.1.1`
- `tailwind-merge@^3.0.0`
- `lucide-vue-next@^0.468.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Cylinder Carousel

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CylinderCarousel } from "@/components/orvui/motion/cylinder-carousel";
import { ShaderBackground } from "@/components/orvui/motion/shader-background";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
const curvature = ref<"concave" | "convex">("concave");
const surfaces = [
  ["dithering", { colorBack: "#1a1030", colorFront: "#b98cff", speed: .3 }],
  ["metaballs", { colors: ["#e8e8ef", "#8a8a9a", "#1a1a22"], colorBack: "#c9b9a8", speed: .4 }],
  ["warp", { colors: ["#c8ff00", "#3a5a00", "#c8ff00", "#88bb00"], speed: .4 }],
  ["god-rays", { colors: ["#6a7bff", "#00114d"], colorBack: "#000000", speed: .5 }],
  ["swirl", { colorBack: "#1a0000", colors: ["#ffd1a8", "#ff6a3d", "#b31a57"], speed: .3 }],
  ["mesh-gradient", { colors: ["#e0eaff", "#241d9a", "#f75092", "#9f50d3"], speed: .3 }],
  ["voronoi", { colors: ["#ff8247", "#ffe53d"], speed: .3 }],
  ["neuro-noise", { colorFront: "#ffffff", colorMid: "#47a6ff", colorBack: "#000000", speed: .4 }],
] as const;
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4 p-6">
    <Tabs v-model="curvature" variant="segment"><TabsList><TabsTrigger v-for="mode in ['concave', 'convex']" :key="mode" :value="mode">{{ mode === 'concave' ? 'Concave' : 'Convex' }}</TabsTrigger></TabsList></Tabs>
    <div class="w-full rounded-3xl border border-border/60 bg-muted/20 py-6 [clip-path:inset(0_round_1.5rem)]"><CylinderCarousel :variant="curvature" :item-size="230" :height="310" class="w-full"><div v-for="[variant, settings] in surfaces" :key="variant" class="h-full w-full overflow-hidden rounded-full border border-border/40"><ShaderBackground :variant="variant as any" v-bind="settings" class="h-full w-full" /></div></CylinderCarousel></div>
    <p class="text-xs text-muted-foreground">Drag, scroll or use arrow keys to roll</p>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CylinderCarousel } from "@orvui/vue/motion/cylinder-carousel";
import { ShaderBackground } from "@orvui/vue/motion/shader-background";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
const curvature = ref<"concave" | "convex">("concave");
const surfaces = [
  ["dithering", { colorBack: "#1a1030", colorFront: "#b98cff", speed: .3 }],
  ["metaballs", { colors: ["#e8e8ef", "#8a8a9a", "#1a1a22"], colorBack: "#c9b9a8", speed: .4 }],
  ["warp", { colors: ["#c8ff00", "#3a5a00", "#c8ff00", "#88bb00"], speed: .4 }],
  ["god-rays", { colors: ["#6a7bff", "#00114d"], colorBack: "#000000", speed: .5 }],
  ["swirl", { colorBack: "#1a0000", colors: ["#ffd1a8", "#ff6a3d", "#b31a57"], speed: .3 }],
  ["mesh-gradient", { colors: ["#e0eaff", "#241d9a", "#f75092", "#9f50d3"], speed: .3 }],
  ["voronoi", { colors: ["#ff8247", "#ffe53d"], speed: .3 }],
  ["neuro-noise", { colorFront: "#ffffff", colorMid: "#47a6ff", colorBack: "#000000", speed: .4 }],
] as const;
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4 p-6">
    <Tabs v-model="curvature" variant="segment"><TabsList><TabsTrigger v-for="mode in ['concave', 'convex']" :key="mode" :value="mode">{{ mode === 'concave' ? 'Concave' : 'Convex' }}</TabsTrigger></TabsList></Tabs>
    <div class="w-full rounded-3xl border border-border/60 bg-muted/20 py-6 [clip-path:inset(0_round_1.5rem)]"><CylinderCarousel :variant="curvature" :item-size="230" :height="310" class="w-full"><div v-for="[variant, settings] in surfaces" :key="variant" class="h-full w-full overflow-hidden rounded-full border border-border/40"><ShaderBackground :variant="variant as any" v-bind="settings" class="h-full w-full" /></div></CylinderCarousel></div>
    <p class="text-xs text-muted-foreground">Drag, scroll or use arrow keys to roll</p>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### CylinderCarousel

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `itemSize` | `number` | `200` | No | — |
| `visibleItems` | `number` | `5` | No | — |
| `variant` | `"concave" \| "convex"` | `"concave"` | No | — |
| `minScale` | `number` | `.55` | No | — |
| `dragSpeed` | `number` | `1.5` | No | — |
| `arc` | `number` | — | No | — |
| `snap` | `boolean` | `true` | No | — |
| `autoRotate` | `boolean` | `false` | No | — |
| `autoRotateSpeed` | `number` | `.4` | No | — |
| `defaultIndex` | `number` | `0` | No | — |
| `height` | `number` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `indexChange` | — | — |

<a id="about"></a>
## About Cylinder Carousel

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Cylinder Carousel?**

Configure Cylinder Carousel through itemSize, visibleItems, variant, minScale, dragSpeed, arc, snap, autoRotate, autoRotateSpeed, defaultIndex, height. The API table describes their types and defaults.

**How does it connect to application state?**

Observe indexChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Marquee](https://orvui.efu.me/en/components/motion/marquee): Repeat a horizontal or vertical content strip with optional pause on hover.
- [Shader Background](https://orvui.efu.me/en/components/motion/shader-background): Render an animated background through a Vue adapter for the Paper Design shader runtime.
- [Tilt Card](https://orvui.efu.me/en/components/motion/tilt-card): Tilt a card toward the pointer and move a highlight over its surface.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/cylinder-carousel.json
- Documentation: https://orvui.efu.me/en/components/motion/cylinder-carousel
- `packages/vue/src/motion/cylinder-carousel/src/CylinderCarousel.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
