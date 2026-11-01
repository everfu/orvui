---
title: "File Diff"
description: "Inspect additions and removals with aligned line numbers and expandable context."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/file-diff"
markdown: "https://orvui.efu.me/en/components/agents/file-diff.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# File Diff

> Inspect additions and removals with aligned line numbers and expandable context.

<a id="when-to-use"></a>

## When to use it

- Use File Diff when the interface needs this behavior: inspect additions and removals with aligned line numbers and expandable context.

<a id="install"></a>
## Install

### File Diff — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/file-diff.json
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
- `shiki@^3.0.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### File Diff

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { FileDiff, type FileDiffLine } from "@/components/orvui/agents/file-diff";
const lines: FileDiffLine[] = [
  {
    id: "1",
    oldLine: 18,
    newLine: 18,
    content: "export async function runTask() {",
  },
  { id: "2", type: "removed", oldLine: 19, content: "  return execute(task);" },
  {
    id: "3",
    type: "added",
    newLine: 19,
    content: "  const result = await execute(task);",
  },
  {
    id: "4",
    type: "added",
    newLine: 20,
    content: "  return normalize(result);",
  },
  { id: "5", oldLine: 20, newLine: 21, content: "}" },
];
const visible = ref(0),
  complete = ref(false),
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
function replay() {
  cancel();
  run.value++;
  visible.value = 0;
  complete.value = false;
  lines.forEach((_, index) =>
    later(180 + 360 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(lines.length * 360 + 480, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[300px] w-full max-w-lg">
    <FileDiff
      :key="run"
      file="src/runner.ts"
      :lines="lines.slice(0, visible)"
      :status="complete ? 'complete' : 'streaming'"
      :copy-text="lines.map((line) => line.content).join('\n')"
      :max-height="150"
    /><button
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
import { FileDiff, type FileDiffLine } from "@orvui/vue/agents/file-diff";
const lines: FileDiffLine[] = [
  {
    id: "1",
    oldLine: 18,
    newLine: 18,
    content: "export async function runTask() {",
  },
  { id: "2", type: "removed", oldLine: 19, content: "  return execute(task);" },
  {
    id: "3",
    type: "added",
    newLine: 19,
    content: "  const result = await execute(task);",
  },
  {
    id: "4",
    type: "added",
    newLine: 20,
    content: "  return normalize(result);",
  },
  { id: "5", oldLine: 20, newLine: 21, content: "}" },
];
const visible = ref(0),
  complete = ref(false),
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
function replay() {
  cancel();
  run.value++;
  visible.value = 0;
  complete.value = false;
  lines.forEach((_, index) =>
    later(180 + 360 * index, () => {
      visible.value = index + 1;
    }),
  );
  later(lines.length * 360 + 480, () => {
    complete.value = true;
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[300px] w-full max-w-lg">
    <FileDiff
      :key="run"
      file="src/runner.ts"
      :lines="lines.slice(0, visible)"
      :status="complete ? 'complete' : 'streaming'"
      :copy-text="lines.map((line) => line.content).join('\n')"
      :max-height="150"
    /><button
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

Compose File Diff with its public parts: FileDiff. Import these names from the component barrel.

```text
ToolResult
└── ToolResultOutput
    └── FileDiff
```

<a id="behavior"></a>
### How it works

Inspect additions and removals with aligned line numbers and expandable context.

### Lifecycle

#### Initialize

Configure File Diff through file, lines, status, open, defaultOpen, collapseOnComplete, maxHeight, language, copyText, onCopy. The API table describes their types and defaults.

#### Update

Observe update:open, openChange to connect the component to application state.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented File Diff parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes FileDiff through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Code Block](https://orvui.efu.me/en/components/agents/code-block): Present highlighted code with line controls, file labels and a copy operation.
- [Tool Result](https://orvui.efu.me/en/components/agents/tool-result): Present a tool call's status, summary and expandable result in one surface.
- [Agent Activity](https://orvui.efu.me/en/components/agents/agent-activity): Group changing assistant activity into expandable steps and a completed summary.

### Contract

- Owns: File Diff owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use File Diff when the interface needs this behavior: inspect additions and removals with aligned line numbers and expandable context.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `FileDiff` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### FileDiff

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `file` | `Content` | — | Yes | — |
| `lines` | `FileDiffLine[]` | — | Yes | — |
| `status` | `"streaming" \| "complete"` | `"streaming"` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `true` | No | — |
| `collapseOnComplete` | `boolean` | `true` | No | — |
| `maxHeight` | `number` | `220` | No | — |
| `language` | `"text" \| "bash" \| "diff" \| "json" \| "tsx" \| "typescript" \| "javascript" \| "vue" \| "css" \| "html"` | `"typescript"` | No | — |
| `copyText` | `string` | `""` | No | — |
| `onCopy` | `() => void \| Promise<void>` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |

<a id="about"></a>
## About File Diff

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure File Diff?**

Configure File Diff through file, lines, status, open, defaultOpen, collapseOnComplete, maxHeight, language, copyText, onCopy. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open, openChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Code Block](https://orvui.efu.me/en/components/agents/code-block): Present highlighted code with line controls, file labels and a copy operation.
- [Tool Result](https://orvui.efu.me/en/components/agents/tool-result): Present a tool call's status, summary and expandable result in one surface.
- [Message](https://orvui.efu.me/en/components/agents/message): Build a conversation entry from content, attachments, sources and action parts.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/file-diff.json
- Documentation: https://orvui.efu.me/en/components/agents/file-diff
- `packages/vue/src/agents/file-diff/src/FileDiff.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
