---
title: "Message Scroller"
description: "Follow appended messages while letting readers leave and return to the latest content."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/message-scroller"
markdown: "https://orvui.efu.me/en/components/agents/message-scroller.md"
license: "MIT"
productVersion: "0.1.0"
---

# Message Scroller

> Follow appended messages while letting readers leave and return to the latest content.

Follow appended messages while letting readers leave and return to the latest content.

## When to use it

- Use Message Scroller when the interface needs this behavior: follow appended messages while letting readers leave and return to the latest content.

## Install

### Message Scroller — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/message-scroller.json https://orvui.efu.me/r/message.json https://orvui.efu.me/r/prompt-input.json https://orvui.efu.me/r/streaming-response.json
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

## Usage

### Message Scroller

**Registry source**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Bot, User } from "lucide-vue-next";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
  MessageTyping,
} from "@/components/orvui/agents/message";
import { MessageBubble, MessageBubbleContent } from "@/components/orvui/agents/message-bubble";
import { MessageScroller } from "@/components/orvui/agents/message-scroller";
import { PromptInput } from "@/components/orvui/agents/prompt-input";
import { StreamingResponse } from "@/components/orvui/agents/streaming-response";
interface ChatMessage {
  id: string;
  from: "user" | "assistant";
  content: string;
  animateIn: boolean;
  streaming?: boolean;
}
const messages = ref<ChatMessage[]>([
  {
    id: "scope-question",
    from: "user",
    content: "What should the first release include?",
    animateIn: false,
  },
  {
    id: "scope-answer",
    from: "assistant",
    content: "Start with the smallest workflow that still feels complete.",
    animateIn: false,
  },
  {
    id: "states-question",
    from: "user",
    content: "Include streaming and recovery states too.",
    animateIn: false,
  },
  {
    id: "states-answer",
    from: "assistant",
    content: "Yes. Those states make the first version feel dependable.",
    animateIn: false,
  },
  {
    id: "evidence-question",
    from: "user",
    content: "How should we present tool results?",
    animateIn: false,
  },
  {
    id: "evidence-answer",
    from: "assistant",
    content: "Keep results close to the action that produced them.",
    animateIn: false,
  },
  {
    id: "approval-question",
    from: "user",
    content: "What about actions that need confirmation?",
    animateIn: false,
  },
  {
    id: "approval-answer",
    from: "assistant",
    content: "Pause the run, explain the impact, and ask before continuing.",
    animateIn: false,
  },
  {
    id: "summary-question",
    from: "user",
    content: "Can the transcript stay easy to navigate?",
    animateIn: false,
  },
  {
    id: "summary-answer",
    from: "assistant",
    content: "Use the rail to jump between turns without losing your place.",
    animateIn: false,
  },
]);
const phase = ref<"idle" | "waiting" | "typing">("idle");
const pending = computed(() => phase.value === "waiting"),
  loading = computed(() => phase.value !== "idle");
