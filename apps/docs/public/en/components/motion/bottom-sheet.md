---
title: "Bottom Sheet"
description: "Open a panel from the lower edge and move it between snap positions with a drag."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/bottom-sheet"
markdown: "https://orvui.efu.me/en/components/motion/bottom-sheet.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Bottom Sheet

> Open a panel from the lower edge and move it between snap positions with a drag.

<a id="when-to-use"></a>

## When to use it

- Use on small screens for a focused set of navigation links, settings or actions.

<a id="install"></a>
## Install

### Bottom Sheet — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/bottom-sheet.json
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
### Bottom Sheet

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BottomSheet } from "@/components/orvui/motion/bottom-sheet";
const open = ref(false);
const actions = ["Share", "Duplicate", "Move to folder", "Rename", "Archive", "Delete"];
</script>
<template><div>
  <button type="button" @click="open = true" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)">Open bottom sheet</button>
  <BottomSheet v-model:open="open" :snap-points="[0.4, 0.85]" title="Quick actions" description="Move the handle or flick downward to close."><ul class="divide-y divide-border"><li v-for="action in actions" :key="action" class="py-3 text-sm text-foreground">{{ action }}</li></ul><div class="py-12 text-center text-xs text-muted-foreground">Flick up for more room, or down to close.</div></BottomSheet>
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BottomSheet } from "@orvui/vue/motion/bottom-sheet";
const open = ref(false);
const actions = ["Share", "Duplicate", "Move to folder", "Rename", "Archive", "Delete"];
</script>
<template><div>
  <button type="button" @click="open = true" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)">Open bottom sheet</button>
  <BottomSheet v-model:open="open" :snap-points="[0.4, 0.85]" title="Quick actions" description="Move the handle or flick downward to close."><ul class="divide-y divide-border"><li v-for="action in actions" :key="action" class="py-3 text-sm text-foreground">{{ action }}</li></ul><div class="py-12 text-center text-xs text-muted-foreground">Flick up for more room, or down to close.</div></BottomSheet>
</div></template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `BottomSheet` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### BottomSheet

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `false` | Yes | — |
| `snapPoints` | `(number \| "auto")[]` | `() => [0.5, 0.92]` | No | — |
| `defaultSnap` | `number` | `0` | No | — |
| `title` | `string` | — | No | — |
| `description` | `string` | — | No | — |
| `dismissThreshold` | `number` | `120` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Bottom Sheet

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Bottom Sheet?**

Configure Bottom Sheet through open, snapPoints, defaultSnap, title, description, dismissThreshold. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Tooltip](https://orvui.efu.me/en/components/motion/tooltip): Reveal a short contextual label on hover or focus without displacing nearby content.
- [Popover](https://orvui.efu.me/en/components/motion/popover): Attach a floating surface to a trigger with conventional or continuous morphing transitions.
- [Morphing Modal](https://orvui.efu.me/en/components/motion/morphing-modal): Change a dialog's content and height together while preserving the outer surface.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/bottom-sheet.json
- Documentation: https://orvui.efu.me/en/components/motion/bottom-sheet
- `packages/vue/src/motion/bottom-sheet/src/BottomSheet.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
