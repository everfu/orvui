# Streaming Response · orvui 0.1.1

## Selection and composition

Build a conversation with Prompt Input, Message and Streaming Response, then add tool results, approvals and citations. The application provides model requests and message storage.
Use Streaming Response when the interface needs this behavior: compose a changing assistant response with text, attachments, references and actions.
Choose another composition if its documented interaction model does not fit the task.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Streaming Response"
description: "Compose a changing assistant response with text, attachments, references and actions."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/streaming-response"
markdown: "https://orvui.efu.me/en/components/agents/streaming-response.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Streaming Response

> Compose a changing assistant response with text, attachments, references and actions.

<a id="when-to-use"></a>

## When to use it

- Use Streaming Response when the interface needs this behavior: compose a changing assistant response with text, attachments, references and actions.

<a id="install"></a>
## Install

### Streaming Response — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/streaming-response.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Streaming Response

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { StreamingResponse } from "@/components/orvui/agents/streaming-response";
const pieces = [
  "This answer adds content a little at a time. Read ",
  "the Vue introduction",
  " while the next paragraph is prepared.",
  "Each update keeps the existing document in place:",
  "Open links without pausing the arriving text",
  "Follow the same list as new items appear",
  "Copy the code after the final line arrives",
  "Set ",
  "aria-busy",
  " until the pending update has finished.",
  'const status = complete ? "ready" : "streaming";',
];
const sources = [
    {
      id: "vue-introduction",
      title: "Vue introduction",
      domain: "vuejs.org",
      url: "https://vuejs.org/guide/introduction.html",
    },
    {
      id: "aria-busy",
      title: "ARIA live regions",
      domain: "developer.mozilla.org",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy",
    },
    {
      id: "vue-rendering",
      title: "Rendering elements",
      domain: "vuejs.org",
      url: "https://vuejs.org/guide/essentials/conditional.html",
    },
  ],
  markdown = `This answer adds content a little at a time. Read [the Vue introduction](https://vuejs.org/guide/introduction.html) while the next paragraph is prepared.\n\nEach update keeps the existing document in place:\n\n- Open links without pausing the arriving text\n- Follow the same list as new items appear\n- Copy the code after the final line arrives\n\nSet \`aria-busy\` until the pending update has finished.\n\n\`\`\`ts\nconst status = complete ? "ready" : "streaming";\n\`\`\``;
let total = 0;
const starts = pieces.map((piece) => {
  const offset = total;
  total += piece.length;
  return offset;
});
const cursor = ref(0),
  complete = ref(false),
  run = ref(0);
const reveal = (index: number) =>
  pieces[index].substring(0, Math.max(0, cursor.value - starts[index]));
const started = (index: number) => cursor.value > starts[index];
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
let animation: number | undefined;
function replay() {
  cancel();
  if (animation !== undefined) cancelAnimationFrame(animation);
  cursor.value = 0;
  complete.value = false;
  run.value++;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cursor.value = total;
    complete.value = true;
    return;
  }
  const origin = performance.now(),
    version = epoch;
  const render = (now: number) => {
    if (version !== epoch) return;
    cursor.value = Math.min(total, Math.floor((now - origin) * 0.11));
    if (cursor.value < total) animation = requestAnimationFrame(render);
    else {
      animation = undefined;
      later(450, () => {
        complete.value = true;
      });
    }
  };
  animation = requestAnimationFrame(render);
}
onMounted(replay);
onBeforeUnmount(() => {
  if (animation !== undefined) cancelAnimationFrame(animation);
});
</script>
<template>
  <div class="relative h-[500px] w-full max-w-xl">
    <StreamingResponse
      :key="run"
      :status="complete ? 'complete' : 'streaming'"
      :copy-text="markdown"
      @retry="replay"
      :sources="sources"
      ><p>
        {{ reveal(0)
        }}<a
          v-if="started(1)"
          href="https://vuejs.org/guide/introduction.html"
          target="_blank"
          rel="noreferrer noopener"
          >{{ reveal(1) }}</a
        >{{ reveal(2) }}
      </p>
      <p v-if="started(3)">{{ reveal(3) }}</p>
      <ul v-if="started(4)">
        <li v-for="index in [4, 5, 6].filter(started)" :key="index">
          {{ reveal(index) }}
        </li>
      </ul>
      <p v-if="started(7)">
        {{ reveal(7) }}<code v-if="started(8)">{{ reveal(8) }}</code
        >{{ reveal(9) }}
      </p>
      <pre
        v-if="started(10)"
      ><code>{{ reveal(10) }}</code></pre></StreamingResponse
    ><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { StreamingResponse } from "@orvui/vue/agents/streaming-response";
