# Expandable Tabs · orvui 0.1.1

## Selection and composition

Use Tabs for related views in one page, Breadcrumb for page hierarchy, Table of Contents for article navigation and Animated Sidebar for workspace sections.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Expandable Tabs"
description: "Navigate an icon strip whose selected item expands to display its label."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/expandable-tabs"
markdown: "https://orvui.efu.me/en/components/blocks/expandable-tabs.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Expandable Tabs

> Navigate an icon strip whose selected item expands to display its label.

<a id="when-to-use"></a>

## When to use it

- Use Expandable Tabs when the interface needs this behavior: navigate an icon strip whose selected item expands to display its label.

<a id="install"></a>
## Install

### Expandable Tabs — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/expandable-tabs.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
```

```bash
pnpm add lucide-vue-next@^0.468.0
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
### Expandable Tabs

**Registry source**

```vue
<script setup lang="ts">
import { h, type Component } from "vue";
import {
  BadgeCheck,
  Brush,
  CalendarClock,
  ChartSpline,
  ChevronRight,
  ClipboardCheck,
  CloudUpload,
  FileText,
  Gauge,
  GitBranch,
  Images,
  Inbox,
  Megaphone,
  MessageCircle,
  PackageOpen,
  RefreshCw,
  Rocket,
  Siren,
  SwatchBook,
  UploadCloud,
  Users,
  Webhook,
  Workflow,
} from "lucide-vue-next";
import { ExpandableTabs, type ExpandableTabsItem } from "@/components/orvui/blocks/expandable-tabs";
type MenuRow = readonly [Component, string];
function content(rows: readonly MenuRow[]) {
  return () =>
    h(
      "div",
      { class: "flex w-[17.125rem] flex-col gap-0.5" },
      rows.map(([icon, label]) =>
        h(
          "button",
          {
            key: label,
            type: "button",
            class:
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted",
          },
          [
            h(icon, { class: "h-4 w-4 text-muted-foreground" }),
            h("span", { class: "flex-1" }, label),
            h(ChevronRight, { class: "h-4 w-4 text-muted-foreground" }),
          ],
        ),
      ),
    );
}
const sections: readonly {
  id: string;
  label: string;
  icon: Component;
  rows: readonly MenuRow[];
}[] = [
  {
    id: "launch",
    label: "Launch",
    icon: Rocket,
    rows: [
      [FileText, "Release Brief"],
      [ClipboardCheck, "Launch Checklist"],
      [Megaphone, "Campaign Notes"],
      [CalendarClock, "Rollout Calendar"],
      [CloudUpload, "Ship Build"],
    ],
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: Inbox,
    rows: [
      [MessageCircle, "Client Feedback"],
      [Users, "Team Requests"],
      [BadgeCheck, "Approval Notes"],
    ],
  },
  {
    id: "flows",
    label: "Flows",
    icon: Workflow,
    rows: [
      [GitBranch, "Trigger Map"],
      [Webhook, "Webhook Runs"],
      [RefreshCw, "Retry Queue"],
    ],
  },
  {
    id: "assets",
    label: "Assets",
    icon: PackageOpen,
    rows: [
      [SwatchBook, "Brand Kit"],
      [Images, "Mockup Library"],
      [Brush, "Design Tokens"],
      [UploadCloud, "Export Queue"],
    ],
  },
  {
    id: "status",
    label: "Status",
    icon: ChartSpline,
    rows: [
      [Gauge, "Activation"],
      [ChartSpline, "Conversion"],
      [Siren, "Incidents"],
    ],
  },
];
const items: ExpandableTabsItem[] = sections.map(({ rows, ...section }) => ({
  ...section,
  content: content(rows),
}));
</script>

<template>
  <div class="flex min-h-88 w-full items-end justify-center">
    <ExpandableTabs :items="items" />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { h, type Component } from "vue";
import {
  BadgeCheck,
  Brush,
  CalendarClock,
  ChartSpline,
  ChevronRight,
  ClipboardCheck,
  CloudUpload,
  FileText,
  Gauge,
  GitBranch,
  Images,
  Inbox,
  Megaphone,
  MessageCircle,
  PackageOpen,
  RefreshCw,
  Rocket,
  Siren,
  SwatchBook,
  UploadCloud,
  Users,
  Webhook,
  Workflow,
} from "lucide-vue-next";
import { ExpandableTabs, type ExpandableTabsItem } from "@orvui/vue/blocks/expandable-tabs";
type MenuRow = readonly [Component, string];
function content(rows: readonly MenuRow[]) {
  return () =>
    h(
      "div",
      { class: "flex w-[17.125rem] flex-col gap-0.5" },
      rows.map(([icon, label]) =>
        h(
          "button",
          {
            key: label,
            type: "button",
            class:
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted",
          },
          [
            h(icon, { class: "h-4 w-4 text-muted-foreground" }),
            h("span", { class: "flex-1" }, label),
            h(ChevronRight, { class: "h-4 w-4 text-muted-foreground" }),
          ],
        ),
      ),
    );
}
const sections: readonly {
  id: string;
  label: string;
  icon: Component;
  rows: readonly MenuRow[];
}[] = [
  {
    id: "launch",
    label: "Launch",
    icon: Rocket,
    rows: [
      [FileText, "Release Brief"],
      [ClipboardCheck, "Launch Checklist"],
      [Megaphone, "Campaign Notes"],
      [CalendarClock, "Rollout Calendar"],
      [CloudUpload, "Ship Build"],
    ],
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: Inbox,
    rows: [
      [MessageCircle, "Client Feedback"],
      [Users, "Team Requests"],
      [BadgeCheck, "Approval Notes"],
    ],
  },
  {
    id: "flows",
    label: "Flows",
    icon: Workflow,
    rows: [
      [GitBranch, "Trigger Map"],
      [Webhook, "Webhook Runs"],
      [RefreshCw, "Retry Queue"],
    ],
  },
  {
    id: "assets",
    label: "Assets",
    icon: PackageOpen,
    rows: [
      [SwatchBook, "Brand Kit"],
      [Images, "Mockup Library"],
      [Brush, "Design Tokens"],
      [UploadCloud, "Export Queue"],
    ],
  },
  {
    id: "status",
    label: "Status",
    icon: ChartSpline,
    rows: [
      [Gauge, "Activation"],
      [ChartSpline, "Conversion"],
      [Siren, "Incidents"],
    ],
  },
];
const items: ExpandableTabsItem[] = sections.map(({ rows, ...section }) => ({
  ...section,
  content: content(rows),
}));
</script>

<template>
  <div class="flex min-h-88 w-full items-end justify-center">
    <ExpandableTabs :items="items" />
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `ExpandableTabs` | `v-model` | `null \| string` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### ExpandableTabs

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `ExpandableTabsItem[]` | — | Yes | — |
| `modelValue` | `null \| string` | — | No | — |
| `defaultValue` | `null \| string` | `null` | No | — |
| `classNames` | `ExpandableTabsClassNames` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `[value: string \| null]` | — |
| `valueChange` | `[value: string \| null]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `content` | — | `item: item`, `item: active` | — |

<a id="about"></a>
## About Expandable Tabs

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Expandable Tabs?**

Configure Expandable Tabs through items, modelValue, defaultValue, classNames. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valueChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Expandable Action Bar](https://orvui.efu.me/en/components/blocks/expandable-action-bar): Reveal labels around the active action in a compact row of icon controls.
- [Bloom Menu](https://orvui.efu.me/en/components/blocks/bloom-menu): Open a group of actions around a shared center and restore focus when it closes.
- [Overflow Actions](https://orvui.efu.me/en/components/blocks/overflow-actions): Expand a compact action track to expose controls that do not fit its resting width.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/expandable-tabs.json
- Documentation: https://orvui.efu.me/en/components/blocks/expandable-tabs
- `packages/vue/src/blocks/expandable-tabs/src/ExpandableTabs.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

