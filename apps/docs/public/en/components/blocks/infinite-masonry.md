---
title: "Infinite Masonry"
description: "Lay out variable-height items in columns and request more as the visible range advances."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/infinite-masonry"
markdown: "https://orvui.efu.me/en/components/blocks/infinite-masonry.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Infinite Masonry

> Lay out variable-height items in columns and request more as the visible range advances.

<a id="when-to-use"></a>

## When to use it

- Use Infinite Masonry when the interface needs this behavior: lay out variable-height items in columns and request more as the visible range advances.

<a id="install"></a>
## Install

### Infinite Masonry — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/infinite-masonry.json
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

- `@tanstack/vue-virtual@^3.13.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Infinite Masonry

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { InfiniteMasonry } from "@/components/orvui/blocks/infinite-masonry";
const scenes = [
  ["Soft geometry", "Architecture", "1511818966892-d7d671e672a2", 260],
  ["Open horizon", "Landscape", "1500530855697-b586d89ba3ee", 190],
  ["Working rhythm", "Workspace", "1497366754035-f200968a6e72", 230],
  ["Shared table", "Studio", "1524758631624-e2822e304c36", 300],
  ["In session", "People", "1521737711867-e3b97375f902", 210],
  ["After hours", "Office", "1504384308090-c894fdcc538d", 280],
] as const;
function page(start: number, count: number) {
  return Array.from({ length: count }, (_, offset) => {
    const index = start + offset,
      [title, category, photo, imageHeight] = scenes[index % scenes.length];
    return {
      id: `gallery-${index}`,
      title: `${title} ${Math.floor(index / scenes.length) + 1}`,
      category,
      image: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=720&q=80`,
      imageHeight,
    };
  });
}
const items = ref(page(0, 12)),
  loading = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
