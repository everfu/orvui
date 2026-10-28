---
title: "Color Picker"
description: "Edit a color with a two-dimensional field, channel inputs, presets and an eye dropper."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/color-picker"
markdown: "https://orvui.efu.me/en/components/motion/color-picker.md"
license: "MIT"
productVersion: "0.1.0"
---

# Color Picker

> Edit a color with a two-dimensional field, channel inputs, presets and an eye dropper.

Edit a color with a two-dimensional field, channel inputs, presets and an eye dropper.

## When to use it

- Use Color Picker when the interface needs this behavior: edit a color with a two-dimensional field, channel inputs, presets and an eye dropper.

## Install

### Color Picker — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/color-picker.json
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

```bash
pnpm add motion-v@^1.10.0
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Color Picker

**Registry source**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { SPRING_SWAP } from "@/components/orvui/lib/ease";
import { useReducedMotion } from "@/components/orvui/lib/composables";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerArea,
  ColorPickerChannels,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerHexInput,
  ColorPickerHue,
  ColorPickerPreset,
  ColorPickerPresets,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from "@/components/orvui/motion/color-picker";
const color = ref("#3478f6");
const modes = ["hex", "rgb", "hsl"] as const;
const modeIndex = ref(0);
const format = computed(() => modes[modeIndex.value]!);
const next = computed(() => modes[(modeIndex.value + 1) % modes.length]!);
const reduced = useReducedMotion();
const presets = [
  ["#3478f6", "Blue"],
  ["#9270e8", "Purple"],
  ["#e66aa4", "Pink"],
  ["#e55656", "Red"],
  ["#ed9141", "Orange"],
  ["#e5b63c", "Amber"],
  ["#65a65a", "Green"],
  ["#169d83", "Teal"],
].map(([value, label]) => ({ value: value!, label: label! }));
function cycle() {
  modeIndex.value = (modeIndex.value + 1) % modes.length;
}
</script>
<template>
  <div class="flex min-h-[460px] w-full justify-center pt-2">
    <ColorPicker v-model="color" aria-label="Brand color"
      ><ColorPickerTrigger /><ColorPickerContent aria-label="Brand color"
        ><ColorPickerArea />
        <div class="flex items-center gap-3">
          <ColorPickerEyeDropper />
          <div class="flex flex-1 flex-col gap-3">
            <ColorPickerHue /><ColorPickerAlpha />
          </div>
        </div>
        <div class="flex items-start gap-1.5">
          <button
            type="button"
            @click="cycle"
            :aria-label="`Format ${format.toUpperCase()}, switch to ${next.toUpperCase()}`"
            class="relative inline-flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <AnimatePresence mode="popLayout" :initial="false"
              ><motion.span
                :key="format"
                :initial="{ opacity: 0, y: reduced ? 0 : 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0, y: reduced ? 0 : -10 }"
                :transition="SPRING_SWAP"
                >{{ format.toUpperCase() }}</motion.span
              ></AnimatePresence
            ></button
          ><ColorPickerHexInput v-if="format === 'hex'" /><ColorPickerChannels
            v-else
            :format="format"
          /><ColorPickerSwatch v-if="format === 'hex'" />
        </div>
        <ColorPickerPresets
          aria-label="Presets"
          class="justify-between px-0.5 pt-1"
          ><ColorPickerPreset
            v-for="preset in presets"
            :key="preset.value"
            v-bind="preset" /></ColorPickerPresets></ColorPickerContent
    ></ColorPicker>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { SPRING_SWAP } from "@orvui/vue";
import { useReducedMotion } from "@orvui/vue";
import { ColorPicker, ColorPickerAlpha, ColorPickerArea, ColorPickerChannels, ColorPickerContent, ColorPickerEyeDropper, ColorPickerHexInput, ColorPickerHue, ColorPickerPreset, ColorPickerPresets, ColorPickerSwatch, ColorPickerTrigger } from "@orvui/vue/motion/color-picker";
const color = ref("#3478f6");
const modes = ["hex", "rgb", "hsl"] as const;
const modeIndex = ref(0);
const format = computed(() => modes[modeIndex.value]!);
const next = computed(() => modes[(modeIndex.value + 1) % modes.length]!);
const reduced = useReducedMotion();
const presets = [
  ["#3478f6", "Blue"],
  ["#9270e8", "Purple"],
  ["#e66aa4", "Pink"],
  ["#e55656", "Red"],
  ["#ed9141", "Orange"],
  ["#e5b63c", "Amber"],
  ["#65a65a", "Green"],
  ["#169d83", "Teal"],
].map(([value, label]) => ({ value: value!, label: label! }));
function cycle() {
  modeIndex.value = (modeIndex.value + 1) % modes.length;
}
</script>
<template>
  <div class="flex min-h-[460px] w-full justify-center pt-2">
    <ColorPicker v-model="color" aria-label="Brand color"
      ><ColorPickerTrigger /><ColorPickerContent aria-label="Brand color"
        ><ColorPickerArea />
        <div class="flex items-center gap-3">
          <ColorPickerEyeDropper />
          <div class="flex flex-1 flex-col gap-3">
            <ColorPickerHue /><ColorPickerAlpha />
          </div>
        </div>
        <div class="flex items-start gap-1.5">
          <button
            type="button"
            @click="cycle"
            :aria-label="`Format ${format.toUpperCase()}, switch to ${next.toUpperCase()}`"
            class="relative inline-flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <AnimatePresence mode="popLayout" :initial="false"
              ><motion.span
                :key="format"
                :initial="{ opacity: 0, y: reduced ? 0 : 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :exit="{ opacity: 0, y: reduced ? 0 : -10 }"
                :transition="SPRING_SWAP"
                >{{ format.toUpperCase() }}</motion.span
              ></AnimatePresence
            ></button
          ><ColorPickerHexInput v-if="format === 'hex'" /><ColorPickerChannels
            v-else
            :format="format"
          /><ColorPickerSwatch v-if="format === 'hex'" />
        </div>
        <ColorPickerPresets
          aria-label="Presets"
          class="justify-between px-0.5 pt-1"
          ><ColorPickerPreset
            v-for="preset in presets"
            :key="preset.value"
            v-bind="preset" /></ColorPickerPresets></ColorPickerContent
    ></ColorPicker>
  </div>
</template>
```

