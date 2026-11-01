---
title: "Agent Loading States"
description: "Communicate pending assistant work with progress, reasoning and shimmer displays."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/loading-states"
markdown: "https://orvui.efu.me/en/components/agents/loading-states.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Agent Loading States

> Communicate pending assistant work with progress, reasoning and shimmer displays.

<a id="when-to-use"></a>

## When to use it

- Use Agent Loading States when the interface needs this behavior: communicate pending assistant work with progress, reasoning and shimmer displays.

<a id="install"></a>
## Install

### Agent Loading States — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/loading-states.json
```

### Reasoning Text — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/reasoning-text.json
```

### Thinking Shimmer — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/thinking-shimmer.json
```

### Agent Progress — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/agent-progress.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Agent Loading States

**Registry source**

```vue
<script setup lang="ts">
import { AgentProgress, ReasoningText, ThinkingShimmer } from "@/components/orvui/agents/loading-states";
const variants = ["cascade", "swap", "scramble"] as const;
</script>
<template>
  <div class="flex min-h-72 flex-col items-start justify-center gap-7">
    <ReasoningText
      v-for="variant in variants"
      :key="variant"
      :variant="variant"
    /><ThinkingShimmer>Searching for the right words…</ThinkingShimmer
    ><AgentProgress label="Churning" />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { AgentProgress, ReasoningText, ThinkingShimmer } from "@orvui/vue/agents/loading-states";
const variants = ["cascade", "swap", "scramble"] as const;
</script>
<template>
  <div class="flex min-h-72 flex-col items-start justify-center gap-7">
    <ReasoningText
      v-for="variant in variants"
      :key="variant"
      :variant="variant"
    /><ThinkingShimmer>Searching for the right words…</ThinkingShimmer
    ><AgentProgress label="Churning" />
  </div>
</template>
```

<a id="reasoning-text"></a>
### Reasoning Text

Present evolving reasoning text with a clear pending-work state.

**Registry source**

```vue
<script setup lang="ts">
import { ReasoningText, type ReasoningTextVariant } from "@/components/orvui/agents/loading-states";
const ordinary = [
  "Thinking",
  "Reading the request",
  "Working through the details",
  "Preparing the answer",
];
const examples = (
  ["cascade", "swap", "scramble"] as ReasoningTextVariant[]
).map((variant) => ({
  variant,
  label: variant[0].toUpperCase() + variant.slice(1),
  phrases:
    variant === "scramble"
      ? ["Thinking", "Searching", "Reasoning", "Composing"]
      : ordinary,
}));
</script>
<template>
  <div class="grid w-full max-w-sm gap-7">
    <div v-for="example in examples" :key="example.variant" class="grid gap-2">
      <span
        class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60"
        >{{ example.label }}</span
      ><ReasoningText
        :variant="example.variant"
        :phrases="example.phrases"
        class="text-base"
      />
    </div>
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ReasoningText, type ReasoningTextVariant } from "@orvui/vue/agents/loading-states";
const ordinary = [
  "Thinking",
  "Reading the request",
  "Working through the details",
  "Preparing the answer",
];
const examples = (
  ["cascade", "swap", "scramble"] as ReasoningTextVariant[]
).map((variant) => ({
  variant,
  label: variant[0].toUpperCase() + variant.slice(1),
  phrases:
    variant === "scramble"
      ? ["Thinking", "Searching", "Reasoning", "Composing"]
      : ordinary,
}));
</script>
<template>
  <div class="grid w-full max-w-sm gap-7">
    <div v-for="example in examples" :key="example.variant" class="grid gap-2">
      <span
        class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60"
        >{{ example.label }}</span
      ><ReasoningText
        :variant="example.variant"
        :phrases="example.phrases"
        class="text-base"
      />
    </div>
  </div>
</template>
```

<a id="thinking-shimmer"></a>
### Thinking Shimmer

Keep a readable waiting label under a moving text highlight.

**Registry source**

```vue
<script setup lang="ts">
import { ThinkingShimmer } from "@/components/orvui/agents/loading-states";
const duration = 1.8;
</script>
<template>
  <ThinkingShimmer class="text-lg" :duration="duration"
    >Thinking…</ThinkingShimmer
  >
