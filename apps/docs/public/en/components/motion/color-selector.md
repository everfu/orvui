---
title: "Animated Color Selector"
description: "Choose one named swatch with a moving selection outline and native radio behavior."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/color-selector"
markdown: "https://orvui.efu.me/en/components/motion/color-selector.md"
license: "MIT"
productVersion: "0.1.0"
---

# Animated Color Selector

> Choose one named swatch with a moving selection outline and native radio behavior.

Choose one named swatch with a moving selection outline and native radio behavior.

## When to use it

- Use Animated Color Selector when the interface needs this behavior: choose one named swatch with a moving selection outline and native radio behavior.

## Install

### Animated Color Selector — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/color-selector.json
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Animated Color Selector

**Registry source**

```vue
<script setup lang="ts">
import { ColorSelector, ColorSelectorItem, ColorSelectorLabel, ColorSelectorList } from "@/components/orvui/motion/color-selector";
const swatches = [
  { value: "blue", color: "#3478f6", label: "Blue" }, { value: "purple", color: "#9270e8", label: "Purple" },
  { value: "pink", color: "#e66aa4", label: "Pink" }, { value: "red", color: "#e55656", label: "Red" },
  { value: "orange", color: "#ed9141", label: "Orange" }, { value: "amber", color: "#e5b63c", label: "Amber" },
  { value: "green", color: "#65a65a", label: "Green" }, { value: "teal", color: "#169d83", label: "Teal" },
];
</script>
<template>
  <ColorSelector default-value="blue" name="accent"><ColorSelectorLabel>Accent</ColorSelectorLabel><ColorSelectorList>
    <ColorSelectorItem v-for="swatch in swatches" :key="swatch.value" v-bind="swatch" />
  </ColorSelectorList></ColorSelector>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ColorSelector, ColorSelectorItem, ColorSelectorLabel, ColorSelectorList } from "@orvui/vue/motion/color-selector";
const swatches = [
  { value: "blue", color: "#3478f6", label: "Blue" }, { value: "purple", color: "#9270e8", label: "Purple" },
  { value: "pink", color: "#e66aa4", label: "Pink" }, { value: "red", color: "#e55656", label: "Red" },
  { value: "orange", color: "#ed9141", label: "Orange" }, { value: "amber", color: "#e5b63c", label: "Amber" },
  { value: "green", color: "#65a65a", label: "Green" }, { value: "teal", color: "#169d83", label: "Teal" },
];
</script>
<template>
  <ColorSelector default-value="blue" name="accent"><ColorSelectorLabel>Accent</ColorSelectorLabel><ColorSelectorList>
    <ColorSelectorItem v-for="swatch in swatches" :key="swatch.value" v-bind="swatch" />
  </ColorSelectorList></ColorSelector>
</template>
```

## API Reference

### ColorSelector

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | — | No | — |
| `defaultValue` | `string` | `""` | No | — |
| `name` | `string` | `instanceId` | No | — |
| `form` | `string` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `required` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ColorSelectorItem

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | — |
| `color` | `string` | — | Yes | — |
| `label` | `string` | — | Yes | — |
| `disabled` | `boolean` | `false` | No | — |

### ColorSelectorLabel

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### ColorSelectorList

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

## About Animated Color Selector

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Animated Color Selector?**

Configure Animated Color Selector through modelValue, defaultValue, name, form, disabled, required. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/color-selector.json
- Documentation: https://orvui.efu.me/en/components/motion/color-selector
- `packages/vue/src/motion/color-selector/src/ColorSelector.vue`
- `packages/vue/src/motion/color-selector/src/ColorSelectorItem.vue`
- `packages/vue/src/motion/color-selector/src/ColorSelectorLabel.vue`
- `packages/vue/src/motion/color-selector/src/ColorSelectorList.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
