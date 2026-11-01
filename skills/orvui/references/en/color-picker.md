# Color Picker · orvui 0.1.1

## Selection and composition

Use Select for fixed options, Combobox for searchable single selection and Multi Select for multiple values. Use Switch for immediate settings and Checkbox for a value submitted with a form.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Color Picker"
description: "Edit a color with a two-dimensional field, channel inputs, presets and an eye dropper."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/color-picker"
markdown: "https://orvui.efu.me/en/components/motion/color-picker.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Color Picker

> Edit a color with a two-dimensional field, channel inputs, presets and an eye dropper.

<a id="when-to-use"></a>

## When to use it

- Use Color Picker when the interface needs this behavior: edit a color with a two-dimensional field, channel inputs, presets and an eye dropper.

<a id="install"></a>
## Install

### Color Picker — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/color-picker.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
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

<a id="examples"></a>
## Usage

<a id="default"></a>
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

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `ColorPicker` | `v-model` | `string` | `update:modelValue` |
| `ColorPicker` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
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

<a id="about"></a>
## About Color Picker

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Color Picker?**

Configure Color Picker through modelValue, value, defaultValue, open, defaultOpen, alpha, disabled, name, form. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valueChange, change, valueCommit, update:open, openChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Arc Picker](https://orvui.efu.me/en/components/motion/arc-picker): Move a curved list of labels through a fixed selection point using gestures or keys.
- [Adaptive Stepper](https://orvui.efu.me/en/components/motion/adaptive-stepper): Adjust a bounded number while the value uses the space released by unavailable actions.
- [Range Slider](https://orvui.efu.me/en/components/motion/range-slider): Adjust a numeric value on a track using drag gestures or keyboard steps.

<a id="licenses"></a>
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

