---
title: "Combobox"
description: "Filter a grouped option list from an input while keeping keyboard focus in the field."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/combobox"
markdown: "https://orvui.efu.me/en/components/motion/combobox.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Combobox

> Filter a grouped option list from an input while keeping keyboard focus in the field.

<a id="when-to-use"></a>

## When to use it

- Use Combobox when the interface needs this behavior: filter a grouped option list from an input while keeping keyboard focus in the field.

<a id="install"></a>
## Install

### Combobox — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/combobox.json
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
### Combobox

**Registry source**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { Blocks, Box, Component, Layers3 } from "lucide-vue-next";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxSeparator,
  ComboboxLabel,
  ComboboxItem,
} from "@/components/orvui/motion/combobox";
const selected = ref("studio");
const workspaces = [
  {
    value: "studio",
    label: "Design studio",
    detail: "12 projects",
    group: "Recent",
    icon: Component,
    color: "bg-amber-400/20 text-amber-700 dark:text-amber-300",
  },
  {
    value: "product",
    label: "Product team",
    detail: "8 projects",
    group: "Recent",
    icon: Layers3,
    color: "bg-sky-400/20 text-sky-700 dark:text-sky-300",
  },
  {
    value: "playground",
    label: "Playground",
    detail: "24 experiments",
    group: "Workspaces",
    icon: Blocks,
    color: "bg-emerald-400/20 text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "archive",
    label: "Component archive",
    detail: "41 components",
    group: "Workspaces",
    icon: Box,
    color: "bg-rose-400/20 text-rose-700 dark:text-rose-300",
  },
];
const groups = computed(() =>
  ["Recent", "Workspaces"].map((label) => ({
    label,
    items: workspaces.filter((item) => item.group === label),
  })),
);
</script>
<template>
  <div class="w-full max-w-72">
    <p class="mb-2 text-xs font-medium text-muted-foreground">Workspace</p>
    <Combobox v-model="selected"
      ><ComboboxTrigger class="h-12 rounded-2xl px-2.5"
        ><ComboboxInput
          aria-label="Search workspaces"
          placeholder="Search workspaces…" /></ComboboxTrigger
      ><ComboboxContent class="w-72 rounded-2xl"
        ><ComboboxList aria-label="Workspaces" class="p-2"
          ><ComboboxEmpty>No workspaces found.</ComboboxEmpty
          ><ComboboxGroup v-for="(group, index) in groups" :key="group.label"
            ><ComboboxSeparator v-if="index" /><ComboboxLabel>{{
              group.label
            }}</ComboboxLabel
            ><ComboboxItem
              v-for="workspace in group.items"
              :key="workspace.value"
              :value="workspace.value"
              :text-value="workspace.label"
              :keywords="[workspace.detail, workspace.group]"
              class="py-2"
              ><span class="flex min-w-0 items-center gap-2.5"
                ><span
                  :class="[
                    'grid size-7 shrink-0 place-items-center rounded-lg',
                    workspace.color,
                  ]"
                  ><component :is="workspace.icon" class="size-3.5" /></span
                ><span class="min-w-0"
                  ><span class="block truncate font-medium text-foreground">{{
                    workspace.label
                  }}</span
                  ><span class="block truncate text-xs text-muted-foreground">{{
                    workspace.detail
                  }}</span></span
                ></span
              ></ComboboxItem
            ></ComboboxGroup
          ></ComboboxList
        ></ComboboxContent
      ></Combobox
    >
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { Blocks, Box, Component, Layers3 } from "lucide-vue-next";
import { Combobox, ComboboxTrigger, ComboboxInput, ComboboxContent, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxSeparator, ComboboxLabel, ComboboxItem } from "@orvui/vue/motion/combobox";
const selected = ref("studio");
const workspaces = [
  {
    value: "studio",
    label: "Design studio",
    detail: "12 projects",
    group: "Recent",
    icon: Component,
    color: "bg-amber-400/20 text-amber-700 dark:text-amber-300",
  },
  {
    value: "product",
    label: "Product team",
    detail: "8 projects",
    group: "Recent",
    icon: Layers3,
    color: "bg-sky-400/20 text-sky-700 dark:text-sky-300",
  },
  {
    value: "playground",
    label: "Playground",
    detail: "24 experiments",
    group: "Workspaces",
    icon: Blocks,
    color: "bg-emerald-400/20 text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "archive",
    label: "Component archive",
    detail: "41 components",
    group: "Workspaces",
    icon: Box,
    color: "bg-rose-400/20 text-rose-700 dark:text-rose-300",
  },
];
const groups = computed(() =>
  ["Recent", "Workspaces"].map((label) => ({
    label,
    items: workspaces.filter((item) => item.group === label),
  })),
);
</script>
<template>
  <div class="w-full max-w-72">
    <p class="mb-2 text-xs font-medium text-muted-foreground">Workspace</p>
    <Combobox v-model="selected"
      ><ComboboxTrigger class="h-12 rounded-2xl px-2.5"
        ><ComboboxInput
          aria-label="Search workspaces"
          placeholder="Search workspaces…" /></ComboboxTrigger
      ><ComboboxContent class="w-72 rounded-2xl"
        ><ComboboxList aria-label="Workspaces" class="p-2"
          ><ComboboxEmpty>No workspaces found.</ComboboxEmpty
          ><ComboboxGroup v-for="(group, index) in groups" :key="group.label"
            ><ComboboxSeparator v-if="index" /><ComboboxLabel>{{
              group.label
            }}</ComboboxLabel
            ><ComboboxItem
              v-for="workspace in group.items"
              :key="workspace.value"
              :value="workspace.value"
              :text-value="workspace.label"
              :keywords="[workspace.detail, workspace.group]"
              class="py-2"
              ><span class="flex min-w-0 items-center gap-2.5"
                ><span
                  :class="[
                    'grid size-7 shrink-0 place-items-center rounded-lg',
                    workspace.color,
                  ]"
                  ><component :is="workspace.icon" class="size-3.5" /></span
                ><span class="min-w-0"
                  ><span class="block truncate font-medium text-foreground">{{
                    workspace.label
                  }}</span
                  ><span class="block truncate text-xs text-muted-foreground">{{
                    workspace.detail
                  }}</span></span
                ></span
              ></ComboboxItem
            ></ComboboxGroup
          ></ComboboxList
        ></ComboboxContent
      ></Combobox
    >
  </div>
