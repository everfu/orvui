# Prompt Input · orvui 0.1.1

## Selection and composition

Build a conversation with Prompt Input, Message and Streaming Response, then add tool results, approvals and citations. The application provides model requests and message storage.
Use Prompt Input when the interface needs this behavior: compose and submit a prompt with a growing textarea, attachments and keyboard handling.
Choose another composition if its documented interaction model does not fit the task.

## SSR, motion and application boundaries

Use explicit imports in Vue / Nuxt and consistent initial data and IDs during SSR and hydration. Create browser resources after mount and release them on unmount. Preserve reduced motion, keyboard access and semantic theme overrides. Use state bindings only for pairs in the actual API below. Example data and demo actions do not provide application services; the app owns requests, permissions and persistence. See the FAQ below for component-specific limitations.

## Complete component reference

---
title: "Prompt Input"
description: "Compose and submit a prompt with a growing textarea, attachments and keyboard handling."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/prompt-input"
markdown: "https://orvui.efu.me/en/components/agents/prompt-input.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Prompt Input

> Compose and submit a prompt with a growing textarea, attachments and keyboard handling.

<a id="when-to-use"></a>

## When to use it

- Use Prompt Input when the interface needs this behavior: compose and submit a prompt with a growing textarea, attachments and keyboard handling.

<a id="install"></a>
## Install

### Prompt Input — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/prompt-input.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Prompt Input

**Registry source**

```vue
<script setup lang="ts">
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";
import { Bot, FileText, ImagePlus, Puzzle } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { PromptInput } from "@/components/orvui/agents/prompt-input";
const ModelLogo = defineComponent({
  props: { url: { type: String, required: true } },
  setup(props) {
    const image = ref<HTMLImageElement>(),
      failed = ref(false);
    let alive = true;
    onMounted(async () => {
      try {
        await image.value?.decode?.();
      } catch {
        if (alive) failed.value = true;
      }
    });
    onBeforeUnmount(() => {
      alive = false;
    });
    return () =>
      failed.value
        ? h(Bot)
        : h("img", {
            ref: image,
            src: new URL("/favicon.ico", props.url).href,
            alt: "",
            width: 16,
            height: 16,
            referrerpolicy: "no-referrer",
            class: "size-4 rounded-sm object-contain",
            onError: () => {
              failed.value = true;
            },
          });
  },
});
const modelData = [
  ["gpt-5.2", "GPT-5.2", "https://openai.com"],
  ["claude-sonnet-4", "Claude Sonnet 4", "https://www.anthropic.com"],
  ["gemini-3.6-flash", "Gemini 3.6 Flash", "https://deepmind.google"],
  ["grok-4.5", "Grok 4.5", "https://x.ai"],
  ["mistral-large-3", "Mistral Large 3", "https://mistral.ai"],
];
const models = modelData.map(([value, label, url]) => ({
  value,
  label,
  icon: () => h(ModelLogo, { url }),
}));
const actions = [
  {
    value: "image",
    label: "Attach image",
    description: "Add a screenshot or visual reference.",
    icon: ImagePlus,
  },
  {
    value: "skill",
    label: "Use a skill",
    description: "Give the agent a specialized workflow.",
    icon: Puzzle,
  },
  {
    value: "context",
    label: "Add context",
    description: "Include a file with supporting details.",
    icon: FileText,
  },
];
const loading = ref(false),
  sent = ref<string>(),
  notice = ref<string>(),
  reduce = ref(false);
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
function submit(prompt: string) {
  cancel();
  sent.value = undefined;
  notice.value = undefined;
  loading.value = true;
  later(900, () => {
    loading.value = false;
    sent.value = prompt;
  });
}
function stop() {
  cancel();
  loading.value = false;
}
function action(value: string) {
  const item = actions.find((candidate) => candidate.value === value);
  notice.value = item ? `${item.label} selected.` : undefined;
}
onMounted(() => {
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
});
</script>
<template>
  <div class="flex h-[360px] w-full max-w-xl flex-col justify-center">
    <PromptInput
      :models="models"
      :actions="actions"
      default-model="gpt-5.2"
      default-value="Review the current implementation and suggest the next improvement."
      :loading="loading"
      @submit="submit"
      @stop="stop"
      @action="action"
    />
    <div class="h-8 px-2 pt-2 text-xs text-muted-foreground">
      <AnimatePresence mode="wait"
        ><motion.p
          v-if="sent || notice"
          :key="sent ?? notice"
          :initial="reduce ? { opacity: 1 } : { opacity: 0, y: 3 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: reduce ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }"
          >{{ sent ? "Prompt sent to the selected model." : notice }}</motion.p
        ></AnimatePresence
      >
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from "vue";
import { Bot, FileText, ImagePlus, Puzzle } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { PromptInput } from "@orvui/vue/agents/prompt-input";
const ModelLogo = defineComponent({
  props: { url: { type: String, required: true } },
  setup(props) {
    const image = ref<HTMLImageElement>(),
      failed = ref(false);
    let alive = true;
    onMounted(async () => {
      try {
        await image.value?.decode?.();
      } catch {
        if (alive) failed.value = true;
      }
    });
    onBeforeUnmount(() => {
      alive = false;
    });
    return () =>
      failed.value
        ? h(Bot)
        : h("img", {
            ref: image,
            src: new URL("/favicon.ico", props.url).href,
            alt: "",
            width: 16,
            height: 16,
            referrerpolicy: "no-referrer",
            class: "size-4 rounded-sm object-contain",
            onError: () => {
              failed.value = true;
            },
          });
  },
});
const modelData = [
  ["gpt-5.2", "GPT-5.2", "https://openai.com"],
  ["claude-sonnet-4", "Claude Sonnet 4", "https://www.anthropic.com"],
  ["gemini-3.6-flash", "Gemini 3.6 Flash", "https://deepmind.google"],
  ["grok-4.5", "Grok 4.5", "https://x.ai"],
  ["mistral-large-3", "Mistral Large 3", "https://mistral.ai"],
];
const models = modelData.map(([value, label, url]) => ({
  value,
  label,
  icon: () => h(ModelLogo, { url }),
}));
const actions = [
  {
    value: "image",
    label: "Attach image",
    description: "Add a screenshot or visual reference.",
    icon: ImagePlus,
  },
  {
    value: "skill",
    label: "Use a skill",
    description: "Give the agent a specialized workflow.",
    icon: Puzzle,
  },
  {
    value: "context",
    label: "Add context",
    description: "Include a file with supporting details.",
    icon: FileText,
  },
];
const loading = ref(false),
  sent = ref<string>(),
  notice = ref<string>(),
  reduce = ref(false);
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
function submit(prompt: string) {
  cancel();
  sent.value = undefined;
  notice.value = undefined;
  loading.value = true;
  later(900, () => {
    loading.value = false;
    sent.value = prompt;
  });
}
function stop() {
  cancel();
  loading.value = false;
}
function action(value: string) {
  const item = actions.find((candidate) => candidate.value === value);
  notice.value = item ? `${item.label} selected.` : undefined;
}
onMounted(() => {
  reduce.value = matchMedia("(prefers-reduced-motion: reduce)").matches;
});
</script>
<template>
  <div class="flex h-[360px] w-full max-w-xl flex-col justify-center">
    <PromptInput
      :models="models"
      :actions="actions"
      default-model="gpt-5.2"
      default-value="Review the current implementation and suggest the next improvement."
      :loading="loading"
      @submit="submit"
      @stop="stop"
      @action="action"
    />
    <div class="h-8 px-2 pt-2 text-xs text-muted-foreground">
      <AnimatePresence mode="wait"
        ><motion.p
          v-if="sent || notice"
          :key="sent ?? notice"
          :initial="reduce ? { opacity: 1 } : { opacity: 0, y: 3 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: reduce ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }"
          >{{ sent ? "Prompt sent to the selected model." : notice }}</motion.p
        ></AnimatePresence
      >
    </div>
  </div>
</template>
```

