---
title: "Image Generation"
description: "Show image creation states, preview the output and offer result actions."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/image-generation"
markdown: "https://orvui.efu.me/en/components/agents/image-generation.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Image Generation

> Show image creation states, preview the output and offer result actions.

<a id="when-to-use"></a>

## When to use it

- Use Image Generation when the interface needs this behavior: show image creation states, preview the output and offer result actions.

<a id="install"></a>
## Install

### Image Generation — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/image-generation.json
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
### Image Generation

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ImageGeneration, type ImageGenerationStatus } from "@/components/orvui/agents/image-generation";
import { useReducedMotion } from "@/components/orvui/lib/composables";
const status = ref<ImageGenerationStatus>("queued"),
  identity = useId(),
  reduced = useReducedMotion();
// orvui-owned illustration: seeded midpoint displacement creates new terrain contours.
// The canvas, color bands and animation are compatibility inputs; ridge silhouettes differ.
function terrain(
  seed: number,
  baseline: number,
  peak: number,
  roughness: number,
  smooth = false,
) {
  let state = seed >>> 0;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4_294_967_296;
  };
  const heights = Array<number>(33).fill(0);
  heights[0] = (random() - 0.5) * roughness;
  heights[32] = (random() - 0.5) * roughness;
  for (
    let stride = 32, displacement = roughness;
    stride > 1;
    stride /= 2, displacement *= 0.57
  ) {
    for (let left = 0; left < 32; left += stride) {
      const right = left + stride;
      heights[left + stride / 2] =
        (heights[left]! + heights[right]!) / 2 +
        (random() - 0.5) * displacement;
    }
  }
  const points = heights.map((height, index) => {
    const x = index * 25;
    const summit = Math.max(0, 1 - Math.abs(x - 350) / 250);
    return { x, y: Number((baseline + height - peak * summit).toFixed(2)) };
  });
  let outline = `M${points[0]!.x} ${points[0]!.y}`;
  if (smooth) {
    for (let index = 1; index < points.length - 1; index++) {
      const current = points[index]!,
        next = points[index + 1]!;
      outline += `Q${current.x} ${current.y} ${(current.x + next.x) / 2} ${(current.y + next.y) / 2}`;
    }
    const last = points.at(-1)!;
    outline += `T${last.x} ${last.y}`;
  } else
    for (const point of points.slice(1)) outline += `L${point.x} ${point.y}`;
  return outline + "L800 600H0Z";
}
const landscape = {
  distant: terrain(0x49554931, 386, 145, 120),
  middle: terrain(0x49554932, 431, 74, 95),
  foreground: terrain(0x49554933, 509, 8, 54, true),
};
let epoch = 0;
const scheduledTasks = new Set<ReturnType<typeof setTimeout>>();
function cancel() {
  epoch++;
  scheduledTasks.forEach(clearTimeout);
  scheduledTasks.clear();
}
function later(milliseconds: number, task: () => void) {
  const version = epoch;
  const handle = setTimeout(() => {
    scheduledTasks.delete(handle);
    if (version === epoch) task();
  }, milliseconds);
  scheduledTasks.add(handle);
}
onBeforeUnmount(cancel);
function replay() {
  cancel();
  status.value = reduced.value ? "complete" : "queued";
  if (reduced.value) return;
  const stages = [
    { after: 500, status: "generating" },
    { after: 3000, status: "refining" },
    { after: 5200, status: "complete" },
  ] as const;
  stages.forEach((stage) =>
    later(stage.after, () => {
      status.value = stage.status;
    }),
  );
}
watch(reduced, replay);
onMounted(replay);
</script>
<template>
  <div class="w-full max-w-xl">
    <div class="flex w-full flex-col items-center">
      <ImageGeneration
        label="A quiet mountain landscape at sunset"
        prompt="a quiet mountain landscape at sunset"
        resolution="1024 × 1024"
        :status="status"
        @retry="replay"
        ><svg
          viewBox="0 0 800 600"
          aria-hidden="true"
          class="size-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient :id="`${identity}-sky`" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#191b33" />
              <stop offset="0.48" stop-color="#60538d" />
              <stop offset="1" stop-color="#e59b7b" />
            </linearGradient>
            <linearGradient
              :id="`${identity}-ground`"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0" stop-color="#314946" />
              <stop offset="1" stop-color="#101817" />
            </linearGradient>
            <radialGradient :id="`${identity}-glow`">
              <stop offset="0" stop-color="#ffe6b2" stop-opacity="0.95" />
              <stop offset="1" stop-color="#efb47e" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="600" :fill="`url(#${identity}-sky)`" />
          <circle cx="570" cy="210" r="150" :fill="`url(#${identity}-glow)`" />
          <circle cx="570" cy="210" r="54" fill="#ffe5ad" />
          <path :d="landscape.distant" fill="#283d43" opacity="0.9" />
          <path :d="landscape.middle" :fill="`url(#${identity}-ground)`" />
          <path :d="landscape.foreground" fill="#13201f" />
          <g fill="#c9d7c3" opacity="0.65">
            <circle cx="108" cy="142" r="2" />
            <circle cx="168" cy="102" r="1.5" />
            <circle cx="248" cy="154" r="2" />
            <circle cx="332" cy="84" r="1.5" />
            <circle cx="414" cy="138" r="2" />
          </g></svg></ImageGeneration
      ><button
        type="button"
        class="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        @click="replay"
      >
        <RotateCcw class="size-4" />Replay
      </button>
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ImageGeneration, type ImageGenerationStatus } from "@orvui/vue/agents/image-generation";
import { useReducedMotion } from "@orvui/vue";
const status = ref<ImageGenerationStatus>("queued"),
  identity = useId(),
  reduced = useReducedMotion();
