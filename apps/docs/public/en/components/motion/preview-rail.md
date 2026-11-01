---
title: "Preview Rail"
description: "Preview navigation targets from a compact rail that expands around the focused item."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/preview-rail"
markdown: "https://orvui.efu.me/en/components/motion/preview-rail.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Preview Rail

> Preview navigation targets from a compact rail that expands around the focused item.

<a id="when-to-use"></a>

## When to use it

- Use Preview Rail when the interface needs this behavior: preview navigation targets from a compact rail that expands around the focused item.

<a id="install"></a>
## Install

### Preview Rail — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/preview-rail.json
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
### Preview Rail

**Registry source**

```vue
<script setup lang="ts">
import { PreviewRail } from "@/components/orvui/motion/preview-rail";
const sections = [
  ["dashboard", "Dashboard", "Return to your workspace overview and recent activity."],
  ["components", "Components", "Browse motion primitives for Vue."],
  ["blocks", "Blocks", "Explore composed, product-ready interface blocks."],
  ["playground", "Playground", "Tune motion values and preview behavior live."],
  ["docs", "Documentation", "Read installation, usage, and API reference notes."],
  ["changelog", "Changelog", "Review newly launched components and improvements."],
  ["source", "Open source", "Explore the component source and implementation notes."],
  ["patterns", "Patterns", "Combine components in reusable interface patterns."],
  ["examples", "Examples", "See components composed in practical interface patterns."],
  ["templates", "Templates", "Start from polished layouts built with orvui components."],
  ["guides", "Guides", "Learn how to combine motion primitives effectively."],
  ["community", "Community", "Discover what other builders are creating with orvui."],
  ["github", "GitHub", "View the source, report issues, and contribute improvements."],
  ["about", "About", "Learn more about the ideas and people behind orvui."],
].map(([id, label, description]) => ({ id, label, description, href: `#${id}` }));
</script>
<template><div class="flex w-full flex-col gap-8"><PreviewRail v-for="orientation in ['vertical', 'horizontal'] as const" :key="orientation" :items="sections" :orientation="orientation" default-active-id="docs" :class="['mx-auto w-full max-w-2xl', orientation === 'vertical' ? 'h-[360px]' : 'h-[280px]']" /></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { PreviewRail } from "@orvui/vue/motion/preview-rail";
const sections = [
  ["dashboard", "Dashboard", "Return to your workspace overview and recent activity."],
  ["components", "Components", "Browse motion primitives for Vue."],
  ["blocks", "Blocks", "Explore composed, product-ready interface blocks."],
  ["playground", "Playground", "Tune motion values and preview behavior live."],
  ["docs", "Documentation", "Read installation, usage, and API reference notes."],
  ["changelog", "Changelog", "Review newly launched components and improvements."],
  ["source", "Open source", "Explore the component source and implementation notes."],
  ["patterns", "Patterns", "Combine components in reusable interface patterns."],
  ["examples", "Examples", "See components composed in practical interface patterns."],
  ["templates", "Templates", "Start from polished layouts built with orvui components."],
  ["guides", "Guides", "Learn how to combine motion primitives effectively."],
  ["community", "Community", "Discover what other builders are creating with orvui."],
  ["github", "GitHub", "View the source, report issues, and contribute improvements."],
  ["about", "About", "Learn more about the ideas and people behind orvui."],
].map(([id, label, description]) => ({ id, label, description, href: `#${id}` }));
</script>
<template><div class="flex w-full flex-col gap-8"><PreviewRail v-for="orientation in ['vertical', 'horizontal'] as const" :key="orientation" :items="sections" :orientation="orientation" default-active-id="docs" :class="['mx-auto w-full max-w-2xl', orientation === 'vertical' ? 'h-[360px]' : 'h-[280px]']" /></div></template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `PreviewRail` | `v-model:activeId` | `string` | `update:activeId` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### PreviewRail

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `RailItem[]` | — | Yes | — |
| `label` | `string` | `"Section navigation"` | No | — |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | No | — |
| `activeId` | `string` | — | No | — |
| `defaultActiveId` | `string` | `props.items[0]?.id` | No | — |
| `showPreview` | `boolean` | `true` | No | — |
| `previewSide` | `"before" \| "after"` | `"after"` | No | — |
| `highlightActive` | `boolean` | `false` | No | — |
| `itemSize` | `number` | `24` | No | — |
| `railClassName` | `string` | — | No | — |
| `previewContainerClassName` | `string` | — | No | — |
| `previewClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:activeId` | `[id: string]` | — |
| `activeChange` | `[id: string]` | — |
| `itemSelect` | `[item: RailItem]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `preview` | — | `item: item` | — |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Preview Rail

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Preview Rail?**

Configure Preview Rail through items, label, orientation, activeId, defaultActiveId, showPreview, previewSide, highlightActive, itemSize, railClassName, previewContainerClassName, previewClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:activeId, activeChange, itemSelect to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Dock](https://orvui.efu.me/en/components/motion/dock): Group compact navigation actions around an indicator that follows the active item.
- [Scroll Animation](https://orvui.efu.me/en/components/motion/scroll-animation): Connect scrolling to progress, parallax, reveal effects and deliberate navigation.
- [Shared Layout Background](https://orvui.efu.me/en/components/motion/shared-layout-bg): Move one background surface between registered items to indicate a current selection.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/preview-rail.json
- Documentation: https://orvui.efu.me/en/components/motion/preview-rail
- `packages/vue/src/motion/preview-rail/src/PreviewRail.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
