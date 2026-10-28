---
title: "Select"
description: "Choose from a floating list whose panel can expand continuously from its trigger."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/select"
markdown: "https://orvui.efu.me/en/components/motion/select.md"
license: "MIT"
productVersion: "0.1.0"
---

# Select

> Choose from a floating list whose panel can expand continuously from its trigger.

Choose from a floating list whose panel can expand continuously from its trigger.

## When to use it

- Use Select when the interface needs this behavior: choose from a floating list whose panel can expand continuously from its trigger.

## Install

### Select — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/select.json
```

### Select — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/select.json
```

### Morph Select — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/select-morph.json
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

- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

## Usage

### Select

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/orvui/motion/select";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <Select v-model="selected"
      ><SelectTrigger
        ><SelectValue placeholder="Pick a Vue tool" /></SelectTrigger
      ><SelectContent
        ><SelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</SelectItem
        ></SelectContent
      ></Select
    >
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@orvui/vue/motion/select";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <Select v-model="selected"
      ><SelectTrigger
        ><SelectValue placeholder="Pick a Vue tool" /></SelectTrigger
      ><SelectContent
        ><SelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</SelectItem
        ></SelectContent
      ></Select
    >
  </div>
</template>
```

### Select

Compose trigger, value and options around a detached panel that chooses the available side.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/orvui/motion/select";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <Select v-model="selected"
      ><SelectTrigger
        ><SelectValue placeholder="Pick a Vue tool" /></SelectTrigger
      ><SelectContent
        ><SelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</SelectItem
        ></SelectContent
      ></Select
    >
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@orvui/vue/motion/select";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <Select v-model="selected"
      ><SelectTrigger
        ><SelectValue placeholder="Pick a Vue tool" /></SelectTrigger
      ><SelectContent
        ><SelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</SelectItem
        ></SelectContent
      ></Select
    >
  </div>
</template>
```

### Morph Select

Use matching shared-layout parts so the trigger grows into the option surface.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  MorphSelect,
  MorphSelectTrigger,
  MorphSelectValue,
  MorphSelectContent,
  MorphSelectItem,
} from "@/components/orvui/motion/select";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <MorphSelect v-model="selected"
      ><MorphSelectTrigger
        ><MorphSelectValue placeholder="Pick a Vue tool" /></MorphSelectTrigger
      ><MorphSelectContent
        ><MorphSelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</MorphSelectItem
        ></MorphSelectContent
      ></MorphSelect
    >
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { MorphSelect, MorphSelectTrigger, MorphSelectValue, MorphSelectContent, MorphSelectItem } from "@orvui/vue/motion/select";
const selected = ref("vue");
const tools = [
  { value: "vue", label: "Vue" },
  { value: "vite", label: "Vite" },
  { value: "vue-router", label: "Vue Router" },
  { value: "pinia", label: "Pinia" },
];
</script>
<template>
  <div class="w-56">
    <MorphSelect v-model="selected"
      ><MorphSelectTrigger
        ><MorphSelectValue placeholder="Pick a Vue tool" /></MorphSelectTrigger
      ><MorphSelectContent
        ><MorphSelectItem
          v-for="tool in tools"
          :key="tool.value"
          :value="tool.value"
          >{{ tool.label }}</MorphSelectItem
        ></MorphSelectContent
      ></MorphSelect
    >
  </div>
</template>
```

## API Reference

### Select

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | `props.value` | No | — |
| `value` | `string` | — | No | — |
| `defaultValue` | `string` | — | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `valueChange` | — | — |
| `change` | — | — |
| `update:open` | — | — |
| `openChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value`, `open: state.open.value` | — |

### SelectTrigger

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SelectValue

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Select"` | No | — |
| `className` | `string` | — | No | — |

### SelectContent

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SelectItem

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | — |
| `disabled` | `boolean` | `false` | No | — |
| `label` | `string` | `element.value?.textContent?.trim()` | No | — |
| `className` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MorphSelect

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | `props.value` | No | — |
| `value` | `string` | — | No | — |
| `defaultValue` | `string` | — | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `className` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `valueChange` | — | — |
| `change` | — | — |
| `update:open` | — | — |
| `openChange` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value`, `open: state.open.value` | — |

### MorphSelectTrigger

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MorphSelectValue

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | — | No | — |
| `className` | `string` | — | No | — |

### MorphSelectContent

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MorphSelectItem

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | — |
| `disabled` | `boolean` | `false` | No | — |
| `label` | `string` | — | No | — |
| `className` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## About Select

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Select?**

Configure Select through modelValue, value, defaultValue, open, defaultOpen, disabled, className. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valueChange, change, update:open, openChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/select.json
- Documentation: https://orvui.efu.me/en/components/motion/select
- `packages/vue/src/motion/select/src/Select.vue`
- `packages/vue/src/motion/select/src/SelectTrigger.vue`
- `packages/vue/src/motion/select/src/SelectValue.vue`
- `packages/vue/src/motion/select/src/SelectContent.vue`
- `packages/vue/src/motion/select/src/SelectItem.vue`
- `packages/vue/src/motion/select/src/MorphSelect.vue`
- `packages/vue/src/motion/select/src/MorphSelectTrigger.vue`
- `packages/vue/src/motion/select/src/MorphSelectValue.vue`
- `packages/vue/src/motion/select/src/MorphSelectContent.vue`
- `packages/vue/src/motion/select/src/MorphSelectItem.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
