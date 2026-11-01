# Animated CTA Buttons · orvui 0.1.1

## Selection and composition

Start with Button for an explicit action. Use CTA Buttons for deliberate hold or slide confirmation, and Expandable Action Bar for compact toolbars.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Animated CTA Buttons"
description: "Confirm an action through an expanding arrow, a deliberate hold or a slide gesture."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/expanding-arrow-button"
markdown: "https://orvui.efu.me/en/components/motion/expanding-arrow-button.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Animated CTA Buttons

> Confirm an action through an expanding arrow, a deliberate hold or a slide gesture.

<a id="when-to-use"></a>

## When to use it

- Use Animated CTA Buttons when the interface needs this behavior: confirm an action through an expanding arrow, a deliberate hold or a slide gesture.

<a id="install"></a>
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

<a id="expanding-arrow"></a>
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

<a id="hold-action"></a>
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

<a id="slide-action"></a>
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

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
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

<a id="about"></a>
## About Animated CTA Buttons

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Animated CTA Buttons?**

Configure Animated CTA Buttons through disabled, accentClassName, labelClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Action Swap](https://orvui.efu.me/en/components/motion/action-swap): Replace short action text or icons using blur, rolling or staggered transitions.
- [Expandable Control](https://orvui.efu.me/en/components/motion/expandable-control): Expand a compact control to reveal a label or trailing action without losing its position.
- [Card](https://orvui.efu.me/en/components/motion/card): Assemble a card from heading, content, actions and footer parts with optional selection.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/expanding-arrow-button.json
- Documentation: https://orvui.efu.me/en/components/motion/expanding-arrow-button
- `packages/vue/src/motion/expanding-arrow-button/src/ExpandingArrowButton.vue`
- `packages/vue/src/motion/expanding-arrow-button/src/HoldActionButton.vue`
- `packages/vue/src/motion/expanding-arrow-button/src/SlideActionButton.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

