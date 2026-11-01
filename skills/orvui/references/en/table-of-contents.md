# Table of Contents · orvui 0.1.1

## Selection and composition

Use Tabs for related views in one page, Breadcrumb for page hierarchy, Table of Contents for article navigation and Animated Sidebar for workspace sections.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Table of Contents"
description: "Navigate article sections with accessible anchor links and an indicator that follows the reading position."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/table-of-contents"
markdown: "https://orvui.efu.me/en/components/motion/table-of-contents.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Table of Contents

> Navigate article sections with accessible anchor links and an indicator that follows the reading position.

<a id="when-to-use"></a>

## When to use it

- Add an outline to long guides, reference pages or articles so readers can jump between sections and keep their place.

<a id="install"></a>
## Install

### Table of Contents — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/table-of-contents.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Table of Contents

**Registry source**

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { TableOfContents } from "@/components/orvui/motion/table-of-contents";
const target = ref<HTMLElement | null>(null);
const instance = useId();
const items = ["Overview", "Installation", "Usage", "Accessibility"].map(
  (label, i) => ({ id: `${instance}-section-${i}`, label }),
);
</script>
<template>
  <div class="grid w-full max-w-2xl grid-cols-[minmax(0,1fr)_9rem] gap-5 p-4">
    <div
      ref="target"
      class="h-72 overflow-y-auto rounded-xl border border-border bg-background px-5"
      tabindex="0"
      aria-label="Example article"
    >
      <section
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        class="min-h-52 py-6"
      >
        <h3 class="text-base font-medium">{{ item.label }}</h3>
        <p class="mt-3 text-sm leading-6 text-muted-foreground">
          Follow this article using the links alongside it. The active section
          updates as you scroll.
        </p>
      </section>
    </div>
    <TableOfContents
      :items="items"
      :target="target ?? undefined"
      :offset="16"
    />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { TableOfContents } from "@orvui/vue/motion/table-of-contents";
const target = ref<HTMLElement | null>(null);
const instance = useId();
const items = ["Overview", "Installation", "Usage", "Accessibility"].map(
  (label, i) => ({ id: `${instance}-section-${i}`, label }),
);
</script>
<template>
  <div class="grid w-full max-w-2xl grid-cols-[minmax(0,1fr)_9rem] gap-5 p-4">
    <div
      ref="target"
      class="h-72 overflow-y-auto rounded-xl border border-border bg-background px-5"
      tabindex="0"
      aria-label="Example article"
    >
      <section
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        class="min-h-52 py-6"
      >
        <h3 class="text-base font-medium">{{ item.label }}</h3>
        <p class="mt-3 text-sm leading-6 text-muted-foreground">
          Follow this article using the links alongside it. The active section
          updates as you scroll.
        </p>
      </section>
    </div>
    <TableOfContents
      :items="items"
      :target="target ?? undefined"
      :offset="16"
    />
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `TableOfContents` | `v-model` | `string` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### TableOfContents

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `TableOfContentsItem[]` | — | Yes | — |
| `target` | `string \| HTMLElement \| ComponentPublicInstance \| Ref<HTMLElement \| ComponentPublicInstance \| null \| undefined, HTMLElement \| ComponentPublicInstance \| null \| undefined> \| () => HTMLElement \| null` | — | No | — |
| `offset` | `number` | `88` | No | — |
| `modelValue` | `string` | `local.value` | No | — |
| `title` | `string` | `"On this page"` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `[id: string]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `title` | `() => unknown` | — | — |
| `item` | `(props: { item: TableOfContentsItem; active: boolean; }) => unknown` | `item: item`, `active: active === item.id` | — |

<a id="about"></a>
## About Table of Contents

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Table of Contents?**

Pass items with stable section IDs and a target article element or selector. Use modelValue and update:modelValue to observe the reading position; offset defaults to 88px.

**How does it connect to application state?**

Observe update:modelValue to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Timeline](https://orvui.efu.me/en/components/motion/timeline): Browse dated milestones on a draggable track that keeps the selected event in focus.
- [Animated Alert](https://orvui.efu.me/en/components/motion/alert): Present feedback in a compact message row with optional actions and dismissal.
- [Animated Collapsible](https://orvui.efu.me/en/components/motion/collapsible): Connect a trigger to an expandable region while preserving the surrounding layout.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/table-of-contents.json
- Documentation: https://orvui.efu.me/en/components/motion/table-of-contents
- `packages/vue/src/motion/table-of-contents/src/TableOfContents.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

