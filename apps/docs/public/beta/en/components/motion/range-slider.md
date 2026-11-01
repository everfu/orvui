---
title: "Range Slider"
description: "Adjust a numeric value on a track using drag gestures or keyboard steps."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/range-slider"
markdown: "https://orvui.efu.me/en/components/motion/range-slider.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Range Slider

> Adjust a numeric value on a track using drag gestures or keyboard steps.

<a id="when-to-use"></a>

## When to use it

- Use Range Slider when the interface needs this behavior: adjust a numeric value on a track using drag gestures or keyboard steps.

<a id="install"></a>
## Install

### Range Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/range-slider.json
```

### Inline Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/range-slider-inline.json
```

### Range Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/range-slider.json
```

### Fluid Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/range-slider-fluid.json
```

### Wave Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/range-slider-wave.json
```

### Bubble Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/range-slider-bubble.json
```

### Ruler Slider — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/range-slider-ruler.json
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

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
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

<a id="inline"></a>
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

<a id="stepped"></a>
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

<a id="fluid"></a>
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

<a id="wave"></a>
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

<a id="bubble"></a>
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

<a id="ruler"></a>
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

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `RangeSlider` | `v-model` | `number` | `update:modelValue` |
| `InlineSlider` | `v-model` | `number` | `update:modelValue` |
| `FluidSlider` | `v-model` | `number` | `update:modelValue` |
| `WaveSlider` | `v-model` | `number` | `update:modelValue` |
| `BubbleSlider` | `v-model` | `number` | `update:modelValue` |
| `RulerSlider` | `v-model` | `number` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
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

<a id="about"></a>
## About Range Slider

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Range Slider?**

Use modelValue with update:modelValue for a controlled value. The defaultValue prop initializes an uncontrolled slider.

**How does it connect to application state?**

Observe update:modelValue, change, valueCommit to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Wheel Picker](https://orvui.efu.me/en/components/motion/wheel-picker): Select a value from a rotating wheel with momentum and row snapping.
- [Switch](https://orvui.efu.me/en/components/motion/switch): Toggle a binary setting with a moving thumb and optional descriptive label.
- [Input](https://orvui.efu.me/en/components/motion/input): Edit text with optional labels, icons and validation feedback in a single field.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/range-slider.json
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
