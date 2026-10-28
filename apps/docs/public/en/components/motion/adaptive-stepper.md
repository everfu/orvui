---
title: "Adaptive Stepper"
description: "Adjust a bounded number while the value uses the space released by unavailable actions."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/adaptive-stepper"
markdown: "https://orvui.efu.me/en/components/motion/adaptive-stepper.md"
license: "MIT"
productVersion: "0.1.0"
---

# Adaptive Stepper

> Adjust a bounded number while the value uses the space released by unavailable actions.

Adjust a bounded number while the value uses the space released by unavailable actions.

## When to use it

- Use Adaptive Stepper when the interface needs this behavior: adjust a bounded number while the value uses the space released by unavailable actions.

## Install

### Adaptive Stepper — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/adaptive-stepper.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Adaptive Stepper

**Registry source**

```vue
<script setup lang="ts">
import { AdaptiveStepper, AdaptiveStepperDecrement, AdaptiveStepperIncrement, AdaptiveStepperValue } from "@/components/orvui/motion/adaptive-stepper";
const limits = { min: 0, max: 3, defaultValue: 2 };
</script>
<template><div class="flex min-h-[320px] w-full items-center justify-center px-4"><AdaptiveStepper v-bind="limits" aria-label="Guests"><AdaptiveStepperDecrement /><AdaptiveStepperValue /><AdaptiveStepperIncrement /></AdaptiveStepper></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { AdaptiveStepper, AdaptiveStepperDecrement, AdaptiveStepperIncrement, AdaptiveStepperValue } from "@orvui/vue/motion/adaptive-stepper";
const limits = { min: 0, max: 3, defaultValue: 2 };
</script>
<template><div class="flex min-h-[320px] w-full items-center justify-center px-4"><AdaptiveStepper v-bind="limits" aria-label="Guests"><AdaptiveStepperDecrement /><AdaptiveStepperValue /><AdaptiveStepperIncrement /></AdaptiveStepper></div></template>
```

## API Reference

### AdaptiveStepper

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | No | — |
| `defaultValue` | `number` | `0` | No | — |
| `min` | `number` | `0` | No | — |
| `max` | `number` | `10` | No | — |
| `step` | `number` | `1` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `name` | `string` | — | No | — |
| `formatValueText` | `(value: number) => string` | — | No | — |
| `ariaLabel` | `string` | `"Quantity"` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AdaptiveStepperDecrement

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AdaptiveStepperIncrement

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AdaptiveStepperValue

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value` | — |

## About Adaptive Stepper

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Adaptive Stepper?**

Configure Adaptive Stepper through modelValue, defaultValue, min, max, step, disabled, name, formatValueText, ariaLabel. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/adaptive-stepper.json
- Documentation: https://orvui.efu.me/en/components/motion/adaptive-stepper
- `packages/vue/src/motion/adaptive-stepper/src/AdaptiveStepper.vue`
- `packages/vue/src/motion/adaptive-stepper/src/AdaptiveStepperDecrement.vue`
- `packages/vue/src/motion/adaptive-stepper/src/AdaptiveStepperIncrement.vue`
- `packages/vue/src/motion/adaptive-stepper/src/AdaptiveStepperValue.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
