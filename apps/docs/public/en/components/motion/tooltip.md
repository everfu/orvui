---
title: "Tooltip"
description: "Reveal a short contextual label on hover or focus without displacing nearby content."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/tooltip"
markdown: "https://orvui.efu.me/en/components/motion/tooltip.md"
license: "MIT"
productVersion: "0.1.0"
---

# Tooltip

> Reveal a short contextual label on hover or focus without displacing nearby content.

Reveal a short contextual label on hover or focus without displacing nearby content.

## When to use it

- Use Tooltip when the interface needs this behavior: reveal a short contextual label on hover or focus without displacing nearby content.

## Install

### Tooltip — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tooltip.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Tooltip — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tooltip.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Toolbar — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tooltip.json
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
pnpm add lucide-vue-next@^0.468.0
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `@floating-ui/dom@^1.7.0`
- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Tooltip

**Registry source**

```vue
<script setup lang="ts">
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-vue-next";
import { Tooltip, type TooltipSide } from "@/components/orvui/motion/tooltip";
const positions = [
  ["top", "Top", ArrowUp, "col-start-2 row-start-1"],
  ["left", "Left", ArrowLeft, "col-start-1 row-start-2"],
  ["right", "Right", ArrowRight, "col-start-3 row-start-2"],
  ["bottom", "Bottom", ArrowDown, "col-start-2 row-start-3"],
].map(([side, label, icon, position]) => ({
  side: side as TooltipSide,
  label: label as string,
  icon,
  position: position as string,
}));
</script>
<template>
  <div class="flex w-full flex-col items-center gap-8 py-6">
    <div class="grid grid-cols-3 gap-x-3 gap-y-5">
      <Tooltip
        v-for="placement in positions"
        :key="placement.side"
        content="More context"
        :side="placement.side"
        arrow
        ><button
          type="button"
          :class="[
            placement.position,
            'inline-flex h-10 w-20 items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
          ]"
        >
          <component
            :is="placement.icon"
            aria-hidden="true"
            class="size-3.5 text-muted-foreground"
          />{{ placement.label }}
        </button></Tooltip
      >
    </div>
    <p class="text-center text-xs text-muted-foreground">
      Hover or focus. Press Esc to dismiss.
    </p>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-vue-next";
import { Tooltip, type TooltipSide } from "@orvui/vue/motion/tooltip";
const positions = [
  ["top", "Top", ArrowUp, "col-start-2 row-start-1"],
  ["left", "Left", ArrowLeft, "col-start-1 row-start-2"],
  ["right", "Right", ArrowRight, "col-start-3 row-start-2"],
  ["bottom", "Bottom", ArrowDown, "col-start-2 row-start-3"],
].map(([side, label, icon, position]) => ({
  side: side as TooltipSide,
  label: label as string,
  icon,
  position: position as string,
}));
</script>
<template>
  <div class="flex w-full flex-col items-center gap-8 py-6">
    <div class="grid grid-cols-3 gap-x-3 gap-y-5">
      <Tooltip
        v-for="placement in positions"
        :key="placement.side"
        content="More context"
        :side="placement.side"
        arrow
        ><button
          type="button"
          :class="[
            placement.position,
            'inline-flex h-10 w-20 items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
          ]"
        >
          <component
            :is="placement.icon"
            aria-hidden="true"
            class="size-3.5 text-muted-foreground"
          />{{ placement.label }}
        </button></Tooltip
      >
    </div>
    <p class="text-center text-xs text-muted-foreground">
      Hover or focus. Press Esc to dismiss.
    </p>
  </div>
</template>
```

### Tooltip

Wrap one trigger with a short content label and choose its side and arrow.

**Registry source**

