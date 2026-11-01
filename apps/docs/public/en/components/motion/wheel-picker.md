---
title: "Wheel Picker"
description: "Select a value from a rotating wheel with momentum and row snapping."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/wheel-picker"
markdown: "https://orvui.efu.me/en/components/motion/wheel-picker.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Wheel Picker

> Select a value from a rotating wheel with momentum and row snapping.

<a id="when-to-use"></a>

## When to use it

- Use Wheel Picker when the interface needs this behavior: select a value from a rotating wheel with momentum and row snapping.

<a id="install"></a>
## Install

### Wheel Picker — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/wheel-picker.json https://orvui.efu.me/r/switch.json
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
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `motion-v@^1.10.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Wheel Picker

**Registry source**

```vue
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { WheelPicker } from "@/components/orvui/motion/wheel-picker";
import { Switch } from "@/components/orvui/motion/switch";
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = Array.from({ length: 60 }, (_, index) => String(index + 1980));
const month = ref("June");
const year = ref("2004");
const day = ref("9");
const sound = ref(false);
const days = computed(() => Array.from({ length: new Date(Number(year.value), months.indexOf(month.value) + 1, 0).getDate() }, (_, index) => String(index + 1)));
watch([day, days], () => { if (Number(day.value) > days.value.length) day.value = String(days.value.length); });
</script>
<template><div class="flex flex-col items-center gap-4"><span class="text-sm text-muted-foreground">Born <span class="font-medium text-foreground tabular-nums">{{ month }} {{ day }}, {{ year }}</span></span><div class="flex items-stretch gap-1 rounded-3xl border border-border bg-background p-2"><WheelPicker v-model="month" :options="months" class="w-32 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Month" /><WheelPicker v-model="day" :options="days" class="w-14 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Day" /><WheelPicker v-model="year" :options="years" class="w-20 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Year" /></div><Switch v-model="sound" label="Tick sound" class="origin-left scale-[0.85] [&_label]:text-sm" /></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { WheelPicker } from "@orvui/vue/motion/wheel-picker";
import { Switch } from "@orvui/vue/motion/switch";
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = Array.from({ length: 60 }, (_, index) => String(index + 1980));
const month = ref("June");
const year = ref("2004");
const day = ref("9");
const sound = ref(false);
const days = computed(() => Array.from({ length: new Date(Number(year.value), months.indexOf(month.value) + 1, 0).getDate() }, (_, index) => String(index + 1)));
watch([day, days], () => { if (Number(day.value) > days.value.length) day.value = String(days.value.length); });
</script>
<template><div class="flex flex-col items-center gap-4"><span class="text-sm text-muted-foreground">Born <span class="font-medium text-foreground tabular-nums">{{ month }} {{ day }}, {{ year }}</span></span><div class="flex items-stretch gap-1 rounded-3xl border border-border bg-background p-2"><WheelPicker v-model="month" :options="months" class="w-32 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Month" /><WheelPicker v-model="day" :options="days" class="w-14 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Day" /><WheelPicker v-model="year" :options="years" class="w-20 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Year" /></div><Switch v-model="sound" label="Tick sound" class="origin-left scale-[0.85] [&_label]:text-sm" /></div></template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `WheelPicker` | `v-model` | `string` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### WheelPicker

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options` | `WheelPickerOption[]` | — | Yes | — |
| `modelValue` | `string` | — | No | — |
| `defaultValue` | `string` | — | No | — |
| `visibleCount` | `number` | `5` | No | — |
| `itemHeight` | `number` | `36` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `sound` | `boolean` | `false` | No | — |
| `ariaLabel` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

<a id="about"></a>
## About Wheel Picker

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Wheel Picker?**

Configure Wheel Picker through options, modelValue, defaultValue, visibleCount, itemHeight, disabled, sound, ariaLabel. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Range Slider](https://orvui.efu.me/en/components/motion/range-slider): Adjust a numeric value on a track using drag gestures or keyboard steps.
- [Checkbox](https://orvui.efu.me/en/components/motion/checkbox): Represent checked, unchecked and mixed values with an animated check mark.
- [Radio Group](https://orvui.efu.me/en/components/motion/radio): Choose one value from a keyboard-navigable group of labeled options.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/wheel-picker.json
- Documentation: https://orvui.efu.me/en/components/motion/wheel-picker
- `packages/vue/src/motion/wheel-picker/src/WheelPicker.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
