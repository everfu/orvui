---
title: "Bounce Sidebar"
description: "Navigate a vertical list while an active marker follows a curved path between rows."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/bounce-sidebar"
markdown: "https://orvui.efu.me/en/components/motion/bounce-sidebar.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Bounce Sidebar

> Navigate a vertical list while an active marker follows a curved path between rows.

<a id="when-to-use"></a>

## When to use it

- Use Bounce Sidebar when the interface needs this behavior: navigate a vertical list while an active marker follows a curved path between rows.

<a id="install"></a>
## Install

### Bounce Sidebar — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/bounce-sidebar.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
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

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `BounceSidebar` | `v-model` | `string` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
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

<a id="about"></a>
## About Bounce Sidebar

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Bounce Sidebar?**

Configure Bounce Sidebar through items, modelValue, defaultValue, ariaLabel, listClassName, itemClassName, indicatorClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Radio Group](https://orvui.efu.me/en/components/motion/radio): Choose one value from a keyboard-navigable group of labeled options.
- [Animated Sidebar](https://orvui.efu.me/en/components/motion/animated-sidebar): Compose nested navigation with expanded, icon-only and mobile drawer presentations.
- [Preview Rail](https://orvui.efu.me/en/components/motion/preview-rail): Preview navigation targets from a compact rail that expands around the focused item.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/bounce-sidebar.json
- Documentation: https://orvui.efu.me/en/components/motion/bounce-sidebar
- `packages/vue/src/motion/bounce-sidebar/src/BounceSidebar.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