```vue
<script setup lang="ts">
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-vue-next";
import { Tooltip, type TooltipSide } from "@/components/orvui/motion/tooltip";
const positions = [
  ["top", "Top", ArrowUp, "col-start-2 row-start-1"],
  ["left", "Left", ArrowLeft, "col-start-1 row-start-2"],
  ["right", "Right", ArrowRight, "col-start-3 row-start-2"],
  ["bottom", "Bottom", ArrowDown, "col-start-2 row-start-3"],
].map(([side, label, icon, position]) => ({
  side: side as TooltipSide,
  label: label as string,
  icon,
  position: position as string,
}));
</script>
<template>
  <div class="flex w-full flex-col items-center gap-8 py-6">
    <div class="grid grid-cols-3 gap-x-3 gap-y-5">
      <Tooltip
        v-for="placement in positions"
        :key="placement.side"
        content="More context"
        :side="placement.side"
        arrow
        ><button
          type="button"
          :class="[
            placement.position,
            'inline-flex h-10 w-20 items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
          ]"
        >
          <component
            :is="placement.icon"
            aria-hidden="true"
            class="size-3.5 text-muted-foreground"
          />{{ placement.label }}
        </button></Tooltip
      >
    </div>
    <p class="text-center text-xs text-muted-foreground">
      Hover or focus. Press Esc to dismiss.
    </p>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-vue-next";
import { Tooltip, type TooltipSide } from "@orvui/vue/motion/tooltip";
const positions = [
  ["top", "Top", ArrowUp, "col-start-2 row-start-1"],
  ["left", "Left", ArrowLeft, "col-start-1 row-start-2"],
  ["right", "Right", ArrowRight, "col-start-3 row-start-2"],
  ["bottom", "Bottom", ArrowDown, "col-start-2 row-start-3"],
].map(([side, label, icon, position]) => ({
  side: side as TooltipSide,
  label: label as string,
  icon,
  position: position as string,
}));
</script>
<template>
  <div class="flex w-full flex-col items-center gap-8 py-6">
    <div class="grid grid-cols-3 gap-x-3 gap-y-5">
      <Tooltip
        v-for="placement in positions"
        :key="placement.side"
        content="More context"
        :side="placement.side"
        arrow
        ><button
          type="button"
          :class="[
            placement.position,
            'inline-flex h-10 w-20 items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
          ]"
        >
          <component
            :is="placement.icon"
            aria-hidden="true"
            class="size-3.5 text-muted-foreground"
          />{{ placement.label }}
        </button></Tooltip
      >
    </div>
    <p class="text-center text-xs text-muted-foreground">
      Hover or focus. Press Esc to dismiss.
    </p>
  </div>
</template>
```

### Toolbar

Share timing across toolbar hints and name icon-only controls from their labels.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Bold, Italic, Link2, Strikethrough, Underline } from "lucide-vue-next";
import { cn } from "@/components/orvui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/orvui/motion/tooltip";
const selected = ref(new Set(["bold"]));
const actions = [
  { id: "bold", label: "Bold", shortcut: "⌘B", keys: "Meta+B", icon: Bold },
  {
    id: "italic",
    label: "Italic",
    shortcut: "⌘I",
    keys: "Meta+I",
    icon: Italic,
  },
  {
    id: "underline",
    label: "Underline",
    shortcut: "⌘U",
    keys: "Meta+U",
    icon: Underline,
  },
  {
    id: "strike",
    label: "Strikethrough",
    shortcut: "⌘⇧X",
    keys: "Meta+Shift+X",
    icon: Strikethrough,
  },
];
function toggle(id: string) {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = next;
}
</script>
<template>
  <TooltipProvider :delay="300" :skip-delay="400"
    ><div class="flex w-full flex-col items-center gap-8 py-6">
      <div
        class="flex items-center gap-1 rounded-xl border border-border bg-card p-1"
      >
        <Tooltip v-for="action in actions" :key="action.id" as-label
          ><TooltipTrigger
            :aria-pressed="selected.has(action.id)"
            :aria-keyshortcuts="action.keys"
            :class="
              cn(
                'grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
                selected.has(action.id) && 'bg-muted text-foreground',
              )
            "
            @click="toggle(action.id)"
            ><component
              :is="action.icon"
              aria-hidden="true"
              class="size-4" /></TooltipTrigger
          ><TooltipContent side="bottom" arrow
            ><span class="flex items-center gap-2"
              >{{ action.label
              }}<span
                aria-hidden="true"
                class="text-[10px] text-muted-foreground"
                >{{ action.shortcut }}</span
              ></span
            ></TooltipContent
          ></Tooltip
        ><span aria-hidden="true" class="mx-1 h-5 w-px bg-border" /><Tooltip
          as-label
          :disabled="selected.size === 0"
          ><TooltipTrigger
            :disabled="selected.size === 0"
            class="grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            ><Link2 aria-hidden="true" class="size-4" /></TooltipTrigger
          ><TooltipContent side="bottom" align="end" arrow
            >Insert link</TooltipContent
          ></Tooltip
        >
      </div>
      <p class="max-w-xs text-center text-xs text-muted-foreground">
        The first label waits, the next ones open instantly. Click hides it
        until the pointer leaves.
      </p>
    </div></TooltipProvider
  >
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Bold, Italic, Link2, Strikethrough, Underline } from "lucide-vue-next";
import { cn } from "@orvui/vue";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@orvui/vue/motion/tooltip";
const selected = ref(new Set(["bold"]));
const actions = [
  { id: "bold", label: "Bold", shortcut: "⌘B", keys: "Meta+B", icon: Bold },
  {
    id: "italic",
    label: "Italic",
    shortcut: "⌘I",
    keys: "Meta+I",
    icon: Italic,
  },
  {
    id: "underline",
    label: "Underline",
    shortcut: "⌘U",
    keys: "Meta+U",
    icon: Underline,
  },
  {
    id: "strike",
    label: "Strikethrough",
    shortcut: "⌘⇧X",
    keys: "Meta+Shift+X",
    icon: Strikethrough,
  },
];
function toggle(id: string) {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = next;
}
</script>
<template>
  <TooltipProvider :delay="300" :skip-delay="400"
    ><div class="flex w-full flex-col items-center gap-8 py-6">
      <div
        class="flex items-center gap-1 rounded-xl border border-border bg-card p-1"
      >
        <Tooltip v-for="action in actions" :key="action.id" as-label
          ><TooltipTrigger
            :aria-pressed="selected.has(action.id)"
            :aria-keyshortcuts="action.keys"
            :class="
              cn(
                'grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
                selected.has(action.id) && 'bg-muted text-foreground',
              )
            "
            @click="toggle(action.id)"
            ><component
              :is="action.icon"
              aria-hidden="true"
              class="size-4" /></TooltipTrigger
          ><TooltipContent side="bottom" arrow
            ><span class="flex items-center gap-2"
              >{{ action.label
              }}<span
                aria-hidden="true"
                class="text-[10px] text-muted-foreground"
                >{{ action.shortcut }}</span
              ></span
            ></TooltipContent
          ></Tooltip
        ><span aria-hidden="true" class="mx-1 h-5 w-px bg-border" /><Tooltip
          as-label
          :disabled="selected.size === 0"
          ><TooltipTrigger
            :disabled="selected.size === 0"
            class="grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            ><Link2 aria-hidden="true" class="size-4" /></TooltipTrigger
          ><TooltipContent side="bottom" align="end" arrow
            >Insert link</TooltipContent
          ></Tooltip
        >
      </div>
      <p class="max-w-xs text-center text-xs text-muted-foreground">
        The first label waits, the next ones open instantly. Click hides it
        until the pointer leaves.
      </p>
    </div></TooltipProvider
  >