## Component Guide

<a id="composition"></a>
### Composition

Compose Prompt Input with its public parts: PromptInput. Import these names from the component barrel.

```text
Chat
├── MessageScroller
│   └── MessageGroup
└── PromptInput
```

<a id="behavior"></a>
### How it works

Compose and submit a prompt with a growing textarea, attachments and keyboard handling.

### Lifecycle

#### Initialize

Configure Prompt Input through modelValue, defaultValue, models, model, defaultModel, actions, loading, minRows, maxRows, disabled, placeholder. The API table describes their types and defaults.

#### Update

Observe update:modelValue, valueChange, update:model, modelChange, action, submit, stop to connect the component to application state.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Prompt Input parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes PromptInput through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Message Scroller](https://orvui.efu.me/en/components/agents/message-scroller): Follow appended messages while letting readers leave and return to the latest content.
- [Tool Approval](https://orvui.efu.me/en/components/agents/tool-approval): Ask for an explicit decision on a pending tool action with explanatory context.
- [Approval Card](https://orvui.efu.me/en/components/agents/approval-card): Guide a person through one or more decisions before an assistant proceeds.

### Contract

- Owns: Prompt Input owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Prompt Input when the interface needs this behavior: compose and submit a prompt with a growing textarea, attachments and keyboard handling.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `PromptInput` | `v-model` | `string` | `update:modelValue` |
| `PromptInput` | `v-model:model` | `string` | `update:model` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### PromptInput

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | — | No | — |
| `defaultValue` | `string` | `""` | No | — |
| `models` | `PromptModel[]` | `() => []` | No | — |
| `model` | `string` | — | No | — |
| `defaultModel` | `string` | `props.models[0]?.value` | No | — |
| `actions` | `PromptAction[]` | `() => []` | No | — |
| `loading` | `boolean` | `false` | No | — |
| `minRows` | `number` | `2` | No | — |
| `maxRows` | `number` | `8` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `placeholder` | `string` | `"Ask the agent to do something…"` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `[value: string]` | — |
| `valueChange` | `[value: string]` | — |
| `update:model` | `[value: string]` | — |
| `modelChange` | `[value: string]` | — |
| `action` | `[action: string]` | — |
| `submit` | `[value: string, model?: string \| undefined]` | — |
| `stop` | `[]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `leading-action` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Prompt Input

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Prompt Input?**

Configure Prompt Input through modelValue, defaultValue, models, model, defaultModel, actions, loading, minRows, maxRows, disabled, placeholder. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, valueChange, update:model, modelChange, action, submit, stop to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Chat App](https://orvui.efu.me/en/components/agents/chat-app): Compose navigation, conversation content and a prompt area into an assistant workspace.
- [Streaming Response](https://orvui.efu.me/en/components/agents/streaming-response): Compose a changing assistant response with text, attachments, references and actions.
- [Citations](https://orvui.efu.me/en/components/agents/citations): Connect inline reference markers to inspectable source entries and links.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/prompt-input.json
- Documentation: https://orvui.efu.me/en/components/agents/prompt-input
- `packages/vue/src/agents/prompt-input/src/PromptInput.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

