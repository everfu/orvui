---
title: "Morphing Tabs"
description: "Switch and reorder tabs while their surfaces follow a continuous layout transition."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/morphing-tabs"
markdown: "https://orvui.efu.me/en/components/blocks/morphing-tabs.md"
license: "MIT"
productVersion: "0.1.0"
---

# Morphing Tabs

> Switch and reorder tabs while their surfaces follow a continuous layout transition.

Switch and reorder tabs while their surfaces follow a continuous layout transition.

## When to use it

- Use Morphing Tabs when the interface needs this behavior: switch and reorder tabs while their surfaces follow a continuous layout transition.

## Install

### Morphing Tabs — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/morphing-tabs.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Morphing Tabs

**Registry source**

```vue
<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { MorphingTabs, type MorphingTabsItem } from "@/components/orvui/blocks/morphing-tabs";
const rooms: Record<
  string,
  { eyebrow: string; title: string; detail: string; accent: string }
> = {
  "room-2": {
    eyebrow: "quiet focus",
    title: "Room 2",
    detail:
      "A small space for the work that needs a little more air around it.",
    accent: "#db5b2f",
  },
  general: {
    eyebrow: "shared space",
    title: "General",
    detail:
      "The common room for notes, links and the ideas that are still finding their shape.",
    accent: "#1bb273",
  },
  archive: {
    eyebrow: "kept close",
    title: "Archive",
    detail:
      "Past rooms stay available without competing with the conversations in motion.",
    accent: "#7a6de2",
  },
};
const items = shallowRef<MorphingTabsItem[]>(
    Object.keys(rooms).map((id) => ({
      id,
      label: rooms[id].title,
      content: "",
    })),
  ),
  value = ref<string | null>("room-2");
function order(ids: string[]) {
  items.value = ids.flatMap((id) => {
    const item = items.value.find((entry) => entry.id === id);
    return item ? [item] : [];
  });
}
function close(id: string) {
  items.value = items.value.filter((item) => item.id !== id);
  if (value.value === id) value.value = items.value[0]?.id ?? null;
}
</script>
<template>
  <div
    class="flex w-full min-w-0 items-center justify-center bg-[#242424] p-3 md:p-8"
  >
    <MorphingTabs
      v-model="value"
      :items="items"
      aria-label="Rooms"
      class="w-full max-w-5xl"
      @order-change="order"
      @close="close"
      ><template #content="{ item }"
        ><div
          class="relative min-h-64 overflow-hidden bg-[radial-gradient(circle_at_1px_1px,#dfe2e3_1px,transparent_1.5px)] bg-[size:4.8rem_4.8rem] px-7 py-8 md:px-12 md:py-10"
        >
          <div class="relative max-w-xl">
            <p
              class="text-[.68rem] font-semibold uppercase tracking-[.24em] text-black/40"
            >
              {{ rooms[item.id].eyebrow }}
            </p>
            <h3
              class="mt-3 text-3xl font-light tracking-[-.055em] text-[#151515] md:text-5xl"
            >
              {{ rooms[item.id].title }}
            </h3>
            <p
              class="mt-4 max-w-md text-sm leading-6 text-black/55 md:text-base"
            >
              {{ rooms[item.id].detail }}
            </p>
            <div
              class="mt-8 flex items-center gap-3 text-xs font-medium text-black/50"
            >
              <span
                class="size-2 rounded-full"
                :style="{ backgroundColor: rooms[item.id].accent }"
              />drag any room to reorder
            </div>
          </div>
        </div></template
      ></MorphingTabs
    >
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { MorphingTabs, type MorphingTabsItem } from "@orvui/vue/blocks/morphing-tabs";
const rooms: Record<
  string,
  { eyebrow: string; title: string; detail: string; accent: string }
> = {
  "room-2": {
    eyebrow: "quiet focus",
    title: "Room 2",
    detail:
      "A small space for the work that needs a little more air around it.",
    accent: "#db5b2f",
  },
  general: {
    eyebrow: "shared space",
    title: "General",
    detail:
      "The common room for notes, links and the ideas that are still finding their shape.",
    accent: "#1bb273",
  },
  archive: {
    eyebrow: "kept close",
    title: "Archive",
    detail:
      "Past rooms stay available without competing with the conversations in motion.",
    accent: "#7a6de2",
  },
};
const items = shallowRef<MorphingTabsItem[]>(
    Object.keys(rooms).map((id) => ({
      id,
      label: rooms[id].title,
      content: "",
    })),
  ),
  value = ref<string | null>("room-2");
function order(ids: string[]) {
  items.value = ids.flatMap((id) => {
    const item = items.value.find((entry) => entry.id === id);
    return item ? [item] : [];
  });
}
function close(id: string) {
  items.value = items.value.filter((item) => item.id !== id);
  if (value.value === id) value.value = items.value[0]?.id ?? null;
}
</script>
<template>
  <div
    class="flex w-full min-w-0 items-center justify-center bg-[#242424] p-3 md:p-8"
  >
    <MorphingTabs
      v-model="value"
      :items="items"
      aria-label="Rooms"
      class="w-full max-w-5xl"
      @order-change="order"
      @close="close"
      ><template #content="{ item }"
        ><div
          class="relative min-h-64 overflow-hidden bg-[radial-gradient(circle_at_1px_1px,#dfe2e3_1px,transparent_1.5px)] bg-[size:4.8rem_4.8rem] px-7 py-8 md:px-12 md:py-10"
        >
          <div class="relative max-w-xl">
            <p
              class="text-[.68rem] font-semibold uppercase tracking-[.24em] text-black/40"
            >
              {{ rooms[item.id].eyebrow }}
            </p>
            <h3
              class="mt-3 text-3xl font-light tracking-[-.055em] text-[#151515] md:text-5xl"
            >
              {{ rooms[item.id].title }}
            </h3>
            <p
              class="mt-4 max-w-md text-sm leading-6 text-black/55 md:text-base"
            >
              {{ rooms[item.id].detail }}
            </p>
            <div
              class="mt-8 flex items-center gap-3 text-xs font-medium text-black/50"
            >
              <span
                class="size-2 rounded-full"
                :style="{ backgroundColor: rooms[item.id].accent }"
              />drag any room to reorder
            </div>
          </div>
        </div></template
      ></MorphingTabs
    >
  </div>
</template>
```

## API Reference

### MorphingTabs

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `MorphingTabsItem[]` | — | Yes | — |
| `modelValue` | `null \| string` | — | No | — |
| `defaultValue` | `null \| string` | `props.items[0]?.id` | No | — |
| `ariaLabel` | `string` | `"Tabs"` | No | — |
| `closable` | `boolean` | `false` | No | — |
| `classNames` | `MorphingTabsClassNames` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `[id: string \| null]` | — |
| `valueChange` | `[id: string \| null]` | — |
| `orderChange` | `[ids: string[]]` | — |
| `close` | `[id: string]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `content` | — | `item: active` | — |

## About Morphing Tabs

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Morphing Tabs?**

Configure Morphing Tabs through items, modelValue, defaultValue, ariaLabel, closable, classNames. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valueChange, orderChange, close to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/morphing-tabs.json
- Documentation: https://orvui.efu.me/en/components/blocks/morphing-tabs
- `packages/vue/src/blocks/morphing-tabs/src/MorphingTabs.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
