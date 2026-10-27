---
title: "Returns Calendar"
description: "Compare signed daily returns with a calendar, month totals and optional day content."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/returns-calendar"
markdown: "https://orvui.efu.me/en/charts/returns-calendar.md"
license: "MIT"
productVersion: "0.1.0"
---

# Returns Calendar

> Compare signed daily returns with a calendar, month totals and optional day content.

## Install

### Returns Calendar — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/returns-calendar.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

## Usage

### Returns Calendar

**Registry source**

```vue
<script setup lang="ts">
import { ReturnsCalendar } from "@/components/orvui/charts/returns-calendar";
const years = [2021, 2022, 2023, 2024, 2025];
let seed = 2021;
function sample() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
const returns = years.map((_, index) =>
  Array.from(
    { length: 12 },
    () =>
      Math.round(((index === 1 ? -1.6 : 0.9) + (sample() - 0.5) * 12) * 10) /
      10,
  ),
);
</script>
<template><ReturnsCalendar :years="years" :returns="returns" /></template>
```

**Package**

```vue
<script setup lang="ts">
import { ReturnsCalendar } from "@orvui/vue/charts/returns-calendar";
const years = [2021, 2022, 2023, 2024, 2025];
let seed = 2021;
function sample() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
const returns = years.map((_, index) =>
  Array.from(
    { length: 12 },
    () =>
      Math.round(((index === 1 ? -1.6 : 0.9) + (sample() - 0.5) * 12) * 10) /
      10,
  ),
);
</script>
<template><ReturnsCalendar :years="years" :returns="returns" /></template>
```

## API Reference

### ReturnsCalendar

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `years` | `number[]` | `[]` | No | Row labels, one per row of `returns`. |
| `returns` | `number[][]` | `[]` | No | `returns[year][month]` in percent, twelve months per row. |
| `className` | `string` | — | No | — |
| `selection` | `null \| ReturnsCalendarSelection` | — | No | — |
| `defaultSelection` | `null \| ReturnsCalendarSelection` | `null` | No | — |
| `onSelectionChange` | `(selection: ReturnsCalendarSelection \| null) => void` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:selection` | — | — |
| `selectionChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ReturnsCalendarGrid

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ReturnsCalendarTooltip

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `label: calendar.tipLabel`, `value: calendar.tipValue`, `note: calendar.tipNote` | — |

## About Returns Calendar

Compare signed daily returns with a calendar, month totals and optional day content.

### When to use it

- Use Returns Calendar when the interface needs this behavior: compare signed daily returns with a calendar, month totals and optional day content.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Returns Calendar?**

Use the scoped default slot to customize day content while keeping the day and its return value available.

**How does it connect to application state?**

Observe update:selection, selectionChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/returns-calendar.json
- Documentation: https://orvui.efu.me/en/charts/returns-calendar
- `packages/vue/src/charts/returns-calendar/src/ReturnsCalendar.vue`
- `packages/vue/src/charts/returns-calendar/src/ReturnsCalendarGrid.vue`
- `packages/vue/src/charts/returns-calendar/src/ReturnsCalendarTooltip.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
