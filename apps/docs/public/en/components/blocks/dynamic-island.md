---
title: "Dynamic Island"
description: "Switch a compact capsule between live activity views without changing its identity."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/dynamic-island"
markdown: "https://orvui.efu.me/en/components/blocks/dynamic-island.md"
license: "MIT"
productVersion: "0.1.0"
---

# Dynamic Island

> Switch a compact capsule between live activity views without changing its identity.

## Install

### Dynamic Island — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/dynamic-island.json https://orvui.efu.me/r/button.json https://orvui.efu.me/r/number.json
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

```bash
pnpm add lucide-vue-next@^0.468.0 motion-v@^1.10.0
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `tailwind-merge@^3.0.0`

## Usage

### Dynamic Island

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { motion } from "motion-v";
import { Music, Phone, PhoneOff, Timer } from "lucide-vue-next";
import { DynamicIsland, DynamicIslandView } from "@/components/orvui/blocks/dynamic-island";
import { Button } from "@/components/orvui/motion/button";
import { NumberTicker } from "@/components/orvui/motion/number";
import { useReducedMotion } from "@/components/orvui/lib/composables";
const view = ref<"call" | "timer" | "music" | null>(null),
  seconds = ref(154),
  reduce = useReducedMotion(),
  delays = [0, 0.18, 0.09, 0.27];
let tick: ReturnType<typeof setInterval> | undefined;
watch(view, (next) => {
  clearInterval(tick);
  if (next === "timer")
    tick = setInterval(() => {
      seconds.value = Math.max(0, seconds.value - 1);
    }, 1000);
});
onBeforeUnmount(() => clearInterval(tick));
const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div class="flex h-32 w-full items-start justify-center pt-2">
      <DynamicIsland :view="view"
        ><template #compact
          ><span class="h-1.5 w-1.5 rounded-full bg-(--color-success)" /><span
            >9:41</span
          ></template
        ><DynamicIslandView id="call" class="gap-4"
          ><div class="flex flex-col">
            <span class="text-[10px] uppercase tracking-wider opacity-60"
              >Incoming call</span
            ><span class="text-sm font-semibold">orvui Demo</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-for="action in [
                { label: 'Decline', icon: PhoneOff, tone: 'bg-destructive' },
                { label: 'Accept', icon: Phone, tone: 'bg-(--color-success)' },
              ]"
              :key="action.label"
              type="button"
              :aria-label="action.label"
              class="flex h-8 w-8 items-center justify-center rounded-full text-white"
              :class="action.tone"
              @click="view = null"
            >
              <component :is="action.icon" class="h-3.5 w-3.5" />
            </button></div></DynamicIslandView
        ><DynamicIslandView id="timer" class="gap-3"
          ><Timer class="h-4 w-4 text-(--color-warning)" /><span
            class="text-[10px] uppercase tracking-wider opacity-60"
            >Timer</span
          ><NumberTicker
            :value="seconds"
            :format="clock"
            :start-on-view="false"
            :duration="0.5"
            class="text-sm font-semibold" /></DynamicIslandView
        ><DynamicIslandView id="music" class="gap-3"
          ><span
            class="flex h-7 w-7 items-center justify-center rounded-lg bg-background/15"
            ><Music class="h-3.5 w-3.5"
          /></span>
          <div class="flex flex-col text-left">
            <span class="text-xs font-semibold leading-tight"
              >Midnight City</span
            ><span class="text-[10px] opacity-60">M83</span>
          </div>
          <span class="flex h-4 items-end gap-0.5" aria-hidden="true"
            ><motion.span
              v-for="delay in delays"
              :key="delay"
              :animate="
                reduce ? undefined : { scaleY: [0.4, 1, 0.55, 0.9, 0.4] }
              "
              :transition="{
                duration: 1.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
              }"
              class="h-full w-0.5 origin-bottom rounded-full bg-(--color-success)"
              :style="{ scaleY: 0.6 }" /></span></DynamicIslandView
      ></DynamicIsland>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <Button size="sm" variant="secondary" @click="view = 'call'">Call</Button
      ><Button
        size="sm"
        variant="secondary"
        @click="
          seconds = 154;
          view = 'timer';
        "
        >Timer</Button
      ><Button size="sm" variant="secondary" @click="view = 'music'"
        >Music</Button
      ><Button size="sm" variant="ghost" @click="view = null">Dismiss</Button>
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { motion } from "motion-v";
import { Music, Phone, PhoneOff, Timer } from "lucide-vue-next";
import { DynamicIsland, DynamicIslandView } from "@orvui/vue/blocks/dynamic-island";
import { Button } from "@orvui/vue/motion/button";
import { NumberTicker } from "@orvui/vue/motion/number";
import { useReducedMotion } from "@orvui/vue";
const view = ref<"call" | "timer" | "music" | null>(null),
  seconds = ref(154),
  reduce = useReducedMotion(),
  delays = [0, 0.18, 0.09, 0.27];
let tick: ReturnType<typeof setInterval> | undefined;
watch(view, (next) => {
  clearInterval(tick);
  if (next === "timer")
    tick = setInterval(() => {
      seconds.value = Math.max(0, seconds.value - 1);
    }, 1000);
});
onBeforeUnmount(() => clearInterval(tick));
const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4">
    <div class="flex h-32 w-full items-start justify-center pt-2">
      <DynamicIsland :view="view"
        ><template #compact
          ><span class="h-1.5 w-1.5 rounded-full bg-(--color-success)" /><span
            >9:41</span
          ></template
        ><DynamicIslandView id="call" class="gap-4"
          ><div class="flex flex-col">
            <span class="text-[10px] uppercase tracking-wider opacity-60"
              >Incoming call</span
            ><span class="text-sm font-semibold">orvui Demo</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-for="action in [
                { label: 'Decline', icon: PhoneOff, tone: 'bg-destructive' },
                { label: 'Accept', icon: Phone, tone: 'bg-(--color-success)' },
              ]"
              :key="action.label"
              type="button"
              :aria-label="action.label"
              class="flex h-8 w-8 items-center justify-center rounded-full text-white"
              :class="action.tone"
              @click="view = null"
            >
              <component :is="action.icon" class="h-3.5 w-3.5" />
            </button></div></DynamicIslandView
        ><DynamicIslandView id="timer" class="gap-3"
          ><Timer class="h-4 w-4 text-(--color-warning)" /><span
            class="text-[10px] uppercase tracking-wider opacity-60"
            >Timer</span
          ><NumberTicker
            :value="seconds"
            :format="clock"
            :start-on-view="false"
            :duration="0.5"
            class="text-sm font-semibold" /></DynamicIslandView
        ><DynamicIslandView id="music" class="gap-3"
          ><span
            class="flex h-7 w-7 items-center justify-center rounded-lg bg-background/15"
            ><Music class="h-3.5 w-3.5"
          /></span>
          <div class="flex flex-col text-left">
            <span class="text-xs font-semibold leading-tight"
              >Midnight City</span
            ><span class="text-[10px] opacity-60">M83</span>
          </div>
          <span class="flex h-4 items-end gap-0.5" aria-hidden="true"
            ><motion.span
              v-for="delay in delays"
              :key="delay"
              :animate="
                reduce ? undefined : { scaleY: [0.4, 1, 0.55, 0.9, 0.4] }
              "
              :transition="{
                duration: 1.1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
              }"
              class="h-full w-0.5 origin-bottom rounded-full bg-(--color-success)"
              :style="{ scaleY: 0.6 }" /></span></DynamicIslandView
      ></DynamicIsland>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <Button size="sm" variant="secondary" @click="view = 'call'">Call</Button
      ><Button
        size="sm"
        variant="secondary"
        @click="
          seconds = 154;
          view = 'timer';
        "
        >Timer</Button
      ><Button size="sm" variant="secondary" @click="view = 'music'"
        >Music</Button
      ><Button size="sm" variant="ghost" @click="view = null">Dismiss</Button>
    </div>
  </div>
</template>
```

## API Reference

### DynamicIsland

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `view` | `string \| null` | — | Yes | — |
| `compact` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `compact` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

### DynamicIslandView

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | — | Yes | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## About Dynamic Island

Switch a compact capsule between live activity views without changing its identity.

### When to use it

- Use Dynamic Island when the interface needs this behavior: switch a compact capsule between live activity views without changing its identity.

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Dynamic Island?**

Configure Dynamic Island through view, compact. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through compact, default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/dynamic-island.json
- Documentation: https://orvui.efu.me/en/components/blocks/dynamic-island
- `packages/vue/src/blocks/dynamic-island/src/DynamicIsland.vue`
- `packages/vue/src/blocks/dynamic-island/src/DynamicIslandView.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
