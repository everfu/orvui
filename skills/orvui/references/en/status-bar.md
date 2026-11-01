# Status Bar · orvui 0.1.1

## Selection and composition

Choose by data relationship: Donut for proportions, Funnel for stage conversion and Sankey for flows. Keep time, units and axis ranges consistent in financial charts.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Status Bar"
description: "Summarize counts across named states in a proportional segmented bar."
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/charts/status-bar"
markdown: "https://orvui.efu.me/en/charts/status-bar.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Status Bar

> Summarize counts across named states in a proportional segmented bar.

<a id="when-to-use"></a>

## When to use it

- Use Status Bar when the interface needs this behavior: summarize counts across named states in a proportional segmented bar.

<a id="install"></a>
## Install

### Status Bar — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/status-bar.json https://orvui.efu.me/r/button.json
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

- `@floating-ui/dom@^1.7.0`
- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `tailwind-merge@^3.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Status Bar

**Registry source**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import {
  StatusBar,
  StatusBarPlot,
  StatusBarTooltip,
  StatusBarLegend,
  STATUS_BAR_STATUSES,
  type StatusBarDatum,
} from "@/components/orvui/charts/status-bar";
import { Button } from "@/components/orvui/motion/button";
const dateLabel = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const history: readonly StatusBarDatum[] = Array.from(
  { length: 48 },
  (_, index) => {
    const date = new Date(Date.UTC(2026, 7, 21 + index));
    const degraded = index === 8;
    return {
      id: date.toISOString().slice(0, 10),
      label: dateLabel.format(date),
      status: degraded ? "degraded" : "operational",
      description: degraded
        ? "Elevated response times for 12 minutes."
        : "All checks passed.",
    };
  },
);
const website = history.map((period) => ({
  ...period,
  status: "operational",
  description: "All checks passed.",
}));
const statuses = STATUS_BAR_STATUSES.slice(0, 3);
const incident = ref(false);
const replay = ref(0);
const api = computed(() =>
  history.map((period, index) => {
    if (!incident.value || index < 45) return period;
    return {
      ...period,
      status: index === 46 ? "outage" : "degraded",
      description:
        index === 46
          ? "Requests failed for 4 minutes."
          : "Elevated response times.",
    };
  }),
);
</script>

<template>
  <div class="w-full max-w-2xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <span class="text-sm text-muted-foreground">48 days of status</span>
      <div class="flex gap-1">
        <Button variant="ghost" size="sm" tabindex="0" @click="replay++"
          >Replay</Button
        ><Button
          variant="ghost"
          size="sm"
          tabindex="0"
          @click="incident = !incident"
          >{{ incident ? "Resolve incident" : "Simulate incident" }}</Button
        >
      </div>
    </div>
    <StatusBar
      :key="'api-' + replay"
      :data="api"
      :statuses="statuses"
      label="API status"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">API</span
        ><span class="text-muted-foreground">{{
          incident ? "Degraded" : "Operational"
        }}</span>
      </div>
      <StatusBarPlot /><StatusBarTooltip />
    </StatusBar>
    <StatusBar
      :key="'website-' + replay"
      class="border-t border-border pt-6"
      :data="website"
      :statuses="statuses"
      label="Website status"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">Website</span
        ><span class="text-muted-foreground">Operational</span>
      </div>
      <StatusBarPlot /><StatusBarLegend class="pt-2" /><StatusBarTooltip />
    </StatusBar>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { StatusBar, StatusBarPlot, StatusBarTooltip, StatusBarLegend, STATUS_BAR_STATUSES, type StatusBarDatum } from "@orvui/vue/charts/status-bar";
import { Button } from "@orvui/vue/motion/button";
const dateLabel = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const history: readonly StatusBarDatum[] = Array.from(
  { length: 48 },
  (_, index) => {
    const date = new Date(Date.UTC(2026, 7, 21 + index));
    const degraded = index === 8;
    return {
      id: date.toISOString().slice(0, 10),
      label: dateLabel.format(date),
      status: degraded ? "degraded" : "operational",
      description: degraded
        ? "Elevated response times for 12 minutes."
        : "All checks passed.",
    };
  },
);
const website = history.map((period) => ({
  ...period,
  status: "operational",
  description: "All checks passed.",
}));
const statuses = STATUS_BAR_STATUSES.slice(0, 3);
const incident = ref(false);
const replay = ref(0);
const api = computed(() =>
  history.map((period, index) => {
    if (!incident.value || index < 45) return period;
    return {
      ...period,
      status: index === 46 ? "outage" : "degraded",
      description:
        index === 46
          ? "Requests failed for 4 minutes."
          : "Elevated response times.",
    };
  }),
);
</script>

<template>
  <div class="w-full max-w-2xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <span class="text-sm text-muted-foreground">48 days of status</span>
      <div class="flex gap-1">
        <Button variant="ghost" size="sm" tabindex="0" @click="replay++"
          >Replay</Button
        ><Button
          variant="ghost"
          size="sm"
          tabindex="0"
          @click="incident = !incident"
          >{{ incident ? "Resolve incident" : "Simulate incident" }}</Button
        >
      </div>
    </div>
    <StatusBar
      :key="'api-' + replay"
      :data="api"
      :statuses="statuses"
      label="API status"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">API</span
        ><span class="text-muted-foreground">{{
          incident ? "Degraded" : "Operational"
        }}</span>
      </div>
      <StatusBarPlot /><StatusBarTooltip />
    </StatusBar>
    <StatusBar
      :key="'website-' + replay"
      class="border-t border-border pt-6"
      :data="website"
      :statuses="statuses"
      label="Website status"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">Website</span
        ><span class="text-muted-foreground">Operational</span>
      </div>
      <StatusBarPlot /><StatusBarLegend class="pt-2" /><StatusBarTooltip />
    </StatusBar>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `StatusBar` | `v-model:activeId` | `null \| string` | `update:activeId` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### StatusBar

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data` | `readonly StatusBarDatum[]` | — | Yes | — |
| `statuses` | `readonly StatusBarStatus[]` | `STATUS_BAR_STATUSES` | No | — |
| `label` | `string` | `"Status history"` | No | — |
| `activeId` | `null \| string` | — | No | — |
| `defaultActiveId` | `null \| string` | `null` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:activeId` | — | — |
| `activeChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### StatusBarPlot

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `barClassName` | `string` | — | No | — |
| `showLabels` | `boolean` | `true` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### StatusBarTooltip

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `datum: history.active.datum`, `status: history.active.status` | — |

### StatusBarLegend

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `showCounts` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Status Bar

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Status Bar?**

Configure Status Bar through data, statuses, label, activeId, defaultActiveId, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:activeId, activeChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Composition Chart](https://orvui.efu.me/en/charts/composition-chart): Compare contributions across categories with normalized bars or stacked areas.
- [Bump Chart](https://orvui.efu.me/en/charts/bump-chart): Follow changes in series rank over time and pin a series for closer inspection.
- [Funnel Chart](https://orvui.efu.me/en/charts/funnel-chart): Follow successive stages and inspect conversion or loss between adjacent steps.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/status-bar.json
- Documentation: https://orvui.efu.me/en/charts/status-bar
- `packages/vue/src/charts/status-bar/src/StatusBar.vue`
- `packages/vue/src/charts/status-bar/src/StatusBarPlot.vue`
- `packages/vue/src/charts/status-bar/src/StatusBarTooltip.vue`
- `packages/vue/src/charts/status-bar/src/StatusBarLegend.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

