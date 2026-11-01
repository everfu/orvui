---
title: "Scroll Animation"
description: "Connect scrolling to progress, parallax, reveal effects and deliberate navigation."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/scroll-animation"
markdown: "https://orvui.efu.me/en/components/motion/scroll-animation.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Scroll Animation

> Connect scrolling to progress, parallax, reveal effects and deliberate navigation.

<a id="when-to-use"></a>

## When to use it

- Use Scroll Animation when the interface needs this behavior: connect scrolling to progress, parallax, reveal effects and deliberate navigation.

<a id="install"></a>
## Install

### Scroll Animation — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/scroll-animation.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Smooth Scroll — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/smooth-scroll.json
```

This example also needs:

```bash
pnpm add lucide-vue-next@^0.468.0
```

### Scroll Progress — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/scroll-progress.json
```

### Parallax — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/parallax.json
```

### Scroll To — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/scroll-to.json
```

### Scroll Reveal — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/scroll-reveal.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
```

```bash
pnpm add lucide-vue-next@^0.468.0 motion-v@^1.10.0
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `lenis@^1.3.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Scroll Animation

**Registry source**

```vue
<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { ScrollTo, SmoothScroll } from "@/components/orvui/motion/scroll-animation";
const sections = Array.from({ length: 16 }, (_, index) => index + 1);
</script>
<template>
  <SmoothScroll :root="false" class="h-64 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="space-y-3 p-4"><div v-for="section in sections" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div></div>
    <ScrollTo :to="0" aria-label="Scroll to top" class="sticky bottom-3 left-[calc(100%-3rem)] z-10 grid size-9 place-items-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"><ArrowUp class="size-4" /></ScrollTo>
  </SmoothScroll>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { ScrollTo, SmoothScroll } from "@orvui/vue/motion/scroll-animation";
const sections = Array.from({ length: 16 }, (_, index) => index + 1);
</script>
<template>
  <SmoothScroll :root="false" class="h-64 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="space-y-3 p-4"><div v-for="section in sections" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div></div>
    <ScrollTo :to="0" aria-label="Scroll to top" class="sticky bottom-3 left-[calc(100%-3rem)] z-10 grid size-9 place-items-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"><ArrowUp class="size-4" /></ScrollTo>
  </SmoothScroll>
</template>
```

<a id="smooth-scroll"></a>
### Smooth Scroll

Provide Lenis scrolling and share offset, velocity and progress through useSmoothScroll.

**Registry source**

```vue
<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { ScrollTo, SmoothScroll } from "@/components/orvui/motion/scroll-animation";
const sections = Array.from({ length: 16 }, (_, index) => index + 1);
</script>
<template>
  <SmoothScroll :root="false" class="h-64 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="space-y-3 p-4"><div v-for="section in sections" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div></div>
    <ScrollTo :to="0" aria-label="Scroll to top" class="sticky bottom-3 left-[calc(100%-3rem)] z-10 grid size-9 place-items-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"><ArrowUp class="size-4" /></ScrollTo>
  </SmoothScroll>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ArrowUp } from "lucide-vue-next";
import { ScrollTo, SmoothScroll } from "@orvui/vue/motion/scroll-animation";
const sections = Array.from({ length: 16 }, (_, index) => index + 1);
</script>
<template>
  <SmoothScroll :root="false" class="h-64 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="space-y-3 p-4"><div v-for="section in sections" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div></div>
    <ScrollTo :to="0" aria-label="Scroll to top" class="sticky bottom-3 left-[calc(100%-3rem)] z-10 grid size-9 place-items-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"><ArrowUp class="size-4" /></ScrollTo>
  </SmoothScroll>
</template>
```

<a id="scroll-progress"></a>
### Scroll Progress

Render scrolling progress as a bar or ring, with optional spring smoothing.

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useMotionValue } from "motion-v";
import { ScrollProgress } from "@/components/orvui/motion/scroll-animation";
const fraction = useMotionValue(0);
function track(event: Event) {
  const viewport = event.currentTarget as HTMLElement;
  fraction.set(viewport.scrollTop / Math.max(1, viewport.scrollHeight - viewport.clientHeight));
}
onBeforeUnmount(() => fraction.destroy());
</script>
<template>
  <div class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card">
    <ScrollProgress :progress="fraction" :fixed="false" :height="3" />
    <div class="absolute right-3 top-3 z-10 rounded-full bg-background/70 p-1 backdrop-blur"><ScrollProgress variant="circle" :progress="fraction" :size="36" /></div>
    <div class="h-64 overflow-y-auto scrollbar-hide" @scroll="track"><div class="space-y-3 p-4">
      <div v-for="section in 18" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div>
    </div></div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useMotionValue } from "motion-v";
import { ScrollProgress } from "@orvui/vue/motion/scroll-animation";
const fraction = useMotionValue(0);
function track(event: Event) {
  const viewport = event.currentTarget as HTMLElement;
  fraction.set(viewport.scrollTop / Math.max(1, viewport.scrollHeight - viewport.clientHeight));
}
onBeforeUnmount(() => fraction.destroy());
</script>
<template>
  <div class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card">
    <ScrollProgress :progress="fraction" :fixed="false" :height="3" />
    <div class="absolute right-3 top-3 z-10 rounded-full bg-background/70 p-1 backdrop-blur"><ScrollProgress variant="circle" :progress="fraction" :size="36" /></div>
    <div class="h-64 overflow-y-auto scrollbar-hide" @scroll="track"><div class="space-y-3 p-4">
      <div v-for="section in 18" :key="section" class="rounded-lg bg-muted/60 px-3 py-4 text-sm text-muted-foreground">Section {{ section }}</div>
    </div></div>
  </div>
</template>
```