function load() {
  if (loading.value || items.value.length >= 42) return;
  loading.value = true;
  timer = setTimeout(() => {
    items.value.push(
      ...page(items.value.length, Math.min(6, 42 - items.value.length)),
    );
    loading.value = false;
  }, 650);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>
<template>
  <div class="w-full max-w-5xl">
    <div class="mb-3 flex items-end justify-between gap-4 px-1">
      <div>
        <p class="text-sm font-semibold text-foreground">Visual index</p>
        <p class="mt-0.5 text-xs text-muted-foreground">
          Scroll to load the next page
        </p>
      </div>
      <p class="font-mono text-xs tabular-nums text-muted-foreground">
        {{ items.length }} items
      </p>
    </div>
    <InfiniteMasonry
      :items="items"
      :get-item-key="(item) => item.id"
      :has-more="items.length < 42"
      :loading="loading"
      :estimate-size="(item) => item.imageHeight + 66"
      aria-label="Visual inspiration gallery"
      class="h-[34rem]"
      @load-more="load"
      ><template #default="{ item }"
        ><figure
          class="overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div
            class="relative w-full overflow-hidden"
            :style="{ height: item.imageHeight + 'px' }"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="absolute inset-0 size-full object-cover"
            />
          </div>
          <figcaption class="flex items-start justify-between gap-3 p-3">
            <p class="text-sm font-medium text-foreground">{{ item.title }}</p>
            <p
              class="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {{ item.category }}
            </p>
          </figcaption>
        </figure></template
      ></InfiniteMasonry
    >
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { InfiniteMasonry } from "@orvui/vue/blocks/infinite-masonry";
const scenes = [
  ["Soft geometry", "Architecture", "1511818966892-d7d671e672a2", 260],
  ["Open horizon", "Landscape", "1500530855697-b586d89ba3ee", 190],
  ["Working rhythm", "Workspace", "1497366754035-f200968a6e72", 230],
  ["Shared table", "Studio", "1524758631624-e2822e304c36", 300],
  ["In session", "People", "1521737711867-e3b97375f902", 210],
  ["After hours", "Office", "1504384308090-c894fdcc538d", 280],
] as const;
function page(start: number, count: number) {
  return Array.from({ length: count }, (_, offset) => {
    const index = start + offset,
      [title, category, photo, imageHeight] = scenes[index % scenes.length];
    return {
      id: `gallery-${index}`,
      title: `${title} ${Math.floor(index / scenes.length) + 1}`,
      category,
      image: `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=720&q=80`,
      imageHeight,
    };
  });
}
const items = ref(page(0, 12)),
  loading = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
function load() {
  if (loading.value || items.value.length >= 42) return;
  loading.value = true;
  timer = setTimeout(() => {
    items.value.push(
      ...page(items.value.length, Math.min(6, 42 - items.value.length)),
    );
    loading.value = false;
  }, 650);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>
<template>
  <div class="w-full max-w-5xl">
    <div class="mb-3 flex items-end justify-between gap-4 px-1">
      <div>
        <p class="text-sm font-semibold text-foreground">Visual index</p>
        <p class="mt-0.5 text-xs text-muted-foreground">
          Scroll to load the next page
        </p>
      </div>
      <p class="font-mono text-xs tabular-nums text-muted-foreground">
        {{ items.length }} items
      </p>
    </div>
    <InfiniteMasonry
      :items="items"
      :get-item-key="(item) => item.id"
      :has-more="items.length < 42"
      :loading="loading"
      :estimate-size="(item) => item.imageHeight + 66"
      aria-label="Visual inspiration gallery"
      class="h-[34rem]"
      @load-more="load"
      ><template #default="{ item }"
        ><figure
          class="overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div
            class="relative w-full overflow-hidden"
            :style="{ height: item.imageHeight + 'px' }"
          >
            <img
              :src="item.image"
              :alt="item.title"
              class="absolute inset-0 size-full object-cover"
            />
          </div>
          <figcaption class="flex items-start justify-between gap-3 p-3">
            <p class="text-sm font-medium text-foreground">{{ item.title }}</p>
            <p
              class="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {{ item.category }}
            </p>
          </figcaption>
        </figure></template
      ></InfiniteMasonry
    >
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### InfiniteMasonry

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `readonly T[]` | — | Yes | — |
| `getItemKey` | `(item: T, index: number) => string \| number \| bigint` | — | Yes | — |
| `hasMore` | `boolean` | `false` | Yes | — |
| `onLoadMore` | `() => void \| Promise<void>` | — | No | — |
| `loading` | `boolean` | `false` | No | — |
| `error` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | No | — |
| `estimateSize` | `(item: T, index: number) => number` | — | No | — |
| `minColumnWidth` | `number` | `208` | No | — |
| `maxColumns` | `number` | `4` | No | — |
| `gap` | `number` | `12` | No | — |
| `overscan` | `number` | `4` | No | — |
| `prefetch` | `number` | `3` | No | — |
| `animateItems` | `boolean` | `true` | No | — |
| `ariaLabel` | `string` | `"Infinite masonry feed"` | No | — |
| `contentClassName` | `string` | — | No | — |
| `itemClassName` | `string` | — | No | — |
| `emptyState` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |
| `endState` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `retry` | `[]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `empty` | `() => VNodeChild` | — | — |
| `loading` | — | `index: row.index - items.length` | — |
| `default` | — | `item: items[row.index]!`, `index: row.index` | — |
| `end` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Infinite Masonry

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Infinite Masonry?**

Configure Infinite Masonry through items, getItemKey, hasMore, onLoadMore, loading, error, estimateSize, minColumnWidth, maxColumns, gap, overscan, prefetch, animateItems, ariaLabel, contentClassName, itemClassName, emptyState, endState. The API table describes their types and defaults.

**How does it connect to application state?**

Observe retry to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Notification Stack](https://orvui.efu.me/en/components/blocks/notification-stack): Expand a compact stack of notifications into separately readable entries.
- [Expandable Tabs](https://orvui.efu.me/en/components/blocks/expandable-tabs): Navigate an icon strip whose selected item expands to display its label.
- [Bloom Menu](https://orvui.efu.me/en/components/blocks/bloom-menu): Open a group of actions around a shared center and restore focus when it closes.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/infinite-masonry.json
- Documentation: https://orvui.efu.me/en/components/blocks/infinite-masonry
- `packages/vue/src/blocks/infinite-masonry/src/InfiniteMasonry.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
