---
title: "Switch"
description: "Toggle a binary setting with a moving thumb and optional descriptive label."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/switch"
markdown: "https://orvui.efu.me/en/components/motion/switch.md"
license: "MIT"
productVersion: "0.1.0"
---

# Switch

> Toggle a binary setting with a moving thumb and optional descriptive label.

Toggle a binary setting with a moving thumb and optional descriptive label.

## When to use it

- Use Switch when the interface needs this behavior: toggle a binary setting with a moving thumb and optional descriptive label.

## Install

### Switch — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/switch.json
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

## About Switch

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Switch?**

Configure Switch through modelValue, defaultValue, disabled, label, ariaLabel. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/switch.json
- Documentation: https://orvui.efu.me/en/components/motion/switch
- `packages/vue/src/motion/switch/src/Switch.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
