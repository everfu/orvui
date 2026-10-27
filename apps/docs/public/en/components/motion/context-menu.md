---
title: "Animated Context Menu"
description: "Open a menu at a pointer position with checkbox, radio and submenu compositions."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/context-menu"
markdown: "https://orvui.efu.me/en/components/motion/context-menu.md"
license: "MIT"
productVersion: "0.1.0"
---

# Animated Context Menu

> Open a menu at a pointer position with checkbox, radio and submenu compositions.

## Install

### Animated Context Menu — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/context-menu.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Animated Context Menu

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Check, Copy, Download, Eye, Pencil, Trash2 } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
  ContextMenuShortcut,
} from "@/components/orvui/motion/context-menu";
import { SPRING_SWAP } from "@/components/orvui/lib/ease";
import { useReducedMotion } from "@/components/orvui/lib/composables";
const message = ref<string | null>(null);
const offline = ref(false), reduce = useReducedMotion();
const items = [
  ["Open", Eye, "Folder opened", "↵"],
  ["Rename", Pencil, "Ready to rename", "R"],
  ["Duplicate", Copy, "Folder duplicated", "⌘D"],
  ["Download", Download, "Download started", undefined],
].map(([label, icon, message, shortcut]) => ({ label: label as string, icon, message: message as string, shortcut: shortcut as string | undefined }));
function checked(value: boolean) { offline.value = value; message.value = value ? "Available offline" : "Online only"; }
</script>
<template>
  <div class="flex min-h-[360px] w-full items-center justify-center">
    <ContextMenu
      ><ContextMenuTrigger
        ><button
          type="button"
          class="group flex flex-col items-center outline-none"
        >
          <div
            class="relative h-24 w-32 transition-transform duration-150 group-active:scale-[0.98] group-focus-visible:rounded-2xl group-focus-visible:ring-2 group-focus-visible:ring-foreground/20 group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background"
          >
            <div
              class="absolute left-1 top-1 h-7 w-14 rounded-t-[10px] bg-[#d4a84f] dark:bg-[#a77d2f]"
            />
            <div
              class="absolute inset-x-0 bottom-0 top-5 rounded-[14px] bg-[#e7bb61] shadow-[0_14px_24px_-16px_rgba(90,58,8,0.75)] dark:bg-[#bd8d36]"
            />
            <div
              class="absolute inset-x-0 bottom-0 top-9 rounded-[14px] bg-[#efc86f] dark:bg-[#cb9a41]"
            />
            <div
              class="absolute inset-x-5 bottom-4 h-px bg-black/10 dark:bg-white/10"
            />
          </div>
          <span class="mt-4 text-sm font-medium text-foreground"
            >Right click on me</span
          >
          <div class="mt-1 h-4">
            <AnimatePresence mode="wait" :initial="false"
              ><motion.span
                v-if="message"
                :key="message"
                :initial="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 3, filter: 'blur(2px)' }
                "
                :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
                :exit="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: -2, filter: 'blur(2px)' }
                "
                :transition="reduce ? { duration: 0.1 } : SPRING_SWAP"
                class="flex items-center gap-1 text-[10px] text-muted-foreground"
                ><Check aria-hidden="true" class="h-3 w-3 text-success" />{{
                  message
                }}</motion.span
              ><span v-else class="text-[10px] text-muted-foreground"
                >or long-press · Shift + F10</span
              ></AnimatePresence
            >
          </div>
        </button></ContextMenuTrigger
      ><ContextMenuContent ariaLabel="Folder actions" class="w-60"
        ><ContextMenuLabel>Project files</ContextMenuLabel
        ><ContextMenuItem
          v-for="item in items"
          :key="item.label"
          :text-value="item.label"
          @select="message = item.message"
          ><component :is="item.icon" aria-hidden="true" class="h-4 w-4" />{{
            item.label
          }}<ContextMenuShortcut v-if="item.shortcut">{{
            item.shortcut
          }}</ContextMenuShortcut></ContextMenuItem
        ><ContextMenuSeparator /><ContextMenuCheckboxItem
          text-value="Keep offline"
          :model-value="offline"
          :close-on-select="false"
          @update:model-value="checked"
          >Keep offline</ContextMenuCheckboxItem
        ><ContextMenuSeparator /><ContextMenuItem
          tone="destructive"
          text-value="Move to trash"
          @select="message = 'Moved to trash'"
          ><Trash2 aria-hidden="true" class="h-4 w-4" />Move to
          trash<ContextMenuShortcut>⌘⌫</ContextMenuShortcut></ContextMenuItem
        ></ContextMenuContent
      ></ContextMenu
    >
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Check, Copy, Download, Eye, Pencil, Trash2 } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuLabel, ContextMenuItem, ContextMenuSeparator, ContextMenuCheckboxItem, ContextMenuShortcut } from "@orvui/vue/motion/context-menu";
import { SPRING_SWAP } from "@orvui/vue";
import { useReducedMotion } from "@orvui/vue";
const message = ref<string | null>(null);
const offline = ref(false), reduce = useReducedMotion();
const items = [
  ["Open", Eye, "Folder opened", "↵"],
  ["Rename", Pencil, "Ready to rename", "R"],
  ["Duplicate", Copy, "Folder duplicated", "⌘D"],
  ["Download", Download, "Download started", undefined],
].map(([label, icon, message, shortcut]) => ({ label: label as string, icon, message: message as string, shortcut: shortcut as string | undefined }));
function checked(value: boolean) { offline.value = value; message.value = value ? "Available offline" : "Online only"; }
</script>
<template>
  <div class="flex min-h-[360px] w-full items-center justify-center">
    <ContextMenu
      ><ContextMenuTrigger
        ><button
          type="button"
          class="group flex flex-col items-center outline-none"
        >
          <div
            class="relative h-24 w-32 transition-transform duration-150 group-active:scale-[0.98] group-focus-visible:rounded-2xl group-focus-visible:ring-2 group-focus-visible:ring-foreground/20 group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background"
          >
            <div
              class="absolute left-1 top-1 h-7 w-14 rounded-t-[10px] bg-[#d4a84f] dark:bg-[#a77d2f]"
            />
            <div
              class="absolute inset-x-0 bottom-0 top-5 rounded-[14px] bg-[#e7bb61] shadow-[0_14px_24px_-16px_rgba(90,58,8,0.75)] dark:bg-[#bd8d36]"
            />
            <div
              class="absolute inset-x-0 bottom-0 top-9 rounded-[14px] bg-[#efc86f] dark:bg-[#cb9a41]"
            />
            <div
              class="absolute inset-x-5 bottom-4 h-px bg-black/10 dark:bg-white/10"
            />
          </div>
          <span class="mt-4 text-sm font-medium text-foreground"
            >Right click on me</span
          >
          <div class="mt-1 h-4">
            <AnimatePresence mode="wait" :initial="false"
              ><motion.span
                v-if="message"
                :key="message"
                :initial="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 3, filter: 'blur(2px)' }
                "
                :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
                :exit="
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: -2, filter: 'blur(2px)' }
                "
                :transition="reduce ? { duration: 0.1 } : SPRING_SWAP"
                class="flex items-center gap-1 text-[10px] text-muted-foreground"
                ><Check aria-hidden="true" class="h-3 w-3 text-success" />{{
                  message
                }}</motion.span
              ><span v-else class="text-[10px] text-muted-foreground"
                >or long-press · Shift + F10</span
              ></AnimatePresence
            >
          </div>
        </button></ContextMenuTrigger
      ><ContextMenuContent ariaLabel="Folder actions" class="w-60"
        ><ContextMenuLabel>Project files</ContextMenuLabel
        ><ContextMenuItem
          v-for="item in items"
          :key="item.label"
          :text-value="item.label"
          @select="message = item.message"
          ><component :is="item.icon" aria-hidden="true" class="h-4 w-4" />{{
            item.label
          }}<ContextMenuShortcut v-if="item.shortcut">{{
            item.shortcut
          }}</ContextMenuShortcut></ContextMenuItem
        ><ContextMenuSeparator /><ContextMenuCheckboxItem
          text-value="Keep offline"
          :model-value="offline"
          :close-on-select="false"
          @update:model-value="checked"
          >Keep offline</ContextMenuCheckboxItem
        ><ContextMenuSeparator /><ContextMenuItem
          tone="destructive"
          text-value="Move to trash"
          @select="message = 'Moved to trash'"
          ><Trash2 aria-hidden="true" class="h-4 w-4" />Move to
          trash<ContextMenuShortcut>⌘⌫</ContextMenuShortcut></ContextMenuItem
        ></ContextMenuContent
      ></ContextMenu
    >
  </div>
