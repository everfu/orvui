---
title: "Range Slider"
description: "Adjust a numeric value on a track using drag gestures or keyboard steps."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/range-slider"
markdown: "https://orvui.efu.me/en/components/motion/range-slider.md"
license: "MIT"
productVersion: "0.1.0"
---

# Range Slider

> Adjust a numeric value on a track using drag gestures or keyboard steps.

Adjust a numeric value on a track using drag gestures or keyboard steps.

## When to use it

- Use Range Slider when the interface needs this behavior: adjust a numeric value on a track using drag gestures or keyboard steps.

## Install

### Range Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider.json
```

### Inline Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider-inline.json
```

### Range Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider.json
```

### Fluid Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider-fluid.json
```

### Wave Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider-wave.json
```

### Bubble Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider-bubble.json
```

### Ruler Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider-ruler.json
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

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Range Slider

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RangeSlider } from "@/components/orvui/motion/range-slider";
const amount = ref(40);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-3"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Drag the handle</span><span class="tabular-nums text-foreground">{{ amount }}</span></div><RangeSlider v-model="amount" :step="5" aria-label="Value" /></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RangeSlider } from "@orvui/vue/motion/range-slider";
const amount = ref(40);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-3"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Drag the handle</span><span class="tabular-nums text-foreground">{{ amount }}</span></div><RangeSlider v-model="amount" :step="5" aria-label="Value" /></div></template>
```

### Inline Slider

Keep the label and value inside the track while nearby ticks move aside for the handle.

**Registry source**

```vue
<script setup lang="ts">
import { InlineSlider } from "@/components/orvui/motion/range-slider";
const spokenPixels = (value: number) => `${value} pixels`;
</script>
<template><div class="w-full max-w-sm"><InlineSlider :default-value="48" :min="8" :max="128" :step="8" label="Icon size" aria-label="Icon size" :format-value-text="spokenPixels" /></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { InlineSlider } from "@orvui/vue/motion/range-slider";
const spokenPixels = (value: number) => `${value} pixels`;
</script>
<template><div class="w-full max-w-sm"><InlineSlider :default-value="48" :min="8" :max="128" :step="8" label="Icon size" aria-label="Icon size" :format-value-text="spokenPixels" /></div></template>
```

### Range Slider

Snap a narrow handle between marked steps and emphasize each landing.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RangeSlider } from "@/components/orvui/motion/range-slider";
const amount = ref(40);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-3"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Drag the handle</span><span class="tabular-nums text-foreground">{{ amount }}</span></div><RangeSlider v-model="amount" :step="5" aria-label="Value" /></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RangeSlider } from "@orvui/vue/motion/range-slider";
const amount = ref(40);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-3"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Drag the handle</span><span class="tabular-nums text-foreground">{{ amount }}</span></div><RangeSlider v-model="amount" :step="5" aria-label="Value" /></div></template>
```

### Fluid Slider

Represent the value with a rounded moving fill instead of a separate thumb.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { FluidSlider } from "@/components/orvui/motion/range-slider";
const brightness = ref(35);
</script>
<template><div class="w-full max-w-sm"><FluidSlider v-model="brightness" label="Brightness" aria-label="Brightness" /></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { FluidSlider } from "@orvui/vue/motion/range-slider";
const brightness = ref(35);
</script>
<template><div class="w-full max-w-sm"><FluidSlider v-model="brightness" label="Brightness" aria-label="Brightness" /></div></template>
```

### Wave Slider

Raise neighboring bars around the handle to form a traveling wave.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { WaveSlider } from "@/components/orvui/motion/range-slider";
const gain = ref(45);
</script>
<template><div class="flex w-full max-w-md flex-col gap-2"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Gain</span><span class="tabular-nums text-foreground">{{ gain }}</span></div><WaveSlider v-model="gain" aria-label="Gain" /></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { WaveSlider } from "@orvui/vue/motion/range-slider";
const gain = ref(45);
</script>
<template><div class="flex w-full max-w-md flex-col gap-2"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Gain</span><span class="tabular-nums text-foreground">{{ gain }}</span></div><WaveSlider v-model="gain" aria-label="Gain" /></div></template>
```

### Bubble Slider

