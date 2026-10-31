---
title: "Multi Select"
description: "Select several options and manage the resulting tags inside a searchable control."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/multi-select"
markdown: "https://orvui.efu.me/en/components/motion/multi-select.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Multi Select

> Select several options and manage the resulting tags inside a searchable control.

<a id="when-to-use"></a>

## When to use it

- Use Multi Select when the interface needs this behavior: select several options and manage the resulting tags inside a searchable control.

<a id="install"></a>
## Install

### Multi Select — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/multi-select.json
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

- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Multi Select

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Circle } from "lucide-vue-next";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectInput,
  MultiSelectContent,
  MultiSelectList,
  MultiSelectGroup,
  MultiSelectLabel,
  MultiSelectItem,
  MultiSelectEmpty,
} from "@/components/orvui/motion/multi-select";
const selected = ref(["design", "engineering"]);
const groups = [
  {
    label: "Product teams",
    items: [
      {
        value: "design",
        label: "Design",
        color: "fill-rose-500 text-rose-500",
      },
      {
        value: "engineering",
        label: "Engineering",
        color: "fill-sky-500 text-sky-500",
      },
      {
        value: "product",
        label: "Product",
        color: "fill-amber-500 text-amber-500",
      },
      {
        value: "research",
        label: "Research",
        color: "fill-violet-500 text-violet-500",
      },
    ],
  },
  {
    label: "Business teams",
    items: [
      {
        value: "marketing",
        label: "Marketing",
        color: "fill-emerald-500 text-emerald-500",
      },
      {
        value: "operations",
        label: "Operations",
        color: "fill-slate-500 text-slate-500",
      },
    ],
  },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center px-4 pt-24">
    <div class="w-full max-w-sm">
      <MultiSelect v-model="selected"
        ><MultiSelectTrigger
          ><MultiSelectValue placeholder="Choose teams" /><MultiSelectInput
            aria-label="Search teams" /></MultiSelectTrigger
        ><MultiSelectContent
          ><MultiSelectList aria-label="Teams"
            ><MultiSelectGroup v-for="group in groups" :key="group.label"
              ><MultiSelectLabel>{{ group.label }}</MultiSelectLabel
              ><MultiSelectItem
                v-for="team in group.items"
                :key="team.value"
                :value="team.value"
                :text-value="team.label"
                ><span class="flex items-center gap-2.5"
                  ><Circle
                    aria-hidden="true"
                    :class="['size-2.5', team.color]"
                  />{{ team.label }}</span
                ></MultiSelectItem
              ></MultiSelectGroup
            ><MultiSelectEmpty
              >No teams found.</MultiSelectEmpty
            ></MultiSelectList
          ></MultiSelectContent
        ></MultiSelect
      >
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Circle } from "lucide-vue-next";
import { MultiSelect, MultiSelectTrigger, MultiSelectValue, MultiSelectInput, MultiSelectContent, MultiSelectList, MultiSelectGroup, MultiSelectLabel, MultiSelectItem, MultiSelectEmpty } from "@orvui/vue/motion/multi-select";
const selected = ref(["design", "engineering"]);
const groups = [
  {
    label: "Product teams",
    items: [
      {
        value: "design",
        label: "Design",
        color: "fill-rose-500 text-rose-500",
      },
      {
        value: "engineering",
        label: "Engineering",
        color: "fill-sky-500 text-sky-500",
      },
      {
        value: "product",
        label: "Product",
        color: "fill-amber-500 text-amber-500",
      },
      {
        value: "research",
        label: "Research",
        color: "fill-violet-500 text-violet-500",
      },
    ],
  },
  {
    label: "Business teams",
    items: [
      {
        value: "marketing",
        label: "Marketing",
        color: "fill-emerald-500 text-emerald-500",
      },
      {
        value: "operations",
        label: "Operations",
        color: "fill-slate-500 text-slate-500",
      },
    ],
  },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center px-4 pt-24">
    <div class="w-full max-w-sm">
      <MultiSelect v-model="selected"
        ><MultiSelectTrigger
          ><MultiSelectValue placeholder="Choose teams" /><MultiSelectInput
            aria-label="Search teams" /></MultiSelectTrigger
        ><MultiSelectContent
          ><MultiSelectList aria-label="Teams"
            ><MultiSelectGroup v-for="group in groups" :key="group.label"
              ><MultiSelectLabel>{{ group.label }}</MultiSelectLabel
              ><MultiSelectItem
                v-for="team in group.items"
                :key="team.value"
                :value="team.value"
                :text-value="team.label"
                ><span class="flex items-center gap-2.5"
                  ><Circle
                    aria-hidden="true"
                    :class="['size-2.5', team.color]"
                  />{{ team.label }}</span
                ></MultiSelectItem
              ></MultiSelectGroup
            ><MultiSelectEmpty
              >No teams found.</MultiSelectEmpty
            ></MultiSelectList
          ></MultiSelectContent
        ></MultiSelect
      >
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `MultiSelect` | `v-model` | `string[]` | `update:modelValue` |
| `MultiSelect` | `v-model:open` | `boolean` | `update:open` |
| `MultiSelect` | `v-model:query` | `string` | `update:query` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### MultiSelect

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string[]` | — | No | — |
| `defaultValue` | `string[]` | `(multiple ? [] : undefined)` | No | — |
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

### MultiSelectTrigger

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MultiSelectValue

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Select options"` | No | — |
| `chipClassName` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `value: value`, `label: state.labelFor(value)` | — |

### MultiSelectInput

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Search…"` | No | — |
| `wrapperClassName` | `string` | — | No | — |
| `showIcon` | `boolean` | `false` | No | — |

### MultiSelectContent

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

### MultiSelectList

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `"Options"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MultiSelectGroup

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MultiSelectLabel

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MultiSelectItem

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

### MultiSelectEmpty

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Multi Select

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Multi Select?**

Use modelValue as a string array with update:modelValue to own the selected values; otherwise supply defaultValue.

**How does it connect to application state?**

Observe update:modelValue, change, update:open, update:query to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Combobox](https://orvui.efu.me/en/components/motion/combobox): Filter a grouped option list from an input while keeping keyboard focus in the field.
- [Select](https://orvui.efu.me/en/components/motion/select): Choose from a floating list whose panel can expand continuously from its trigger.
- [Tooltip](https://orvui.efu.me/en/components/motion/tooltip): Reveal a short contextual label on hover or focus without displacing nearby content.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/multi-select.json
- Documentation: https://orvui.efu.me/en/components/motion/multi-select
- `packages/vue/src/motion/multi-select/src/MultiSelect.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectTrigger.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectValue.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectInput.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectContent.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectList.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectGroup.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectLabel.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectItem.vue`
- `packages/vue/src/motion/multi-select/src/MultiSelectEmpty.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
