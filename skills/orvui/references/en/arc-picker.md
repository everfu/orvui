# Arc Picker · orvui 0.1.1

## Selection and composition

Use Select for fixed options, Combobox for searchable single selection and Multi Select for multiple values. Use Switch for immediate settings and Checkbox for a value submitted with a form.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Arc Picker"
description: "Move a curved list of labels through a fixed selection point using gestures or keys."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/arc-picker"
markdown: "https://orvui.efu.me/en/components/motion/arc-picker.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Arc Picker

> Move a curved list of labels through a fixed selection point using gestures or keys.

<a id="when-to-use"></a>

## When to use it

- Use Arc Picker when the interface needs this behavior: move a curved list of labels through a fixed selection point using gestures or keys.

<a id="install"></a>
## Install

### Arc Picker — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/arc-picker.json https://orvui.efu.me/r/button.json
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

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Arc Picker

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ArcPicker, type ArcPickerSide } from "@/components/orvui/motion/arc-picker";
import { Button } from "@/components/orvui/motion/button";
const directions = ["top", "bottom", "left", "right"] as const;
const times = ["First light", "Dawn", "Daybreak", "Sunrise", "Early morning", "Morning", "Late morning", "Midday", "Noon", "Afternoon", "Golden hour", "Sunset", "Blue hour", "Dusk", "Twilight", "Evening", "Nightfall", "Night", "Late night", "Midnight", "Deep night", "Starlight"];
const options = times.map(label => ({ label, value: label.toLowerCase().replaceAll(" ", "-") }));
const value = ref("golden-hour");
const side = ref<ArcPickerSide>("right");
</script>
<template><div class="w-full max-w-xl py-5"><fieldset class="flex flex-wrap items-center justify-center gap-1 px-4"><legend class="sr-only">Curve side</legend><Button v-for="direction in directions" :key="direction" size="sm" :variant="side === direction ? 'secondary' : 'ghost'" :aria-pressed="side === direction" @click="side = direction" class="capitalize">{{ direction }}</Button></fieldset><div class="my-8 flex min-h-108 items-center sm:my-10"><ArcPicker v-model="value" :options="options" aria-label="Time of day" :side="side" :radius="260" :visible-count="9" :item-height="48" /></div><p class="px-6 text-center text-xs text-muted-foreground">Drag {{ side === 'top' || side === 'bottom' ? 'horizontally' : 'vertically' }}, scroll or use the arrow keys.</p></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ArcPicker, type ArcPickerSide } from "@orvui/vue/motion/arc-picker";
import { Button } from "@orvui/vue/motion/button";
const directions = ["top", "bottom", "left", "right"] as const;
const times = ["First light", "Dawn", "Daybreak", "Sunrise", "Early morning", "Morning", "Late morning", "Midday", "Noon", "Afternoon", "Golden hour", "Sunset", "Blue hour", "Dusk", "Twilight", "Evening", "Nightfall", "Night", "Late night", "Midnight", "Deep night", "Starlight"];
const options = times.map(label => ({ label, value: label.toLowerCase().replaceAll(" ", "-") }));
const value = ref("golden-hour");
const side = ref<ArcPickerSide>("right");
</script>
<template><div class="w-full max-w-xl py-5"><fieldset class="flex flex-wrap items-center justify-center gap-1 px-4"><legend class="sr-only">Curve side</legend><Button v-for="direction in directions" :key="direction" size="sm" :variant="side === direction ? 'secondary' : 'ghost'" :aria-pressed="side === direction" @click="side = direction" class="capitalize">{{ direction }}</Button></fieldset><div class="my-8 flex min-h-108 items-center sm:my-10"><ArcPicker v-model="value" :options="options" aria-label="Time of day" :side="side" :radius="260" :visible-count="9" :item-height="48" /></div><p class="px-6 text-center text-xs text-muted-foreground">Drag {{ side === 'top' || side === 'bottom' ? 'horizontally' : 'vertically' }}, scroll or use the arrow keys.</p></div></template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `ArcPicker` | `v-model` | `string` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### ArcPicker

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options` | `readonly ArcPickerOption[]` | — | Yes | — |
| `modelValue` | `string` | — | No | — |
| `defaultValue` | `string` | `props.options.find(option => !option.disabled)?.value` | No | — |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"right"` | No | — |
| `radius` | `number` | `280` | No | — |
| `itemHeight` | `number` | `48` | No | — |
| `visibleCount` | `number` | `7` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `name` | `string` | — | No | — |
| `ariaLabel` | `string` | `"Choose an option"` | No | — |
| `ariaDescribedby` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

<a id="about"></a>
## About Arc Picker

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Arc Picker?**

Configure Arc Picker through options, modelValue, defaultValue, side, radius, itemHeight, visibleCount, disabled, name, ariaLabel, ariaDescribedby. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Color Picker](https://orvui.efu.me/en/components/motion/color-picker): Edit a color with a two-dimensional field, channel inputs, presets and an eye dropper.
- [Range Slider](https://orvui.efu.me/en/components/motion/range-slider): Adjust a numeric value on a track using drag gestures or keyboard steps.
- [Wheel Picker](https://orvui.efu.me/en/components/motion/wheel-picker): Select a value from a rotating wheel with momentum and row snapping.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/arc-picker.json
- Documentation: https://orvui.efu.me/en/components/motion/arc-picker
- `packages/vue/src/motion/arc-picker/src/ArcPicker.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