</template>
```

## API Reference

### Tooltip

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `content` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren` | `undefined` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `delay` | `number` | `timing.value.delay` | No | — |
| `closeDelay` | `number` | `timing.value.closeDelay` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `asLabel` | `boolean` | `false` | No | — |
| `followCursor` | `boolean` | `false` | No | — |
| `anchorRef` | `null \| HTMLElement \| SVGElement \| Ref<TooltipAnchor \| null, TooltipAnchor \| null>` | — | No | — |
| `id` | `string` | `useId()` | No | — |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | — | No | — |
| `align` | `"start" \| "center" \| "end"` | — | No | — |
| `sideOffset` | `number` | — | No | — |
| `arrow` | `boolean` | `false` | No | — |
| `anchorPoint` | `TooltipPoint` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | — | — |
| `openChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### TooltipTrigger

### TooltipContent

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | No | — |
| `align` | `"start" \| "center" \| "end"` | `"center"` | No | — |
| `sideOffset` | `number` | `(point ? 12 : 8)` | No | — |
| `arrow` | `boolean` | `false` | No | — |
| `anchorPoint` | `TooltipPoint` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### TooltipProvider

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `delay` | `number` | `inherited.value.delay` | No | — |
| `closeDelay` | `number` | `inherited.value.closeDelay` | No | — |
| `skipDelay` | `number` | `props.skipDelayDuration` | No | — |
| `skipDelayDuration` | `number` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## About Tooltip

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Tooltip?**

Configure Tooltip through content, open, defaultOpen, delay, closeDelay, disabled, asLabel, followCursor, anchorRef, id, side, align, sideOffset, arrow, anchorPoint. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open, openChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/tooltip.json
- Documentation: https://orvui.efu.me/en/components/motion/tooltip
- `packages/vue/src/motion/tooltip/src/Tooltip.vue`
- `packages/vue/src/motion/tooltip/src/TooltipTrigger.vue`
- `packages/vue/src/motion/tooltip/src/TooltipContent.vue`
- `packages/vue/src/motion/tooltip/src/TooltipProvider.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