const pieces = [
  "This answer adds content a little at a time. Read ",
  "the Vue introduction",
  " while the next paragraph is prepared.",
  "Each update keeps the existing document in place:",
  "Open links without pausing the arriving text",
  "Follow the same list as new items appear",
  "Copy the code after the final line arrives",
  "Set ",
  "aria-busy",
  " until the pending update has finished.",
  'const status = complete ? "ready" : "streaming";',
];
const sources = [
    {
      id: "vue-introduction",
      title: "Vue introduction",
      domain: "vuejs.org",
      url: "https://vuejs.org/guide/introduction.html",
    },
    {
      id: "aria-busy",
      title: "ARIA live regions",
      domain: "developer.mozilla.org",
      url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy",
    },
    {
      id: "vue-rendering",
      title: "Rendering elements",
      domain: "vuejs.org",
      url: "https://vuejs.org/guide/essentials/conditional.html",
    },
  ],
  markdown = `This answer adds content a little at a time. Read [the Vue introduction](https://vuejs.org/guide/introduction.html) while the next paragraph is prepared.\n\nEach update keeps the existing document in place:\n\n- Open links without pausing the arriving text\n- Follow the same list as new items appear\n- Copy the code after the final line arrives\n\nSet \`aria-busy\` until the pending update has finished.\n\n\`\`\`ts\nconst status = complete ? "ready" : "streaming";\n\`\`\``;
let total = 0;
const starts = pieces.map((piece) => {
  const offset = total;
  total += piece.length;
  return offset;
});
const cursor = ref(0),
  complete = ref(false),
  run = ref(0);
const reveal = (index: number) =>
  pieces[index].substring(0, Math.max(0, cursor.value - starts[index]));
const started = (index: number) => cursor.value > starts[index];
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
let animation: number | undefined;
function replay() {
  cancel();
  if (animation !== undefined) cancelAnimationFrame(animation);
  cursor.value = 0;
  complete.value = false;
  run.value++;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cursor.value = total;
    complete.value = true;
    return;
  }
  const origin = performance.now(),
    version = epoch;
  const render = (now: number) => {
    if (version !== epoch) return;
    cursor.value = Math.min(total, Math.floor((now - origin) * 0.11));
    if (cursor.value < total) animation = requestAnimationFrame(render);
    else {
      animation = undefined;
      later(450, () => {
        complete.value = true;
      });
    }
  };
  animation = requestAnimationFrame(render);
}
onMounted(replay);
onBeforeUnmount(() => {
  if (animation !== undefined) cancelAnimationFrame(animation);
});
</script>
<template>
  <div class="relative h-[500px] w-full max-w-xl">
    <StreamingResponse
      :key="run"
      :status="complete ? 'complete' : 'streaming'"
      :copy-text="markdown"
      @retry="replay"
      :sources="sources"
      ><p>
        {{ reveal(0)
        }}<a
          v-if="started(1)"
          href="https://vuejs.org/guide/introduction.html"
          target="_blank"
          rel="noreferrer noopener"
          >{{ reveal(1) }}</a
        >{{ reveal(2) }}
      </p>
      <p v-if="started(3)">{{ reveal(3) }}</p>
      <ul v-if="started(4)">
        <li v-for="index in [4, 5, 6].filter(started)" :key="index">
          {{ reveal(index) }}
        </li>
      </ul>
      <p v-if="started(7)">
        {{ reveal(7) }}<code v-if="started(8)">{{ reveal(8) }}</code
        >{{ reveal(9) }}
      </p>
      <pre
        v-if="started(10)"
      ><code>{{ reveal(10) }}</code></pre></StreamingResponse
    ><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
