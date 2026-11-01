---
title: "Shader Background"
description: "Render an animated background through a Vue adapter for the Paper Design shader runtime."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/shader-background"
markdown: "https://orvui.efu.me/en/components/motion/shader-background.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Shader Background

> Render an animated background through a Vue adapter for the Paper Design shader runtime.

<a id="when-to-use"></a>

## When to use it

- Use Shader Background when the interface needs this behavior: render an animated background through a Vue adapter for the Paper Design shader runtime.

<a id="install"></a>
## Install

### Shader Background — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/shader-background.json https://orvui.efu.me/beta/r/tabs.json
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

- `@paper-design/shaders@^0.0.76`
- `clsx@^2.1.1`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Shader Background

**Registry source**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ShaderBackground, type ShaderBackgroundVariant } from "@/components/orvui/motion/shader-background";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
import { useReducedMotion } from "@/components/orvui/lib/composables";
const variants: {
  id: string;
  value: ShaderBackgroundVariant;
  label: string;
  props: Record<string, unknown>;
}[] = [
  {
    id: "mesh-gradient",
    value: "mesh-gradient",
    label: "Mesh",
    props: {
      colors: ["#e0eaff", "#241d9a", "#f75092", "#9f50d3"],
      distortion: 0.8,
      swirl: 0.3,
      speed: 0.4,
    },
  },
  {
    id: "grain-gradient",
    value: "grain-gradient",
    label: "Grain",
    props: {
      colors: ["#7300ff", "#eba8ff", "#00bfff", "#2a00ff"],
      colorBack: "#000000",
      softness: 0.6,
      speed: 0.5,
    },
  },
  {
    id: "grain-sunset",
    value: "grain-gradient",
    label: "Grain — Sunset",
    props: {
      colors: ["#ff7a00", "#ff2e93", "#ffce54", "#8a2be2"],
      colorBack: "#1a0500",
      softness: 0.7,
      speed: 0.4,
    },
  },
  {
    id: "grain-pastel",
    value: "grain-gradient",
    label: "Grain — Pastel",
    props: {
      colors: ["#ffd6e8", "#c9e4ff", "#fff3c4", "#d9c9ff"],
      colorBack: "#ffffff",
      softness: 0.85,
      speed: 0.3,
    },
  },
  {
    id: "mesh-aurora",
    value: "mesh-gradient",
    label: "Mesh — Aurora",
    props: {
      colors: ["#00ffb2", "#0072ff", "#a200ff", "#001a2c"],
      distortion: 0.6,
      swirl: 0.5,
      speed: 0.3,
    },
  },
  {
    id: "mesh-citrus",
    value: "mesh-gradient",
    label: "Mesh — Citrus",
    props: {
      colors: ["#fff200", "#ff8a00", "#ff3d00", "#ffe08a"],
      distortion: 0.7,
      swirl: 0.4,
      speed: 0.5,
    },
  },
  {
    id: "warp",
    value: "warp",
    label: "Warp",
    props: {
      colors: ["#121212", "#9470ff", "#121212", "#8838ff"],
      speed: 0.4,
    },
  },
  {
    id: "waves",
    value: "waves",
    label: "Waves",
    props: { colorFront: "#ffbb00", colorBack: "#000000" },
  },
  {
    id: "voronoi",
    value: "voronoi",
    label: "Voronoi",
    props: { colors: ["#ff8247", "#ffe53d"], speed: 0.3 },
  },
  {
    id: "swirl",
    value: "swirl",
    label: "Swirl",
    props: {
      colorBack: "#180018",
      colors: ["#ffd1d1", "#ff8a8a", "#660000"],
      speed: 0.2,
    },
  },
  {
    id: "dot-orbit",
    value: "dot-orbit",
    label: "Orbit",
    props: {
      colors: ["#ffc96b", "#ff6200", "#ff2f00"],
      colorBack: "#000000",
      speed: 0.6,
    },
  },
  {
    id: "dot-grid",
    value: "dot-grid",
    label: "Grid",
    props: {
      colorBack: "#000000",
      colorFill: "#ffffff",
      colorStroke: "#ffaa00",
    },
  },
  {
    id: "smoke-ring",
    value: "smoke-ring",
    label: "Smoke",
    props: { colorBack: "#000000", colors: ["#ffffff"], speed: 0.3 },
  },
  {
    id: "static-radial-gradient",
    value: "static-radial-gradient",
    label: "Radial",
    props: { colorBack: "#000000", colors: ["#00bbff", "#00ffe1", "#ffffff"] },
  },
  {
    id: "neuro-noise",
    value: "neuro-noise",
    label: "Neuro",
    props: {
      colorFront: "#ffffff",
      colorMid: "#47a6ff",
      colorBack: "#000000",
      speed: 0.4,
    },
  },
  {
    id: "water",
    value: "water",
    label: "Water",
    props: { colorBack: "#909090", colorHighlight: "#ffffff", speed: 0.4 },
  },
  {
    id: "metaballs",
    value: "metaballs",
    label: "Metaballs",
    props: {
      colors: ["#ff5cf4", "#4d9eff", "#000000"],
      colorBack: "#000000",
      speed: 0.5,
    },
  },
  {
    id: "god-rays",
    value: "god-rays",
    label: "Rays",
    props: {
      colors: ["#ffcc66", "#ff6a00"],
      colorBack: "#000000",
      speed: 0.4,
    },
  },
  {
    id: "spiral",
    value: "spiral",
    label: "Spiral",
    props: { colors: ["#7a5cff", "#ff5ca6", "#000000"], speed: 0.4 },
  },
  {
    id: "dithering",
    value: "dithering",
    label: "Dither",
    props: {
      colorBack: "#000000",
      colorFront: "#00ff9d",
      speed: 0.4,
    },
  },
  {
    id: "pulsing-border",
    value: "pulsing-border",
    label: "Pulse",
    props: {
      colors: ["#00e5ff", "#7000ff", "#ff00c8"],
      colorBack: "#000000",
      speed: 0.5,
    },
  },
  {
    id: "color-panels",
    value: "color-panels",
    label: "Panels",
    props: { colors: ["#ff3d68", "#ffb800", "#3d7aff", "#00ffb2"], speed: 0.3 },
  },
  {
    id: "static-mesh-gradient",
    value: "static-mesh-gradient",
    label: "Static Mesh",
    props: { colors: ["#ff8a3d", "#ff3d9a", "#3d5aff", "#0a0a0a"] },
  },
  {
    id: "static-mesh-dusk",
    value: "static-mesh-gradient",
    label: "Static Mesh — Dusk",
    props: { colors: ["#2b1055", "#7597de", "#f6a1c8", "#0d0221"] },
  },
  {
    id: "radial-ember",
    value: "static-radial-gradient",
    label: "Radial — Ember",
    props: { colorBack: "#0a0000", colors: ["#ff5100", "#ffce00", "#4a0000"] },
  },
  {
    id: "simplex-noise",
    value: "simplex-noise",
    label: "Simplex",
    props: { colors: ["#ff6ec7", "#6ec7ff", "#000000"], speed: 0.4 },
  },
  {
    id: "perlin-noise",
    value: "perlin-noise",
    label: "Perlin",
    props: { colorFront: "#00ffd5", colorBack: "#000000", speed: 0.3 },
  },
];