</template>
```

## Component Guide

<a id="composition"></a>
### Composition

Compose Combobox with its public parts: Combobox, ComboboxTrigger, ComboboxInput, ComboboxContent, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxSeparator, ComboboxLabel, ComboboxItem. Import these names from the component barrel.

```text
Combobox
├── ComboboxTrigger
│   └── ComboboxInput
└── ComboboxContent
    └── ComboboxList
        ├── ComboboxEmpty
        ├── ComboboxGroup
        │   ├── ComboboxLabel
        │   └── ComboboxItem
        └── ComboboxSeparator
```

<a id="behavior"></a>
### How it works

Filter a grouped option list from an input while keeping keyboard focus in the field.

### Lifecycle

#### Initialize

Configure Combobox through modelValue, defaultValue, open, defaultOpen, query, defaultQuery, disabled, filter. The API table describes their types and defaults.

#### Update

Observe update:modelValue, change, update:open, update:query to connect the component to application state.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Combobox parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes Combobox, ComboboxTrigger, ComboboxInput, ComboboxContent, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxSeparator, ComboboxLabel, ComboboxItem through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

### Contract

- Owns: Combobox owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Combobox when the interface needs this behavior: filter a grouped option list from an input while keeping keyboard focus in the field.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `Combobox` | `v-model` | `string` | `update:modelValue` |
| `Combobox` | `v-model:open` | `boolean` | `update:open` |
| `Combobox` | `v-model:query` | `string` | `update:query` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### Combobox

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | — | No | — |
| `defaultValue` | `string` | `(multiple ? [] : undefined)` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `query` | `string` | — | No | — |
| `defaultQuery` | `string` | `""` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `filter` | `(value: string, query: string, keywords: string[]) => boolean` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `update:open` | — | — |
| `update:query` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value`, `open: state.open.value`, `query: state.query.value` | — |

### ComboboxTrigger

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ComboboxInput

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Search…"` | No | — |
| `wrapperClassName` | `string` | — | No | — |
| `showIcon` | `boolean` | `true` | No | — |

### ComboboxContent

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom"` | `"bottom"` | No | — |
| `align` | `"start" \| "center" \| "end"` | `"start"` | No | — |
| `sideOffset` | `number` | `6` | No | — |
| `avoidCollisions` | `boolean` | `true` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ComboboxList

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `"Options"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ComboboxEmpty

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ComboboxGroup

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ComboboxSeparator

### ComboboxLabel

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ComboboxItem

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | — |
| `textValue` | `string` | — | No | — |
| `label` | `string` | — | No | — |
| `keywords` | `string[]` | `() => []` | No | — |
| `disabled` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `select` | `[value: string]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Combobox

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Combobox?**

Configure Combobox through modelValue, defaultValue, open, defaultOpen, query, defaultQuery, disabled, filter. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change, update:open, update:query to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Multi Select](https://orvui.efu.me/en/components/motion/multi-select): Select several options and manage the resulting tags inside a searchable control.
- [Sortable List](https://orvui.efu.me/en/components/motion/sortable-stack): Reorder a list with pointer or keyboard input and offer an undo operation.
- [Image Viewer](https://orvui.efu.me/en/components/motion/image-viewer): Open a gallery image from its thumbnail and navigate, zoom or pan the enlarged view.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/combobox.json
- Documentation: https://orvui.efu.me/en/components/motion/combobox
- `packages/vue/src/motion/combobox/src/Combobox.vue`
- `packages/vue/src/motion/combobox/src/ComboboxTrigger.vue`
- `packages/vue/src/motion/combobox/src/ComboboxInput.vue`
- `packages/vue/src/motion/combobox/src/ComboboxContent.vue`
- `packages/vue/src/motion/combobox/src/ComboboxList.vue`
- `packages/vue/src/motion/combobox/src/ComboboxEmpty.vue`
- `packages/vue/src/motion/combobox/src/ComboboxGroup.vue`
- `packages/vue/src/motion/combobox/src/ComboboxSeparator.vue`
- `packages/vue/src/motion/combobox/src/ComboboxLabel.vue`
- `packages/vue/src/motion/combobox/src/ComboboxItem.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
