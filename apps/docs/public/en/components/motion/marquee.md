---
title: "Marquee"
description: "Repeat a horizontal or vertical content strip with optional pause on hover."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/marquee"
markdown: "https://orvui.efu.me/en/components/motion/marquee.md"
license: "MIT"
productVersion: "0.1.0"
---

# Marquee

> Repeat a horizontal or vertical content strip with optional pause on hover.

Repeat a horizontal or vertical content strip with optional pause on hover.

## When to use it

- Use Marquee when the interface needs this behavior: repeat a horizontal or vertical content strip with optional pause on hover.

## Install

### Marquee — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/marquee.json
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
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## Usage

### Marquee

**Registry source**

```vue
<script setup lang="ts">
import { Marquee } from "@/components/orvui/motion/marquee";
const names = "Vercel,Linear,Stripe,Figma,GitHub,Notion,Loom,Raycast".split(",");
</script>
<template>
  <div class="w-full"><Marquee :speed="25">
    <div v-for="name in names" :key="name" class="mx-4 flex h-12 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground">{{ name }}</div>
  </Marquee></div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { Marquee } from "@orvui/vue/motion/marquee";
const names = "Vercel,Linear,Stripe,Figma,GitHub,Notion,Loom,Raycast".split(",");
</script>
<template>
  <div class="w-full"><Marquee :speed="25">
    <div v-for="name in names" :key="name" class="mx-4 flex h-12 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground">{{ name }}</div>
  </Marquee></div>
</template>
```

## API Reference

### Marquee

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `direction` | `"left" \| "right" \| "up" \| "down"` | `"left"` | No | — |
| `speed` | `number` | `30` | No | — |
| `pauseOnHover` | `boolean` | `true` | No | — |
| `gap` | `string` | `"1rem"` | No | — |
| `fade` | `boolean` | `true` | No | — |

## About Marquee

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Marquee?**

Configure Marquee through direction, speed, pauseOnHover, gap, fade. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through the documented composition; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/marquee.json
- Documentation: https://orvui.efu.me/en/components/motion/marquee
- `packages/vue/src/motion/marquee/src/Marquee.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
