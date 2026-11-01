---
title: "Animated Color Selector"
description: "Choose one named swatch with a moving selection outline and native radio behavior."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/color-selector"
markdown: "https://orvui.efu.me/en/components/motion/color-selector.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Animated Color Selector

> Choose one named swatch with a moving selection outline and native radio behavior.

<a id="when-to-use"></a>

## When to use it

- Use Animated Color Selector when the interface needs this behavior: choose one named swatch with a moving selection outline and native radio behavior.

<a id="install"></a>
## Install

### Animated Color Selector — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/color-selector.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the local Beta archive; see the Beta installation guide to build it.

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
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

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `ColorSelector` | `v-model` | `string` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
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

<a id="about"></a>
## About Animated Color Selector

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Animated Color Selector?**

Configure Animated Color Selector through modelValue, defaultValue, name, form, disabled, required. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Animated Context Menu](https://orvui.efu.me/en/components/motion/context-menu): Open a menu at a pointer position with checkbox, radio and submenu compositions.
- [Sortable List](https://orvui.efu.me/en/components/motion/sortable-stack): Reorder a list with pointer or keyboard input and offer an undo operation.
- [Image Viewer](https://orvui.efu.me/en/components/motion/image-viewer): Open a gallery image from its thumbnail and navigate, zoom or pan the enlarged view.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/color-selector.json
- Documentation: https://orvui.efu.me/en/components/motion/color-selector
- `packages/vue/src/motion/color-selector/src/ColorSelector.vue`
- `packages/vue/src/motion/color-selector/src/ColorSelectorItem.vue`
- `packages/vue/src/motion/color-selector/src/ColorSelectorLabel.vue`
- `packages/vue/src/motion/color-selector/src/ColorSelectorList.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
