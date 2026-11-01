# Popover · orvui 0.1.1

## Selection and composition

Use Tooltip for short non-interactive labels and Popover for content beside its trigger. Use Modal, Drawer or a mobile Bottom Sheet for focused tasks.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Popover"
description: "Attach a floating surface to a trigger with conventional or continuous morphing transitions."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/popover"
markdown: "https://orvui.efu.me/en/components/motion/popover.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Popover

> Attach a floating surface to a trigger with conventional or continuous morphing transitions.

<a id="when-to-use"></a>

## When to use it

- Use Popover when the interface needs this behavior: attach a floating surface to a trigger with conventional or continuous morphing transitions.

<a id="install"></a>
## Install

### Popover — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/popover.json https://orvui.efu.me/r/button.json
```

### Gooey Popover — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/popover.json https://orvui.efu.me/r/button.json
```

### Morph Popover — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/popover-morph.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Popover

**Registry source**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Button } from "@/components/orvui/motion/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/orvui/motion/popover";
const dimensions = reactive([
  { label: "Width", value: "100%" },
  { label: "Height", value: "auto" },
]);
</script>
<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <Popover side="bottom" align="start"
      ><PopoverTrigger
        ><Button variant="secondary">Edit profile</Button></PopoverTrigger
      ><PopoverContent class="w-72"
        ><p class="text-sm font-medium text-foreground">Dimensions</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Set the width and height for the layer.
        </p>
        <div class="mt-3 flex flex-col gap-2">
          <label
            v-for="dimension in dimensions"
            :key="dimension.label"
            class="flex items-center justify-between gap-3 text-sm"
            ><span class="text-muted-foreground">{{ dimension.label }}</span
            ><input
              v-model="dimension.value"
              class="h-8 w-32 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          /></label></div></PopoverContent></Popover
    ><Popover trigger="hover" side="top"
      ><PopoverTrigger
        ><Button variant="outline">Hover me</Button></PopoverTrigger
      ><PopoverContent class="w-56"
        ><p class="text-sm text-foreground">
          Opens on hover, with a grace window so you can move into the panel.
        </p></PopoverContent
      ></Popover
    >
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Button } from "@orvui/vue/motion/button";
import { Popover, PopoverTrigger, PopoverContent } from "@orvui/vue/motion/popover";
const dimensions = reactive([
  { label: "Width", value: "100%" },
  { label: "Height", value: "auto" },
]);
</script>
<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <Popover side="bottom" align="start"
      ><PopoverTrigger
        ><Button variant="secondary">Edit profile</Button></PopoverTrigger
      ><PopoverContent class="w-72"
        ><p class="text-sm font-medium text-foreground">Dimensions</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Set the width and height for the layer.
        </p>
        <div class="mt-3 flex flex-col gap-2">
          <label
            v-for="dimension in dimensions"
            :key="dimension.label"
            class="flex items-center justify-between gap-3 text-sm"
            ><span class="text-muted-foreground">{{ dimension.label }}</span
            ><input
              v-model="dimension.value"
              class="h-8 w-32 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          /></label></div></PopoverContent></Popover
    ><Popover trigger="hover" side="top"
      ><PopoverTrigger
        ><Button variant="outline">Hover me</Button></PopoverTrigger
      ><PopoverContent class="w-56"
        ><p class="text-sm text-foreground">
          Opens on hover, with a grace window so you can move into the panel.
        </p></PopoverContent
      ></Popover
    >
  </div>
</template>
```

<a id="gooey"></a>
### Gooey Popover

Join the trigger and floating panel with a liquid neck while keeping the panel content sharp.

**Registry source**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Button } from "@/components/orvui/motion/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/orvui/motion/popover";
const dimensions = reactive([
  { label: "Width", value: "100%" },
  { label: "Height", value: "auto" },
]);
</script>
<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <Popover side="bottom" align="start"
      ><PopoverTrigger
        ><Button variant="secondary">Edit profile</Button></PopoverTrigger
      ><PopoverContent class="w-72"
        ><p class="text-sm font-medium text-foreground">Dimensions</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Set the width and height for the layer.
        </p>
        <div class="mt-3 flex flex-col gap-2">
          <label
            v-for="dimension in dimensions"
            :key="dimension.label"
            class="flex items-center justify-between gap-3 text-sm"
            ><span class="text-muted-foreground">{{ dimension.label }}</span
            ><input
              v-model="dimension.value"
              class="h-8 w-32 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          /></label></div></PopoverContent></Popover
    ><Popover trigger="hover" side="top"
      ><PopoverTrigger
        ><Button variant="outline">Hover me</Button></PopoverTrigger
      ><PopoverContent class="w-56"
        ><p class="text-sm text-foreground">
          Opens on hover, with a grace window so you can move into the panel.
        </p></PopoverContent
      ></Popover
    >
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Button } from "@orvui/vue/motion/button";
import { Popover, PopoverTrigger, PopoverContent } from "@orvui/vue/motion/popover";
const dimensions = reactive([
  { label: "Width", value: "100%" },
  { label: "Height", value: "auto" },
]);
</script>
<template>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <Popover side="bottom" align="start"
      ><PopoverTrigger
        ><Button variant="secondary">Edit profile</Button></PopoverTrigger
      ><PopoverContent class="w-72"
        ><p class="text-sm font-medium text-foreground">Dimensions</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Set the width and height for the layer.
        </p>
        <div class="mt-3 flex flex-col gap-2">
          <label
            v-for="dimension in dimensions"
            :key="dimension.label"
            class="flex items-center justify-between gap-3 text-sm"
            ><span class="text-muted-foreground">{{ dimension.label }}</span
            ><input
              v-model="dimension.value"
              class="h-8 w-32 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          /></label></div></PopoverContent></Popover
    ><Popover trigger="hover" side="top"
      ><PopoverTrigger
        ><Button variant="outline">Hover me</Button></PopoverTrigger
      ><PopoverContent class="w-56"
        ><p class="text-sm text-foreground">
          Opens on hover, with a grace window so you can move into the panel.
        </p></PopoverContent
      ></Popover
    >
  </div>
</template>
```

