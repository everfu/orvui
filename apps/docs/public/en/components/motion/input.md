---
title: "Input"
description: "Edit text with optional labels, icons and validation feedback in a single field."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/input"
markdown: "https://orvui.efu.me/en/components/motion/input.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Input

> Edit text with optional labels, icons and validation feedback in a single field.

<a id="when-to-use"></a>

## When to use it

- Use Input when the interface needs this behavior: edit text with optional labels, icons and validation feedback in a single field.

<a id="install"></a>
## Install

### Input — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/input.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
```

```bash
pnpm add lucide-vue-next@^0.468.0
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
### Input

**Registry source**

```vue
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Eye, EyeOff, Mail, Search } from "lucide-vue-next";
import { Input } from "@/components/orvui/motion/input";
const form = reactive({ email: "", password: "orvui2026", query: "Kai" }), visible = ref(false);
const emailError = computed(() => form.email && !form.email.includes("@") ? "Use a valid email address." : undefined);
</script>
<template><div class="flex w-full max-w-xs flex-col gap-1">
  <Input v-model="form.email" label="Email" type="email" placeholder="you@example.com" :error="emailError" reserve-error-line><template #leftIcon><Mail /></template></Input>
  <Input v-model="form.password" label="Password" :type="visible ? 'text' : 'password'" reserve-error-line><template #rightIcon><button type="button" @click="visible = !visible" :aria-label="visible ? 'Hide password' : 'Show password'" class="pointer-events-auto"><EyeOff v-if="visible" /><Eye v-else /></button></template></Input>
  <Input v-model="form.query" label="Search" :success="form.query.length > 1" reserve-error-line><template #leftIcon><Search /></template></Input>
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Eye, EyeOff, Mail, Search } from "lucide-vue-next";
import { Input } from "@orvui/vue/motion/input";
const form = reactive({ email: "", password: "orvui2026", query: "Kai" }), visible = ref(false);
const emailError = computed(() => form.email && !form.email.includes("@") ? "Use a valid email address." : undefined);
</script>
<template><div class="flex w-full max-w-xs flex-col gap-1">
  <Input v-model="form.email" label="Email" type="email" placeholder="you@example.com" :error="emailError" reserve-error-line><template #leftIcon><Mail /></template></Input>
  <Input v-model="form.password" label="Password" :type="visible ? 'text' : 'password'" reserve-error-line><template #rightIcon><button type="button" @click="visible = !visible" :aria-label="visible ? 'Hide password' : 'Show password'" class="pointer-events-auto"><EyeOff v-if="visible" /><Eye v-else /></button></template></Input>
  <Input v-model="form.query" label="Search" :success="form.query.length > 1" reserve-error-line><template #leftIcon><Search /></template></Input>
</div></template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `Input` | `v-model` | `string` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### Input

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | — | No | — |
| `defaultValue` | `string` | `""` | No | — |
| `label` | `string` | — | No | — |
| `error` | `boolean \| string` | — | No | — |
| `reserveErrorLine` | `boolean` | `false` | No | — |
| `success` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `type` | `string` | `"text"` | No | — |
| `id` | `string` | `generatedId` | No | — |
| `leftIcon` | `any` | — | No | — |
| `rightIcon` | `any` | — | No | — |
| `classNames` | `Record<string, string>` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `focus` | — | — |
| `blur` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `leftIcon` | `() => VNodeChild` | — | — |
| `rightIcon` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Input

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Input?**

Configure Input through modelValue, defaultValue, label, error, reserveErrorLine, success, disabled, type, id, leftIcon, rightIcon, classNames. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change, focus, blur to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Checkbox](https://orvui.efu.me/en/components/motion/checkbox): Represent checked, unchecked and mixed values with an animated check mark.
- [Select](https://orvui.efu.me/en/components/motion/select): Choose from a floating list whose panel can expand continuously from its trigger.
- [Radio Group](https://orvui.efu.me/en/components/motion/radio): Choose one value from a keyboard-navigable group of labeled options.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/input.json
- Documentation: https://orvui.efu.me/en/components/motion/input
- `packages/vue/src/motion/input/src/Input.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