```

## Component Guide

<a id="composition"></a>
### Composition

Compose Streaming Response with its public parts: StreamingResponse. Import these names from the component barrel.

```text
Message
└── MessageContent
    └── MessageBubble
        └── StreamingResponse
```

<a id="behavior"></a>
### How it works

Compose a changing assistant response with text, attachments, references and actions.

### Lifecycle

#### Initialize

Place changing response content in the default slot and pass streaming to control the pending presentation.

#### Update

Observe retry, update:sourcesOpen, sourcesOpenChange, update:feedback, feedbackChange to connect the component to application state.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Streaming Response parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes StreamingResponse through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Message](https://orvui.efu.me/en/components/agents/message): Build a conversation entry from content, attachments, sources and action parts.
- [Citations](https://orvui.efu.me/en/components/agents/citations): Connect inline reference markers to inspectable source entries and links.
- [Code Block](https://orvui.efu.me/en/components/agents/code-block): Present highlighted code with line controls, file labels and a copy operation.

### Contract

- Owns: Streaming Response owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Streaming Response when the interface needs this behavior: compose a changing assistant response with text, attachments, references and actions.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `StreamingResponse` | `v-model:sourcesOpen` | `boolean` | `update:sourcesOpen` |
| `StreamingResponse` | `v-model:feedback` | `null \| "up" \| "down"` | `update:feedback` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### StreamingResponse

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `status` | `"error" \| "streaming" \| "complete"` | `"streaming"` | No | — |
| `copyText` | `string` | `""` | No | — |
| `onCopy` | `() => void \| Promise<void>` | — | No | — |
| `sources` | `CitationItem[]` | `() => []` | No | — |
| `sourcesOpen` | `boolean` | `undefined` | No | — |
| `defaultSourcesOpen` | `boolean` | `false` | No | — |
| `sourceIdPrefix` | `string` | — | No | — |
| `feedback` | `null \| "up" \| "down"` | — | No | — |
| `defaultFeedback` | `null \| "up" \| "down"` | `null` | No | — |
| `announce` | `boolean` | `true` | No | — |
| `showActions` | `boolean` | `true` | No | — |
| `contentClassName` | `string` | — | No | — |
| `actionsClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `retry` | `[]` | — |
| `update:sourcesOpen` | `[open: boolean]` | — |
| `sourcesOpenChange` | `[open: boolean]` | — |
| `update:feedback` | `[feedback: StreamingResponseFeedback]` | — |
| `feedbackChange` | `[feedback: StreamingResponseFeedback]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Streaming Response

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Streaming Response?**

Place changing response content in the default slot and pass streaming to control the pending presentation.

**How does it connect to application state?**

Observe retry, update:sourcesOpen, sourcesOpenChange, update:feedback, feedbackChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Code Block](https://orvui.efu.me/en/components/agents/code-block): Present highlighted code with line controls, file labels and a copy operation.
- [Citations](https://orvui.efu.me/en/components/agents/citations): Connect inline reference markers to inspectable source entries and links.
- [Chat App](https://orvui.efu.me/en/components/agents/chat-app): Compose navigation, conversation content and a prompt area into an assistant workspace.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/streaming-response.json
- Documentation: https://orvui.efu.me/en/components/agents/streaming-response
- `packages/vue/src/agents/streaming-response/src/StreamingResponse.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

