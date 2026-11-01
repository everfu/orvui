# Tabs · orvui 0.1.1

## Selection and composition

Use Tabs for related views in one page, Breadcrumb for page hierarchy, Table of Contents for article navigation and Animated Sidebar for workspace sections.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Tabs"
description: "Switch between associated panels using a moving indicator and accessible tab controls."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/tabs"
markdown: "https://orvui.efu.me/en/components/motion/tabs.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Tabs

> Switch between associated panels using a moving indicator and accessible tab controls.

<a id="when-to-use"></a>

## When to use it

- Use when related views share one place on the page and readers need to switch between them.

<a id="install"></a>
## Install

### Tabs — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tabs.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Tabs

**Registry source**

```vue
<script setup lang="ts">
import { BarChart3, Bell, Home } from "lucide-vue-next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/orvui/motion/tabs";
const sections = [{ value: "overview", label: "Overview", content: "High-level summary." }, { value: "activity", label: "Activity", content: "Recent events." }, { value: "settings", label: "Settings", content: "Preferences." }];
const icons = [{ value: "home", text: "Home", icon: Home }, { value: "stats", text: "Stats", icon: BarChart3 }, { value: "alerts", text: "Alerts", icon: Bell }];
</script>
<template><div class="flex w-full max-w-md flex-col gap-8"><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pill</span><Tabs default-value="overview" variant="pill"><TabsList><TabsTrigger v-for="section in sections" :key="section.value" :value="section.value">{{ section.label }}</TabsTrigger></TabsList><TabsContent v-for="section in sections" :key="section.value" :value="section.value" class="text-sm text-muted-foreground">{{ section.content }}</TabsContent></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Overflow</span><Tabs default-value="Overview" class="w-full max-w-xs"><TabsList><TabsTrigger v-for="label in ['Overview', 'Activity', 'Analytics', 'Members', 'Billing', 'Settings']" :key="label" :value="label">{{ label }}</TabsTrigger></TabsList></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Segment</span><Tabs default-value="day" variant="segment"><TabsList><TabsTrigger v-for="value in ['day', 'week', 'month']" :key="value" :value="value">{{ value[0].toUpperCase() + value.slice(1) }}</TabsTrigger></TabsList></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Icon on selected</span><Tabs default-value="home" variant="pill" icons="selected"><TabsList><TabsTrigger v-for="entry in icons" :key="entry.value" :value="entry.value"><template #icon><component :is="entry.icon" class="size-3.5" /></template>{{ entry.text }}</TabsTrigger></TabsList></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Underline</span><Tabs default-value="all" variant="underline"><TabsList><TabsTrigger v-for="value in ['all', 'open', 'closed']" :key="value" :value="value">{{ value[0].toUpperCase() + value.slice(1) }}</TabsTrigger></TabsList></Tabs></div></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { BarChart3, Bell, Home } from "lucide-vue-next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@orvui/vue/motion/tabs";
const sections = [{ value: "overview", label: "Overview", content: "High-level summary." }, { value: "activity", label: "Activity", content: "Recent events." }, { value: "settings", label: "Settings", content: "Preferences." }];
const icons = [{ value: "home", text: "Home", icon: Home }, { value: "stats", text: "Stats", icon: BarChart3 }, { value: "alerts", text: "Alerts", icon: Bell }];
</script>
<template><div class="flex w-full max-w-md flex-col gap-8"><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pill</span><Tabs default-value="overview" variant="pill"><TabsList><TabsTrigger v-for="section in sections" :key="section.value" :value="section.value">{{ section.label }}</TabsTrigger></TabsList><TabsContent v-for="section in sections" :key="section.value" :value="section.value" class="text-sm text-muted-foreground">{{ section.content }}</TabsContent></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Overflow</span><Tabs default-value="Overview" class="w-full max-w-xs"><TabsList><TabsTrigger v-for="label in ['Overview', 'Activity', 'Analytics', 'Members', 'Billing', 'Settings']" :key="label" :value="label">{{ label }}</TabsTrigger></TabsList></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Segment</span><Tabs default-value="day" variant="segment"><TabsList><TabsTrigger v-for="value in ['day', 'week', 'month']" :key="value" :value="value">{{ value[0].toUpperCase() + value.slice(1) }}</TabsTrigger></TabsList></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Icon on selected</span><Tabs default-value="home" variant="pill" icons="selected"><TabsList><TabsTrigger v-for="entry in icons" :key="entry.value" :value="entry.value"><template #icon><component :is="entry.icon" class="size-3.5" /></template>{{ entry.text }}</TabsTrigger></TabsList></Tabs></div><div class="flex flex-col gap-2"><span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Underline</span><Tabs default-value="all" variant="underline"><TabsList><TabsTrigger v-for="value in ['all', 'open', 'closed']" :key="value" :value="value">{{ value[0].toUpperCase() + value.slice(1) }}</TabsTrigger></TabsList></Tabs></div></div></template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `Tabs` | `v-model` | `string` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### Tabs

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | — | No | — |
| `defaultValue` | `string` | `""` | No | — |
| `variant` | `"pill" \| "underline" \| "segment"` | `"pill"` | No | — |
| `icons` | `"always" \| "selected"` | `"always"` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### TabsList

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `wrapperClassName` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### TabsTrigger

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | — |
| `disabled` | `boolean` | `false` | No | — |
| `icon` | `any` | — | No | — |
| `indicatorClassName` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `icon` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

### TabsContent

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | — |
| `forceMount` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Tabs

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Tabs?**

Configure Tabs through modelValue, defaultValue, variant, icons. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Shared Layout Background](https://orvui.efu.me/en/components/motion/shared-layout-bg): Move one background surface between registered items to indicate a current selection.
- [Dock](https://orvui.efu.me/en/components/motion/dock): Group compact navigation actions around an indicator that follows the active item.
- [Scroll Animation](https://orvui.efu.me/en/components/motion/scroll-animation): Connect scrolling to progress, parallax, reveal effects and deliberate navigation.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/tabs.json
- Documentation: https://orvui.efu.me/en/components/motion/tabs
- `packages/vue/src/motion/tabs/src/Tabs.vue`
- `packages/vue/src/motion/tabs/src/TabsList.vue`
- `packages/vue/src/motion/tabs/src/TabsTrigger.vue`
- `packages/vue/src/motion/tabs/src/TabsContent.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