let serial = 0,
  reduced = false,
  animation: number | undefined;
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
function stop() {
  cancel();
  if (animation !== undefined) cancelAnimationFrame(animation);
  animation = undefined;
  phase.value = "idle";
  messages.value.forEach((message) => {
    message.streaming = false;
  });
}
function submit(prompt: string) {
  if (loading.value) return;
  const turn = serial++,
    text =
      "The viewport follows while you stay at the live edge. Scroll upward while this response streams and it will leave your reading position alone.";
  messages.value.push({
    id: `sent-user-${turn}`,
    from: "user",
    content: prompt,
    animateIn: true,
  });
  phase.value = "waiting";
  later(reduced ? 0 : 420, () => {
    messages.value.push({
      id: `sent-assistant-${turn}`,
      from: "assistant",
      content: "",
      animateIn: true,
      streaming: true,
    });
    const target = messages.value[messages.value.length - 1];
    phase.value = "typing";
    if (reduced) {
      target.content = text;
      target.streaming = false;
      phase.value = "idle";
      return;
    }
    const start = performance.now() + 140,
      version = epoch;
    const render = (now: number) => {
      if (version !== epoch) return;
      const count = Math.min(
        text.length,
        Math.floor(Math.max(0, now - start) * 0.096),
      );
      target.content = text.substring(0, count);
      if (count < text.length) animation = requestAnimationFrame(render);
      else {
        animation = undefined;
        target.streaming = false;
        phase.value = "idle";
      }
    };
    animation = requestAnimationFrame(render);
  });
}
onMounted(() => {
  reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
});
onBeforeUnmount(stop);
</script>
<template>
  <div
    class="flex h-[440px] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border/70 bg-background"
  >
    <MessageScroller
      :busy="loading"
      navigation="rail"
      class="min-h-0 flex-1"
      viewport-class-name="px-3 py-4"
      content-class-name="min-h-full"
      ><MessageGroup spacing="default"
        ><Message
          v-for="message in messages"
          :key="message.id"
          :id="message.id"
          :from="message.from"
          :animate-in="message.from === 'user' && message.animateIn"
          ><MessageContent
            ><MessageBubble
              :variant="message.from === 'user' ? 'solid' : 'soft'"
              :animate-in="false"
              ><MessageBubbleContent
                ><StreamingResponse
                  v-if="message.from === 'assistant'"
                  :status="message.streaming ? 'streaming' : 'complete'"
                  :show-actions="false"
                  :announce="false"
                  ><template v-if="message.content">{{
                    message.content
                  }}</template
                  ><MessageTyping v-else /></StreamingResponse
                ><template v-else>{{
                  message.content
                }}</template></MessageBubbleContent
              ></MessageBubble
            ></MessageContent
          ></Message
        ><Message v-if="pending" id="pending-assistant" from="assistant"
          ><MessageContent
            ><MessageTyping
              label="Preparing response" /></MessageContent></Message></MessageGroup
    ></MessageScroller>
    <div class="shrink-0 border-t border-border/60 p-2">
      <PromptInput
        :min-rows="1"
        :max-rows="1"
        :loading="loading"
        @submit="submit"
        @stop="stop"
        placeholder="Send another message…"
        class="border-0 bg-muted shadow-none focus-within:border-transparent"
      />
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Bot, User } from "lucide-vue-next";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader, MessageTyping } from "@orvui/vue/agents/message";
import { MessageBubble, MessageBubbleContent } from "@orvui/vue/agents/message-bubble";
import { MessageScroller } from "@orvui/vue/agents/message-scroller";
import { PromptInput } from "@orvui/vue/agents/prompt-input";
import { StreamingResponse } from "@orvui/vue/agents/streaming-response";
interface ChatMessage {
  id: string;
  from: "user" | "assistant";
  content: string;
  animateIn: boolean;
  streaming?: boolean;
}
const messages = ref<ChatMessage[]>([
  {
    id: "scope-question",
    from: "user",
    content: "What should the first release include?",
    animateIn: false,
  },
  {
    id: "scope-answer",
    from: "assistant",
    content: "Start with the smallest workflow that still feels complete.",
    animateIn: false,
  },
  {
    id: "states-question",
    from: "user",
    content: "Include streaming and recovery states too.",
    animateIn: false,
  },
  {
    id: "states-answer",
    from: "assistant",
    content: "Yes. Those states make the first version feel dependable.",
    animateIn: false,
  },
  {
    id: "evidence-question",
    from: "user",
    content: "How should we present tool results?",
    animateIn: false,
  },
  {
    id: "evidence-answer",
    from: "assistant",
    content: "Keep results close to the action that produced them.",
    animateIn: false,
  },
  {
    id: "approval-question",
    from: "user",
    content: "What about actions that need confirmation?",
    animateIn: false,
  },
  {
    id: "approval-answer",
    from: "assistant",
    content: "Pause the run, explain the impact, and ask before continuing.",
    animateIn: false,
  },
  {
    id: "summary-question",
    from: "user",
    content: "Can the transcript stay easy to navigate?",
    animateIn: false,
  },
  {
    id: "summary-answer",
    from: "assistant",
    content: "Use the rail to jump between turns without losing your place.",
    animateIn: false,
  },
]);
const phase = ref<"idle" | "waiting" | "typing">("idle");
const pending = computed(() => phase.value === "waiting"),
  loading = computed(() => phase.value !== "idle");
