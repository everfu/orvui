---
title: "Bloom Menu"
description: "Open a group of actions around a shared center and restore focus when it closes."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/bloom-menu"
markdown: "https://orvui.efu.me/en/components/blocks/bloom-menu.md"
license: "MIT"
productVersion: "0.1.0"
---

# Bloom Menu

> Open a group of actions around a shared center and restore focus when it closes.

Open a group of actions around a shared center and restore focus when it closes.

## When to use it

- Use Bloom Menu when the interface needs this behavior: open a group of actions around a shared center and restore focus when it closes.

## Install

### Bloom Menu — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/bloom-menu.json
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

### Bloom Menu

**Registry source**

```vue
<script setup lang="ts">
import {
  FileText,
  LayoutGrid,
  Table,
  FolderClosed,
  Bell,
  Link,
} from "lucide-vue-next";
import { BloomMenu, type BloomMenuItem } from "@/components/orvui/blocks/bloom-menu";
const entries: BloomMenuItem[] = [
  { label: "Note", icon: FileText },
  { label: "Canvas", icon: LayoutGrid },
  { label: "Grid", icon: Table },
  { label: "Space", icon: FolderClosed },
  { label: "Alert", icon: Bell },
  { label: "URL", icon: Link },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center pt-24">
    <BloomMenu :items="entries" />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import {
  FileText,
  LayoutGrid,
  Table,
  FolderClosed,
  Bell,
  Link,
} from "lucide-vue-next";
import { BloomMenu, type BloomMenuItem } from "@orvui/vue/blocks/bloom-menu";
const entries: BloomMenuItem[] = [
  { label: "Note", icon: FileText },
  { label: "Canvas", icon: LayoutGrid },
  { label: "Grid", icon: Table },
  { label: "Space", icon: FolderClosed },
  { label: "Alert", icon: Bell },
  { label: "URL", icon: Link },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center pt-24">
    <BloomMenu :items="entries" />
  </div>
</template>
```

## API Reference

### BloomMenu

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `BloomMenuItem[]` | `() => [ { label: "Doc", icon: FileText }, { label: "Board", icon: LayoutGrid }, { label: "Table", icon: Table }, { label: "Folder", icon: FolderClosed }, { label: "Reminder", icon: Bell }, { label: "Link", icon: Link }, ]` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `select` | `[label: string]` | — |

## About Bloom Menu

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Bloom Menu?**

Configure Bloom Menu through items, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe select to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/bloom-menu.json
- Documentation: https://orvui.efu.me/en/components/blocks/bloom-menu
- `packages/vue/src/blocks/bloom-menu/src/BloomMenu.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
