---
title: "Fixtures"
description: "Browse elimination rounds or a radial bracket with team and match metadata."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/knockout-bracket"
markdown: "https://orvui.efu.me/en/components/blocks/knockout-bracket.md"
license: "MIT"
productVersion: "0.1.0"
---

# Fixtures

> Browse elimination rounds or a radial bracket with team and match metadata.

## Install

### Fixtures — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/knockout-bracket.json
```

### Knockout Wheel — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/knockout-wheel.json
```

### Knockout Bracket — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/knockout-bracket.json
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

### Fixtures

**Registry source**

```vue
<script setup lang="ts">
import { KnockoutBracket, ROUNDS, THIRD_PLACE } from "@/components/orvui/blocks/knockout-bracket";
const season = { rounds: ROUNDS, thirdPlace: THIRD_PLACE, initialRound: 1 };
</script>
<template>
  <div class="w-full py-8"><KnockoutBracket v-bind="season" /></div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { KnockoutBracket, ROUNDS, THIRD_PLACE } from "@orvui/vue/blocks/knockout-bracket";
const season = { rounds: ROUNDS, thirdPlace: THIRD_PLACE, initialRound: 1 };
</script>
<template>
  <div class="w-full py-8"><KnockoutBracket v-bind="season" /></div>
</template>
```

### Knockout Wheel

Arrange elimination matches around a radial wheel with the winner at its center.

**Registry source**

```vue
<script setup lang="ts">
import { KnockoutWheel, WHEEL_ROUNDS } from "@/components/orvui/blocks/knockout-bracket";
const season = { rounds: WHEEL_ROUNDS, initialRound: 0 };
</script>
<template>
  <div class="w-full py-8"><KnockoutWheel v-bind="season" /></div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { KnockoutWheel, WHEEL_ROUNDS } from "@orvui/vue/blocks/knockout-bracket";
const season = { rounds: WHEEL_ROUNDS, initialRound: 0 };
</script>
<template>
  <div class="w-full py-8"><KnockoutWheel v-bind="season" /></div>
</template>
```

### Knockout Bracket

Navigate tournament rounds with team metadata and an optional third-place match.

**Registry source**

```vue
<script setup lang="ts">
import { KnockoutBracket, ROUNDS, THIRD_PLACE } from "@/components/orvui/blocks/knockout-bracket";
const season = { rounds: ROUNDS, thirdPlace: THIRD_PLACE, initialRound: 1 };
</script>
<template>
  <div class="w-full py-8"><KnockoutBracket v-bind="season" /></div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { KnockoutBracket, ROUNDS, THIRD_PLACE } from "@orvui/vue/blocks/knockout-bracket";
const season = { rounds: ROUNDS, thirdPlace: THIRD_PLACE, initialRound: 1 };
</script>
<template>
  <div class="w-full py-8"><KnockoutBracket v-bind="season" /></div>
</template>
```

## API Reference

### KnockoutBracket

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `rounds` | `Round[]` | — | Yes | — |
| `initialRound` | `number` | `1` | No | — |
| `thirdPlace` | `Match` | — | No | — |
| `thirdPlaceLabel` | `string` | `"Third place play-off"` | No | — |

### KnockoutWheel

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `rounds` | `Round[]` | — | Yes | — |
| `initialRound` | `number` | `0` | No | — |

## About Fixtures

Browse elimination rounds or a radial bracket with team and match metadata.

### When to use it

- Use Fixtures when the interface needs this behavior: browse elimination rounds or a radial bracket with team and match metadata.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Fixtures?**

Configure Fixtures through rounds, initialRound, thirdPlace, thirdPlaceLabel. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through the documented composition; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/knockout-bracket.json
- Documentation: https://orvui.efu.me/en/components/blocks/knockout-bracket
- `packages/vue/src/blocks/knockout-bracket/src/KnockoutBracket.vue`
- `packages/vue/src/blocks/knockout-bracket/src/KnockoutWheel.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
