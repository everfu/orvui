---
title: "Code Block"
description: "Present highlighted code with line controls, file labels and a copy operation."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/code-block"
markdown: "https://orvui.efu.me/en/components/agents/code-block.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Code Block

> Present highlighted code with line controls, file labels and a copy operation.

<a id="when-to-use"></a>

## When to use it

- Use Code Block when the interface needs this behavior: present highlighted code with line controls, file labels and a copy operation.

<a id="install"></a>
## Install

### Code Block — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/code-block.json
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
- `shiki@^3.0.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Code Block

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { CodeBlock } from "@/components/orvui/agents/code-block";
const lines = [
  'import { generateText } from "ai";',
  "",
  "export async function summarize(input: string) {",
  "  const { text } = await generateText({",
  '    model: "openai/gpt-5",',
  "    prompt: `Summarize this clearly: ${input}`,",
  "  });",
  "",
  "  return {",
  "    text,",
  "    generatedAt: new Date().toISOString(),",
  "  };",
  "}",
];
const visible = ref(1),
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
  visible.value = 1;
  for (let index = 2; index <= lines.length; index++)
    later((index - 1) * 260, () => {
      visible.value = index;
    });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[340px] w-full max-w-xl">
    <CodeBlock
      :key="run"
      filename="summarize.ts"
      language="typescript"
      :code="lines.slice(0, visible).join('\n')"
      :status="visible === lines.length ? 'complete' : 'streaming'"
      :highlight-lines="[4, 5, 6, 7]"
      :max-height="224"
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
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { CodeBlock } from "@orvui/vue/agents/code-block";
const lines = [
  'import { generateText } from "ai";',
  "",
  "export async function summarize(input: string) {",
  "  const { text } = await generateText({",
  '    model: "openai/gpt-5",',
  "    prompt: `Summarize this clearly: ${input}`,",
  "  });",
  "",
  "  return {",
  "    text,",
  "    generatedAt: new Date().toISOString(),",
  "  };",
  "}",
];
const visible = ref(1),
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
  visible.value = 1;
  for (let index = 2; index <= lines.length; index++)
    later((index - 1) * 260, () => {
      visible.value = index;
    });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[340px] w-full max-w-xl">
    <CodeBlock
      :key="run"
      filename="summarize.ts"
      language="typescript"
      :code="lines.slice(0, visible).join('\n')"
      :status="visible === lines.length ? 'complete' : 'streaming'"
      :highlight-lines="[4, 5, 6, 7]"
      :max-height="224"
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

## Component Guide

<a id="composition"></a>
### Composition

Compose Code Block with its public parts: CodeBlock, AgentCodeLine. Import these names from the component barrel.

```text
StreamingResponse
└── CodeBlock
```

<a id="behavior"></a>
### How it works

Present highlighted code with line controls, file labels and a copy operation.

### Lifecycle

#### Initialize

Configure Code Block through code, language, filename, status, showLineNumbers, highlightLines, maxHeight, wrap, copyable, onCopy. The API table describes their types and defaults.

#### Update

Provide content through the documented composition; application effects remain with the consumer.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Code Block parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes CodeBlock, AgentCodeLine through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [File Diff](https://orvui.efu.me/en/components/agents/file-diff): Inspect additions and removals with aligned line numbers and expandable context.
- [Tool Result](https://orvui.efu.me/en/components/agents/tool-result): Present a tool call's status, summary and expandable result in one surface.
- [Streaming Response](https://orvui.efu.me/en/components/agents/streaming-response): Compose a changing assistant response with text, attachments, references and actions.

### Contract

- Owns: Code Block owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Code Block when the interface needs this behavior: present highlighted code with line controls, file labels and a copy operation.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### CodeBlock

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | Yes | — |
| `language` | `"text" \| "bash" \| "diff" \| "json" \| "tsx" \| "typescript" \| "javascript" \| "vue" \| "css" \| "html"` | `"typescript"` | No | — |
| `filename` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |
| `status` | `"streaming" \| "complete"` | `"complete"` | No | — |
| `showLineNumbers` | `boolean` | `true` | No | — |
| `highlightLines` | `number[]` | `() => []` | No | — |
| `maxHeight` | `number` | `280` | No | — |
| `wrap` | `boolean` | `false` | No | — |
| `copyable` | `boolean` | `true` | No | — |
| `onCopy` | `() => void \| Promise<void>` | — | No | — |

### AgentCodeLine

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | Yes | — |
| `tokens` | `AgentCodeToken[]` | — | No | — |

<a id="about"></a>
## About Code Block

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Code Block?**

Configure Code Block through code, language, filename, status, showLineNumbers, highlightLines, maxHeight, wrap, copyable, onCopy. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through the documented composition; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [File Diff](https://orvui.efu.me/en/components/agents/file-diff): Inspect additions and removals with aligned line numbers and expandable context.
- [Tool Result](https://orvui.efu.me/en/components/agents/tool-result): Present a tool call's status, summary and expandable result in one surface.
- [Streaming Response](https://orvui.efu.me/en/components/agents/streaming-response): Compose a changing assistant response with text, attachments, references and actions.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/code-block.json
- Documentation: https://orvui.efu.me/en/components/agents/code-block
- `packages/vue/src/agents/code-block/src/CodeBlock.vue`
- `packages/vue/src/agents/code-block/src/AgentCodeLine.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
