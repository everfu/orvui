---
title: "Message"
description: "Build a conversation entry from content, attachments, sources and action parts."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/message"
markdown: "https://orvui.efu.me/en/components/agents/message.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Message

> Build a conversation entry from content, attachments, sources and action parts.

<a id="when-to-use"></a>

## When to use it

- Use Message when the interface needs this behavior: build a conversation entry from content, attachments, sources and action parts.

<a id="install"></a>
## Install

### Message — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/message.json https://orvui.efu.me/beta/r/prompt-input.json https://orvui.efu.me/beta/r/streaming-response.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the local Beta archive; see the Beta installation guide to build it.

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
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
### Message

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
    id: "welcome-question",
    from: "user",
    content: "What should we include in the first release?",
    animateIn: false,
  },
  {
    id: "welcome-answer",
    from: "assistant",
    content: "Start with the smallest workflow that still feels complete.",
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
      "I’d include composing a prompt, following a streamed answer, recovering from an error, and returning to the latest response without losing the reader’s place.";
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
          ><MessageAvatar
            ><User v-if="message.from === 'user'" /><Bot
              v-else /></MessageAvatar
          ><MessageContent
            ><MessageHeader
              ><span class="font-medium text-foreground/70">{{
                message.from === "user" ? "You" : "Assistant"
              }}</span
              ><span>{{
                message.streaming ? "Responding" : "Now"
              }}</span></MessageHeader
            ><MessageBubble
              :variant="message.from === 'user' ? 'solid' : 'ghost'"
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
            ><MessageFooter v-if="message.from === 'user'"
              >Sent</MessageFooter
            ></MessageContent
          ></Message
        ><Message v-if="pending" id="pending-assistant" from="assistant"
          ><MessageAvatar><Bot /></MessageAvatar
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
        placeholder="Ask a follow-up…"
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
    id: "welcome-question",
    from: "user",
    content: "What should we include in the first release?",
    animateIn: false,
  },
  {
    id: "welcome-answer",
    from: "assistant",
    content: "Start with the smallest workflow that still feels complete.",
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
      "I’d include composing a prompt, following a streamed answer, recovering from an error, and returning to the latest response without losing the reader’s place.";
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
          ><MessageAvatar
            ><User v-if="message.from === 'user'" /><Bot
              v-else /></MessageAvatar
          ><MessageContent
            ><MessageHeader
              ><span class="font-medium text-foreground/70">{{
                message.from === "user" ? "You" : "Assistant"
              }}</span
              ><span>{{
                message.streaming ? "Responding" : "Now"
              }}</span></MessageHeader
            ><MessageBubble
              :variant="message.from === 'user' ? 'solid' : 'ghost'"
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
            ><MessageFooter v-if="message.from === 'user'"
              >Sent</MessageFooter
            ></MessageContent
          ></Message
        ><Message v-if="pending" id="pending-assistant" from="assistant"
          ><MessageAvatar><Bot /></MessageAvatar
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
        placeholder="Ask a follow-up…"
        class="border-0 bg-muted shadow-none focus-within:border-transparent"
      />
    </div>
  </div>
</template>
```

## Component Guide

<a id="composition"></a>
### Composition

Compose Message with its public parts: Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader, MessageTyping. Import these names from the component barrel.

```text
MessageGroup
└── Message
    ├── MessageAvatar
    └── MessageContent
        ├── MessageHeader
        ├── MessageBubble
        └── MessageFooter
```

<a id="behavior"></a>
### How it works

Build a conversation entry from content, attachments, sources and action parts.

### Lifecycle

#### Initialize

Configure Message through from, animateIn. The API table describes their types and defaults.

#### Update

Provide content through default; application effects remain with the consumer.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Message parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader, MessageTyping through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Message Bubble](https://orvui.efu.me/en/components/agents/message-bubble): Render a compact conversation bubble with an avatar, metadata and optional controls.
- [Message Scroller](https://orvui.efu.me/en/components/agents/message-scroller): Follow appended messages while letting readers leave and return to the latest content.
- [Agent Activity](https://orvui.efu.me/en/components/agents/agent-activity): Group changing assistant activity into expandable steps and a completed summary.

### Contract

- Owns: Message owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Message when the interface needs this behavior: build a conversation entry from content, attachments, sources and action parts.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### Message

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `from` | `MessageFrom` | — | Yes | — |
| `animateIn` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MessageAvatar

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `placeholder` | `boolean` | `false` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `(props: {}) => any` | — | — |

### MessageContent

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MessageFooter

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MessageGroup

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `spacing` | `"default" \| "compact"` | `"compact"` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `(props: {}) => any` | — | — |

### MessageHeader

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### MessageTyping

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Responding"` | No | — |

<a id="about"></a>
## About Message

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Message?**

Configure Message through from, animateIn. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Message Scroller](https://orvui.efu.me/en/components/agents/message-scroller): Follow appended messages while letting readers leave and return to the latest content.
- [Chat App](https://orvui.efu.me/en/components/agents/chat-app): Compose navigation, conversation content and a prompt area into an assistant workspace.
- [Message Bubble](https://orvui.efu.me/en/components/agents/message-bubble): Render a compact conversation bubble with an avatar, metadata and optional controls.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/message.json
- Documentation: https://orvui.efu.me/en/components/agents/message
- `packages/vue/src/agents/message/src/Message.vue`
- `packages/vue/src/agents/message/src/MessageAvatar.vue`
- `packages/vue/src/agents/message/src/MessageContent.vue`
- `packages/vue/src/agents/message/src/MessageFooter.vue`
- `packages/vue/src/agents/message/src/MessageGroup.vue`
- `packages/vue/src/agents/message/src/MessageHeader.vue`
- `packages/vue/src/agents/message/src/MessageTyping.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
