# Availability Scheduler · orvui 0.1.1

## Selection and composition

These components combine several primitives. Read their usage and state contracts before replacing sample data and connecting saves, submissions and persistence.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Availability Scheduler"
description: "Edit weekly availability as time ranges and copy a schedule to selected days."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/availability-scheduler"
markdown: "https://orvui.efu.me/en/components/blocks/availability-scheduler.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Availability Scheduler

> Edit weekly availability as time ranges and copy a schedule to selected days.

<a id="when-to-use"></a>

## When to use it

- Use Availability Scheduler when the interface needs this behavior: edit weekly availability as time ranges and copy a schedule to selected days.

<a id="install"></a>
## Install

### Availability Scheduler — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/availability-scheduler.json
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

- `@floating-ui/dom@^1.7.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
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

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `AvailabilityScheduler` | `v-model` | `WeekAvailability` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
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

<a id="about"></a>
## About Availability Scheduler

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Availability Scheduler?**

Configure Availability Scheduler through modelValue, defaultValue, step, disabled. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [OTP Input](https://orvui.efu.me/en/components/blocks/otp-input): Enter or paste a fixed-length code through grouped fields with completion feedback.
- [File Upload](https://orvui.efu.me/en/components/blocks/file-upload): Manage files, previews, progress and retry actions in a queue or attachment workspace.
- [Feedback Widget](https://orvui.efu.me/en/components/blocks/feedback-widget): Expand a feedback trigger into a form with sending, success and retry states.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/availability-scheduler.json
- Documentation: https://orvui.efu.me/en/components/blocks/availability-scheduler
- `packages/vue/src/blocks/availability-scheduler/src/AvailabilityScheduler.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

