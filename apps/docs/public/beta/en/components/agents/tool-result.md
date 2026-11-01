---
title: "Tool Result"
description: "Present a tool call's status, summary and expandable result in one surface."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/tool-result"
markdown: "https://orvui.efu.me/en/components/agents/tool-result.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Tool Result

> Present a tool call's status, summary and expandable result in one surface.

<a id="when-to-use"></a>

## When to use it

- Use Tool Result when the interface needs this behavior: present a tool call's status, summary and expandable result in one surface.

<a id="install"></a>
## Install

### Tool Result — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/tool-result.json
```

### Terminal Output — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/tool-result.json
```

### Request Result — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/tool-result.json https://orvui.efu.me/beta/r/code-block.json
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
### Tool Result

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolResult, ToolResultOutput } from "@/components/orvui/agents/tool-result";
const lines = [
  "$ pnpm exec vitest run tests/a11y.test.ts",
  "Vitest · Vue accessibility tests",
  "✓ StreamingResponse complete",
  "✓ ToolApproval pending",
  "✓ Citations expanded",
  "49 pass · 0 fail",
];
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
const output = computed(() => lines.slice(0, visible.value).join("\n"));
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
  status.value = "running";
  lines.forEach((_, index) =>
    later(180 + index * 420, () => {
      visible.value = index + 1;
    }),
  );
  later(3000, () => {
    status.value = "success";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="terminal.run"
      :title="
        status === 'running' ? 'Running accessibility tests' : 'Tests passed'
      "
      kind="terminal"
      :status="status"
      :meta="status === 'success' ? '2.9s' : undefined"
      :copy-text="output"
      @retry="replay"
      :max-height="150"
      ><ToolResultOutput :code="output" /></ToolResult
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
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolResult, ToolResultOutput } from "@orvui/vue/agents/tool-result";
const lines = [
  "$ pnpm exec vitest run tests/a11y.test.ts",
  "Vitest · Vue accessibility tests",
  "✓ StreamingResponse complete",
  "✓ ToolApproval pending",
  "✓ Citations expanded",
  "49 pass · 0 fail",
];
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
const output = computed(() => lines.slice(0, visible.value).join("\n"));
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
  status.value = "running";
  lines.forEach((_, index) =>
    later(180 + index * 420, () => {
      visible.value = index + 1;
    }),
  );
  later(3000, () => {
    status.value = "success";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="terminal.run"
      :title="
        status === 'running' ? 'Running accessibility tests' : 'Tests passed'
      "
      kind="terminal"
      :status="status"
      :meta="status === 'success' ? '2.9s' : undefined"
      :copy-text="output"
      @retry="replay"
      :max-height="150"
      ><ToolResultOutput :code="output" /></ToolResult
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

<a id="terminal-output"></a>
### Terminal Output

Show command output with its terminal framing and execution state.

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolResult, ToolResultOutput } from "@/components/orvui/agents/tool-result";
const lines = [
  "$ pnpm exec vitest run tests/a11y.test.ts",
  "Vitest · Vue accessibility tests",
  "✓ StreamingResponse complete",
  "✓ ToolApproval pending",
  "✓ Citations expanded",
  "49 pass · 0 fail",
];
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
const output = computed(() => lines.slice(0, visible.value).join("\n"));
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
  status.value = "running";
  lines.forEach((_, index) =>
    later(180 + index * 420, () => {
      visible.value = index + 1;
    }),
  );
  later(3000, () => {
    status.value = "success";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="terminal.run"
      :title="
        status === 'running' ? 'Running accessibility tests' : 'Tests passed'
      "
      kind="terminal"
      :status="status"
      :meta="status === 'success' ? '2.9s' : undefined"
      :copy-text="output"
      @retry="replay"
      :max-height="150"
      ><ToolResultOutput :code="output" /></ToolResult
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
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolResult, ToolResultOutput } from "@orvui/vue/agents/tool-result";
const lines = [
  "$ pnpm exec vitest run tests/a11y.test.ts",
  "Vitest · Vue accessibility tests",
  "✓ StreamingResponse complete",
  "✓ ToolApproval pending",
  "✓ Citations expanded",
  "49 pass · 0 fail",
];
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
const output = computed(() => lines.slice(0, visible.value).join("\n"));
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
  status.value = "running";
  lines.forEach((_, index) =>
    later(180 + index * 420, () => {
      visible.value = index + 1;
    }),
  );
  later(3000, () => {
    status.value = "success";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="terminal.run"
      :title="
        status === 'running' ? 'Running accessibility tests' : 'Tests passed'
      "
      kind="terminal"
      :status="status"
      :meta="status === 'success' ? '2.9s' : undefined"
      :copy-text="output"
      @retry="replay"
      :max-height="150"
      ><ToolResultOutput :code="output" /></ToolResult
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

<a id="request-result"></a>
### Request Result

Present request metadata and its returned content as an inspectable result.

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolResult, ToolResultOutput } from "@/components/orvui/agents/tool-result";
import { AgentCode } from "@/components/orvui/agents/code-block";
const response = JSON.stringify(
  { error: "rate_limit_exceeded", retryAfter: 30, requestId: "req_8f21" },
  null,
  2,
);
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
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
  status.value = "running";
  for (let index = 1; index <= 3; index++)
    later(180 + (index - 1) * 600, () => {
      visible.value = index;
    });
  later(2280, () => {
    status.value = "error";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="http.request"
      :title="
        status === 'running' ? 'Fetching project activity' : 'Request failed'
      "
      kind="request"
      :status="status"
      :meta="status === 'error' ? '429' : 'GET /v1/activity'"
      :copy-text="response"
      @retry="replay"
      :collapse-on-complete="false"
      :max-height="150"
      ><ToolResultOutput
        v-if="visible < 3"
        :code="
          [
            'Preparing request…',
            'GET /v1/activity\nConnecting…',
            'GET /v1/activity\nWaiting for response…',
          ][visible]
        " /><AgentCode v-else :code="response" language="json" /></ToolResult
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
import { ToolResult, ToolResultOutput } from "@orvui/vue/agents/tool-result";
import { AgentCode } from "@orvui/vue/agents/code-block";
const response = JSON.stringify(
  { error: "rate_limit_exceeded", retryAfter: 30, requestId: "req_8f21" },
  null,
  2,
);
const visible = ref(0),
  run = ref(0),
  status = ref<"running" | "success" | "error">("running");
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
  status.value = "running";
  for (let index = 1; index <= 3; index++)
    later(180 + (index - 1) * 600, () => {
      visible.value = index;
    });
  later(2280, () => {
    status.value = "error";
  });
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[330px] w-full max-w-lg">
    <ToolResult
      :key="run"
      tool="http.request"
      :title="
        status === 'running' ? 'Fetching project activity' : 'Request failed'
      "
      kind="request"
      :status="status"
      :meta="status === 'error' ? '429' : 'GET /v1/activity'"
      :copy-text="response"
      @retry="replay"
      :collapse-on-complete="false"
      :max-height="150"
      ><ToolResultOutput
        v-if="visible < 3"
        :code="
          [
            'Preparing request…',
            'GET /v1/activity\nConnecting…',
            'GET /v1/activity\nWaiting for response…',
          ][visible]
        " /><AgentCode v-else :code="response" language="json" /></ToolResult
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

Compose Tool Result with its public parts: ToolResult, ToolResultOutput. Import these names from the component barrel.

```text
ToolResult
└── ToolResultOutput
```

<a id="behavior"></a>
### How it works

Present a tool call's status, summary and expandable result in one surface.

### Lifecycle

#### Initialize

Configure Tool Result through tool, title, status, kind, meta, icon, open, defaultOpen, collapseOnComplete, maxHeight, copyText, onCopy, contentClassName. The API table describes their types and defaults.

#### Update

Observe update:open, openChange, retry to connect the component to application state.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Tool Result parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes ToolResult, ToolResultOutput through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Tool Approval](https://orvui.efu.me/en/components/agents/tool-approval): Ask for an explicit decision on a pending tool action with explanatory context.
- [Code Block](https://orvui.efu.me/en/components/agents/code-block): Present highlighted code with line controls, file labels and a copy operation.
- [Agent Activity](https://orvui.efu.me/en/components/agents/agent-activity): Group changing assistant activity into expandable steps and a completed summary.

### Contract

- Owns: Tool Result owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Tool Result when the interface needs this behavior: present a tool call's status, summary and expandable result in one surface.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `ToolResult` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### ToolResult

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `tool` | `Content` | — | Yes | — |
| `title` | `Content` | — | Yes | — |
| `status` | `"success" \| "error" \| "running" \| "cancelled"` | `"running"` | No | — |
| `kind` | `"terminal" \| "request" \| "custom"` | `"custom"` | No | — |
| `meta` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |
| `icon` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `true` | No | — |
| `collapseOnComplete` | `boolean` | `true` | No | — |
| `maxHeight` | `number` | `220` | No | — |
| `copyText` | `string` | `""` | No | — |
| `onCopy` | `() => void \| Promise<void>` | — | No | — |
| `contentClassName` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |
| `retry` | `[]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ToolResultOutput

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `code` | `string` | `(slots.default?.() ?? []).reduce( (text, node) => text + (typeof node.children === "string" ? node.children : ""), "", )` | No | — |
| `language` | `"text" \| "bash" \| "diff" \| "json" \| "tsx" \| "typescript" \| "javascript" \| "vue" \| "css" \| "html"` | `"bash"` | No | — |

<a id="about"></a>
## About Tool Result

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Tool Result?**

Configure Tool Result through tool, title, status, kind, meta, icon, open, defaultOpen, collapseOnComplete, maxHeight, copyText, onCopy, contentClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open, openChange, retry to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [File Diff](https://orvui.efu.me/en/components/agents/file-diff): Inspect additions and removals with aligned line numbers and expandable context.
- [Code Block](https://orvui.efu.me/en/components/agents/code-block): Present highlighted code with line controls, file labels and a copy operation.
- [Todo List](https://orvui.efu.me/en/components/agents/todo-list): Show a sequence of work items with expandable details and explicit task states.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/beta/r/tool-result.json
- Documentation: https://orvui.efu.me/en/components/agents/tool-result
- `packages/vue/src/agents/tool-result/src/ToolResult.vue`
- `packages/vue/src/agents/tool-result/src/ToolResultOutput.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