Lift a value bubble while dragging and let its tilt respond to movement.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BubbleSlider } from "@/components/orvui/motion/range-slider";
const amount = ref(28);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-1"><span class="text-sm text-muted-foreground">Drag fast and the bubble leans</span><BubbleSlider v-model="amount" aria-label="Value" /></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BubbleSlider } from "@orvui/vue/motion/range-slider";
const amount = ref(28);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-1"><span class="text-sm text-muted-foreground">Drag fast and the bubble leans</span><BubbleSlider v-model="amount" aria-label="Value" /></div></template>
```

### Ruler Slider

Keep the pointer still while the marked ruler moves beneath it.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RulerSlider } from "@/components/orvui/motion/range-slider";
const weight = ref(72.5);
</script>
<template><div class="w-full max-w-sm"><RulerSlider v-model="weight" :min="40" :max="120" :step=".5" :gap="12" :major-every="10" unit="kg" aria-label="Weight" /></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RulerSlider } from "@orvui/vue/motion/range-slider";
const weight = ref(72.5);
</script>
<template><div class="w-full max-w-sm"><RulerSlider v-model="weight" :min="40" :max="120" :step=".5" :gap="12" :major-every="10" unit="kg" aria-label="Weight" /></div></template>
```

## API Reference

### RangeSlider

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | No | — |
| `defaultValue` | `number` | `0` | No | — |
| `min` | `number` | `0` | No | — |
| `max` | `number` | `100` | No | — |
| `step` | `number` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `ariaLabel` | `string` | — | No | — |
| `formatValueText` | `(value: number) => string` | — | No | — |
| `showTicks` | `boolean` | `true` | No | — |
| `name` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |

### InlineSlider

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | No | — |
| `defaultValue` | `number` | — | No | — |
| `min` | `number` | — | No | — |
| `max` | `number` | — | No | — |
| `step` | `number` | `1` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `ariaLabel` | `string` | — | No | — |
| `formatValueText` | `(value: number) => string` | — | No | — |
| `label` | `string` | — | Yes | — |
| `format` | `(v: number) => string` | `String` | No | — |
| `showTicks` | `boolean` | `true` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |

### FluidSlider

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | No | — |
| `defaultValue` | `number` | `0` | No | — |
| `min` | `number` | `0` | No | — |
| `max` | `number` | `100` | No | — |
| `step` | `number` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `ariaLabel` | `string` | — | No | — |
| `formatValueText` | `(value: number) => string` | — | No | — |
| `label` | `string` | — | No | — |
| `format` | `(v: number) => string` | `` (v: number) => `${v}%` `` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |

### WaveSlider

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | No | — |
| `defaultValue` | `number` | `0` | No | — |
| `min` | `number` | `0` | No | — |
| `max` | `number` | `100` | No | — |
| `step` | `number` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `ariaLabel` | `string` | — | No | — |
| `formatValueText` | `(value: number) => string` | — | No | — |
| `bars` | `number` | `32` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |

### BubbleSlider

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | No | — |
| `defaultValue` | `number` | `0` | No | — |
| `min` | `number` | `0` | No | — |
| `max` | `number` | `100` | No | — |
| `step` | `number` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `ariaLabel` | `string` | — | No | — |
| `formatValueText` | `(value: number) => string` | — | No | — |
| `format` | `(v: number) => string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |

### RulerSlider

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | No | — |
| `defaultValue` | `number` | — | No | — |
| `min` | `number` | — | No | — |
| `max` | `number` | — | No | — |
| `step` | `number` | `1` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `ariaLabel` | `string` | — | No | — |
| `formatValueText` | `(value: number) => string` | ``(props.unit ? (value: number) => `${value.toFixed(decimals.value)} ${props.unit}` : undefined)`` | No | — |
| `gap` | `number` | `14` | No | — |
| `majorEvery` | `number` | `5` | No | — |
| `unit` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |

## About Range Slider

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Range Slider?**

Use modelValue with update:modelValue for a controlled value. The defaultValue prop initializes an uncontrolled slider.

**How does it connect to application state?**

Observe update:modelValue, change, valueCommit to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/range-slider.json
- Documentation: https://orvui.efu.me/en/components/motion/range-slider
- `packages/vue/src/motion/range-slider/src/RangeSlider.vue`
- `packages/vue/src/motion/range-slider/src/InlineSlider.vue`
- `packages/vue/src/motion/range-slider/src/FluidSlider.vue`
- `packages/vue/src/motion/range-slider/src/WaveSlider.vue`
- `packages/vue/src/motion/range-slider/src/BubbleSlider.vue`
- `packages/vue/src/motion/range-slider/src/RulerSlider.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
