# Tilt Card · orvui 0.1.1

## Selection and composition

Add motion to an existing structure with text transitions, shared selection backgrounds or scroll feedback, while retaining clear static states for reduced motion.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Tilt Card"
description: "Tilt a card toward the pointer and move a highlight over its surface."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/tilt-card"
markdown: "https://orvui.efu.me/en/components/motion/tilt-card.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Tilt Card

> Tilt a card toward the pointer and move a highlight over its surface.

<a id="when-to-use"></a>

## When to use it

- Use Tilt Card when the interface needs this behavior: tilt a card toward the pointer and move a highlight over its surface.

<a id="install"></a>
## Install

### Tilt Card — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tilt-card.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Tilt Card

**Registry source**

```vue
<script setup lang="ts">
import { TiltCard } from "@/components/orvui/motion/tilt-card";
</script>
<template>
  <div class="flex items-center justify-center p-6">
    <TiltCard class="w-[280px] border border-border bg-card p-8">
      <div class="text-xs uppercase tracking-wider text-muted-foreground">Interactive</div>
      <h3 class="mt-2 text-2xl font-semibold text-foreground">A new angle</h3>
      <p class="mt-3 text-sm text-muted-foreground">Move across the surface to follow its depth and reflected light.</p>
    </TiltCard>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { TiltCard } from "@orvui/vue/motion/tilt-card";
</script>
<template>
  <div class="flex items-center justify-center p-6">
    <TiltCard class="w-[280px] border border-border bg-card p-8">
      <div class="text-xs uppercase tracking-wider text-muted-foreground">Interactive</div>
      <h3 class="mt-2 text-2xl font-semibold text-foreground">A new angle</h3>
      <p class="mt-3 text-sm text-muted-foreground">Move across the surface to follow its depth and reflected light.</p>
    </TiltCard>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### TiltCard

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `max` | `number` | `12` | No | — |
| `glare` | `boolean` | `true` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Tilt Card

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Tilt Card?**

Configure Tilt Card through max, glare. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Marquee](https://orvui.efu.me/en/components/motion/marquee): Repeat a horizontal or vertical content strip with optional pause on hover.
- [Theme Toggle](https://orvui.efu.me/en/components/motion/theme-toggle): Reveal a new page theme with a circle, rectangle or blinds transition.
- [Shader Background](https://orvui.efu.me/en/components/motion/shader-background): Render an animated background through a Vue adapter for the Paper Design shader runtime.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/tilt-card.json
- Documentation: https://orvui.efu.me/en/components/motion/tilt-card
- `packages/vue/src/motion/tilt-card/src/TiltCard.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

