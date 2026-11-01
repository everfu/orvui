# Checkbox · orvui 0.1.1

## Selection and composition

Use Select for fixed options, Combobox for searchable single selection and Multi Select for multiple values. Use Switch for immediate settings and Checkbox for a value submitted with a form.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Checkbox"
description: "Represent checked, unchecked and mixed values with an animated check mark."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/checkbox"
markdown: "https://orvui.efu.me/en/components/motion/checkbox.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Checkbox

> Represent checked, unchecked and mixed values with an animated check mark.

<a id="when-to-use"></a>

## When to use it

- Use Checkbox when the interface needs this behavior: represent checked, unchecked and mixed values with an animated check mark.

<a id="install"></a>
## Install

### Checkbox — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/checkbox.json
```

### Checkbox — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/checkbox.json
```

### With Description — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/checkbox.json
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
### Checkbox

**Registry source**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "@/components/orvui/motion/checkbox";
const settings = reactive({ terms: true, announcements: false });
</script>
<template><div class="flex flex-col gap-3">
  <Checkbox v-model="settings.terms" label="Accept terms and conditions" /><Checkbox v-model="settings.announcements" label="Email me product updates" />
  <Checkbox :model-value="true" indeterminate label="Select all (partial)" /><Checkbox :model-value="true" disabled label="Disabled" />
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "@orvui/vue/motion/checkbox";
const settings = reactive({ terms: true, announcements: false });
</script>
<template><div class="flex flex-col gap-3">
  <Checkbox v-model="settings.terms" label="Accept terms and conditions" /><Checkbox v-model="settings.announcements" label="Email me product updates" />
  <Checkbox :model-value="true" indeterminate label="Select all (partial)" /><Checkbox :model-value="true" disabled label="Disabled" />
</div></template>
```

<a id="default"></a>
### Checkbox

Inspect checked and mixed states with a drawn mark and spring press feedback.

**Registry source**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "@/components/orvui/motion/checkbox";
const settings = reactive({ terms: true, announcements: false });
</script>
<template><div class="flex flex-col gap-3">
  <Checkbox v-model="settings.terms" label="Accept terms and conditions" /><Checkbox v-model="settings.announcements" label="Email me product updates" />
  <Checkbox :model-value="true" indeterminate label="Select all (partial)" /><Checkbox :model-value="true" disabled label="Disabled" />
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "@orvui/vue/motion/checkbox";
const settings = reactive({ terms: true, announcements: false });
</script>
<template><div class="flex flex-col gap-3">
  <Checkbox v-model="settings.terms" label="Accept terms and conditions" /><Checkbox v-model="settings.announcements" label="Email me product updates" />
  <Checkbox :model-value="true" indeterminate label="Select all (partial)" /><Checkbox :model-value="true" disabled label="Disabled" />
</div></template>
```

<a id="description"></a>
### With Description

Add explanatory text below the label and connect it to the checkbox description.

**Registry source**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "@/components/orvui/motion/checkbox";
const selected = reactive<Record<string, boolean>>({ comments: true, mentions: true, digest: false });
const options = [
  { id: "comments", label: "Comments", description: "Replies to conversations you began." },
  { id: "mentions", label: "Mentions", description: "A notification when your name is tagged." },
  { id: "digest", label: "Weekly digest", description: "A Monday overview of recent activity." },
];
</script>
<template><div class="flex w-full max-w-64 flex-col gap-3">
  <Checkbox v-for="option in options" :key="option.id" v-model="selected[option.id]" :label="option.label" :description="option.description" />
  <Checkbox :model-value="false" disabled label="SMS alerts" description="Connect your phone number to begin." />
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "@orvui/vue/motion/checkbox";
const selected = reactive<Record<string, boolean>>({ comments: true, mentions: true, digest: false });
const options = [
  { id: "comments", label: "Comments", description: "Replies to conversations you began." },
  { id: "mentions", label: "Mentions", description: "A notification when your name is tagged." },
  { id: "digest", label: "Weekly digest", description: "A Monday overview of recent activity." },
];
</script>
<template><div class="flex w-full max-w-64 flex-col gap-3">
  <Checkbox v-for="option in options" :key="option.id" v-model="selected[option.id]" :label="option.label" :description="option.description" />
  <Checkbox :model-value="false" disabled label="SMS alerts" description="Connect your phone number to begin." />
</div></template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `Checkbox` | `v-model` | `boolean` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### Checkbox

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `boolean` | `undefined` | No | — |
| `defaultValue` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `indeterminate` | `boolean` | `false` | No | — |
| `label` | `string` | — | No | — |
| `description` | `string` | — | No | — |
| `id` | `string` | `generatedId` | No | — |
| `ariaLabel` | `string` | `attrs["aria-label"] as string \| undefined` | No | — |
| `ariaDescribedBy` | `string` | `attrs["aria-describedby"]` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

<a id="about"></a>
## About Checkbox

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Checkbox?**

Configure Checkbox through modelValue, defaultValue, disabled, indeterminate, label, description, id, ariaLabel, ariaDescribedBy. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Radio Group](https://orvui.efu.me/en/components/motion/radio): Choose one value from a keyboard-navigable group of labeled options.
- [Input](https://orvui.efu.me/en/components/motion/input): Edit text with optional labels, icons and validation feedback in a single field.
- [Select](https://orvui.efu.me/en/components/motion/select): Choose from a floating list whose panel can expand continuously from its trigger.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/checkbox.json
- Documentation: https://orvui.efu.me/en/components/motion/checkbox
- `packages/vue/src/motion/checkbox/src/Checkbox.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