const active = ref(variants[0]!.id), paused = ref(false);
const current = computed(() => variants.find(scene => scene.id === active.value) ?? variants[0]!);
const reduce = useReducedMotion();
let mounted = false;
let next: ReturnType<typeof setTimeout> | undefined;
function schedule() {
  clearTimeout(next);
  if (!mounted || reduce.value || paused.value) return;
  next = setTimeout(() => {
    const index = variants.findIndex(scene => scene.id === active.value);
    active.value = variants[(index + 1) % variants.length]!.id;
    schedule();
  }, 2400);
}
watch([reduce, paused], schedule);
onMounted(() => { mounted = true; schedule(); });
onBeforeUnmount(() => { mounted = false; clearTimeout(next); });
</script>
<template>
  <div
    class="flex w-full max-w-2xl flex-col gap-5 p-6"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div
      class="relative h-80 w-full overflow-hidden rounded-2xl border border-border"
    >
      <ShaderBackground
        :key="current.id"
        :variant="current.value"
        v-bind="current.props"
        class="absolute inset-0"
      />
    </div>
    <Tabs v-model="active"
      ><TabsList class="flex-wrap justify-center gap-2 rounded-2xl"
        ><TabsTrigger
          v-for="item in variants"
          :key="item.id"
          :value="item.id"
          class="px-4 py-2 text-sm"
          >{{ item.label }}</TabsTrigger
        ></TabsList
      ></Tabs
    >
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ShaderBackground, type ShaderBackgroundVariant } from "@orvui/vue/motion/shader-background";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
import { useReducedMotion } from "@orvui/vue";
const variants: {
  id: string;
  value: ShaderBackgroundVariant;
  label: string;
  props: Record<string, unknown>;
}[] = [
  {
    id: "mesh-gradient",
    value: "mesh-gradient",
    label: "Mesh",
    props: {
      colors: ["#e0eaff", "#241d9a", "#f75092", "#9f50d3"],
      distortion: 0.8,
      swirl: 0.3,
      speed: 0.4,
    },
  },
  {
    id: "grain-gradient",
    value: "grain-gradient",
    label: "Grain",
    props: {
      colors: ["#7300ff", "#eba8ff", "#00bfff", "#2a00ff"],
      colorBack: "#000000",
      softness: 0.6,
      speed: 0.5,
    },
  },
  {
    id: "grain-sunset",
    value: "grain-gradient",
    label: "Grain — Sunset",
    props: {
      colors: ["#ff7a00", "#ff2e93", "#ffce54", "#8a2be2"],
      colorBack: "#1a0500",
      softness: 0.7,
      speed: 0.4,
    },
  },
  {
    id: "grain-pastel",
    value: "grain-gradient",
    label: "Grain — Pastel",
    props: {
      colors: ["#ffd6e8", "#c9e4ff", "#fff3c4", "#d9c9ff"],
      colorBack: "#ffffff",
      softness: 0.85,
      speed: 0.3,
    },
  },
  {
    id: "mesh-aurora",
    value: "mesh-gradient",
    label: "Mesh — Aurora",
    props: {
      colors: ["#00ffb2", "#0072ff", "#a200ff", "#001a2c"],
      distortion: 0.6,
      swirl: 0.5,
      speed: 0.3,
    },
  },
  {
    id: "mesh-citrus",
    value: "mesh-gradient",
    label: "Mesh — Citrus",
    props: {
      colors: ["#fff200", "#ff8a00", "#ff3d00", "#ffe08a"],
      distortion: 0.7,
      swirl: 0.4,
      speed: 0.5,
    },
  },
  {
    id: "warp",
    value: "warp",
    label: "Warp",
    props: {
      colors: ["#121212", "#9470ff", "#121212", "#8838ff"],
      speed: 0.4,
    },
  },
  {
    id: "waves",
    value: "waves",
    label: "Waves",
    props: { colorFront: "#ffbb00", colorBack: "#000000" },
  },
  {
    id: "voronoi",
    value: "voronoi",
    label: "Voronoi",
    props: { colors: ["#ff8247", "#ffe53d"], speed: 0.3 },
  },
  {
    id: "swirl",
    value: "swirl",
    label: "Swirl",
    props: {
      colorBack: "#180018",
      colors: ["#ffd1d1", "#ff8a8a", "#660000"],
      speed: 0.2,
    },
  },
  {
    id: "dot-orbit",
    value: "dot-orbit",
    label: "Orbit",
    props: {
      colors: ["#ffc96b", "#ff6200", "#ff2f00"],
      colorBack: "#000000",
      speed: 0.6,
    },
  },
  {
    id: "dot-grid",
    value: "dot-grid",
    label: "Grid",
    props: {
      colorBack: "#000000",
      colorFill: "#ffffff",
      colorStroke: "#ffaa00",
    },
  },
  {
    id: "smoke-ring",
    value: "smoke-ring",
    label: "Smoke",
    props: { colorBack: "#000000", colors: ["#ffffff"], speed: 0.3 },
  },
  {
    id: "static-radial-gradient",
    value: "static-radial-gradient",
    label: "Radial",
    props: { colorBack: "#000000", colors: ["#00bbff", "#00ffe1", "#ffffff"] },
  },
  {
    id: "neuro-noise",
    value: "neuro-noise",
    label: "Neuro",
    props: {
      colorFront: "#ffffff",
      colorMid: "#47a6ff",
      colorBack: "#000000",
      speed: 0.4,
    },
  },
  {
    id: "water",
    value: "water",
    label: "Water",
    props: { colorBack: "#909090", colorHighlight: "#ffffff", speed: 0.4 },
  },
  {
    id: "metaballs",
    value: "metaballs",
    label: "Metaballs",
    props: {
      colors: ["#ff5cf4", "#4d9eff", "#000000"],
      colorBack: "#000000",
      speed: 0.5,
    },
  },
  {
    id: "god-rays",
    value: "god-rays",
    label: "Rays",
    props: {
      colors: ["#ffcc66", "#ff6a00"],
      colorBack: "#000000",
      speed: 0.4,
    },
  },
  {
    id: "spiral",
    value: "spiral",
    label: "Spiral",
    props: { colors: ["#7a5cff", "#ff5ca6", "#000000"], speed: 0.4 },
  },
  {
    id: "dithering",
    value: "dithering",
    label: "Dither",
    props: {
      colorBack: "#000000",
      colorFront: "#00ff9d",
      speed: 0.4,
    },
  },
  {
    id: "pulsing-border",
    value: "pulsing-border",
    label: "Pulse",
    props: {
      colors: ["#00e5ff", "#7000ff", "#ff00c8"],
      colorBack: "#000000",
      speed: 0.5,
    },
  },
  {
    id: "color-panels",
    value: "color-panels",
    label: "Panels",
    props: { colors: ["#ff3d68", "#ffb800", "#3d7aff", "#00ffb2"], speed: 0.3 },
  },
  {
    id: "static-mesh-gradient",
    value: "static-mesh-gradient",
    label: "Static Mesh",
    props: { colors: ["#ff8a3d", "#ff3d9a", "#3d5aff", "#0a0a0a"] },
  },
  {
    id: "static-mesh-dusk",
    value: "static-mesh-gradient",
    label: "Static Mesh — Dusk",
    props: { colors: ["#2b1055", "#7597de", "#f6a1c8", "#0d0221"] },
  },
  {
    id: "radial-ember",
    value: "static-radial-gradient",
    label: "Radial — Ember",
    props: { colorBack: "#0a0000", colors: ["#ff5100", "#ffce00", "#4a0000"] },
  },
  {
    id: "simplex-noise",
    value: "simplex-noise",
    label: "Simplex",
    props: { colors: ["#ff6ec7", "#6ec7ff", "#000000"], speed: 0.4 },
  },
  {
    id: "perlin-noise",
    value: "perlin-noise",
    label: "Perlin",
    props: { colorFront: "#00ffd5", colorBack: "#000000", speed: 0.3 },
  },
];

