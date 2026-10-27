---
title: "Overflow Actions"
description: "Expand a compact action track to expose controls that do not fit its resting width."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/overflow-actions"
markdown: "https://orvui.efu.me/en/components/blocks/overflow-actions.md"
license: "MIT"
productVersion: "0.1.0"
---

# Overflow Actions

> Expand a compact action track to expose controls that do not fit its resting width.

## Install

### Overflow Actions — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/overflow-actions.json
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

### Overflow Actions

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CalendarClock, Eye, GitBranch, Pin } from "lucide-vue-next";
import { OverflowActions } from "@/components/orvui/blocks/overflow-actions";
const expanded = ref(false);
const primary = [
  { id: "preview", label: "Preview", icon: Eye },
  { id: "pin", label: "Pin", icon: Pin },
];
const extra = [
  { id: "branch", label: "Branch", icon: GitBranch },
  { id: "schedule", label: "Schedule", icon: CalendarClock },
];
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <OverflowActions
      :primary-actions="primary"
      :overflow-actions="extra"
      v-model:expanded="expanded"
      open-label="Open action rail"
      close-label="Collapse action rail"
    />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CalendarClock, Eye, GitBranch, Pin } from "lucide-vue-next";
import { OverflowActions } from "@orvui/vue/blocks/overflow-actions";
const expanded = ref(false);
const primary = [
  { id: "preview", label: "Preview", icon: Eye },
  { id: "pin", label: "Pin", icon: Pin },
];
const extra = [
  { id: "branch", label: "Branch", icon: GitBranch },
  { id: "schedule", label: "Schedule", icon: CalendarClock },
];
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <OverflowActions
      :primary-actions="primary"
      :overflow-actions="extra"
      v-model:expanded="expanded"
      open-label="Open action rail"
      close-label="Collapse action rail"
    />
  </div>
</template>
```

## API Reference

### OverflowActions

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `primaryActions` | `OverflowActionItem[]` | — | Yes | — |
| `overflowActions` | `OverflowActionItem[]` | — | Yes | — |
| `expanded` | `boolean` | `undefined` | No | — |
| `defaultExpanded` | `boolean` | `false` | No | — |
| `collapseOnAction` | `boolean` | `false` | No | — |
| `size` | `"sm" \| "md"` | `"md"` | No | — |
| `openLabel` | `string` | `"Show extra actions"` | No | — |
| `closeLabel` | `string` | `"Hide extra actions"` | No | — |
| `classNames` | `OverflowActionsClassNames` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:expanded` | `[value: boolean]` | — |
| `expandedChange` | `[value: boolean]` | — |
| `action` | `[item: OverflowActionItem]` | — |

## About Overflow Actions

Expand a compact action track to expose controls that do not fit its resting width.

### When to use it

- Use Overflow Actions when the interface needs this behavior: expand a compact action track to expose controls that do not fit its resting width.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Overflow Actions?**

Configure Overflow Actions through primaryActions, overflowActions, expanded, defaultExpanded, collapseOnAction, size, openLabel, closeLabel, classNames. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:expanded, expandedChange, action to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/overflow-actions.json
- Documentation: https://orvui.efu.me/en/components/blocks/overflow-actions
- `packages/vue/src/blocks/overflow-actions/src/OverflowActions.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