// orvui-owned illustration: seeded midpoint displacement creates new terrain contours.
// The canvas, color bands and animation are compatibility inputs; ridge silhouettes differ.
function terrain(
  seed: number,
  baseline: number,
  peak: number,
  roughness: number,
  smooth = false,
) {
  let state = seed >>> 0;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4_294_967_296;
  };
  const heights = Array<number>(33).fill(0);
  heights[0] = (random() - 0.5) * roughness;
  heights[32] = (random() - 0.5) * roughness;
  for (
    let stride = 32, displacement = roughness;
    stride > 1;
    stride /= 2, displacement *= 0.57
  ) {
    for (let left = 0; left < 32; left += stride) {
      const right = left + stride;
      heights[left + stride / 2] =
        (heights[left]! + heights[right]!) / 2 +
        (random() - 0.5) * displacement;
    }
  }
  const points = heights.map((height, index) => {
    const x = index * 25;
    const summit = Math.max(0, 1 - Math.abs(x - 350) / 250);
    return { x, y: Number((baseline + height - peak * summit).toFixed(2)) };
  });
  let outline = `M${points[0]!.x} ${points[0]!.y}`;
  if (smooth) {
    for (let index = 1; index < points.length - 1; index++) {
      const current = points[index]!,
        next = points[index + 1]!;
      outline += `Q${current.x} ${current.y} ${(current.x + next.x) / 2} ${(current.y + next.y) / 2}`;
    }
    const last = points.at(-1)!;
    outline += `T${last.x} ${last.y}`;
  } else
    for (const point of points.slice(1)) outline += `L${point.x} ${point.y}`;
  return outline + "L800 600H0Z";
}
const landscape = {
  distant: terrain(0x49554931, 386, 145, 120),
  middle: terrain(0x49554932, 431, 74, 95),
  foreground: terrain(0x49554933, 509, 8, 54, true),
};
let epoch = 0;
const scheduledTasks = new Set<ReturnType<typeof setTimeout>>();
function cancel() {
  epoch++;
  scheduledTasks.forEach(clearTimeout);
  scheduledTasks.clear();
}
function later(milliseconds: number, task: () => void) {
  const version = epoch;
  const handle = setTimeout(() => {
    scheduledTasks.delete(handle);
    if (version === epoch) task();
  }, milliseconds);
  scheduledTasks.add(handle);
}
onBeforeUnmount(cancel);
function replay() {
  cancel();
  status.value = reduced.value ? "complete" : "queued";
  if (reduced.value) return;
  const stages = [
    { after: 500, status: "generating" },
    { after: 3000, status: "refining" },
    { after: 5200, status: "complete" },
  ] as const;
  stages.forEach((stage) =>
    later(stage.after, () => {
      status.value = stage.status;
    }),
  );
}
watch(reduced, replay);
onMounted(replay);
</script>
<template>
  <div class="w-full max-w-xl">
    <div class="flex w-full flex-col items-center">
      <ImageGeneration
        label="A quiet mountain landscape at sunset"
        prompt="a quiet mountain landscape at sunset"
        resolution="1024 × 1024"
        :status="status"
        @retry="replay"
        ><svg
          viewBox="0 0 800 600"
          aria-hidden="true"
          class="size-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient :id="`${identity}-sky`" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#191b33" />
              <stop offset="0.48" stop-color="#60538d" />
              <stop offset="1" stop-color="#e59b7b" />
            </linearGradient>
            <linearGradient
              :id="`${identity}-ground`"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0" stop-color="#314946" />
              <stop offset="1" stop-color="#101817" />
            </linearGradient>
            <radialGradient :id="`${identity}-glow`">
              <stop offset="0" stop-color="#ffe6b2" stop-opacity="0.95" />
              <stop offset="1" stop-color="#efb47e" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="600" :fill="`url(#${identity}-sky)`" />
          <circle cx="570" cy="210" r="150" :fill="`url(#${identity}-glow)`" />
          <circle cx="570" cy="210" r="54" fill="#ffe5ad" />
          <path :d="landscape.distant" fill="#283d43" opacity="0.9" />
          <path :d="landscape.middle" :fill="`url(#${identity}-ground)`" />
          <path :d="landscape.foreground" fill="#13201f" />
          <g fill="#c9d7c3" opacity="0.65">
            <circle cx="108" cy="142" r="2" />
            <circle cx="168" cy="102" r="1.5" />
            <circle cx="248" cy="154" r="2" />
            <circle cx="332" cy="84" r="1.5" />
            <circle cx="414" cy="138" r="2" />
          </g></svg></ImageGeneration
      ><button
        type="button"
        class="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        @click="replay"
      >
        <RotateCcw class="size-4" />Replay
      </button>
    </div>
  </div>
