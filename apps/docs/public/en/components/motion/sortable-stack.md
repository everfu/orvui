---
title: "Sortable List"
description: "Reorder a list with pointer or keyboard input and offer an undo operation."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/sortable-stack"
markdown: "https://orvui.efu.me/en/components/motion/sortable-stack.md"
license: "MIT"
productVersion: "0.1.0"
---

# Sortable List

> Reorder a list with pointer or keyboard input and offer an undo operation.

Reorder a list with pointer or keyboard input and offer an undo operation.

## When to use it

- Use Sortable List when the interface needs this behavior: reorder a list with pointer or keyboard input and offer an undo operation.

## Install

### Sortable List — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/sortable-stack.json
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

### Sortable List

**Registry source**

```vue
<script setup lang="ts">
import { Circle, FileText, Layers, Palette, Rocket } from "lucide-vue-next";
import { SortableList, SortableListGroup, SortableListItem, SortableListHandle, SortableListItemContent, SortableListUndo } from "@/components/orvui/motion/sortable-stack";
const priorities = [
  { id: "research", title: "Collect references", detail: "Find the right direction", icon: FileText, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: "design", title: "Explore the visual system", detail: "Type, color, and composition", icon: Palette, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { id: "build", title: "Build the first prototype", detail: "Make the interaction tangible", icon: Layers, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { id: "ship", title: "Ship something useful", detail: "Polish the details and release", icon: Rocket, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
];
</script>
<template>
  <div class="w-full max-w-md"><div class="mb-5 flex items-end justify-between gap-4 px-1"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">In the studio</p><h3 class="text-lg font-medium tracking-tight">Make room for what matters.</h3></div><span class="shrink-0 text-xs tabular-nums text-muted-foreground">04 tasks</span></div>
    <SortableList :default-items="priorities" label="Studio priorities" :get-item-label="item => item.title"><template #default="{ items }"><SortableListGroup><SortableListItem v-for="(item, index) in items" :key="item.id" :id="item.id"><SortableListHandle /><SortableListItemContent><div class="flex items-center gap-3"><span :class="['flex size-10 shrink-0 items-center justify-center rounded-xl', item.color]"><component :is="item.icon" :size="18" aria-hidden="true" /></span><div class="min-w-0 flex-1"><p class="text-sm font-medium">{{ item.title }}</p><p class="mt-0.5 text-xs text-muted-foreground">{{ item.detail }}</p></div><span class="text-[10px] tabular-nums text-muted-foreground">{{ String(index + 1).padStart(2, '0') }}</span><Circle :size="14" class="text-border" aria-hidden="true" /></div></SortableListItemContent></SortableListItem></SortableListGroup><SortableListUndo /></template></SortableList>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { Circle, FileText, Layers, Palette, Rocket } from "lucide-vue-next";
import { SortableList, SortableListGroup, SortableListItem, SortableListHandle, SortableListItemContent, SortableListUndo } from "@orvui/vue/motion/sortable-stack";
const priorities = [
  { id: "research", title: "Collect references", detail: "Find the right direction", icon: FileText, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: "design", title: "Explore the visual system", detail: "Type, color, and composition", icon: Palette, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { id: "build", title: "Build the first prototype", detail: "Make the interaction tangible", icon: Layers, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { id: "ship", title: "Ship something useful", detail: "Polish the details and release", icon: Rocket, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
];
</script>
<template>
  <div class="w-full max-w-md"><div class="mb-5 flex items-end justify-between gap-4 px-1"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">In the studio</p><h3 class="text-lg font-medium tracking-tight">Make room for what matters.</h3></div><span class="shrink-0 text-xs tabular-nums text-muted-foreground">04 tasks</span></div>
    <SortableList :default-items="priorities" label="Studio priorities" :get-item-label="item => item.title"><template #default="{ items }"><SortableListGroup><SortableListItem v-for="(item, index) in items" :key="item.id" :id="item.id"><SortableListHandle /><SortableListItemContent><div class="flex items-center gap-3"><span :class="['flex size-10 shrink-0 items-center justify-center rounded-xl', item.color]"><component :is="item.icon" :size="18" aria-hidden="true" /></span><div class="min-w-0 flex-1"><p class="text-sm font-medium">{{ item.title }}</p><p class="mt-0.5 text-xs text-muted-foreground">{{ item.detail }}</p></div><span class="text-[10px] tabular-nums text-muted-foreground">{{ String(index + 1).padStart(2, '0') }}</span><Circle :size="14" class="text-border" aria-hidden="true" /></div></SortableListItemContent></SortableListItem></SortableListGroup><SortableListUndo /></template></SortableList>
  </div>
</template>
```

## API Reference

### SortableList

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `any[]` | — | No | — |
| `items` | `any[]` | `model.value` | No | — |
| `defaultItems` | `any[]` | `() => []` | No | — |
| `getItemLabel` | `(item: any) => string` | — | No | — |
| `label` | `string` | `"Sortable items"` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `showUndo` | `boolean` | `true` | No | — |
| `itemClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `update:items` | — | — |
| `itemsChange` | — | — |
| `change` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `items: items`, `move-item: move`, `undo: undo` | — |
| `item` | — | `item: item`, `index: index` | — |

### SortableListGroup

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SortableListItem

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | — | Yes | — |
| `label` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SortableListHandle

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SortableListItemContent

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SortableListUndo

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## About Sortable List

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Sortable List?**

Configure Sortable List through modelValue, items, defaultItems, getItemLabel, label, disabled, showUndo, itemClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, update:items, itemsChange, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/sortable-stack.json
- Documentation: https://orvui.efu.me/en/components/motion/sortable-stack
- `packages/vue/src/motion/sortable-stack/src/SortableList.vue`
- `packages/vue/src/motion/sortable-stack/src/SortableListGroup.vue`
- `packages/vue/src/motion/sortable-stack/src/SortableListItem.vue`
- `packages/vue/src/motion/sortable-stack/src/SortableListHandle.vue`
- `packages/vue/src/motion/sortable-stack/src/SortableListItemContent.vue`
- `packages/vue/src/motion/sortable-stack/src/SortableListUndo.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
