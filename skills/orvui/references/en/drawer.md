# Drawer · orvui 0.1.1

## Selection and composition

Use Tooltip for short non-interactive labels and Popover for content beside its trigger. Use Modal, Drawer or a mobile Bottom Sheet for focused tasks.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Drawer"
description: "Present a dialog from either side of the viewport with focus and scroll management."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/drawer"
markdown: "https://orvui.efu.me/en/components/motion/drawer.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Drawer

> Present a dialog from either side of the viewport with focus and scroll management.

<a id="when-to-use"></a>

## When to use it

- Use Drawer when the interface needs this behavior: present a dialog from either side of the viewport with focus and scroll management.

<a id="install"></a>
## Install

### Drawer — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/drawer.json
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
### Drawer

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Drawer } from "@/components/orvui/motion/drawer";
const open = ref(false), side = ref<"left" | "right">("right");
function reveal(edge: "left" | "right") { side.value = edge; open.value = true; }
</script>
<template><div class="flex items-center gap-3">
  <button type="button" @click="reveal('left')" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-card/70">Open left</button>
  <button type="button" @click="reveal('right')" class="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Open right</button>
  <Drawer v-model:open="open" :side="side" aria-label="Demo drawer" class="gap-4 p-6"><h2 class="text-sm font-semibold text-foreground">Drawer</h2><p class="text-sm text-muted-foreground">Enter from the {{ side }} edge. Use Escape or the backdrop to dismiss.</p><button type="button" @click="open = false" class="mt-auto inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-card/70">Close</button></Drawer>
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Drawer } from "@orvui/vue/motion/drawer";
const open = ref(false), side = ref<"left" | "right">("right");
function reveal(edge: "left" | "right") { side.value = edge; open.value = true; }
</script>
<template><div class="flex items-center gap-3">
  <button type="button" @click="reveal('left')" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-card/70">Open left</button>
  <button type="button" @click="reveal('right')" class="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Open right</button>
  <Drawer v-model:open="open" :side="side" aria-label="Demo drawer" class="gap-4 p-6"><h2 class="text-sm font-semibold text-foreground">Drawer</h2><p class="text-sm text-muted-foreground">Enter from the {{ side }} edge. Use Escape or the backdrop to dismiss.</p><button type="button" @click="open = false" class="mt-auto inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-card/70">Close</button></Drawer>
</div></template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `Drawer` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### Drawer

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `false` | Yes | — |
| `side` | `"left" \| "right"` | `"right"` | No | — |
| `ariaLabel` | `string` | — | No | — |
| `dismissable` | `boolean` | `true` | No | — |
| `backdropClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Drawer

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Drawer?**

Configure Drawer through open, side, ariaLabel, dismissable, backdropClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Popover](https://orvui.efu.me/en/components/motion/popover): Attach a floating surface to a trigger with conventional or continuous morphing transitions.
- [Morphing Modal](https://orvui.efu.me/en/components/motion/morphing-modal): Change a dialog's content and height together while preserving the outer surface.
- [Tooltip](https://orvui.efu.me/en/components/motion/tooltip): Reveal a short contextual label on hover or focus without displacing nearby content.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/drawer.json
- Documentation: https://orvui.efu.me/en/components/motion/drawer
- `packages/vue/src/motion/drawer/src/Drawer.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

