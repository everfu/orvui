---
title: "Todo List"
description: "Show a sequence of work items with expandable details and explicit task states."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/todo-list"
markdown: "https://orvui.efu.me/en/components/agents/todo-list.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Todo List

> Show a sequence of work items with expandable details and explicit task states.

<a id="when-to-use"></a>

## When to use it

- Use Todo List when the interface needs this behavior: show a sequence of work items with expandable details and explicit task states.

<a id="install"></a>
## Install

### Todo List — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/todo-list.json
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
### Todo List

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { TodoList, type TodoItem } from "@/components/orvui/agents/todo-list";
const tasks = [
  "Inspect the current data flow",
  "Update the response schema",
  "Add coverage for edge cases",
  "Run checks and prepare the result",
];
const step = ref(0),
  run = ref(0);
const items = computed<TodoItem[]>(() =>
  tasks.map((title, index) => {
    const progress = step.value - index * 4;
    const active = progress >= 0 && progress < 4;
    return {
      id: `task-${index}`,
      title,
      status: progress >= 4 ? "completed" : active ? "in-progress" : "pending",
      progress: active ? (progress + 1) * 25 : undefined,
      detail: active ? `${(progress + 1) * 25}%` : undefined,
    };
  }),
);
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
  run.value++;
  step.value = 0;
  for (let tick = 1; tick <= tasks.length * 4; tick++)
    later(tick * 280, () => {
      step.value = tick;
    });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <TodoList :key="run" :items="items" title="Implementation plan" /><button
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
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { TodoList, type TodoItem } from "@orvui/vue/agents/todo-list";
const tasks = [
  "Inspect the current data flow",
  "Update the response schema",
  "Add coverage for edge cases",
  "Run checks and prepare the result",
];
const step = ref(0),
  run = ref(0);
const items = computed<TodoItem[]>(() =>
  tasks.map((title, index) => {
    const progress = step.value - index * 4;
    const active = progress >= 0 && progress < 4;
    return {
      id: `task-${index}`,
      title,
      status: progress >= 4 ? "completed" : active ? "in-progress" : "pending",
      progress: active ? (progress + 1) * 25 : undefined,
      detail: active ? `${(progress + 1) * 25}%` : undefined,
    };
  }),
);
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
  run.value++;
  step.value = 0;
  for (let tick = 1; tick <= tasks.length * 4; tick++)
    later(tick * 280, () => {
      step.value = tick;
    });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <TodoList :key="run" :items="items" title="Implementation plan" /><button
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

<a id="composition"></a>
### Composition

Compose Todo List with its public parts: TodoList. Import these names from the component barrel.

```text
Message
└── MessageContent
    └── TodoList
```

<a id="behavior"></a>
### How it works

Show a sequence of work items with expandable details and explicit task states.

### Lifecycle

#### Initialize

Configure Todo List through items, title, open, defaultOpen, collapseOnComplete, maxHeight. The API table describes their types and defaults.

#### Update

Observe update:open, openChange to connect the component to application state.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Todo List parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes TodoList through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Agent Activity](https://orvui.efu.me/en/components/agents/agent-activity): Group changing assistant activity into expandable steps and a completed summary.
- [Agent Loading States](https://orvui.efu.me/en/components/agents/loading-states): Communicate pending assistant work with progress, reasoning and shimmer displays.
- [Tool Result](https://orvui.efu.me/en/components/agents/tool-result): Present a tool call's status, summary and expandable result in one surface.

### Contract

- Owns: Todo List owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Todo List when the interface needs this behavior: show a sequence of work items with expandable details and explicit task states.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `TodoList` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### TodoList

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `TodoItem[]` | — | Yes | — |
| `title` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"To-dos"` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `true` | No | — |
| `collapseOnComplete` | `boolean` | `true` | No | — |
| `maxHeight` | `number` | `248` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |

<a id="about"></a>
## About Todo List

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Todo List?**

Configure Todo List through items, title, open, defaultOpen, collapseOnComplete, maxHeight. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open, openChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Code Block](https://orvui.efu.me/en/components/agents/code-block): Present highlighted code with line controls, file labels and a copy operation.
- [File Diff](https://orvui.efu.me/en/components/agents/file-diff): Inspect additions and removals with aligned line numbers and expandable context.
- [Tool Result](https://orvui.efu.me/en/components/agents/tool-result): Present a tool call's status, summary and expandable result in one surface.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/todo-list.json
- Documentation: https://orvui.efu.me/en/components/agents/todo-list
- `packages/vue/src/agents/todo-list/src/TodoList.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