</template>
```

**Package**

```vue
<script setup lang="ts">
import { ThinkingShimmer } from "@orvui/vue/agents/loading-states";
const duration = 1.8;
</script>
<template>
  <ThinkingShimmer class="text-lg" :duration="duration"
    >Thinking…</ThinkingShimmer
  >
</template>
```

<a id="agent-progress"></a>
### Agent Progress

Combine a progress indicator with labels describing the current stage.

**Registry source**

```vue
<script setup lang="ts">
import { AgentProgress } from "@/components/orvui/agents/loading-states";
const initial = 151.6;
</script>
<template>
  <AgentProgress
    label="Churning"
    :initial-seconds="initial"
    class="text-base"
  />
</template>
```

**Package**

```vue
<script setup lang="ts">
import { AgentProgress } from "@orvui/vue/agents/loading-states";
const initial = 151.6;
</script>
<template>
  <AgentProgress
    label="Churning"
    :initial-seconds="initial"
    class="text-base"
  />
</template>
```

## Component Guide

<a id="composition"></a>
### Composition

Compose Agent Loading States with its public parts: AgentProgress, ReasoningText, ThinkingShimmer. Import these names from the component barrel.

```text
Message
└── MessageContent
    ├── ThinkingShimmer
    ├── AgentProgress
    └── ReasoningText
```

<a id="behavior"></a>
### How it works

Communicate pending assistant work with progress, reasoning and shimmer displays.

### Lifecycle

#### Initialize

Configure Agent Loading States through label, elapsedSeconds, initialSeconds, running. The API table describes their types and defaults.

#### Update

Provide content through the documented composition; application effects remain with the consumer.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Agent Loading States parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes AgentProgress, ReasoningText, ThinkingShimmer through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Agent Activity](https://orvui.efu.me/en/components/agents/agent-activity): Group changing assistant activity into expandable steps and a completed summary.
- [Todo List](https://orvui.efu.me/en/components/agents/todo-list): Show a sequence of work items with expandable details and explicit task states.
- [Streaming Response](https://orvui.efu.me/en/components/agents/streaming-response): Compose a changing assistant response with text, attachments, references and actions.

### Contract

- Owns: Agent Loading States owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Agent Loading States when the interface needs this behavior: communicate pending assistant work with progress, reasoning and shimmer displays.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

This example composition declares no paired controlled prop and update event. Compose it through the documented props, native events and slots; do not add an undocumented v-model.

<a id="api-reference"></a>
## API Reference

### AgentProgress

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Churning"` | No | — |
| `elapsedSeconds` | `number` | `internal.value` | No | — |
| `initialSeconds` | `number` | `0` | No | — |
| `running` | `boolean` | `true` | No | — |

### ReasoningText

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `phrases` | `string[]` | `() => [ "Thinking", "Reading the context", "Connecting the details", "Forming a response", ]` | No | — |
| `variant` | `"cascade" \| "scramble" \| "swap"` | `"cascade"` | No | — |
| `interval` | `number` | `1800` | No | — |
| `shimmerDuration` | `number` | `2.2` | No | — |
| `indicator` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `indicator` | `() => VNodeChild` | — | — |

### ThinkingShimmer

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `duration` | `number` | `1.8` | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Agent Loading States

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Agent Loading States?**

Configure Agent Loading States through label, elapsedSeconds, initialSeconds, running. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through the documented composition; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Todo List](https://orvui.efu.me/en/components/agents/todo-list): Show a sequence of work items with expandable details and explicit task states.
- [Message](https://orvui.efu.me/en/components/agents/message): Build a conversation entry from content, attachments, sources and action parts.
- [Prompt Input](https://orvui.efu.me/en/components/agents/prompt-input): Compose and submit a prompt with a growing textarea, attachments and keyboard handling.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/loading-states.json
- Documentation: https://orvui.efu.me/en/components/agents/loading-states
- `packages/vue/src/agents/loading-states/src/AgentProgress.vue`
- `packages/vue/src/agents/loading-states/src/ReasoningText.vue`
- `packages/vue/src/agents/loading-states/src/ThinkingShimmer.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