const active = ref(variants[0]!.id), paused = ref(false);
const current = computed(() => variants.find(scene => scene.id === active.value) ?? variants[0]!);
const reduce = useReducedMotion();
let mounted = false;
let next: ReturnType<typeof setTimeout> | undefined;
function schedule() {
  clearTimeout(next);
  if (!mounted || reduce.value || paused.value) return;
  next = setTimeout(() => {
    const index = variants.findIndex(scene => scene.id === active.value);
    active.value = variants[(index + 1) % variants.length]!.id;
    schedule();
  }, 2400);
}
watch([reduce, paused], schedule);
onMounted(() => { mounted = true; schedule(); });
onBeforeUnmount(() => { mounted = false; clearTimeout(next); });
</script>
<template>
  <div
    class="flex w-full max-w-2xl flex-col gap-5 p-6"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div
      class="relative h-80 w-full overflow-hidden rounded-2xl border border-border"
    >
      <ShaderBackground
        :key="current.id"
        :variant="current.value"
        v-bind="current.props"
        class="absolute inset-0"
      />
    </div>
    <Tabs v-model="active"
      ><TabsList class="flex-wrap justify-center gap-2 rounded-2xl"
        ><TabsTrigger
          v-for="item in variants"
          :key="item.id"
          :value="item.id"
          class="px-4 py-2 text-sm"
          >{{ item.label }}</TabsTrigger
        ></TabsList
      ></Tabs
    >
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### ShaderBackground

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `"mesh-gradient" \| "swirl" \| "grain-gradient" \| "dot-grid" \| "dot-orbit" \| "warp" \| "waves" \| "water" \| "voronoi" \| "smoke-ring" \| "static-radial-gradient" \| "neuro-noise" \| "metaballs" \| "god-rays" \| "spiral" \| "dithering" \| "pulsing-border" \| "color-panels" \| "static-mesh-gradient" \| "simplex-noise" \| "perlin-noise"` | `"mesh-gradient"` | No | — |
| `speed` | `number` | — | No | — |
| `frame` | `number` | — | No | — |
| `fallback` | `string` | `"linear-gradient(135deg,#e0eaff,#9f50d3,#f75092)"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `fallback` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Shader Background

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Shader Background?**

Configure Shader Background through variant, speed, frame, fallback. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through fallback; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Cylinder Carousel](https://orvui.efu.me/en/components/motion/cylinder-carousel): Arrange gallery items on a concave or convex cylinder controlled by dragging.
- [Tilt Card](https://orvui.efu.me/en/components/motion/tilt-card): Tilt a card toward the pointer and move a highlight over its surface.
- [Marquee](https://orvui.efu.me/en/components/motion/marquee): Repeat a horizontal or vertical content strip with optional pause on hover.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/shader-background.json
- Documentation: https://orvui.efu.me/en/components/motion/shader-background
- `packages/vue/src/motion/shader-background/src/ShaderBackground.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

The bundled Paper Design shader runtime retains its separate license in `packages/vue/src/motion/shader-background/LICENSE.paper-design`.
