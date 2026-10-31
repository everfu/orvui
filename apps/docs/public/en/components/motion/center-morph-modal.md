---
title: "Center Morph Modal"
description: "Expand a modal evenly around its center and return it to the same point on close."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/center-morph-modal"
markdown: "https://orvui.efu.me/en/components/motion/center-morph-modal.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Center Morph Modal

> Expand a modal evenly around its center and return it to the same point on close.

<a id="when-to-use"></a>

## When to use it

- Use Center Morph Modal when the interface needs this behavior: expand a modal evenly around its center and return it to the same point on close.

<a id="install"></a>
## Install

### Center Morph Modal — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/center-morph-modal.json
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
### Center Morph Modal

**Registry source**

```vue
<script setup lang="ts">
import { useId } from "vue";
import { ArrowUpRight, Check } from "lucide-vue-next";
import { CenterMorphModal, CenterMorphModalClose, CenterMorphModalContent, CenterMorphModalTrigger } from "@/components/orvui/motion/center-morph-modal";
const descriptionId = `${useId()}-description`;
const features = ["Animated Vue components", "Composition API and TypeScript", "Editable source and registry"];
</script>
<template><div class="flex min-h-[420px] w-full items-center justify-center"><CenterMorphModal>
  <CenterMorphModalTrigger><button type="button" class="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Open modal</button></CenterMorphModalTrigger>
  <CenterMorphModalContent ariaLabel="orvui" :ariaDescribedBy="descriptionId"><div class="p-7 sm:p-8"><p class="text-sm font-medium text-muted-foreground">orvui</p>
    <h2 class="mt-5 max-w-xs pr-8 text-2xl font-medium tracking-tight text-foreground">Ship the whole experience.</h2>
    <p :id="descriptionId" class="mt-3 text-sm leading-relaxed text-muted-foreground">Create distinctive Vue interfaces with accessible controls and thoughtful movement throughout.</p>
    <div class="mt-7 space-y-3 border-y border-border py-5"><div v-for="feature in features" :key="feature" class="flex items-center gap-3 text-sm text-foreground"><Check class="h-4 w-4 text-muted-foreground" aria-hidden="true" /><span>{{ feature }}</span></div></div>
    <CenterMorphModalClose><button class="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Start creating<ArrowUpRight class="h-4 w-4" aria-hidden="true" /></button></CenterMorphModalClose>
  </div></CenterMorphModalContent>
</CenterMorphModal></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { useId } from "vue";
import { ArrowUpRight, Check } from "lucide-vue-next";
import { CenterMorphModal, CenterMorphModalClose, CenterMorphModalContent, CenterMorphModalTrigger } from "@orvui/vue/motion/center-morph-modal";
const descriptionId = `${useId()}-description`;
const features = ["Animated Vue components", "Composition API and TypeScript", "Editable source and registry"];
</script>
<template><div class="flex min-h-[420px] w-full items-center justify-center"><CenterMorphModal>
  <CenterMorphModalTrigger><button type="button" class="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Open modal</button></CenterMorphModalTrigger>
  <CenterMorphModalContent ariaLabel="orvui" :ariaDescribedBy="descriptionId"><div class="p-7 sm:p-8"><p class="text-sm font-medium text-muted-foreground">orvui</p>
    <h2 class="mt-5 max-w-xs pr-8 text-2xl font-medium tracking-tight text-foreground">Ship the whole experience.</h2>
    <p :id="descriptionId" class="mt-3 text-sm leading-relaxed text-muted-foreground">Create distinctive Vue interfaces with accessible controls and thoughtful movement throughout.</p>
    <div class="mt-7 space-y-3 border-y border-border py-5"><div v-for="feature in features" :key="feature" class="flex items-center gap-3 text-sm text-foreground"><Check class="h-4 w-4 text-muted-foreground" aria-hidden="true" /><span>{{ feature }}</span></div></div>
    <CenterMorphModalClose><button class="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Start creating<ArrowUpRight class="h-4 w-4" aria-hidden="true" /></button></CenterMorphModalClose>
  </div></CenterMorphModalContent>
</CenterMorphModal></div></template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `CenterMorphModal` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### CenterMorphModal

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `open: opened` | — |

### CenterMorphModalClose

### CenterMorphModalContent

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | — | Yes | — |
| `ariaDescribedBy` | `string` | — | No | — |
| `dismissible` | `boolean` | `true` | No | — |
| `showCloseButton` | `boolean` | `true` | No | — |
| `closeButtonLabel` | `string` | `"Close modal"` | No | — |
| `backdropClassName` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### CenterMorphModalTrigger

<a id="about"></a>
## About Center Morph Modal

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Center Morph Modal?**

Configure Center Morph Modal through open, defaultOpen. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Popover](https://orvui.efu.me/en/components/motion/popover): Attach a floating surface to a trigger with conventional or continuous morphing transitions.
- [Select](https://orvui.efu.me/en/components/motion/select): Choose from a floating list whose panel can expand continuously from its trigger.
- [Color Picker](https://orvui.efu.me/en/components/motion/color-picker): Edit a color with a two-dimensional field, channel inputs, presets and an eye dropper.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/center-morph-modal.json
- Documentation: https://orvui.efu.me/en/components/motion/center-morph-modal
- `packages/vue/src/motion/center-morph-modal/src/CenterMorphModal.vue`
- `packages/vue/src/motion/center-morph-modal/src/CenterMorphModalClose.vue`
- `packages/vue/src/motion/center-morph-modal/src/CenterMorphModalContent.vue`
- `packages/vue/src/motion/center-morph-modal/src/CenterMorphModalTrigger.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
