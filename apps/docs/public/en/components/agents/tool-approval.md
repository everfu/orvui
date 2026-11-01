---
title: "Tool Approval"
description: "Ask for an explicit decision on a pending tool action with explanatory context."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/tool-approval"
markdown: "https://orvui.efu.me/en/components/agents/tool-approval.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Tool Approval

> Ask for an explicit decision on a pending tool action with explanatory context.

<a id="when-to-use"></a>

## When to use it

- Use Tool Approval when the interface needs this behavior: ask for an explicit decision on a pending tool action with explanatory context.

<a id="install"></a>
## Install

### Tool Approval — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tool-approval.json
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
### Tool Approval

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref, h } from "vue";
import { RotateCcw } from "lucide-vue-next";
import {
  ToolApproval,
  ToolApprovalCode,
  type ToolApprovalStatus,
} from "@/components/orvui/agents/tool-approval";
const status = ref<ToolApprovalStatus>("pending"),
  details = ref(true);
const parameters = [
  {
    id: "command",
    label: "Command",
    value: () =>
      h(ToolApprovalCode, {
        code: "pnpm exec vitest run tests/a11y.test.ts",
        language: "bash",
      }),
  },
  { id: "directory", label: "Directory", value: "ui-components" },
];
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
function approve() {
  cancel();
  status.value = "approving";
  (
    [
      ["approved", 600],
      ["running", 1150],
      ["complete", 2200],
    ] as const
  ).forEach(([next, delay]) =>
    later(delay, () => {
      status.value = next;
    }),
  );
}
function deny() {
  cancel();
  status.value = "denied";
}
function replay() {
  cancel();
  status.value = "pending";
  details.value = true;
}
</script>
<template>
  <div class="relative h-[360px] w-full max-w-lg">
    <ToolApproval
      tool="terminal.run"
      :title="
        status === 'pending' ? 'Allow this tool to run?' : 'Terminal access'
      "
      description="The agent wants to run the project test suite in the current workspace."
      :status="status"
      v-model:open="details"
      :parameters="parameters"
      @approve="approve"
      @always-allow="approve"
      @deny="deny"
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
import { onBeforeUnmount, ref, h } from "vue";
import { RotateCcw } from "lucide-vue-next";
import { ToolApproval, ToolApprovalCode, type ToolApprovalStatus } from "@orvui/vue/agents/tool-approval";
const status = ref<ToolApprovalStatus>("pending"),
  details = ref(true);
const parameters = [
  {
    id: "command",
    label: "Command",
    value: () =>
      h(ToolApprovalCode, {
        code: "pnpm exec vitest run tests/a11y.test.ts",
        language: "bash",
      }),
  },
  { id: "directory", label: "Directory", value: "ui-components" },
];
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
function approve() {
  cancel();
  status.value = "approving";
  (
    [
      ["approved", 600],
      ["running", 1150],
      ["complete", 2200],
    ] as const
  ).forEach(([next, delay]) =>
    later(delay, () => {
      status.value = next;
    }),
  );
}
function deny() {
  cancel();
  status.value = "denied";
}
function replay() {
  cancel();
  status.value = "pending";
  details.value = true;
}
</script>
<template>
  <div class="relative h-[360px] w-full max-w-lg">
    <ToolApproval
      tool="terminal.run"
      :title="
        status === 'pending' ? 'Allow this tool to run?' : 'Terminal access'
      "
      description="The agent wants to run the project test suite in the current workspace."
      :status="status"
      v-model:open="details"
      :parameters="parameters"
      @approve="approve"
      @always-allow="approve"
      @deny="deny"
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

Compose Tool Approval with its public parts: ToolApproval, ToolApprovalCode. Import these names from the component barrel.

```text
Message
└── MessageContent
    └── ToolApproval
        └── ToolApprovalCode
```

<a id="behavior"></a>
### How it works

Ask for an explicit decision on a pending tool action with explanatory context.

### Lifecycle

#### Initialize

Configure Tool Approval through tool, title, description, parameters, status, open, defaultOpen. The API table describes their types and defaults.

#### Update

Observe update:open, openChange, approve, alwaysAllow, deny to connect the component to application state.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Tool Approval parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes ToolApproval, ToolApprovalCode through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Approval Card](https://orvui.efu.me/en/components/agents/approval-card): Guide a person through one or more decisions before an assistant proceeds.
- [Agent Activity](https://orvui.efu.me/en/components/agents/agent-activity): Group changing assistant activity into expandable steps and a completed summary.
- [Tool Result](https://orvui.efu.me/en/components/agents/tool-result): Present a tool call's status, summary and expandable result in one surface.

### Contract

- Owns: Tool Approval owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Tool Approval when the interface needs this behavior: ask for an explicit decision on a pending tool action with explanatory context.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `ToolApproval` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### ToolApproval

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `tool` | `Content` | — | Yes | — |
| `title` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Allow this tool to run?"` | No | — |
| `description` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |
| `parameters` | `ToolApprovalParameter[]` | `() => []` | No | — |
| `status` | `"error" \| "complete" \| "pending" \| "approved" \| "running" \| "approving" \| "denied"` | `"pending"` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |
| `approve` | `[]` | — |
| `alwaysAllow` | `[]` | — |
| `deny` | `[]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ToolApprovalCode

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `code` | `string` | — | Yes | — |
| `language` | `"text" \| "bash" \| "diff" \| "json" \| "tsx" \| "typescript" \| "javascript" \| "vue" \| "css" \| "html"` | `"bash"` | No | — |

<a id="about"></a>
## About Tool Approval

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Tool Approval?**

Configure Tool Approval through tool, title, description, parameters, status, open, defaultOpen. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open, openChange, approve, alwaysAllow, deny to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Approval Card](https://orvui.efu.me/en/components/agents/approval-card): Guide a person through one or more decisions before an assistant proceeds.
- [Agent Activity](https://orvui.efu.me/en/components/agents/agent-activity): Group changing assistant activity into expandable steps and a completed summary.
- [Tool Result](https://orvui.efu.me/en/components/agents/tool-result): Present a tool call's status, summary and expandable result in one surface.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/tool-approval.json
- Documentation: https://orvui.efu.me/en/components/agents/tool-approval
- `packages/vue/src/agents/tool-approval/src/ToolApproval.vue`
- `packages/vue/src/agents/tool-approval/src/ToolApprovalCode.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
