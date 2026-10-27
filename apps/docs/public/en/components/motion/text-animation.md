---
title: "Text Animation"
description: "Reveal, shimmer, scramble or replace text while keeping a stable accessible reading."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/text-animation"
markdown: "https://orvui.efu.me/en/components/motion/text-animation.md"
license: "MIT"
productVersion: "0.1.0"
---

# Text Animation

> Reveal, shimmer, scramble or replace text while keeping a stable accessible reading.

## Install

### Text Animation — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/text-animation.json
```

### Text Scramble — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/text-scramble.json
```

### Dia Text Animation — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/chromatic-text-reveal.json
```

### Text Reveal — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/text-reveal.json
```

### Text Shimmer — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/text-shimmer.json
```

### Text Cascade — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/text-cascade.json
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

### Text Animation

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextReveal } from "@/components/orvui/motion/text-animation";
const replay = ref(0);
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><div :key="replay" class="flex flex-col gap-2"><TextReveal as="h2" :text="['Motion that feels', 'considered.']" class="text-balance text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-5xl" /><TextReveal text="Word by word, with a soft blur." :delay=".9" :stagger=".05" :blur="6" y-offset="20%" class="text-sm text-muted-foreground" /></div><button type="button" @click="replay += 1" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground press hover:border-(--color-border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Replay</button></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextReveal } from "@orvui/vue/motion/text-animation";
const replay = ref(0);
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><div :key="replay" class="flex flex-col gap-2"><TextReveal as="h2" :text="['Motion that feels', 'considered.']" class="text-balance text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-5xl" /><TextReveal text="Word by word, with a soft blur." :delay=".9" :stagger=".05" :blur="6" y-offset="20%" class="text-sm text-muted-foreground" /></div><button type="button" @click="replay += 1" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground press hover:border-(--color-border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Replay</button></div></template>
```

### Text Scramble

Resolve temporary characters into the target text and expose a stable accessible value.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextScramble } from "@/components/orvui/motion/text-animation";
const steps = ["Inspecting the repository", "Running the checks", "Preparing the update"];
const selected = ref(0);
function advance() { selected.value = (selected.value + 1) % steps.length; }
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><TextScramble :text="steps[selected]" class="font-mono text-xl font-medium text-foreground" /><button type="button" @click="advance" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground hover:border-border-strong">Next phrase</button></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextScramble } from "@orvui/vue/motion/text-animation";
const steps = ["Inspecting the repository", "Running the checks", "Preparing the update"];
const selected = ref(0);
function advance() { selected.value = (selected.value + 1) % steps.length; }
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><TextScramble :text="steps[selected]" class="font-mono text-xl font-medium text-foreground" /><button type="button" @click="advance" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground hover:border-border-strong">Next phrase</button></div></template>
```

### Dia Text Animation

Keep the sentence prefix still while a color sweep reveals each changing final word.

**Registry source**

```vue
<script setup lang="ts">
import { ChromaticTextReveal } from "@/components/orvui/motion/text-animation";
const adjectives = ["natural.", "intentional.", "alive."];
</script>
<template><div class="@container flex w-full justify-center"><ChromaticTextReveal prefix="Motion that feels" :words="adjectives" :start-on-view="false" class="shrink-0 font-medium tracking-[-.04em] text-foreground [font-size:clamp(1.25rem,7.8cqw,3rem)]" /></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ChromaticTextReveal } from "@orvui/vue/motion/text-animation";
const adjectives = ["natural.", "intentional.", "alive."];
</script>
<template><div class="@container flex w-full justify-center"><ChromaticTextReveal prefix="Motion that feels" :words="adjectives" :start-on-view="false" class="shrink-0 font-medium tracking-[-.04em] text-foreground [font-size:clamp(1.25rem,7.8cqw,3rem)]" /></div></template>
```

### Text Reveal

Introduce words or characters with a short upward movement and fading blur.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextReveal } from "@/components/orvui/motion/text-animation";
const replay = ref(0);
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><div :key="replay" class="flex flex-col gap-2"><TextReveal as="h2" :text="['Motion that feels', 'considered.']" class="text-balance text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-5xl" /><TextReveal text="Word by word, with a soft blur." :delay=".9" :stagger=".05" :blur="6" y-offset="20%" class="text-sm text-muted-foreground" /></div><button type="button" @click="replay += 1" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground hover:border-border-strong">Replay</button></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TextReveal } from "@orvui/vue/motion/text-animation";
const replay = ref(0);
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><div :key="replay" class="flex flex-col gap-2"><TextReveal as="h2" :text="['Motion that feels', 'considered.']" class="text-balance text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-5xl" /><TextReveal text="Word by word, with a soft blur." :delay=".9" :stagger=".05" :blur="6" y-offset="20%" class="text-sm text-muted-foreground" /></div><button type="button" @click="replay += 1" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground hover:border-border-strong">Replay</button></div></template>
```