<a id="parallax"></a>
### Parallax

Offset content along either axis according to its position and configured speed.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Parallax } from "@/components/orvui/motion/scroll-animation";
const viewport = ref<HTMLElement | null>(null);
const layers = [
  { speed: -0.6, wrapper: "absolute inset-x-0 -top-1/4 h-[150%]", src: "https://picsum.photos/id/528/800/600", image: "size-full object-cover" },
  { speed: 0.5, wrapper: "absolute inset-0 grid place-items-center" },
  { speed: 0.9, wrapper: "absolute bottom-4 right-4", src: "https://picsum.photos/id/621/120/120", image: "size-12 rounded-full border-2 border-background object-cover shadow-lg" },
];
</script>
<template>
  <div ref="viewport" class="relative h-[600px] w-full max-w-2xl overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="flex h-80 items-center justify-center text-sm text-muted-foreground">Scroll down ↓</div>
    <div class="relative h-96 overflow-hidden">
      <Parallax v-for="(layer, index) in layers" :key="index" :container="viewport" :speed="layer.speed" :class="layer.wrapper">
        <img v-if="layer.src" :src="layer.src" alt="" :class="layer.image" />
        <span v-else class="rounded-full bg-background/85 px-5 py-2 text-base font-medium text-foreground backdrop-blur">Parallax</span>
      </Parallax>
    </div>
    <div class="flex h-80 items-center justify-center text-sm text-muted-foreground">↑ Scroll up</div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Parallax } from "@orvui/vue/motion/scroll-animation";
const viewport = ref<HTMLElement | null>(null);
const layers = [
  { speed: -0.6, wrapper: "absolute inset-x-0 -top-1/4 h-[150%]", src: "https://picsum.photos/id/528/800/600", image: "size-full object-cover" },
  { speed: 0.5, wrapper: "absolute inset-0 grid place-items-center" },
  { speed: 0.9, wrapper: "absolute bottom-4 right-4", src: "https://picsum.photos/id/621/120/120", image: "size-12 rounded-full border-2 border-background object-cover shadow-lg" },
];
</script>
<template>
  <div ref="viewport" class="relative h-[600px] w-full max-w-2xl overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="flex h-80 items-center justify-center text-sm text-muted-foreground">Scroll down ↓</div>
    <div class="relative h-96 overflow-hidden">
      <Parallax v-for="(layer, index) in layers" :key="index" :container="viewport" :speed="layer.speed" :class="layer.wrapper">
        <img v-if="layer.src" :src="layer.src" alt="" :class="layer.image" />
        <span v-else class="rounded-full bg-background/85 px-5 py-2 text-base font-medium text-foreground backdrop-blur">Parallax</span>
      </Parallax>
    </div>
    <div class="flex h-80 items-center justify-center text-sm text-muted-foreground">↑ Scroll up</div>
  </div>
</template>
```

<a id="scroll-to"></a>
### Scroll To

Move the active scroll container to an element, selector or numeric offset.

**Registry source**

```vue
<script setup lang="ts">
import { useId } from "vue";
import { ScrollTo, SmoothScroll } from "@/components/orvui/motion/scroll-animation";
const instanceId = useId();
const sections = ["Intro", "Features", "Pricing", "FAQ"].map(label => ({ label, id: `${instanceId}-${label.toLowerCase()}` }));
</script>
<template>
  <SmoothScroll :root="false" class="relative h-80 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <nav class="sticky top-0 z-10 flex gap-1.5 border-b border-border bg-background/80 p-2 backdrop-blur">
      <ScrollTo v-for="section in sections" :key="section.id" :to="`#${section.id}`" :offset="-48" class="rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{{ section.label }}</ScrollTo>
    </nav>
    <section v-for="section in sections" :id="section.id" :key="section.id" class="flex h-64 items-center justify-center text-lg font-medium text-foreground">{{ section.label }}</section>
  </SmoothScroll>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { useId } from "vue";
import { ScrollTo, SmoothScroll } from "@orvui/vue/motion/scroll-animation";
const instanceId = useId();
const sections = ["Intro", "Features", "Pricing", "FAQ"].map(label => ({ label, id: `${instanceId}-${label.toLowerCase()}` }));
</script>
<template>
  <SmoothScroll :root="false" class="relative h-80 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <nav class="sticky top-0 z-10 flex gap-1.5 border-b border-border bg-background/80 p-2 backdrop-blur">
      <ScrollTo v-for="section in sections" :key="section.id" :to="`#${section.id}`" :offset="-48" class="rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{{ section.label }}</ScrollTo>
    </nav>
    <section v-for="section in sections" :id="section.id" :key="section.id" class="flex h-64 items-center justify-center text-lg font-medium text-foreground">{{ section.label }}</section>
  </SmoothScroll>
