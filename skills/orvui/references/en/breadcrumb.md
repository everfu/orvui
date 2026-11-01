# Animated Breadcrumb · orvui 0.1.1

## Selection and composition

Use Tabs for related views in one page, Breadcrumb for page hierarchy, Table of Contents for article navigation and Animated Sidebar for workspace sections.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Animated Breadcrumb"
description: "Show the current location in a hierarchy and collapse intermediate links when space is limited."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/breadcrumb"
markdown: "https://orvui.efu.me/en/components/motion/breadcrumb.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Animated Breadcrumb

> Show the current location in a hierarchy and collapse intermediate links when space is limited.

<a id="when-to-use"></a>

## When to use it

- Use on nested pages to show the current location and offer direct links to parent pages.

<a id="install"></a>
## Install

### Animated Breadcrumb — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/breadcrumb.json
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
### Animated Breadcrumb

**Registry source**

```vue
<script setup lang="ts">
import { nextTick, ref } from "vue";
import { ArrowUpRight, Folder, Home } from "lucide-vue-next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/orvui/motion/breadcrumb";
const segments = "Workspace/Projects/Website/Design system/Components/Navigation/Breadcrumb".split("/");
const current = ref(5), root = ref<HTMLElement | null>(null);
async function navigate(index: number, event?: MouseEvent) {
  if (event && (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)) return;
  event?.preventDefault(); current.value = index;
  await nextTick(); root.value?.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
}
</script>
<template>
  <div ref="root" class="w-full max-w-lg space-y-8 px-4">
    <Breadcrumb class="min-h-[4.25rem] sm:min-h-8"><BreadcrumbList :max-items="3">
      <BreadcrumbItem v-for="(segment, index) in segments.slice(0, current + 1)" :key="segment">
        <BreadcrumbSeparator v-if="index > 0" />
        <BreadcrumbPage v-if="index === current" :tabindex="-1"><Home v-if="index === 0" aria-hidden="true" />{{ segment }}</BreadcrumbPage>
        <BreadcrumbLink v-else :href="`#${segment.toLowerCase()}`" @click="navigate(index, $event)"><Home v-if="index === 0" aria-hidden="true" />{{ segment }}</BreadcrumbLink>
      </BreadcrumbItem>
    </BreadcrumbList></Breadcrumb>
    <div class="min-h-20 border-t border-border/60 pt-5">
      <button v-if="current < segments.length - 1" type="button" @click="navigate(Math.min(current + 1, segments.length - 1))"
        class="flex w-full items-center gap-3 rounded-lg border border-border/60 px-4 py-3 text-start text-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Folder aria-hidden="true" class="size-4 text-muted-foreground" /><span class="flex-1">{{ segments[current + 1] }}</span><ArrowUpRight aria-hidden="true" class="size-3.5 text-muted-foreground" />
      </button>
      <p v-else class="py-3 text-center text-sm text-muted-foreground">Choose a parent path to go back.</p>
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { nextTick, ref } from "vue";
import { ArrowUpRight, Folder, Home } from "lucide-vue-next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@orvui/vue/motion/breadcrumb";
const segments = "Workspace/Projects/Website/Design system/Components/Navigation/Breadcrumb".split("/");
const current = ref(5), root = ref<HTMLElement | null>(null);
async function navigate(index: number, event?: MouseEvent) {
  if (event && (event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)) return;
  event?.preventDefault(); current.value = index;
  await nextTick(); root.value?.querySelector<HTMLElement>('[aria-current="page"]')?.focus();
}
</script>
<template>
  <div ref="root" class="w-full max-w-lg space-y-8 px-4">
    <Breadcrumb class="min-h-[4.25rem] sm:min-h-8"><BreadcrumbList :max-items="3">
      <BreadcrumbItem v-for="(segment, index) in segments.slice(0, current + 1)" :key="segment">
        <BreadcrumbSeparator v-if="index > 0" />
        <BreadcrumbPage v-if="index === current" :tabindex="-1"><Home v-if="index === 0" aria-hidden="true" />{{ segment }}</BreadcrumbPage>
        <BreadcrumbLink v-else :href="`#${segment.toLowerCase()}`" @click="navigate(index, $event)"><Home v-if="index === 0" aria-hidden="true" />{{ segment }}</BreadcrumbLink>
      </BreadcrumbItem>
    </BreadcrumbList></Breadcrumb>
    <div class="min-h-20 border-t border-border/60 pt-5">
      <button v-if="current < segments.length - 1" type="button" @click="navigate(Math.min(current + 1, segments.length - 1))"
        class="flex w-full items-center gap-3 rounded-lg border border-border/60 px-4 py-3 text-start text-sm transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Folder aria-hidden="true" class="size-4 text-muted-foreground" /><span class="flex-1">{{ segments[current + 1] }}</span><ArrowUpRight aria-hidden="true" class="size-3.5 text-muted-foreground" />
      </button>
      <p v-else class="py-3 text-center text-sm text-muted-foreground">Choose a parent path to go back.</p>
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### Breadcrumb

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `"Breadcrumb"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### BreadcrumbItem

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### BreadcrumbLink

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `href` | `string` | — | No | — |
| `as` | `any` | `"a"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### BreadcrumbList

### BreadcrumbPage

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### BreadcrumbSeparator

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### BreadcrumbEllipsis

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Show hidden paths"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Animated Breadcrumb

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Animated Breadcrumb?**

Choose a native destination element through the as prop, and supply the corresponding link attributes.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Animated Context Menu](https://orvui.efu.me/en/components/motion/context-menu): Open a menu at a pointer position with checkbox, radio and submenu compositions.
- [Image Viewer](https://orvui.efu.me/en/components/motion/image-viewer): Open a gallery image from its thumbnail and navigate, zoom or pan the enlarged view.
- [Date Range Picker](https://orvui.efu.me/en/components/motion/date-range-picker): Choose the beginning and end of a date interval in an inline or floating calendar.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/breadcrumb.json
- Documentation: https://orvui.efu.me/en/components/motion/breadcrumb
- `packages/vue/src/motion/breadcrumb/src/Breadcrumb.vue`
- `packages/vue/src/motion/breadcrumb/src/BreadcrumbItem.vue`
- `packages/vue/src/motion/breadcrumb/src/BreadcrumbLink.vue`
- `packages/vue/src/motion/breadcrumb/src/BreadcrumbList.vue`
- `packages/vue/src/motion/breadcrumb/src/BreadcrumbPage.vue`
- `packages/vue/src/motion/breadcrumb/src/BreadcrumbSeparator.vue`
- `packages/vue/src/motion/breadcrumb/src/BreadcrumbEllipsis.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