### Text Shimmer

Move a highlight across existing text to indicate pending work or emphasize a label.

**Registry source**

```vue
<script setup lang="ts">
import { TextShimmer } from "@/components/orvui/motion/text-animation";
const examples = [{ text: "Loading projects…", class: "text-3xl font-semibold", duration: 2 }, { text: "Faster shimmer", class: "text-sm", duration: 1.5 }];
</script>
<template><div class="flex flex-col gap-4"><TextShimmer v-for="example in examples" :key="example.text" :duration="example.duration" :class="example.class">{{ example.text }}</TextShimmer></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { TextShimmer } from "@orvui/vue/motion/text-animation";
const examples = [{ text: "Loading projects…", class: "text-3xl font-semibold", duration: 2 }, { text: "Faster shimmer", class: "text-sm", duration: 1.5 }];
</script>
<template><div class="flex flex-col gap-4"><TextShimmer v-for="example in examples" :key="example.text" :duration="example.duration" :class="example.class">{{ example.text }}</TextShimmer></div></template>
```

### Text Cascade

Replace characters individually, letting the previous line leave before the next settles.

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { TextCascade } from "@/components/orvui/motion/text-animation";
const actions = ["Install skills", "Open settings", "Ship updates"];
const selected = ref(0);
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => selected.value = (selected.value + 1) % actions.length, 2400); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template><div class="flex w-full justify-center"><p class="text-lg font-medium text-foreground"><TextCascade :text="actions[selected]" /></p></div></template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { TextCascade } from "@orvui/vue/motion/text-animation";
const actions = ["Install skills", "Open settings", "Ship updates"];
const selected = ref(0);
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => selected.value = (selected.value + 1) % actions.length, 2400); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template><div class="flex w-full justify-center"><p class="text-lg font-medium text-foreground"><TextCascade :text="actions[selected]" /></p></div></template>
```

## API Reference

### TextReveal

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `text` | `string \| string[]` | — | Yes | — |
| `as` | `string` | `"span"` | No | — |
| `split` | `"word" \| "char"` | `"word"` | No | — |
| `stagger` | `number` | `.09` | No | — |
| `delay` | `number` | `0` | No | — |
| `blur` | `number` | `12` | No | — |
| `yOffset` | `string \| number` | `"40%"` | No | — |
| `spring` | `{ stiffness?: number; damping?: number; mass?: number; }` | — | No | — |
| `once` | `boolean` | `true` | No | — |
| `whileInView` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### TextScramble

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `text` | `string` | — | Yes | — |
| `duration` | `number` | `Math.min(760, Math.max(420, target.length * 32))` | No | — |
| `glyphs` | `string` | `"ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/"` | No | — |
| `trigger` | `string \| number` | — | No | — |

### ChromaticTextReveal

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `prefix` | `string` | — | Yes | — |
| `words` | `string[]` | — | Yes | — |
| `colors` | `string[]` | `() => ["#60a5fa", "#818cf8", "#c084fc", "#fb7185", "#fbbf24"]` | No | — |
| `foregroundColor` | `string` | `"var(--foreground)"` | No | — |
| `duration` | `number` | `1.2` | No | — |
| `delay` | `number` | `0` | No | — |
| `pauseDuration` | `number` | `.8` | No | — |
| `loop` | `boolean` | `true` | No | — |
| `startOnView` | `boolean` | `true` | No | — |
| `once` | `boolean` | `true` | No | — |
| `inViewMargin` | `string` | — | No | — |

### TextShimmer

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `as` | `string` | `"span"` | No | — |
| `duration` | `number` | `2` | No | — |
| `spread` | `number` | `2` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### TextCascade

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `text` | `string` | — | Yes | — |

## About Text Animation

Reveal, shimmer, scramble or replace text while keeping a stable accessible reading.

### When to use it

- Use Text Animation when the interface needs this behavior: reveal, shimmer, scramble or replace text while keeping a stable accessible reading.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Text Animation?**

Configure Text Animation through text, as, split, stagger, delay, blur, yOffset, spring, once, whileInView. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/text-animation.json
- Documentation: https://orvui.efu.me/en/components/motion/text-animation
- `packages/vue/src/motion/text-animation/src/TextReveal.vue`
- `packages/vue/src/motion/text-animation/src/TextScramble.vue`
- `packages/vue/src/motion/text-animation/src/ChromaticTextReveal.vue`
- `packages/vue/src/motion/text-animation/src/TextShimmer.vue`
- `packages/vue/src/motion/text-animation/src/TextCascade.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
