---
title: "Availability Scheduler"
description: "Edit weekly availability as time ranges and copy a schedule to selected days."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/availability-scheduler"
markdown: "https://orvui.efu.me/en/components/blocks/availability-scheduler.md"
license: "MIT"
productVersion: "0.1.0"
---

# Availability Scheduler

> Edit weekly availability as time ranges and copy a schedule to selected days.

## Install

### Availability Scheduler — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/availability-scheduler.json
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

- `@floating-ui/dom@^1.7.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Availability Scheduler

**Registry source**

```vue
<script setup lang="ts">
import { AvailabilityScheduler } from "@/components/orvui/blocks/availability-scheduler";
</script>
<template><AvailabilityScheduler /></template>
```

**Package**

```vue
<script setup lang="ts">
import { AvailabilityScheduler } from "@orvui/vue/blocks/availability-scheduler";
</script>
<template><AvailabilityScheduler /></template>
```

## API Reference

### AvailabilityScheduler

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `WeekAvailability` | — | No | — |
| `defaultValue` | `WeekAvailability` | `defaultWeek()` | No | — |
| `step` | `number` | `30` | No | — |
| `disabled` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `[value: WeekAvailability]` | — |
| `change` | `[value: WeekAvailability]` | — |

## About Availability Scheduler

Edit weekly availability as time ranges and copy a schedule to selected days.

### When to use it

- Use Availability Scheduler when the interface needs this behavior: edit weekly availability as time ranges and copy a schedule to selected days.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Availability Scheduler?**

Configure Availability Scheduler through modelValue, defaultValue, step, disabled. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/availability-scheduler.json
- Documentation: https://orvui.efu.me/en/components/blocks/availability-scheduler
- `packages/vue/src/blocks/availability-scheduler/src/AvailabilityScheduler.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
