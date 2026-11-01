# Heat Calendar · orvui 0.1.1

## Selection and composition

Choose by data relationship: Donut for proportions, Funnel for stage conversion and Sankey for flows. Keep time, units and axis ranges consistent in financial charts.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Heat Calendar"
description: "Show daily activity in a compact calendar grid with exact values available on inspection."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/heat-calendar"
markdown: "https://orvui.efu.me/en/charts/heat-calendar.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Heat Calendar

> Show daily activity in a compact calendar grid with exact values available on inspection.

<a id="when-to-use"></a>

## When to use it

- Use Heat Calendar when the interface needs this behavior: show daily activity in a compact calendar grid with exact values available on inspection.

<a id="install"></a>
## Install

### Heat Calendar — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/heat-calendar.json
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

<a id="examples"></a>
## Usage

<a id="default"></a>
### Heat Calendar

**Registry source**

```vue
<script setup lang="ts">
import { HeatCalendar } from "@/components/orvui/charts/heat-calendar";
const values = Array.from({ length: 16 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const noise = Math.sin(week * 12.9898 + day * 78.233) * 43758.5453;
    const intensity = noise - Math.floor(noise);
    return day >= 5 ? Math.max(0, intensity - 0.55) * 1.4 : intensity;
  }),
);
const end = new Date("2026-10-25T00:00:00Z");
</script>
<template>
  <HeatCalendar
    unit="commits"
    :weeks="16"
    :max-count="14"
    :values="values"
    :end-date="end"
  />
</template>
```

**Package**

```vue
<script setup lang="ts">
import { HeatCalendar } from "@orvui/vue/charts/heat-calendar";
const values = Array.from({ length: 16 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const noise = Math.sin(week * 12.9898 + day * 78.233) * 43758.5453;
    const intensity = noise - Math.floor(noise);
    return day >= 5 ? Math.max(0, intensity - 0.55) * 1.4 : intensity;
  }),
);
const end = new Date("2026-10-25T00:00:00Z");
</script>
<template>
  <HeatCalendar
    unit="commits"
    :weeks="16"
    :max-count="14"
    :values="values"
    :end-date="end"
  />
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `HeatCalendar` | `v-model:selection` | `null \| HeatCalendarSelection` | `update:selection` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### HeatCalendar

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `unit` | `string` | `"commits"` | No | Noun after every count, e.g. "commits", "ships". |
| `weeks` | `number` | `16` | No | Number of week columns. |
| `maxCount` | `number` | `14` | No | Count a cell at intensity 1 stands for; a cell reads `intensity × maxCount`. |
| `values` | `number[][]` | — | No | `values[week][day]` intensities in 0..1, seven days per week. Missing values are zero. |
| `endDate` | `Date` | — | No | Last UTC calendar day of the grid. Defaults to today after mount; explicit dates render identically in every timezone. |
| `color` | `string` | `"var(--accent)"` | No | The single hue. Any CSS color; magnitude maps to its strength, never to a second color. |
| `className` | `string` | — | No | — |
| `selection` | `null \| HeatCalendarSelection` | — | No | Controlled selection; null clears it. Cell coordinates are zero-based week/day (Monday first). |
| `defaultSelection` | `null \| HeatCalendarSelection` | `null` | No | — |
| `onSelectionChange` | `(selection: HeatCalendarSelection \| null) => void` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:selection` | — | — |
| `selectionChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### HeatCalendarGrid

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### HeatCalendarLegend

### HeatCalendarTooltip

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `tooltip: calendar.tooltip` | — |

<a id="about"></a>
## About Heat Calendar

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Heat Calendar?**

Configure Heat Calendar through unit, weeks, maxCount, values, endDate, color, className, selection, defaultSelection, onSelectionChange. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:selection, selectionChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Returns Calendar](https://orvui.efu.me/en/charts/returns-calendar): Compare signed daily returns with a calendar, month totals and optional day content.
- [Price Target Fan](https://orvui.efu.me/en/charts/price-target-fan): Compare price forecasts around a shared origin using projected target paths.
- [Treemap](https://orvui.efu.me/en/charts/treemap): Compare hierarchical values using nested rectangles whose area follows each value.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/heat-calendar.json
- Documentation: https://orvui.efu.me/en/charts/heat-calendar
- `packages/vue/src/charts/heat-calendar/src/HeatCalendar.vue`
- `packages/vue/src/charts/heat-calendar/src/HeatCalendarGrid.vue`
- `packages/vue/src/charts/heat-calendar/src/HeatCalendarLegend.vue`
- `packages/vue/src/charts/heat-calendar/src/HeatCalendarTooltip.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

