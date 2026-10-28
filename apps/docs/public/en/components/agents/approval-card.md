---
title: "Approval Card"
description: "Guide a person through one or more decisions before an assistant proceeds."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/approval-card"
markdown: "https://orvui.efu.me/en/components/agents/approval-card.md"
license: "MIT"
productVersion: "0.1.0"
---

# Approval Card

> Guide a person through one or more decisions before an assistant proceeds.

Guide a person through one or more decisions before an assistant proceeds.

## When to use it

- Use Approval Card when the interface needs this behavior: guide a person through one or more decisions before an assistant proceeds.

## Install

### Approval Card — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/approval-card.json
```

### Questions — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/approval-card.json
```

### Review and Approve — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/approval-card.json
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

## Usage

### Approval Card

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import {
  ApprovalCard,
  type ApprovalCardQuestion,
  type ApprovalCardStatus,
} from "@/components/orvui/agents/approval-card";
const QUESTIONS: ApprovalCardQuestion[] = [
  {
    id: "scope",
    title: "How focused should the first release be?",
    options: [
      {
        value: "focused",
        label: "A focused starter set",
        description: "Ship a few polished pieces first.",
      },
      {
        value: "broad",
        label: "A broader collection",
        description: "Cover more ground with lighter depth.",
      },
      {
        value: "flagship",
        label: "One flagship experience",
        description: "Pour everything into a single showcase.",
      },
    ],
    allowCustom: true,
    customPlaceholder: "Describe another scope…",
  },
  {
    id: "checks",
    title: "Which checks should block publishing?",
    description:
      "Select every check the agent must pass before it can continue.",
    multiple: true,
    options: [
      { value: "types", label: "Type safety" },
      { value: "accessibility", label: "Accessibility" },
      { value: "registry", label: "Registry validation" },
    ],
  },
  {
    id: "preserve",
    title: "Anything the agent should preserve?",
    allowCustom: true,
    customPlaceholder: "Add a final constraint…",
  },
];
const status = ref<ApprovalCardStatus>("pending"),
  run = ref(0);
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
function submit() {
  cancel();
  status.value = "submitting";
  later(750, () => {
    status.value = "answered";
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[470px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      :questions="QUESTIONS"
      :status="status"
      @submit="submit"
      result="Three responses sent to the agent."
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ApprovalCard, type ApprovalCardQuestion, type ApprovalCardStatus } from "@orvui/vue/agents/approval-card";
const QUESTIONS: ApprovalCardQuestion[] = [
  {
    id: "scope",
    title: "How focused should the first release be?",
    options: [
      {
        value: "focused",
        label: "A focused starter set",
        description: "Ship a few polished pieces first.",
      },
      {
        value: "broad",
        label: "A broader collection",
        description: "Cover more ground with lighter depth.",
      },
      {
        value: "flagship",
        label: "One flagship experience",
        description: "Pour everything into a single showcase.",
      },
    ],
    allowCustom: true,
    customPlaceholder: "Describe another scope…",
  },
  {
    id: "checks",
    title: "Which checks should block publishing?",
    description:
      "Select every check the agent must pass before it can continue.",
    multiple: true,
    options: [
      { value: "types", label: "Type safety" },
      { value: "accessibility", label: "Accessibility" },
      { value: "registry", label: "Registry validation" },
    ],
  },
  {
    id: "preserve",
    title: "Anything the agent should preserve?",
    allowCustom: true,
    customPlaceholder: "Add a final constraint…",
  },
];
const status = ref<ApprovalCardStatus>("pending"),
  run = ref(0);
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
function submit() {
  cancel();
  status.value = "submitting";
  later(750, () => {
    status.value = "answered";
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[470px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      :questions="QUESTIONS"
      :status="status"
      @submit="submit"
      result="Three responses sent to the agent."
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
```

### Questions

Move through decision questions and keep each selected answer available for review.

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import {
  ApprovalCard,
  type ApprovalCardQuestion,
  type ApprovalCardStatus,
} from "@/components/orvui/agents/approval-card";
const QUESTIONS: ApprovalCardQuestion[] = [
  {
    id: "scope",
    title: "How focused should the first release be?",
    options: [
      {
        value: "focused",
        label: "A focused starter set",
        description: "Ship a few polished pieces first.",
      },
      {
        value: "broad",
        label: "A broader collection",
        description: "Cover more ground with lighter depth.",
      },
      {
        value: "flagship",
        label: "One flagship experience",
        description: "Pour everything into a single showcase.",
      },
    ],
    allowCustom: true,
    customPlaceholder: "Describe another scope…",
  },
  {
    id: "checks",
    title: "Which checks should block publishing?",
    description:
      "Select every check the agent must pass before it can continue.",
    multiple: true,
    options: [
      { value: "types", label: "Type safety" },
      { value: "accessibility", label: "Accessibility" },
      { value: "registry", label: "Registry validation" },
    ],
  },
  {
    id: "preserve",
    title: "Anything the agent should preserve?",
    allowCustom: true,
    customPlaceholder: "Add a final constraint…",
  },
];
const status = ref<ApprovalCardStatus>("pending"),
  run = ref(0);
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
function submit() {
  cancel();
  status.value = "submitting";
  later(750, () => {
    status.value = "answered";
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[470px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      :questions="QUESTIONS"
      :status="status"
      @submit="submit"
      result="Three responses sent to the agent."
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ApprovalCard, type ApprovalCardQuestion, type ApprovalCardStatus } from "@orvui/vue/agents/approval-card";
const QUESTIONS: ApprovalCardQuestion[] = [
  {
    id: "scope",
    title: "How focused should the first release be?",
    options: [
      {
        value: "focused",
        label: "A focused starter set",
        description: "Ship a few polished pieces first.",
      },
      {
        value: "broad",
        label: "A broader collection",
        description: "Cover more ground with lighter depth.",
      },
      {
        value: "flagship",
        label: "One flagship experience",
        description: "Pour everything into a single showcase.",
      },
    ],
    allowCustom: true,
    customPlaceholder: "Describe another scope…",
  },
  {
    id: "checks",
    title: "Which checks should block publishing?",
    description:
      "Select every check the agent must pass before it can continue.",
    multiple: true,
    options: [
      { value: "types", label: "Type safety" },
      { value: "accessibility", label: "Accessibility" },
      { value: "registry", label: "Registry validation" },
    ],
  },
  {
    id: "preserve",
    title: "Anything the agent should preserve?",
    allowCustom: true,
    customPlaceholder: "Add a final constraint…",
  },
];
const status = ref<ApprovalCardStatus>("pending"),
  run = ref(0);
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
function submit() {
  cancel();
  status.value = "submitting";
  later(750, () => {
    status.value = "answered";
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[470px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      :questions="QUESTIONS"
      :status="status"
      @submit="submit"
      result="Three responses sent to the agent."
    /><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
```

### Review and Approve

Review the collected answers before confirming the pending action.

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ApprovalCard, type ApprovalCardStatus } from "@/components/orvui/agents/approval-card";
const status = ref<ApprovalCardStatus>("pending"),
  run = ref(0);
const details = [
  { label: "Release", text: "approval-card", mono: true },
  { label: "Checks", text: "4 passed", mono: false },
  { label: "Visibility", text: "Public registry", mono: false },
];
const results = {
  approved: "Publishing was approved.",
  "changes-requested": "The agent will wait for revision notes.",
  rejected: "Publishing was declined.",
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
function finish(value: ApprovalCardStatus) {
  cancel();
  status.value = "submitting";
  later(700, () => {
    status.value = value;
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[360px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      title="Publish the component update?"
      description="The agent has prepared the release and is waiting for your decision."
      :status="status"
      @approve="finish('approved')"
      @request-changes="finish('changes-requested')"
      @reject="finish('rejected')"
      :result="results[status as keyof typeof results] ?? results.rejected"
      ><dl class="grid gap-1 text-xs">
        <div
          v-for="item in details"
          :key="item.label"
          class="flex items-center justify-between gap-4 py-1"
        >
          <dt class="text-muted-foreground">{{ item.label }}</dt>
          <dd :class="[item.mono && 'font-mono', 'text-foreground/80']">
            {{ item.text }}
          </dd>
        </div>
      </dl></ApprovalCard
    ><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ApprovalCard, type ApprovalCardStatus } from "@orvui/vue/agents/approval-card";
const status = ref<ApprovalCardStatus>("pending"),
  run = ref(0);
const details = [
  { label: "Release", text: "approval-card", mono: true },
  { label: "Checks", text: "4 passed", mono: false },
  { label: "Visibility", text: "Public registry", mono: false },
];
const results = {
  approved: "Publishing was approved.",
  "changes-requested": "The agent will wait for revision notes.",
  rejected: "Publishing was declined.",
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
function finish(value: ApprovalCardStatus) {
  cancel();
  status.value = "submitting";
  later(700, () => {
    status.value = value;
  });
}
function replay() {
  cancel();
  run.value++;
  status.value = "pending";
}
</script>
<template>
  <div class="relative h-[360px] w-full max-w-lg">
    <ApprovalCard
      :key="run"
      title="Publish the component update?"
      description="The agent has prepared the release and is waiting for your decision."
      :status="status"
      @approve="finish('approved')"
      @request-changes="finish('changes-requested')"
      @reject="finish('rejected')"
      :result="results[status as keyof typeof results] ?? results.rejected"
      ><dl class="grid gap-1 text-xs">
        <div
          v-for="item in details"
          :key="item.label"
          class="flex items-center justify-between gap-4 py-1"
        >
          <dt class="text-muted-foreground">{{ item.label }}</dt>
          <dd :class="[item.mono && 'font-mono', 'text-foreground/80']">
            {{ item.text }}
          </dd>
        </div>
      </dl></ApprovalCard
    ><button
      type="button"
      @click="replay"
      class="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <RotateCcw class="size-3" />Replay
    </button>
  </div>
</template>
```

## Component Guide

Guide a person through one or more decisions before an assistant proceeds.

### Composition

Compose Approval Card with its public parts: ApprovalCard. Import these names from the component barrel.

```text
Message
└── MessageContent
    └── ApprovalCard
```

### Lifecycle

#### Initialize

Configure Approval Card through title, description, questions, status, answers, defaultAnswers, step, defaultStep, approveLabel, submitLabel, result. The API table describes their types and defaults.

#### Update

Observe update:answers, answersChange, update:step, stepChange, submit, approve, reject, requestChanges, dismiss to connect the component to application state.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Approval Card parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes ApprovalCard through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Tool Approval](https://orvui.efu.me/en/components/agents/tool-approval): Ask for an explicit decision on a pending tool action with explanatory context.
- [Message](https://orvui.efu.me/en/components/agents/message): Build a conversation entry from content, attachments, sources and action parts.
- [Todo List](https://orvui.efu.me/en/components/agents/todo-list): Show a sequence of work items with expandable details and explicit task states.

### Contract

- Owns: Approval Card owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Approval Card when the interface needs this behavior: guide a person through one or more decisions before an assistant proceeds.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

## API Reference

### ApprovalCard

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Approval required"` | No | — |
| `description` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |
| `questions` | `ApprovalCardQuestion[]` | `() => []` | No | — |
| `status` | `"pending" \| "submitting" \| "approved" \| "rejected" \| "changes-requested" \| "answered"` | `"pending"` | No | — |
| `answers` | `ApprovalCardAnswers` | — | No | — |
| `defaultAnswers` | `ApprovalCardAnswers` | `() => ({})` | No | — |
| `step` | `number` | — | No | — |
| `defaultStep` | `number` | `0` | No | — |
| `approveLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Approve"` | No | — |
| `submitLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Submit response"` | No | — |
| `result` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:answers` | `[answers: ApprovalCardAnswers]` | — |
| `answersChange` | `[answers: ApprovalCardAnswers]` | — |
| `update:step` | `[step: number]` | — |
| `stepChange` | `[step: number]` | — |
| `submit` | `[answers: ApprovalCardAnswers]` | — |
| `approve` | `[]` | — |
| `reject` | `[]` | — |
| `requestChanges` | `[]` | — |
| `dismiss` | `[]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## About Approval Card

### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### FAQ

**How do I configure Approval Card?**

Configure Approval Card through title, description, questions, status, answers, defaultAnswers, step, defaultStep, approveLabel, submitLabel, result. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:answers, answersChange, update:step, stepChange, submit, approve, reject, requestChanges, dismiss to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

## Source

- Registry detail: https://orvui.efu.me/r/approval-card.json
- Documentation: https://orvui.efu.me/en/components/agents/approval-card
- `packages/vue/src/agents/approval-card/src/ApprovalCard.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
