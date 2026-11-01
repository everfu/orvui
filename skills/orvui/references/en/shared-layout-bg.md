# Shared Layout Background · orvui 0.1.1

## Selection and composition

Add motion to an existing structure with text transitions, shared selection backgrounds or scroll feedback, while retaining clear static states for reduced motion.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Shared Layout Background"
description: "Move one background surface between registered items to indicate a current selection."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/shared-layout-bg"
markdown: "https://orvui.efu.me/en/components/motion/shared-layout-bg.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Shared Layout Background

> Move one background surface between registered items to indicate a current selection.

<a id="when-to-use"></a>

## When to use it

- Use Shared Layout Background when the interface needs this behavior: move one background surface between registered items to indicate a current selection.

<a id="install"></a>
## Install

### Shared Layout Background — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/shared-layout-bg.json
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
### Shared Layout Background

**Registry source**

```vue
<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import { SharedLayoutBg } from "@/components/orvui/motion/shared-layout-bg";
const entries = [
  { title: "Inbox", body: "12 unread threads and 3 mentions today." }, { title: "Drafts", body: "4 posts are ready for a final review." },
  { title: "Releases", body: "Version 0.4.1 was released 2 days ago." }, { title: "Billing", body: "Your plan renews on the first next month." },
];
</script>
<template><div class="w-full max-w-lg px-2"><SharedLayoutBg>
  <button v-for="entry in entries" :key="entry.title" type="button" class="group flex flex-col gap-1 px-2 py-3 text-left"><div class="flex items-center justify-between gap-3"><span class="text-sm font-medium text-foreground">{{ entry.title }}</span><ArrowUpRight class="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div><p class="text-sm text-muted-foreground">{{ entry.body }}</p></button>
</SharedLayoutBg></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import { SharedLayoutBg } from "@orvui/vue/motion/shared-layout-bg";
const entries = [
  { title: "Inbox", body: "12 unread threads and 3 mentions today." }, { title: "Drafts", body: "4 posts are ready for a final review." },
  { title: "Releases", body: "Version 0.4.1 was released 2 days ago." }, { title: "Billing", body: "Your plan renews on the first next month." },
];
</script>
<template><div class="w-full max-w-lg px-2"><SharedLayoutBg>
  <button v-for="entry in entries" :key="entry.title" type="button" class="group flex flex-col gap-1 px-2 py-3 text-left"><div class="flex items-center justify-between gap-3"><span class="text-sm font-medium text-foreground">{{ entry.title }}</span><ArrowUpRight class="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div><p class="text-sm text-muted-foreground">{{ entry.body }}</p></button>
</SharedLayoutBg></div></template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### SharedLayoutBg

<a id="about"></a>
## About Shared Layout Background

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Shared Layout Background?**

Shared Layout Background composes through its slots and native element attributes.

**How does it connect to application state?**

Provide content through the documented composition; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Preview Rail](https://orvui.efu.me/en/components/motion/preview-rail): Preview navigation targets from a compact rail that expands around the focused item.
- [Dock](https://orvui.efu.me/en/components/motion/dock): Group compact navigation actions around an indicator that follows the active item.
- [Scroll Animation](https://orvui.efu.me/en/components/motion/scroll-animation): Connect scrolling to progress, parallax, reveal effects and deliberate navigation.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/shared-layout-bg.json
- Documentation: https://orvui.efu.me/en/components/motion/shared-layout-bg
- `packages/vue/src/motion/shared-layout-bg/src/SharedLayoutBg.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

