---
title: "Bounce Sidebar"
description: "Navigate a vertical list while an active marker follows a curved path between rows."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/bounce-sidebar"
markdown: "https://orvui.efu.me/en/components/motion/bounce-sidebar.md"
license: "MIT"
productVersion: "0.1.0"
---

# Bounce Sidebar

> Navigate a vertical list while an active marker follows a curved path between rows.

## Install

### Bounce Sidebar — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/bounce-sidebar.json
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

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Bounce Sidebar

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BounceSidebar } from "@/components/orvui/motion/bounce-sidebar";
const selected = ref("components");
const sections = ["Overview", "Components", "Motion", "Templates", "Changelog"].map(label => ({ id: label.toLowerCase(), label }));
</script>
<template><div class="flex min-h-[360px] w-full items-center justify-center"><BounceSidebar v-model="selected" :items="sections" aria-label="orvui sections" class="w-52" list-class-name="w-full" item-class-name="text-base" /></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BounceSidebar } from "@orvui/vue/motion/bounce-sidebar";
const selected = ref("components");
const sections = ["Overview", "Components", "Motion", "Templates", "Changelog"].map(label => ({ id: label.toLowerCase(), label }));
</script>
<template><div class="flex min-h-[360px] w-full items-center justify-center"><BounceSidebar v-model="selected" :items="sections" aria-label="orvui sections" class="w-52" list-class-name="w-full" item-class-name="text-base" /></div></template>
```

## API Reference

### BounceSidebar

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `BounceSidebarItem[]` | — | Yes | — |
| `modelValue` | `string` | — | No | — |
| `defaultValue` | `string` | `props.items[0]?.id` | No | — |
| `ariaLabel` | `string` | `"Sidebar navigation"` | No | — |
| `listClassName` | `string` | — | No | — |
| `itemClassName` | `string` | — | No | — |
| `indicatorClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `item` | — | `item: item`, `active: selected === item.id` | — |

## About Bounce Sidebar

Navigate a vertical list while an active marker follows a curved path between rows.

### When to use it

- Use Bounce Sidebar when the interface needs this behavior: navigate a vertical list while an active marker follows a curved path between rows.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Bounce Sidebar?**

Configure Bounce Sidebar through items, modelValue, defaultValue, ariaLabel, listClassName, itemClassName, indicatorClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/bounce-sidebar.json
- Documentation: https://orvui.efu.me/en/components/motion/bounce-sidebar
- `packages/vue/src/motion/bounce-sidebar/src/BounceSidebar.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