</template>
```

## Component Guide

<a id="composition"></a>
### Composition

Compose Image Generation with its public parts: ImageGeneration. Import these names from the component barrel.

```text
Message
└── MessageContent
    └── ImageGeneration
        └── GeneratedMedia
```

<a id="behavior"></a>
### How it works

Show image creation states, preview the output and offer result actions.

### Lifecycle

#### Initialize

Configure Image Generation through status, label, prompt, resolution, aspectRatio, size, interactive, statusText, showStatus, mediaClassName, statusClassName. The API table describes their types and defaults.

#### Update

Observe retry to connect the component to application state.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Image Generation parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes ImageGeneration through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Message](https://orvui.efu.me/en/components/agents/message): Build a conversation entry from content, attachments, sources and action parts.
- [Streaming Response](https://orvui.efu.me/en/components/agents/streaming-response): Compose a changing assistant response with text, attachments, references and actions.
- [Prompt Input](https://orvui.efu.me/en/components/agents/prompt-input): Compose and submit a prompt with a growing textarea, attachments and keyboard handling.

### Contract

- Owns: Image Generation owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Image Generation when the interface needs this behavior: show image creation states, preview the output and offer result actions.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### ImageGeneration

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `status` | `"error" \| "complete" \| "queued" \| "generating" \| "refining"` | `"generating"` | No | — |
| `label` | `string` | ``(props.prompt ? `${message.value}: ${props.prompt}` : message.value)`` | No | — |
| `prompt` | `string` | — | No | — |
| `resolution` | `string` | `"1024 × 1024"` | No | — |
| `aspectRatio` | `string \| number` | `"1 / 1"` | No | — |
| `size` | `"compact" \| "fluid"` | `"compact"` | No | — |
| `interactive` | `boolean` | `true` | No | — |
| `statusText` | `string` | `{ queued: "Waiting to generate", generating: "Generating image", refining: "Refining details", complete: "Image ready", error: "Generation failed", }[props.status]` | No | — |
| `showStatus` | `boolean` | `true` | No | — |
| `mediaClassName` | `string` | — | No | — |
| `statusClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `retry` | `[]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Image Generation

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Image Generation?**

Configure Image Generation through status, label, prompt, resolution, aspectRatio, size, interactive, statusText, showStatus, mediaClassName, statusClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Observe retry to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Chat App](https://orvui.efu.me/en/components/agents/chat-app): Compose navigation, conversation content and a prompt area into an assistant workspace.
- [Agent Loading States](https://orvui.efu.me/en/components/agents/loading-states): Communicate pending assistant work with progress, reasoning and shimmer displays.
- [Code Block](https://orvui.efu.me/en/components/agents/code-block): Present highlighted code with line controls, file labels and a copy operation.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/image-generation.json
- Documentation: https://orvui.efu.me/en/components/agents/image-generation
- `packages/vue/src/agents/image-generation/src/ImageGeneration.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