<a id="morph"></a>
### Morph Popover

Reveal a full-size panel through an anchored clip path without scaling its text.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, Copy, Pencil, Share2, Trash2 } from "lucide-vue-next";
import {
  MorphPopover,
  MorphPopoverTrigger,
  MorphPopoverContent,
} from "@/components/orvui/motion/popover";
const expanded = ref(false);
const actions = [
  ["Edit", Pencil],
  ["Duplicate", Copy],
  ["Share", Share2],
  ["Delete", Trash2],
].map(([label, icon]) => ({ label: label as string, icon }));
function choose() {
  expanded.value = false;
}
</script>
<template>
  <MorphPopover v-model:open="expanded"
    ><MorphPopoverTrigger
      ><button
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition-colors hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
      >
        Options<ChevronDown
          class="h-4 w-4 text-muted-foreground"
        /></button></MorphPopoverTrigger
    ><MorphPopoverContent align="start" class="w-48 p-1.5"
      ><button
        v-for="action in actions"
        :key="action.label"
        type="button"
        @click="choose"
        class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
      >
        <component :is="action.icon" class="h-4 w-4 text-muted-foreground" />{{
          action.label
        }}
      </button></MorphPopoverContent
    ></MorphPopover
  >
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, Copy, Pencil, Share2, Trash2 } from "lucide-vue-next";
import { MorphPopover, MorphPopoverTrigger, MorphPopoverContent } from "@orvui/vue/motion/popover";
const expanded = ref(false);
const actions = [
  ["Edit", Pencil],
  ["Duplicate", Copy],
  ["Share", Share2],
  ["Delete", Trash2],
].map(([label, icon]) => ({ label: label as string, icon }));
function choose() {
  expanded.value = false;
}
</script>
<template>
  <MorphPopover v-model:open="expanded"
    ><MorphPopoverTrigger
      ><button
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition-colors hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
      >
        Options<ChevronDown
          class="h-4 w-4 text-muted-foreground"
        /></button></MorphPopoverTrigger
    ><MorphPopoverContent align="start" class="w-48 p-1.5"
      ><button
        v-for="action in actions"
        :key="action.label"
        type="button"
        @click="choose"
        class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
      >
        <component :is="action.icon" class="h-4 w-4 text-muted-foreground" />{{
          action.label
        }}
      </button></MorphPopoverContent
    ></MorphPopover
  >
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `Popover` | `v-model:open` | `boolean` | `update:open` |
| `MorphPopover` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### Popover

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `trigger` | `"click" \| "hover"` | `"click"` | No | — |
| `side` | `"top" \| "bottom"` | `"bottom"` | No | — |
| `align` | `"start" \| "center" \| "end"` | `"center"` | No | — |
| `sideOffset` | `number` | `14` | No | — |
| `panelRadius` | `number` | `16` | No | — |
| `gooStrength` | `number` | `8` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | — | — |
| `openChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `open: state.open.value` | — |

### PopoverTrigger

### PopoverContent

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MorphPopover

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | — | — |
| `openChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `open: state.open.value` | — |

### MorphPopoverTrigger

### MorphPopoverContent

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom"` | `"bottom"` | No | — |
| `align` | `"start" \| "end"` | `"end"` | No | — |
| `sideOffset` | `number` | `8` | No | — |
| `radius` | `number` | `16` | No | — |
| `shadow` | `boolean` | `true` | No | — |
| `initialFocus` | `null \| HTMLElement \| Ref<HTMLElement \| null, HTMLElement \| null>` | — | No | — |
| `onOpenAutoFocus` | `(content: HTMLDivElement) => void` | — | No | — |
| `className` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Popover

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Popover?**

Configure Popover through open, defaultOpen, trigger, side, align, sideOffset, panelRadius, gooStrength, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open, openChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Morphing Modal](https://orvui.efu.me/en/components/motion/morphing-modal): Change a dialog's content and height together while preserving the outer surface.
- [Drawer](https://orvui.efu.me/en/components/motion/drawer): Present a dialog from either side of the viewport with focus and scroll management.
- [Tooltip](https://orvui.efu.me/en/components/motion/tooltip): Reveal a short contextual label on hover or focus without displacing nearby content.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/popover.json
- Documentation: https://orvui.efu.me/en/components/motion/popover
- `packages/vue/src/motion/popover/src/Popover.vue`
- `packages/vue/src/motion/popover/src/PopoverTrigger.vue`
- `packages/vue/src/motion/popover/src/PopoverContent.vue`
- `packages/vue/src/motion/popover/src/MorphPopover.vue`
- `packages/vue/src/motion/popover/src/MorphPopoverTrigger.vue`
- `packages/vue/src/motion/popover/src/MorphPopoverContent.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

