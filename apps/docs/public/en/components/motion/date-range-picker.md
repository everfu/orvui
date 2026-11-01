---
title: "Date Range Picker"
description: "Choose the beginning and end of a date interval in an inline or floating calendar."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/date-range-picker"
markdown: "https://orvui.efu.me/en/components/motion/date-range-picker.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Date Range Picker

> Choose the beginning and end of a date interval in an inline or floating calendar.

<a id="when-to-use"></a>

## When to use it

- Use Date Range Picker when the interface needs this behavior: choose the beginning and end of a date interval in an inline or floating calendar.

<a id="install"></a>
## Install

### Date Range Picker — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/date-range-picker.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Date Range Picker

**Registry source**

```vue
<script setup lang="ts">
import {
  DateRangePicker,
  DateRangePickerCalendar,
  DateRangePickerClear,
  DateRangePickerContent,
  DateRangePickerFooter,
  DateRangePickerGrid,
  DateRangePickerHeader,
  DateRangePickerSelection,
  DateRangePickerTrigger,
} from "@/components/orvui/motion/date-range-picker";
const reporting = {
  label: "Reporting period",
  defaultMonth: "2026-10-25",
  defaultValue: { from: "2026-10-19", to: "2026-10-25" },
  max: "2026-10-25",
};
</script>
<template>
  <DateRangePicker v-bind="reporting"
    ><DateRangePickerTrigger /><DateRangePickerContent
      ><DateRangePickerCalendar class="w-full rounded-none border-0"
        ><DateRangePickerHeader /><DateRangePickerGrid /><DateRangePickerFooter
          ><div class="flex items-center justify-between gap-2">
            <DateRangePickerSelection /><DateRangePickerClear /></div></DateRangePickerFooter></DateRangePickerCalendar></DateRangePickerContent
  ></DateRangePicker>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { DateRangePicker, DateRangePickerCalendar, DateRangePickerClear, DateRangePickerContent, DateRangePickerFooter, DateRangePickerGrid, DateRangePickerHeader, DateRangePickerSelection, DateRangePickerTrigger } from "@orvui/vue/motion/date-range-picker";
const reporting = {
  label: "Reporting period",
  defaultMonth: "2026-10-25",
  defaultValue: { from: "2026-10-19", to: "2026-10-25" },
  max: "2026-10-25",
};
</script>
<template>
  <DateRangePicker v-bind="reporting"
    ><DateRangePickerTrigger /><DateRangePickerContent
      ><DateRangePickerCalendar class="w-full rounded-none border-0"
        ><DateRangePickerHeader /><DateRangePickerGrid /><DateRangePickerFooter
          ><div class="flex items-center justify-between gap-2">
            <DateRangePickerSelection /><DateRangePickerClear /></div></DateRangePickerFooter></DateRangePickerCalendar></DateRangePickerContent
  ></DateRangePicker>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `DateRangePicker` | `v-model` | `null \| DateRange` | `update:modelValue` |
| `DateRangePicker` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### DateRangePicker

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `null \| DateRange` | — | No | — |
| `value` | `null \| DateRange` | — | No | — |
| `defaultValue` | `null \| DateRange` | `null` | No | — |
| `defaultMonth` | `string` | `value.value?.from` | No | — |
| `min` | `string` | `"0000-01-01"` | No | — |
| `max` | `string` | `"9999-12-31"` | No | — |
| `isDateDisabled` | `(date: string) => boolean` | — | No | — |
| `presets` | `DateRangePreset[]` | — | No | — |
| `locale` | `string` | `"en-US"` | No | — |
| `label` | `string` | `"Choose a date range"` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `autoFocus` | `boolean` | `false` | No | — |
| `showSummary` | `boolean` | `true` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `closeOnSelect` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `valueChange` | — | — |
| `change` | — | — |
| `update:open` | — | — |
| `openChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value`, `select-date: state.select`, `clear: state.clear` | — |

### DateRangePickerCalendar

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `showSummary` | `boolean` | `undefined` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DateRangePickerClear

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DateRangePickerContent

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `autoFocus` | `boolean` | `true` | No | — |
| `onOpenAutoFocus` | `(content: HTMLDivElement) => void` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DateRangePickerFooter

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `(props: {}) => any` | — | — |

### DateRangePickerGrid

### DateRangePickerHeader

### DateRangePickerSelection

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value` | — |

### DateRangePickerTrigger

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Select dates"` | No | — |
| `disabled` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DateRangePickerSummary

### DateRangePickerPresets

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DateRangePickerPreset

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `DateRange` | — | Yes | — |
| `label` | `string` | `root.value?.textContent?.trim()` | No | — |
| `disabled` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Date Range Picker

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Date Range Picker?**

Configure Date Range Picker through modelValue, value, defaultValue, defaultMonth, min, max, isDateDisabled, presets, locale, label, disabled, autoFocus, showSummary, open, defaultOpen, closeOnSelect. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valueChange, change, update:open, openChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Card](https://orvui.efu.me/en/components/motion/card): Assemble a card from heading, content, actions and footer parts with optional selection.
- [Sortable List](https://orvui.efu.me/en/components/motion/sortable-stack): Reorder a list with pointer or keyboard input and offer an undo operation.
- [Color Picker](https://orvui.efu.me/en/components/motion/color-picker): Edit a color with a two-dimensional field, channel inputs, presets and an eye dropper.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/date-range-picker.json
- Documentation: https://orvui.efu.me/en/components/motion/date-range-picker
- `packages/vue/src/motion/date-range-picker/src/DateRangePicker.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerCalendar.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerClear.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerContent.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerFooter.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerGrid.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerHeader.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerSelection.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerTrigger.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerSummary.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerPresets.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerPreset.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
