---
title: "Expandable Action Bar"
description: "Reveal labels around the active action in a compact row of icon controls."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/expandable-action-bar"
markdown: "https://orvui.efu.me/en/components/blocks/expandable-action-bar.md"
license: "MIT"
productVersion: "0.1.0"
---

# Expandable Action Bar

> Reveal labels around the active action in a compact row of icon controls.

Reveal labels around the active action in a compact row of icon controls.

## When to use it

- Use Expandable Action Bar when the interface needs this behavior: reveal labels around the active action in a compact row of icon controls.

## Install

### Expandable Action Bar — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/expandable-action-bar.json
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
pnpm add lucide-vue-next@^0.468.0 motion-v@^1.10.0
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

### Expandable Action Bar

**Registry source**

```vue
<script setup lang="ts">
import { h, computed, ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Archive, Bell, Copy, Download, Send, Settings } from "lucide-vue-next";
import { ExpandableActionBar, type ExpandableActionBarItem } from "@/components/orvui/blocks/expandable-action-bar";
const expanded = ref(false),
  activeId = ref("send");
const descriptors = [
  {
    id: "send",
    label: "Send",
    icon: Send,
    shortcut: "S",
    motion: "motion-safe:group-hover:animate-action-send",
  },
  {
    id: "copy",
    label: "Copy",
    icon: Copy,
    shortcut: "C",
    motion: "motion-safe:group-hover:animate-action-copy",
  },
  {
    id: "download",
    label: "Export",
    icon: Download,
    shortcut: "E",
    motion: "motion-safe:group-hover:animate-action-download",
  },
  {
    id: "archive",
    label: "Archive",
    icon: Archive,
    motion: "motion-safe:group-hover:animate-action-archive",
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: Bell,
    badge: "3",
    motion: "origin-top motion-safe:group-hover:animate-action-bell",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    motion: "motion-safe:group-hover:animate-action-settings",
  },
];
const items = computed<ExpandableActionBarItem[]>(() =>
  descriptors.map(({ icon, motion: animation, ...item }) => ({
    ...item,
    active: item.id === activeId.value,
    icon: () => h(icon, { class: `h-4 w-4 ${animation}` }),
  })),
);
</script>
<template>
  <div class="flex min-h-72 w-full flex-col items-center justify-center gap-6">
    <div class="flex min-h-24 w-full items-center justify-center">
      <ExpandableActionBar
        :items="items"
        v-model:expanded="expanded"
        :active-id="activeId"
        @action="activeId = $event.id"
        :class-names="{ item: 'group' }"
      />
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <motion.button
        type="button"
        @click="expanded = !expanded"
        class="relative flex h-9 w-[110px] items-center justify-center overflow-hidden rounded-full border border-border bg-card text-xs font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
        :while-hover="{ scale: 1.02 }"
        :while-press="{ scale: 0.96 }"
        ><motion.div layout class="flex items-center gap-1.5"
          ><motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            :stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-3.5 w-3.5 shrink-0"
            ><motion.path
              :initial="false"
              :animate="{
                d: expanded ? 'M 10 20 L 10 14 L 4 14' : 'M 9 21 L 3 21 L 3 15',
              }"
              :transition="{
                type: 'spring',
                bounce: 0,
                duration: 0.3,
              }" /><motion.path
              :initial="false"
              :animate="{
                d: expanded ? 'M 14 4 L 14 10 L 20 10' : 'M 15 3 L 21 3 L 21 9',
              }"
              :transition="{ type: 'spring', bounce: 0, duration: 0.3 }" /><line
              x1="14"
              x2="21"
              y1="10"
              y2="3" /><line x1="3" x2="10" y1="21" y2="14" /></motion.svg
          ><AnimatePresence mode="popLayout" :initial="false"
            ><motion.span
              :key="expanded ? 'expanded' : 'collapsed'"
              :initial="{ opacity: 0, y: -25, filter: 'blur(4px)' }"
              :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
              :exit="{ opacity: 0, y: 25, filter: 'blur(4px)' }"
              :transition="{ type: 'spring', bounce: 0, duration: 0.3 }"
              >{{ expanded ? "Collapse" : "Expand" }}</motion.span
            ></AnimatePresence
          ></motion.div
        ></motion.button
      >
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { h, computed, ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Archive, Bell, Copy, Download, Send, Settings } from "lucide-vue-next";
import { ExpandableActionBar, type ExpandableActionBarItem } from "@orvui/vue/blocks/expandable-action-bar";
const expanded = ref(false),
  activeId = ref("send");
const descriptors = [
  {
    id: "send",
    label: "Send",
    icon: Send,
    shortcut: "S",
    motion: "motion-safe:group-hover:animate-action-send",
  },
  {
    id: "copy",
    label: "Copy",
    icon: Copy,
    shortcut: "C",
    motion: "motion-safe:group-hover:animate-action-copy",
  },
  {
    id: "download",
    label: "Export",
    icon: Download,
    shortcut: "E",
    motion: "motion-safe:group-hover:animate-action-download",
  },
  {
    id: "archive",
    label: "Archive",
    icon: Archive,
    motion: "motion-safe:group-hover:animate-action-archive",
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: Bell,
    badge: "3",
    motion: "origin-top motion-safe:group-hover:animate-action-bell",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    motion: "motion-safe:group-hover:animate-action-settings",
  },
];
const items = computed<ExpandableActionBarItem[]>(() =>
  descriptors.map(({ icon, motion: animation, ...item }) => ({
    ...item,
    active: item.id === activeId.value,
    icon: () => h(icon, { class: `h-4 w-4 ${animation}` }),
  })),
);
</script>
<template>
  <div class="flex min-h-72 w-full flex-col items-center justify-center gap-6">
    <div class="flex min-h-24 w-full items-center justify-center">
      <ExpandableActionBar
        :items="items"
        v-model:expanded="expanded"
        :active-id="activeId"
        @action="activeId = $event.id"
        :class-names="{ item: 'group' }"
      />
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <motion.button
        type="button"
        @click="expanded = !expanded"
        class="relative flex h-9 w-[110px] items-center justify-center overflow-hidden rounded-full border border-border bg-card text-xs font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
        :while-hover="{ scale: 1.02 }"
        :while-press="{ scale: 0.96 }"
        ><motion.div layout class="flex items-center gap-1.5"
          ><motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            :stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-3.5 w-3.5 shrink-0"
            ><motion.path
              :initial="false"
              :animate="{
                d: expanded ? 'M 10 20 L 10 14 L 4 14' : 'M 9 21 L 3 21 L 3 15',
              }"
              :transition="{
                type: 'spring',
                bounce: 0,
                duration: 0.3,
              }" /><motion.path
              :initial="false"
              :animate="{
                d: expanded ? 'M 14 4 L 14 10 L 20 10' : 'M 15 3 L 21 3 L 21 9',
              }"
              :transition="{ type: 'spring', bounce: 0, duration: 0.3 }" /><line
              x1="14"
              x2="21"
              y1="10"
              y2="3" /><line x1="3" x2="10" y1="21" y2="14" /></motion.svg
          ><AnimatePresence mode="popLayout" :initial="false"
            ><motion.span
              :key="expanded ? 'expanded' : 'collapsed'"
              :initial="{ opacity: 0, y: -25, filter: 'blur(4px)' }"
              :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
              :exit="{ opacity: 0, y: 25, filter: 'blur(4px)' }"
              :transition="{ type: 'spring', bounce: 0, duration: 0.3 }"
              >{{ expanded ? "Collapse" : "Expand" }}</motion.span
            ></AnimatePresence
          ></motion.div
        ></motion.button
      >
    </div>
  </div>
</template>
```

