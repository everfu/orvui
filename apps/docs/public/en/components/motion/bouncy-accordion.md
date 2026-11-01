---
title: "Bouncy Accordion"
description: "Expand a section in a single-open group with connected spring layout movement."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/bouncy-accordion"
markdown: "https://orvui.efu.me/en/components/motion/bouncy-accordion.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Bouncy Accordion

> Expand a section in a single-open group with connected spring layout movement.

<a id="when-to-use"></a>

## When to use it

- Use Bouncy Accordion when the interface needs this behavior: expand a section in a single-open group with connected spring layout movement.

<a id="install"></a>
## Install

### Bouncy Accordion — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/bouncy-accordion.json
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
### Bouncy Accordion

**Registry source**

```vue
<script setup lang="ts">
import { h } from "vue";
import { CalendarClock, FileText, FolderKanban, PackageCheck, RadioTower, ShieldCheck } from "lucide-vue-next";
import { BouncyAccordion } from "@/components/orvui/motion/bouncy-accordion";
const records = [
  ["brief", "Release Brief", "Gather launch notes, accountable owners and known risks into a brief handoff before the release.", FileText],
  ["launch", "Launch Checklist", "Review copy, links, analytics, recovery steps and approvals together before the launch starts.", ShieldCheck],
  ["campaign", "Campaign Notes", "Attach notes for each channel while keeping the closed task list compact and easy to scan.", RadioTower],
  ["calendar", "Rollout Calendar", "Coordinate announcements, staging reviews, reminders and quiet hours on a shared timeline.", CalendarClock],
  ["ship", "Ship Build", "Follow the build artifact, deployment state and final review before completing the release.", PackageCheck],
  ["archive", "Archive Assets", "File the approved copy, graphics and source in the campaign folder after the rollout ends.", FolderKanban],
] as const;
const items = records.map(([id, title, description, icon]) => ({ id, title, description, icon: h(icon, { class: "h-4 w-4" }) }));
</script>
<template><div class="flex min-h-96 w-full items-center justify-center"><div class="w-full max-w-sm h-[480px]"><BouncyAccordion :items="items" default-value="calendar" /></div></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { h } from "vue";
import { CalendarClock, FileText, FolderKanban, PackageCheck, RadioTower, ShieldCheck } from "lucide-vue-next";
import { BouncyAccordion } from "@orvui/vue/motion/bouncy-accordion";
const records = [
  ["brief", "Release Brief", "Gather launch notes, accountable owners and known risks into a brief handoff before the release.", FileText],
  ["launch", "Launch Checklist", "Review copy, links, analytics, recovery steps and approvals together before the launch starts.", ShieldCheck],
  ["campaign", "Campaign Notes", "Attach notes for each channel while keeping the closed task list compact and easy to scan.", RadioTower],
  ["calendar", "Rollout Calendar", "Coordinate announcements, staging reviews, reminders and quiet hours on a shared timeline.", CalendarClock],
  ["ship", "Ship Build", "Follow the build artifact, deployment state and final review before completing the release.", PackageCheck],
  ["archive", "Archive Assets", "File the approved copy, graphics and source in the campaign folder after the rollout ends.", FolderKanban],
] as const;
const items = records.map(([id, title, description, icon]) => ({ id, title, description, icon: h(icon, { class: "h-4 w-4" }) }));
</script>
<template><div class="flex min-h-96 w-full items-center justify-center"><div class="w-full max-w-sm h-[480px]"><BouncyAccordion :items="items" default-value="calendar" /></div></div></template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `BouncyAccordion` | `v-model` | `null \| string` | `update:modelValue` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### BouncyAccordion

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `{ id: string; title: any; description?: any; icon?: any; disabled?: boolean; }[]` | — | Yes | — |
| `modelValue` | `null \| string` | — | No | — |
| `defaultValue` | `null \| string` | `null` | No | — |
| `collapsible` | `boolean` | `true` | No | — |
| `classNames` | `Record<string, string>` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `title` | — | `v-bind: scope` | — |
| `content` | — | `v-bind: scope` | — |

<a id="about"></a>
## About Bouncy Accordion

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Bouncy Accordion?**

Configure Bouncy Accordion through items, modelValue, defaultValue, collapsible, classNames. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Table](https://orvui.efu.me/en/components/motion/table): Inspect and edit rows with virtual scrolling, selection, sorting and adjustable columns.
- [Sortable List](https://orvui.efu.me/en/components/motion/sortable-stack): Reorder a list with pointer or keyboard input and offer an undo operation.
- [Popover](https://orvui.efu.me/en/components/motion/popover): Attach a floating surface to a trigger with conventional or continuous morphing transitions.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/bouncy-accordion.json
- Documentation: https://orvui.efu.me/en/components/motion/bouncy-accordion
- `packages/vue/src/motion/bouncy-accordion/src/BouncyAccordion.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
