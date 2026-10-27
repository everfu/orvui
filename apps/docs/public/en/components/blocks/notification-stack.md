---
title: "Notification Stack"
description: "Expand a compact stack of notifications into separately readable entries."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/notification-stack"
markdown: "https://orvui.efu.me/en/components/blocks/notification-stack.md"
license: "MIT"
productVersion: "0.1.0"
---

# Notification Stack

> Expand a compact stack of notifications into separately readable entries.

## Install

### Notification Stack — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/notification-stack.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Notification Stack

**Registry source**

```vue
<script setup lang="ts">
import { h } from "vue";
import { RotateCw } from "lucide-vue-next";
import { NotificationStack, type NotificationStackItem } from "@/components/orvui/blocks/notification-stack";
const notices = [
  [
    "catalog-retry",
    "Catalog refresh paused",
    "42s · Gateway timeout in phase 2",
  ],
  ["queue-delay", "Queue delay", "2m 11s · Sample indexing"],
  ["media-restored", "Media preview recovered", "5m · Missing file in /media"],
] as const;
const items: NotificationStackItem[] = notices.map(
  ([id, title, description], index) => ({
    id,
    title,
    description,
    ...(index === 0
      ? {
          trailing: () =>
            h(
              "span",
              {
                class:
                  "inline-flex items-center gap-1 text-amber-500 dark:text-amber-400",
              },
              [h(RotateCw, { class: "h-3.5 w-3.5", "aria-hidden": true }), "2"],
            ),
        }
      : {}),
  }),
);
</script>
<template>
  <div class="flex w-full items-center justify-center pt-52 pb-6">
    <NotificationStack :items="items" />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { h } from "vue";
import { RotateCw } from "lucide-vue-next";
import { NotificationStack, type NotificationStackItem } from "@orvui/vue/blocks/notification-stack";
const notices = [
  [
    "catalog-retry",
    "Catalog refresh paused",
    "42s · Gateway timeout in phase 2",
  ],
  ["queue-delay", "Queue delay", "2m 11s · Sample indexing"],
  ["media-restored", "Media preview recovered", "5m · Missing file in /media"],
] as const;
const items: NotificationStackItem[] = notices.map(
  ([id, title, description], index) => ({
    id,
    title,
    description,
    ...(index === 0
      ? {
          trailing: () =>
            h(
              "span",
              {
                class:
                  "inline-flex items-center gap-1 text-amber-500 dark:text-amber-400",
              },
              [h(RotateCw, { class: "h-3.5 w-3.5", "aria-hidden": true }), "2"],
            ),
        }
      : {}),
  }),
);
</script>
<template>
  <div class="flex w-full items-center justify-center pt-52 pb-6">
    <NotificationStack :items="items" />
  </div>
</template>
```

## API Reference

### NotificationStack

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `NotificationStackItem[]` | — | Yes | — |
| `expanded` | `boolean` | `undefined` | No | — |
| `defaultExpanded` | `boolean` | `false` | No | — |
| `maxVisible` | `number` | `3` | No | — |
| `collapsedLabel` | `string` | `"Notifications"` | No | — |
| `expandedLabel` | `string` | `"View all"` | No | — |
| `emptyLabel` | `string` | `"All caught up"` | No | — |
| `classNames` | `NotificationStackClassNames` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:expanded` | `[expanded: boolean]` | — |
| `expandedChange` | `[expanded: boolean]` | — |
| `viewAll` | `[]` | — |

## About Notification Stack

Expand a compact stack of notifications into separately readable entries.

### When to use it

- Use Notification Stack when the interface needs this behavior: expand a compact stack of notifications into separately readable entries.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Notification Stack?**

Configure Notification Stack through items, expanded, defaultExpanded, maxVisible, collapsedLabel, expandedLabel, emptyLabel, classNames. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:expanded, expandedChange, viewAll to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/notification-stack.json
- Documentation: https://orvui.efu.me/en/components/blocks/notification-stack
- `packages/vue/src/blocks/notification-stack/src/NotificationStack.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
