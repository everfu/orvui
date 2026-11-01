# Switch · orvui 0.1.1

## Selection and composition

Use Select for fixed options, Combobox for searchable single selection and Multi Select for multiple values. Use Switch for immediate settings and Checkbox for a value submitted with a form.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Switch"
description: "Toggle a binary setting with a moving thumb and optional descriptive label."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/switch"
markdown: "https://orvui.efu.me/en/components/motion/switch.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Switch

> Toggle a binary setting with a moving thumb and optional descriptive label.

<a id="when-to-use"></a>

## When to use it

- Use for a setting that takes effect immediately, such as enabling notifications or changing a preference.

<a id="install"></a>
## Install

### Switch — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/switch.json
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
### Switch

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Switch } from "@/components/orvui/motion/switch";
const notifications = ref(true);
</script>
<template>
  <div class="flex flex-col gap-3">
    <Switch v-model="notifications" label="Activity notifications" />
    <Switch :model-value="false" label="Inactive" />
    <Switch :model-value="true" disabled label="Unavailable" />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Switch } from "@orvui/vue/motion/switch";
const notifications = ref(true);
</script>
<template>
  <div class="flex flex-col gap-3">
    <Switch v-model="notifications" label="Activity notifications" />
    <Switch :model-value="false" label="Inactive" />
    <Switch :model-value="true" disabled label="Unavailable" />
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `Switch` | `v-model` | `boolean` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### Switch

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `boolean` | `undefined` | No | — |
| `defaultValue` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `label` | `string` | — | No | — |
| `ariaLabel` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

<a id="about"></a>
## About Switch

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Switch?**

Configure Switch through modelValue, defaultValue, disabled, label, ariaLabel. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Checkbox](https://orvui.efu.me/en/components/motion/checkbox): Represent checked, unchecked and mixed values with an animated check mark.
- [Radio Group](https://orvui.efu.me/en/components/motion/radio): Choose one value from a keyboard-navigable group of labeled options.
- [Select](https://orvui.efu.me/en/components/motion/select): Choose from a floating list whose panel can expand continuously from its trigger.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/switch.json
- Documentation: https://orvui.efu.me/en/components/motion/switch
- `packages/vue/src/motion/switch/src/Switch.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

