# Loader · orvui 0.1.1

## Selection and composition

Use Alert for persistent inline information, Toast Stack for transient action feedback and Loader while an operation is pending. Drive progress and completion from application state.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Loader"
description: "Choose a compact animated indicator for an operation whose result is still pending."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/loader"
markdown: "https://orvui.efu.me/en/components/motion/loader.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Loader

> Choose a compact animated indicator for an operation whose result is still pending.

<a id="when-to-use"></a>

## When to use it

- Use Loader when the interface needs this behavior: choose a compact animated indicator for an operation whose result is still pending.

<a id="install"></a>
## Install

### Loader — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/loader.json
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
### Loader

**Registry source**

```vue
<script setup lang="ts">
import { Loader, type LoaderVariant } from "@/components/orvui/motion/loader";
const variants: [LoaderVariant, string][] = [
  ["spinner", "Spinner"], ["dots", "Dots"], ["bars", "Bars"], ["dot-matrix", "Dot Matrix"], ["dither", "Dither"],
  ["morph", "Morph"], ["comet", "Comet"], ["metaballs", "Metaballs"], ["newton", "Newton"], ["helix", "Helix"],
  ["scramble", "Scramble"], ["percent", "Percent"], ["ascii", "ASCII"], ["ascii-line", "ASCII Line"],
  ["ascii-braille", "ASCII Braille"], ["ascii-blocks", "ASCII Blocks"], ["ascii-bounce", "ASCII Bounce"],
];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-8 p-8">
  <div v-for="[variant, label] in variants" :key="variant" class="flex flex-col items-center gap-4"><Loader :variant="variant" :size="36" /><span class="text-xs text-muted-foreground">{{ label }}</span></div>
</div></template>
```

**Package**

```vue
<script setup lang="ts">
import { Loader, type LoaderVariant } from "@orvui/vue/motion/loader";
const variants: [LoaderVariant, string][] = [
  ["spinner", "Spinner"], ["dots", "Dots"], ["bars", "Bars"], ["dot-matrix", "Dot Matrix"], ["dither", "Dither"],
  ["morph", "Morph"], ["comet", "Comet"], ["metaballs", "Metaballs"], ["newton", "Newton"], ["helix", "Helix"],
  ["scramble", "Scramble"], ["percent", "Percent"], ["ascii", "ASCII"], ["ascii-line", "ASCII Line"],
  ["ascii-braille", "ASCII Braille"], ["ascii-blocks", "ASCII Blocks"], ["ascii-bounce", "ASCII Bounce"],
];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-8 p-8">
  <div v-for="[variant, label] in variants" :key="variant" class="flex flex-col items-center gap-4"><Loader :variant="variant" :size="36" /><span class="text-xs text-muted-foreground">{{ label }}</span></div>
</div></template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### Loader

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `"morph" \| "bars" \| "metaballs" \| "dots" \| "spinner" \| "dot-matrix" \| "dither" \| "ascii" \| "ascii-line" \| "ascii-braille" \| "ascii-blocks" \| "ascii-bounce" \| "comet" \| "scramble" \| "newton" \| "helix" \| "percent"` | `"spinner"` | No | — |
| `size` | `number` | `32` | No | — |
| `speed` | `number` | `1` | No | — |
| `label` | `string` | `"Loading"` | No | — |

<a id="about"></a>
## About Loader

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Loader?**

Configure Loader through variant, size, speed, label. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through the documented composition; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Animated Badge](https://orvui.efu.me/en/components/motion/animated-badge): Pair a compact status label with an icon and optional pulse feedback.
- [Text Animation](https://orvui.efu.me/en/components/motion/text-animation): Reveal, shimmer, scramble or replace text while keeping a stable accessible reading.
- [Number Animation](https://orvui.efu.me/en/components/motion/number): Animate numeric values with counting, rolling or position-preserving digit changes.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/loader.json
- Documentation: https://orvui.efu.me/en/components/motion/loader
- `packages/vue/src/motion/loader/src/Loader.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

