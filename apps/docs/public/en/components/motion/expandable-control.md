---
title: "Expandable Control"
description: "Expand a compact control to reveal a label or trailing action without losing its position."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/expandable-control"
markdown: "https://orvui.efu.me/en/components/motion/expandable-control.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Expandable Control

> Expand a compact control to reveal a label or trailing action without losing its position.

<a id="when-to-use"></a>

## When to use it

- Use Expandable Control when the interface needs this behavior: expand a compact control to reveal a label or trailing action without losing its position.

<a id="install"></a>
## Install

### Expandable Control — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/expandable-control.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
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

<a id="examples"></a>
## Usage

<a id="default"></a>
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

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `ExpandableButton` | `v-model:expanded` | `boolean` | `update:expanded` |
| `ExpandableChip` | `v-model:expanded` | `boolean` | `update:expanded` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
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

<a id="about"></a>
## About Expandable Control

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Expandable Control?**

Configure Expandable Control through expanded, defaultExpanded, icon, label, disabled, type. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:expanded to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Popover](https://orvui.efu.me/en/components/motion/popover): Attach a floating surface to a trigger with conventional or continuous morphing transitions.
- [Theme Toggle](https://orvui.efu.me/en/components/motion/theme-toggle): Reveal a new page theme with a circle, rectangle or blinds transition.
- [Card](https://orvui.efu.me/en/components/motion/card): Assemble a card from heading, content, actions and footer parts with optional selection.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/expandable-control.json
- Documentation: https://orvui.efu.me/en/components/motion/expandable-control
- `packages/vue/src/motion/expandable-control/src/ExpandableButton.vue`
- `packages/vue/src/motion/expandable-control/src/ExpandableChip.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
