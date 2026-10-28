---
title: "Animated Badge"
description: "Pair a compact status label with an icon and optional pulse feedback."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/animated-badge"
markdown: "https://orvui.efu.me/en/components/motion/animated-badge.md"
license: "MIT"
productVersion: "0.1.0"
---

# Animated Badge

> Pair a compact status label with an icon and optional pulse feedback.

Pair a compact status label with an icon and optional pulse feedback.

## When to use it

- Use Animated Badge when the interface needs this behavior: pair a compact status label with an icon and optional pulse feedback.

## Install

### Animated Badge — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/animated-badge.json
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

### Animated Badge

**Registry source**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { AnimatedBadge, type AnimatedBadgeStatus } from "@/components/orvui/motion/animated-badge";
const sequence = [
  { status: "loading", label: "Syncing" }, { status: "success", label: "Synced" },
  { status: "warning", label: "Review" }, { status: "danger", label: "Failed" },
] as const;
const samples = [["neutral", "Queued"], ["info", "Live"], ["loading", "Indexing"], ["success", "Verified"], ["warning", "Pending"], ["danger", "Blocked"]] as const;
const step = ref(0), current = computed(() => sequence[step.value % sequence.length]!);
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => { step.value += 1; }, 1600); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex h-16 items-center justify-center"><AnimatedBadge :status="current.status" size="md" aria-live="polite">{{ current.label }}</AnimatedBadge></div>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3"><AnimatedBadge v-for="[status, label] in samples" :key="status" :status="status" size="sm">{{ label }}</AnimatedBadge></div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { AnimatedBadge, type AnimatedBadgeStatus } from "@orvui/vue/motion/animated-badge";
const sequence = [
  { status: "loading", label: "Syncing" }, { status: "success", label: "Synced" },
  { status: "warning", label: "Review" }, { status: "danger", label: "Failed" },
] as const;
const samples = [["neutral", "Queued"], ["info", "Live"], ["loading", "Indexing"], ["success", "Verified"], ["warning", "Pending"], ["danger", "Blocked"]] as const;
const step = ref(0), current = computed(() => sequence[step.value % sequence.length]!);
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => { step.value += 1; }, 1600); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex h-16 items-center justify-center"><AnimatedBadge :status="current.status" size="md" aria-live="polite">{{ current.label }}</AnimatedBadge></div>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3"><AnimatedBadge v-for="[status, label] in samples" :key="status" :status="status" size="sm">{{ label }}</AnimatedBadge></div>
  </div>
</template>
```

## API Reference

### AnimatedBadge

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `status` | `"info" \| "success" \| "warning" \| "loading" \| "neutral" \| "danger"` | `"neutral"` | No | — |
| `size` | `"sm" \| "md"` | `"md"` | No | — |
| `icon` | `any` | `({ neutral: Circle, info: Info, success: Check, warning: TriangleAlert, danger: X, loading: LoaderCircle })[props.status]` | No | — |
| `showIcon` | `boolean` | `true` | No | — |
| `pulse` | `boolean` | `undefined` | No | — |
| `contentKey` | `string \| number` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `icon` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

## About Animated Badge

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Animated Badge?**

Configure Animated Badge through status, size, icon, showIcon, pulse, contentKey. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through icon, default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/animated-badge.json
- Documentation: https://orvui.efu.me/en/components/motion/animated-badge
- `packages/vue/src/motion/animated-badge/src/AnimatedBadge.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