</template>
```

<a id="scroll-reveal"></a>
### Scroll Reveal

Reveal content when it crosses the viewport boundary, once or on each entry.

**Registry source**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ScrollReveal } from "@/components/orvui/motion/scroll-animation";
const viewport = ref<HTMLElement | null>(null);
const samples = ["Spring slide", "Blur in", "Staggered by delay", "Reveal once"];
</script>
<template>
  <div ref="viewport" class="h-80 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="flex flex-col gap-16 p-6"><div class="text-center text-sm text-muted-foreground">Scroll ↓</div>
      <ScrollReveal v-for="(label, index) in samples" :key="label" :root="viewport" :once="false" :delay="index * 0.05"
        class="rounded-xl border border-border bg-muted/50 px-4 py-16 text-center text-base font-medium text-foreground">{{ label }}</ScrollReveal>
      <div class="text-center text-sm text-muted-foreground">End</div>
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ScrollReveal } from "@orvui/vue/motion/scroll-animation";
const viewport = ref<HTMLElement | null>(null);
const samples = ["Spring slide", "Blur in", "Staggered by delay", "Reveal once"];
</script>
<template>
  <div ref="viewport" class="h-80 w-full max-w-lg overflow-y-auto scrollbar-hide rounded-2xl border border-border bg-card">
    <div class="flex flex-col gap-16 p-6"><div class="text-center text-sm text-muted-foreground">Scroll ↓</div>
      <ScrollReveal v-for="(label, index) in samples" :key="label" :root="viewport" :once="false" :delay="index * 0.05"
        class="rounded-xl border border-border bg-muted/50 px-4 py-16 text-center text-base font-medium text-foreground">{{ label }}</ScrollReveal>
      <div class="text-center text-sm text-muted-foreground">End</div>
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### ScrollTo

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `to` | `string \| number \| HTMLElement` | `props.target` | No | — |
| `target` | `string \| number \| HTMLElement` | — | No | — |
| `offset` | `number` | — | No | — |
| `duration` | `number` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SmoothScroll

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `root` | `boolean` | `true` | No | — |
| `lerp` | `number` | `0.1` | No | — |
| `duration` | `number` | `1.2` | No | — |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | No | — |
| `wheelMultiplier` | `number` | `1` | No | — |
| `touch` | `boolean` | `false` | No | — |
| `enabled` | `boolean` | `true` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ScrollProgress

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `"circle" \| "bar"` | `"bar"` | No | — |
| `progress` | `MotionValue<number>` | `fallback` | No | — |
| `spring` | `boolean` | `true` | No | — |
| `position` | `"top" \| "bottom"` | `"top"` | No | — |
| `height` | `number` | `2` | No | — |
| `fixed` | `boolean` | `true` | No | — |
| `size` | `number` | `40` | No | — |
| `thickness` | `number` | `3` | No | — |

### Parallax

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `speed` | `number` | `0.3` | No | — |
| `axis` | `"x" \| "y"` | `"y"` | No | — |
| `container` | `null \| HTMLElement \| Ref<HTMLElement \| null, HTMLElement \| null>` | — | No | — |
| `spring` | `boolean` | `true` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ScrollReveal

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `y` | `number` | `16` | No | — |
| `blur` | `number` | `8` | No | — |
| `duration` | `number` | `0.6` | No | — |
| `delay` | `number` | `0` | No | — |
| `once` | `boolean` | `true` | No | — |
| `amount` | `number \| "some" \| "all"` | `0.3` | No | — |
| `root` | `null \| HTMLElement \| Ref<HTMLElement \| null, HTMLElement \| null>` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Scroll Animation

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Scroll Animation?**

Configure Scroll Animation through to, target, offset, duration, disabled. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Tabs](https://orvui.efu.me/en/components/motion/tabs): Switch between associated panels using a moving indicator and accessible tab controls.
- [Shared Layout Background](https://orvui.efu.me/en/components/motion/shared-layout-bg): Move one background surface between registered items to indicate a current selection.
- [Preview Rail](https://orvui.efu.me/en/components/motion/preview-rail): Preview navigation targets from a compact rail that expands around the focused item.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/scroll-animation.json
- Documentation: https://orvui.efu.me/en/components/motion/scroll-animation
- `packages/vue/src/motion/scroll-animation/src/ScrollTo.vue`
- `packages/vue/src/motion/scroll-animation/src/SmoothScroll.vue`
- `packages/vue/src/motion/scroll-animation/src/ScrollProgress.vue`
- `packages/vue/src/motion/scroll-animation/src/Parallax.vue`
- `packages/vue/src/motion/scroll-animation/src/ScrollReveal.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
