---
title: "Expandable Tabs"
description: "Navigate an icon strip whose selected item expands to display its label."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/expandable-tabs"
markdown: "https://orvui.efu.me/en/components/blocks/expandable-tabs.md"
license: "MIT"
productVersion: "0.1.0"
---

# Expandable Tabs

> Navigate an icon strip whose selected item expands to display its label.

Navigate an icon strip whose selected item expands to display its label.

## When to use it

- Use Expandable Tabs when the interface needs this behavior: navigate an icon strip whose selected item expands to display its label.

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

After npm publication, use the package command below. Before publication, install the verified local archive.

```bash
pnpm add @orvui/vue
```

```bash
pnpm add ./orvui-vue-0.1.0.tgz
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

## Usage

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

## About Expandable Tabs

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Expandable Tabs?**

Configure Expandable Tabs through items, modelValue, defaultValue, classNames. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valueChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/expandable-tabs.json
- Documentation: https://orvui.efu.me/en/components/blocks/expandable-tabs
- `packages/vue/src/blocks/expandable-tabs/src/ExpandableTabs.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