</template>
```

## API Reference

### ContextMenu

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### ContextMenuTrigger

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### ContextMenuContent

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `"Context menu"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### ContextMenuLabel

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `inset` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### ContextMenuItem

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | No | — |
| `closeOnSelect` | `boolean` | `true` | No | — |
| `tone` | `"default" \| "destructive"` | — | No | — |
| `inset` | `boolean` | `false` | No | — |
| `textValue` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `select` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### ContextMenuSeparator

### ContextMenuCheckboxItem

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `boolean` | `undefined` | No | — |
| `checked` | `boolean` | `undefined` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `closeOnSelect` | `boolean` | `true` | No | — |
| `tone` | `"default" \| "destructive"` | — | No | — |
| `inset` | `boolean` | `false` | No | — |
| `textValue` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `update:checked` | — | — |
| `change` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

### ContextMenuShortcut

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => unknown` | — | — |

## About Animated Context Menu

Open a menu at a pointer position with checkbox, radio and submenu compositions.

### When to use it

- Use Animated Context Menu when the interface needs this behavior: open a menu at a pointer position with checkbox, radio and submenu compositions.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Animated Context Menu?**

Configure Animated Context Menu through open, defaultOpen. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/context-menu.json
- Documentation: https://orvui.efu.me/en/components/motion/context-menu
- `packages/vue/src/motion/context-menu/src/ContextMenu.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuTrigger.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuContent.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuLabel.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuItem.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuSeparator.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuCheckboxItem.vue`
- `packages/vue/src/motion/context-menu/src/ContextMenuShortcut.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