## API Reference

### ColorPicker

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | `props.value` | No | — |
| `value` | `string` | — | No | — |
| `defaultValue` | `string` | `"#3478f6"` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `alpha` | `boolean` | `true` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `name` | `string` | — | No | — |
| `form` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `valueChange` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |
| `update:open` | — | — |
| `openChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `hex: hex`, `hsva: displayHsva`, `set-color: setColor` | — |

### ColorPickerAlpha

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Opacity"` | No | — |

### ColorPickerArea

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Saturation and brightness"` | No | — |

### ColorPickerChannels

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `format` | `"rgb" \| "hsl"` | `"rgb"` | No | — |

### ColorPickerContent

### ColorPickerEyeDropper

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ColorPickerHexInput

### ColorPickerHue

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Hue"` | No | — |

### ColorPickerPreset

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | — |
| `label` | `string` | — | No | — |

### ColorPickerPresets

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ColorPickerSwatch

### ColorPickerTrigger

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## About Color Picker

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Color Picker?**

Configure Color Picker through modelValue, value, defaultValue, open, defaultOpen, alpha, disabled, name, form. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valueChange, change, valueCommit, update:open, openChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/color-picker.json
- Documentation: https://orvui.efu.me/en/components/motion/color-picker
- `packages/vue/src/motion/color-picker/src/ColorPicker.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerAlpha.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerArea.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerChannels.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerContent.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerEyeDropper.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerHexInput.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerHue.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerPreset.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerPresets.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerSwatch.vue`
- `packages/vue/src/motion/color-picker/src/ColorPickerTrigger.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
