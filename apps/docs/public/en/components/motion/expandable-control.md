---
title: "Expandable Control"
description: "Expand a compact control to reveal a label or trailing action without losing its position."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/expandable-control"
markdown: "https://orvui.efu.me/en/components/motion/expandable-control.md"
license: "MIT"
productVersion: "0.1.0"
---

# Expandable Control

> Expand a compact control to reveal a label or trailing action without losing its position.

## Install

### Expandable Control — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/expandable-control.json
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

### Expandable Control

**Registry source**

```vue
<script setup lang="ts">
import { Bell, X } from "lucide-vue-next";
import { ExpandableButton, ExpandableChip } from "@/components/orvui/motion/expandable-control";
const notificationLabel = "Notifications";
</script>
<template><div class="flex flex-col items-center gap-6">
  <div class="flex items-center gap-2"><ExpandableButton :label="notificationLabel"><template #icon><Bell class="size-4" /></template></ExpandableButton></div>
  <div class="flex items-center gap-2"><ExpandableChip label="Vue" action-label="Remove Vue"><template #actionIcon><X class="size-3.5" /></template></ExpandableChip></div>
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { Bell, X } from "lucide-vue-next";
import { ExpandableButton, ExpandableChip } from "@orvui/vue/motion/expandable-control";
const notificationLabel = "Notifications";
</script>
<template><div class="flex flex-col items-center gap-6">
  <div class="flex items-center gap-2"><ExpandableButton :label="notificationLabel"><template #icon><Bell class="size-4" /></template></ExpandableButton></div>
  <div class="flex items-center gap-2"><ExpandableChip label="Vue" action-label="Remove Vue"><template #actionIcon><X class="size-3.5" /></template></ExpandableChip></div>
</div></template>
```

## API Reference

### ExpandableButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `expanded` | `boolean` | `undefined` | No | — |
| `defaultExpanded` | `boolean` | `false` | No | — |
| `icon` | `any` | — | No | — |
| `label` | `string` | `"Create new"` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:expanded` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `icon` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

### ExpandableChip

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `expanded` | `boolean` | `undefined` | No | — |
| `defaultExpanded` | `boolean` | `false` | No | — |
| `label` | `string` | — | Yes | — |
| `actionIcon` | `any` | — | No | — |
| `actionLabel` | `string` | `"Remove"` | No | — |
| `collapseOnAction` | `boolean` | `true` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `labelClassName` | `string` | — | No | — |
| `actionClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:expanded` | — | — |
| `action` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `actionIcon` | `() => VNodeChild` | — | — |

## About Expandable Control

Expand a compact control to reveal a label or trailing action without losing its position.

### When to use it

- Use Expandable Control when the interface needs this behavior: expand a compact control to reveal a label or trailing action without losing its position.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Expandable Control?**

Configure Expandable Control through expanded, defaultExpanded, icon, label, disabled, type. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:expanded to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/expandable-control.json
- Documentation: https://orvui.efu.me/en/components/motion/expandable-control
- `packages/vue/src/motion/expandable-control/src/ExpandableButton.vue`
- `packages/vue/src/motion/expandable-control/src/ExpandableChip.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
