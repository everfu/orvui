---
title: "Animated CTA Buttons"
description: "Confirm an action through an expanding arrow, a deliberate hold or a slide gesture."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/expanding-arrow-button"
markdown: "https://orvui.efu.me/en/components/motion/expanding-arrow-button.md"
license: "MIT"
productVersion: "0.1.0"
---

# Animated CTA Buttons

> Confirm an action through an expanding arrow, a deliberate hold or a slide gesture.

Confirm an action through an expanding arrow, a deliberate hold or a slide gesture.

## When to use it

- Use Animated CTA Buttons when the interface needs this behavior: confirm an action through an expanding arrow, a deliberate hold or a slide gesture.

## Install

### Animated CTA Buttons — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/expanding-arrow-button.json
```

### Expanding Arrow Button — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/expanding-arrow-button.json
```

### Hold Action Button — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/hold-action-button.json
```

### Slide Action Button — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/slide-action-button.json
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

### Animated CTA Buttons

**Registry source**

```vue
<script setup lang="ts">
import { ExpandingArrowButton } from "@/components/orvui/motion/expanding-arrow-button";
</script>
<template>
  <ExpandingArrowButton>Book a demo</ExpandingArrowButton>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ExpandingArrowButton } from "@orvui/vue/motion/expanding-arrow-button";
</script>
<template>
  <ExpandingArrowButton>Book a demo</ExpandingArrowButton>
</template>
```

### Expanding Arrow Button

Expand the accent end of the button and extend its dotted arrow path on focus or hover.

**Registry source**

```vue
<script setup lang="ts">
import { ExpandingArrowButton } from "@/components/orvui/motion/expanding-arrow-button";
</script>
<template>
  <ExpandingArrowButton>Book a demo</ExpandingArrowButton>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ExpandingArrowButton } from "@orvui/vue/motion/expanding-arrow-button";
</script>
<template>
  <ExpandingArrowButton>Book a demo</ExpandingArrowButton>
</template>
```

### Hold Action Button

Hold until the horizontal or vertical fill reaches its endpoint; release early to cancel.

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { HoldActionButton } from "@/components/orvui/motion/expanding-arrow-button";
const visible = ref(false);
let expiry: ReturnType<typeof setTimeout> | undefined;
function feedback() { clearTimeout(expiry); visible.value = true; expiry = setTimeout(() => visible.value = false, 1800); }
onBeforeUnmount(() => clearTimeout(expiry));
</script>
<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <HoldActionButton @hold-complete="feedback">Hold for vertical fill</HoldActionButton><HoldActionButton type="horizontal" @hold-complete="feedback">Hold for horizontal fill</HoldActionButton>
    <p class="h-4 text-xs text-muted-foreground" aria-live="polite">{{ visible ? "Action confirmed" : "Release early to cancel" }}</p>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { HoldActionButton } from "@orvui/vue/motion/expanding-arrow-button";
const visible = ref(false);
let expiry: ReturnType<typeof setTimeout> | undefined;
function feedback() { clearTimeout(expiry); visible.value = true; expiry = setTimeout(() => visible.value = false, 1800); }
onBeforeUnmount(() => clearTimeout(expiry));
</script>
<template>
  <div class="flex flex-col items-center justify-center gap-3">
    <HoldActionButton @hold-complete="feedback">Hold for vertical fill</HoldActionButton><HoldActionButton type="horizontal" @hold-complete="feedback">Hold for horizontal fill</HoldActionButton>
    <p class="h-4 text-xs text-muted-foreground" aria-live="polite">{{ visible ? "Action confirmed" : "Release early to cancel" }}</p>
  </div>
</template>
```

### Slide Action Button

Drag the handle to confirm; an incomplete gesture springs back without submitting.

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { SlideActionButton } from "@/components/orvui/motion/expanding-arrow-button";
const visible = ref(false);
let expiry: ReturnType<typeof setTimeout> | undefined;
function feedback() { clearTimeout(expiry); visible.value = true; expiry = setTimeout(() => visible.value = false, 1800); }
onBeforeUnmount(() => clearTimeout(expiry));
</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <SlideActionButton complete-label="Ready" @complete="feedback">Slide to continue</SlideActionButton>
    <p class="h-4 text-xs text-muted-foreground" aria-live="polite">{{ visible ? "Action completed" : "Drag the arrow to the end" }}</p>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { SlideActionButton } from "@orvui/vue/motion/expanding-arrow-button";
const visible = ref(false);
let expiry: ReturnType<typeof setTimeout> | undefined;
function feedback() { clearTimeout(expiry); visible.value = true; expiry = setTimeout(() => visible.value = false, 1800); }
onBeforeUnmount(() => clearTimeout(expiry));
</script>
<template>
  <div class="flex flex-col items-center gap-3">
    <SlideActionButton complete-label="Ready" @complete="feedback">Slide to continue</SlideActionButton>
    <p class="h-4 text-xs text-muted-foreground" aria-live="polite">{{ visible ? "Action completed" : "Drag the arrow to the end" }}</p>
  </div>
</template>
```

## API Reference

### ExpandingArrowButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | No | — |
| `accentClassName` | `string` | — | No | — |
| `labelClassName` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### HoldActionButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `type` | `"vertical" \| "horizontal"` | `"vertical"` | No | — |
| `holdingLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Keep holding"` | No | — |
| `completeLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Done"` | No | — |
| `holdDuration` | `number` | `1600` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `fillClassName` | `string` | — | No | — |
| `labelClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `holdComplete` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |
| `holdingLabel` | `() => VNodeChild` | — | — |
| `completeLabel` | `() => VNodeChild` | — | — |

### SlideActionButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `completeLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Complete"` | No | — |
| `threshold` | `number` | `.82` | No | — |
| `resetDelay` | `number` | `1200` | No | — |
| `thumbClassName` | `string` | — | No | — |
| `fillClassName` | `string` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `complete` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |
| `completeLabel` | `() => VNodeChild` | — | — |

## About Animated CTA Buttons

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Animated CTA Buttons?**

Configure Animated CTA Buttons through disabled, accentClassName, labelClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/expanding-arrow-button.json
- Documentation: https://orvui.efu.me/en/components/motion/expanding-arrow-button
- `packages/vue/src/motion/expanding-arrow-button/src/ExpandingArrowButton.vue`
- `packages/vue/src/motion/expanding-arrow-button/src/HoldActionButton.vue`
- `packages/vue/src/motion/expanding-arrow-button/src/SlideActionButton.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
