---
title: "Tilt Card"
description: "Tilt a card toward the pointer and move a highlight over its surface."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/tilt-card"
markdown: "https://orvui.efu.me/en/components/motion/tilt-card.md"
license: "MIT"
productVersion: "0.1.0"
---

# Tilt Card

> Tilt a card toward the pointer and move a highlight over its surface.

Tilt a card toward the pointer and move a highlight over its surface.

## When to use it

- Use Tilt Card when the interface needs this behavior: tilt a card toward the pointer and move a highlight over its surface.

## Install

### Tilt Card — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tilt-card.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

## Usage

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

## About Tilt Card

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Tilt Card?**

Configure Tilt Card through max, glare. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/tilt-card.json
- Documentation: https://orvui.efu.me/en/components/motion/tilt-card
- `packages/vue/src/motion/tilt-card/src/TiltCard.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
