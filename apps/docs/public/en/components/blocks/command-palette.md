---
title: "Command Palette"
description: "Find and activate grouped commands in a keyboard-operated search panel."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/command-palette"
markdown: "https://orvui.efu.me/en/components/blocks/command-palette.md"
license: "MIT"
productVersion: "0.1.0"
---

# Command Palette

> Find and activate grouped commands in a keyboard-operated search panel.

Find and activate grouped commands in a keyboard-operated search panel.

## When to use it

- Use Command Palette when the interface needs this behavior: find and activate grouped commands in a keyboard-operated search panel.

## Install

### Command Palette — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/command-palette.json
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

### Command Palette

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { FileText, Home, Plus, Settings, User } from "lucide-vue-next";
import { CommandPalette } from "@/components/orvui/blocks/command-palette";
const open = ref(false);
const items = [
  {
    id: "home",
    label: "Go to Home",
    group: "Navigation",
    icon: Home,
    hint: "G H",
  },
  {
    id: "profile",
    label: "Open profile",
    group: "Navigation",
    icon: User,
    hint: "G P",
  },
  { id: "settings", label: "Settings", group: "Navigation", icon: Settings },
  {
    id: "new-doc",
    label: "Create document",
    group: "Actions",
    icon: FileText,
    hint: "⌘ N",
  },
  {
    id: "new-project",
    label: "New project",
    group: "Actions",
    icon: Plus,
    hint: "⌘ ⇧ N",
  },
];
</script>
<template>
  <div class="flex flex-col items-start gap-3">
    <button
      type="button"
      @click="open = true"
      class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)"
    >
      Open command palette
    </button>
    <p class="text-sm text-muted-foreground">
      Press
      <kbd
        class="rounded border border-border bg-card px-1.5 py-0.5 text-xs text-foreground"
        >⌘ J</kbd
      >
      (or
      <kbd
        class="rounded border border-border bg-card px-1.5 py-0.5 text-xs text-foreground"
        >Ctrl J</kbd
      >) to open.
    </p>
    <CommandPalette v-model:open="open" shortcut="j" :items="items" />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { FileText, Home, Plus, Settings, User } from "lucide-vue-next";
import { CommandPalette } from "@orvui/vue/blocks/command-palette";
const open = ref(false);
const items = [
  {
    id: "home",
    label: "Go to Home",
    group: "Navigation",
    icon: Home,
    hint: "G H",
  },
  {
    id: "profile",
    label: "Open profile",
    group: "Navigation",
    icon: User,
    hint: "G P",
  },
  { id: "settings", label: "Settings", group: "Navigation", icon: Settings },
  {
    id: "new-doc",
    label: "Create document",
    group: "Actions",
    icon: FileText,
    hint: "⌘ N",
  },
  {
    id: "new-project",
    label: "New project",
    group: "Actions",
    icon: Plus,
    hint: "⌘ ⇧ N",
  },
];
</script>
<template>
  <div class="flex flex-col items-start gap-3">
    <button
      type="button"
      @click="open = true"
      class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)"
    >
      Open command palette
    </button>
    <p class="text-sm text-muted-foreground">
      Press
      <kbd
        class="rounded border border-border bg-card px-1.5 py-0.5 text-xs text-foreground"
        >⌘ J</kbd
      >
      (or
      <kbd
        class="rounded border border-border bg-card px-1.5 py-0.5 text-xs text-foreground"
        >Ctrl J</kbd
      >) to open.
    </p>
    <CommandPalette v-model:open="open" shortcut="j" :items="items" />
  </div>
</template>
```

## API Reference

### CommandPalette

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `CommandItem[]` | — | Yes | — |
| `shortcut` | `string` | `"k"` | No | — |
| `placeholder` | `string` | `"Type a command or search…"` | No | — |
| `emptyMessage` | `string` | `"No results found."` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |
| `select` | `[item: CommandItem]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `trigger` | — | `open: () => (open = true)` | — |

## About Command Palette

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Command Palette?**

Configure Command Palette through items, shortcut, placeholder, emptyMessage, open, defaultOpen. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open, openChange, select to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/command-palette.json
- Documentation: https://orvui.efu.me/en/components/blocks/command-palette
- `packages/vue/src/blocks/command-palette/src/CommandPalette.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
