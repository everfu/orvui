---
title: "Radio Group"
description: "Choose one value from a keyboard-navigable group of labeled options."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/radio"
markdown: "https://orvui.efu.me/en/components/motion/radio.md"
license: "MIT"
productVersion: "0.1.0"
---

# Radio Group

> Choose one value from a keyboard-navigable group of labeled options.

Choose one value from a keyboard-navigable group of labeled options.

## When to use it

- Use Radio Group when the interface needs this behavior: choose one value from a keyboard-navigable group of labeled options.

## Install

### Radio Group — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/radio.json
```

### Radio Group — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/radio.json
```

### With Description — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/radio.json
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

### Radio Group

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "@/components/orvui/motion/radio";
const selected = ref("pro");
const options = [{ value: "starter", label: "Starter, free" }, { value: "pro", label: "Pro, $12/mo" }, { value: "team", label: "Team, $29/mo" }, { value: "legacy", label: "Legacy plan", disabled: true }];
</script>
<template><RadioGroup v-model="selected" class="min-w-48"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "@orvui/vue/motion/radio";
const selected = ref("pro");
const options = [{ value: "starter", label: "Starter, free" }, { value: "pro", label: "Pro, $12/mo" }, { value: "team", label: "Team, $29/mo" }, { value: "legacy", label: "Legacy plan", disabled: true }];
</script>
<template><RadioGroup v-model="selected" class="min-w-48"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
```

### Radio Group

Move the selected dot between native radio choices with press feedback.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "@/components/orvui/motion/radio";
const selected = ref("pro");
const options = [{ value: "starter", label: "Starter, free" }, { value: "pro", label: "Pro, $12/mo" }, { value: "team", label: "Team, $29/mo" }, { value: "legacy", label: "Legacy plan", disabled: true }];
</script>
<template><RadioGroup v-model="selected" class="min-w-48"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "@orvui/vue/motion/radio";
const selected = ref("pro");
const options = [{ value: "starter", label: "Starter, free" }, { value: "pro", label: "Pro, $12/mo" }, { value: "team", label: "Team, $29/mo" }, { value: "legacy", label: "Legacy plan", disabled: true }];
</script>
<template><RadioGroup v-model="selected" class="min-w-48"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
```

### With Description

Give each radio choice supporting text in its accessible description.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "@/components/orvui/motion/radio";
const selected = ref("once");
const options = [
  { value: "once", label: "Run once", description: "Start one run immediately." },
  { value: "schedule", label: "Run on a schedule", description: "Use a recurring interval until you stop it." },
  { value: "trigger", label: "Run on a trigger", description: "Start after the selected event arrives." },
  { value: "manual", label: "Manual approval", description: "Choose another plan to use this option.", disabled: true },
];
</script>
<template><RadioGroup v-model="selected" class="w-full max-w-64"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "@orvui/vue/motion/radio";
const selected = ref("once");
const options = [
  { value: "once", label: "Run once", description: "Start one run immediately." },
  { value: "schedule", label: "Run on a schedule", description: "Use a recurring interval until you stop it." },
  { value: "trigger", label: "Run on a trigger", description: "Start after the selected event arrives." },
  { value: "manual", label: "Manual approval", description: "Choose another plan to use this option.", disabled: true },
];
</script>
<template><RadioGroup v-model="selected" class="w-full max-w-64"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
```

## API Reference

### RadioGroup

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | — | No | — |
| `defaultValue` | `string` | `""` | No | — |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | No | — |
| `name` | `string` | `instanceId` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### RadioGroupItem

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | — |
| `label` | `string` | — | No | — |
| `description` | `string` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `id` | `string` | `generatedId` | No | — |

## About Radio Group

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Radio Group?**

Configure Radio Group through modelValue, defaultValue, orientation, name. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/radio.json
- Documentation: https://orvui.efu.me/en/components/motion/radio
- `packages/vue/src/motion/radio/src/RadioGroup.vue`
- `packages/vue/src/motion/radio/src/RadioGroupItem.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
