---
title: "Animated Collapsible"
description: "Connect a trigger to an expandable region while preserving the surrounding layout."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/collapsible"
markdown: "https://orvui.efu.me/en/components/motion/collapsible.md"
license: "MIT"
productVersion: "0.1.0"
---

# Animated Collapsible

> Connect a trigger to an expandable region while preserving the surrounding layout.

## Install

### Animated Collapsible — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/collapsible.json
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

### Animated Collapsible

**Registry source**

```vue
<script setup lang="ts">
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@/components/orvui/motion/collapsible";
const details = "Open this section whenever you need a little more information.";
</script>
<template>
  <Collapsible class="max-w-sm rounded-xl border border-border bg-background p-1">
    <CollapsibleTrigger>More details<CollapsibleIndicator /></CollapsibleTrigger>
    <CollapsibleContent content-class-name="px-3 pb-3 pt-1 text-sm leading-6 text-muted-foreground"><p>{{ details }}</p></CollapsibleContent>
  </Collapsible>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { Collapsible, CollapsibleContent, CollapsibleIndicator, CollapsibleTrigger } from "@orvui/vue/motion/collapsible";
const details = "Open this section whenever you need a little more information.";
</script>
<template>
  <Collapsible class="max-w-sm rounded-xl border border-border bg-background p-1">
    <CollapsibleTrigger>More details<CollapsibleIndicator /></CollapsibleTrigger>
    <CollapsibleContent content-class-name="px-3 pb-3 pt-1 text-sm leading-6 text-muted-foreground"><p>{{ details }}</p></CollapsibleContent>
  </Collapsible>
</template>
```

## API Reference

### Collapsible

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `contentClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `open: opened`, `toggle: toggle` | — |

### CollapsibleContent

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `contentClassName` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### CollapsibleIndicator

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### CollapsibleTrigger

## About Animated Collapsible

Connect a trigger to an expandable region while preserving the surrounding layout.

### When to use it

- Use Animated Collapsible when the interface needs this behavior: connect a trigger to an expandable region while preserving the surrounding layout.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Animated Collapsible?**

Configure Animated Collapsible through open, defaultOpen, disabled, contentClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/collapsible.json
- Documentation: https://orvui.efu.me/en/components/motion/collapsible
- `packages/vue/src/motion/collapsible/src/Collapsible.vue`
- `packages/vue/src/motion/collapsible/src/CollapsibleContent.vue`
- `packages/vue/src/motion/collapsible/src/CollapsibleIndicator.vue`
- `packages/vue/src/motion/collapsible/src/CollapsibleTrigger.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