## API Reference

### ExpandableActionBar

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `ExpandableActionBarItem[]` | — | Yes | — |
| `expanded` | `boolean` | `undefined` | No | — |
| `defaultExpanded` | `boolean` | `false` | No | — |
| `activeId` | `string` | — | No | — |
| `size` | `"sm" \| "md"` | `"md"` | No | — |
| `expandOnHover` | `boolean` | `true` | No | — |
| `expandOnFocus` | `boolean` | `true` | No | — |
| `collapseDelay` | `number` | `90` | No | — |
| `classNames` | `ExpandableActionBarClassNames` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:expanded` | `[value: boolean]` | — |
| `expandedChange` | `[value: boolean]` | — |
| `action` | `[item: ExpandableActionBarItem]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `item` | — | `item: item`, `expanded: expanded`, `active: item.active \|\| props.activeId === item.id` | — |

## About Expandable Action Bar

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Expandable Action Bar?**

Configure Expandable Action Bar through items, expanded, defaultExpanded, activeId, size, expandOnHover, expandOnFocus, collapseDelay, classNames. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:expanded, expandedChange, action to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/expandable-action-bar.json
- Documentation: https://orvui.efu.me/en/components/blocks/expandable-action-bar
- `packages/vue/src/blocks/expandable-action-bar/src/ExpandableActionBar.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