let serial = 0,
  reduced = false,
  animation: number | undefined;
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
function stop() {
  cancel();
  if (animation !== undefined) cancelAnimationFrame(animation);
  animation = undefined;
  phase.value = "idle";
  messages.value.forEach((message) => {
    message.streaming = false;
  });
}
function submit(prompt: string) {
  if (loading.value) return;
  const turn = serial++,
    text =
      "The viewport follows while you stay at the live edge. Scroll upward while this response streams and it will leave your reading position alone.";
  messages.value.push({
    id: `sent-user-${turn}`,
    from: "user",
    content: prompt,
    animateIn: true,
  });
  phase.value = "waiting";
  later(reduced ? 0 : 420, () => {
    messages.value.push({
      id: `sent-assistant-${turn}`,
      from: "assistant",
      content: "",
      animateIn: true,
      streaming: true,
    });
    const target = messages.value[messages.value.length - 1];
    phase.value = "typing";
    if (reduced) {
      target.content = text;
      target.streaming = false;
      phase.value = "idle";
      return;
    }
    const start = performance.now() + 140,
      version = epoch;
    const render = (now: number) => {
      if (version !== epoch) return;
      const count = Math.min(
        text.length,
        Math.floor(Math.max(0, now - start) * 0.096),
      );
      target.content = text.substring(0, count);
      if (count < text.length) animation = requestAnimationFrame(render);
      else {
        animation = undefined;
        target.streaming = false;
        phase.value = "idle";
      }
    };
    animation = requestAnimationFrame(render);
  });
}
onMounted(() => {
  reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
});
onBeforeUnmount(stop);
</script>
<template>
  <div
    class="flex h-[440px] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border/70 bg-background"
  >
    <MessageScroller
      :busy="loading"
      navigation="rail"
      class="min-h-0 flex-1"
      viewport-class-name="px-3 py-4"
      content-class-name="min-h-full"
      ><MessageGroup spacing="default"
        ><Message
          v-for="message in messages"
          :key="message.id"
          :id="message.id"
          :from="message.from"
          :animate-in="message.from === 'user' && message.animateIn"
          ><MessageContent
            ><MessageBubble
              :variant="message.from === 'user' ? 'solid' : 'soft'"
              :animate-in="false"
              ><MessageBubbleContent
                ><StreamingResponse
                  v-if="message.from === 'assistant'"
                  :status="message.streaming ? 'streaming' : 'complete'"
                  :show-actions="false"
                  :announce="false"
                  ><template v-if="message.content">{{
                    message.content
                  }}</template
                  ><MessageTyping v-else /></StreamingResponse
                ><template v-else>{{
                  message.content
                }}</template></MessageBubbleContent
              ></MessageBubble
            ></MessageContent
          ></Message
        ><Message v-if="pending" id="pending-assistant" from="assistant"
          ><MessageContent
            ><MessageTyping
              label="Preparing response" /></MessageContent></Message></MessageGroup
    ></MessageScroller>
    <div class="shrink-0 border-t border-border/60 p-2">
      <PromptInput
        :min-rows="1"
        :max-rows="1"
        :loading="loading"
        @submit="submit"
        @stop="stop"
        placeholder="Send another message…"
        class="border-0 bg-muted shadow-none focus-within:border-transparent"
      />
    </div>
  </div>
</template>
```

## Component Guide

Follow appended messages while letting readers leave and return to the latest content.

### Composition

Compose Message Scroller with its public parts: MessageScroller. Import these names from the component barrel.

```text
MessageScroller
└── MessageGroup
    └── Message
        └── MessageContent
```

### Lifecycle

#### Initialize

Configure Message Scroller through followOutput, followThreshold, smooth, label, busy, navigation, navigationLabel, viewportClassName, contentClassName, railClassName, viewportRef, viewportProps, contentProps. The API table describes their types and defaults.

#### Update

Observe followChange to connect the component to application state.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Message Scroller parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes MessageScroller through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Message](https://orvui.efu.me/en/components/agents/message): Build a conversation entry from content, attachments, sources and action parts.
- [Prompt Input](https://orvui.efu.me/en/components/agents/prompt-input): Compose and submit a prompt with a growing textarea, attachments and keyboard handling.
- [Streaming Response](https://orvui.efu.me/en/components/agents/streaming-response): Compose a changing assistant response with text, attachments, references and actions.

### Contract

- Owns: Message Scroller owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Message Scroller when the interface needs this behavior: follow appended messages while letting readers leave and return to the latest content.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

## API Reference

### MessageScroller

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `followOutput` | `boolean` | `true` | No | — |
| `followThreshold` | `number` | `56` | No | — |
| `smooth` | `boolean` | `true` | No | — |
| `label` | `string` | `"Conversation"` | No | — |
| `busy` | `boolean` | `false` | No | — |
| `navigation` | `"rail"` | — | No | — |
| `navigationLabel` | `string` | `"Message navigation"` | No | — |
| `viewportClassName` | `string` | — | No | — |
| `contentClassName` | `string` | — | No | — |
| `railClassName` | `string` | — | No | — |
| `viewportRef` | `Ref<HTMLElement \| null, HTMLElement \| null> \| (element: HTMLElement \| null) => void` | — | No | — |
| `viewportProps` | `HTMLAttributes` | `{}` | No | — |
| `contentProps` | `HTMLAttributes` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `followChange` | `[following: boolean]` | — |

## About Message Scroller

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Message Scroller?**

Configure Message Scroller through followOutput, followThreshold, smooth, label, busy, navigation, navigationLabel, viewportClassName, contentClassName, railClassName, viewportRef, viewportProps, contentProps. The API table describes their types and defaults.

**How does it connect to application state?**

Observe followChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/message-scroller.json
- Documentation: https://orvui.efu.me/en/components/agents/message-scroller
- `packages/vue/src/agents/message-scroller/src/MessageScroller.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
