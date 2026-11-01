---
title: "Citations"
description: "Connect inline reference markers to inspectable source entries and links."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/citations"
markdown: "https://orvui.efu.me/en/components/agents/citations.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Citations

> Connect inline reference markers to inspectable source entries and links.

<a id="when-to-use"></a>

## When to use it

- Use Citations when the interface needs this behavior: connect inline reference markers to inspectable source entries and links.

<a id="install"></a>
## Install

### Citations — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/citations.json
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

- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Citations

**Registry source**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { FileText, RotateCcw } from "lucide-vue-next";
import { Citation, Citations, type CitationItem } from "@/components/orvui/agents/citations";
const citations: CitationItem[] = [
  {
    id: "motion",
    title: "Motion documentation",
    domain: "motion.dev",
    url: "https://motion.dev/docs/vue",
  },
  {
    id: "wai",
    title: "WAI accessibility patterns",
    domain: "w3.org",
    url: "https://www.w3.org/WAI/ARIA/apg/",
  },
  {
    id: "guidelines",
    title: "Motion guidelines",
    domain: "Design handbook · PDF",
    icon: FileText,
  },
];
const visible = ref(0),
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
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    visible.value = citations.length;
    return;
  }
  citations.forEach((_, index) =>
    later(500 + index * 700, () => {
      visible.value = index + 1;
    }),
  );
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[410px] w-full max-w-lg">
    <div :key="run" class="space-y-4">
      <p class="text-sm leading-6 text-foreground/90">
        Use layout-aware motion for newly appended results
        <Citation citation-id="motion" :index="1" id-prefix="preview-source" />
        and preserve accessible disclosure behavior
        <Citation citation-id="wai" :index="2" id-prefix="preview-source" /> as
        the list grows, keeping exits shorter than entrances
        <Citation
          citation-id="guidelines"
          :index="3"
          id-prefix="preview-source"
          label="Citation 3: Motion guidelines"
        />.
      </p>
      <Citations
        id-prefix="preview-source"
        :citations="citations.slice(0, visible)"
        default-open
      />
    </div>
    <button
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
import { FileText, RotateCcw } from "lucide-vue-next";
import { Citation, Citations, type CitationItem } from "@orvui/vue/agents/citations";
const citations: CitationItem[] = [
  {
    id: "motion",
    title: "Motion documentation",
    domain: "motion.dev",
    url: "https://motion.dev/docs/vue",
  },
  {
    id: "wai",
    title: "WAI accessibility patterns",
    domain: "w3.org",
    url: "https://www.w3.org/WAI/ARIA/apg/",
  },
  {
    id: "guidelines",
    title: "Motion guidelines",
    domain: "Design handbook · PDF",
    icon: FileText,
  },
];
const visible = ref(0),
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
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    visible.value = citations.length;
    return;
  }
  citations.forEach((_, index) =>
    later(500 + index * 700, () => {
      visible.value = index + 1;
    }),
  );
}
onMounted(replay);
</script>
<template>
  <div class="relative h-[410px] w-full max-w-lg">
    <div :key="run" class="space-y-4">
      <p class="text-sm leading-6 text-foreground/90">
        Use layout-aware motion for newly appended results
        <Citation citation-id="motion" :index="1" id-prefix="preview-source" />
        and preserve accessible disclosure behavior
        <Citation citation-id="wai" :index="2" id-prefix="preview-source" /> as
        the list grows, keeping exits shorter than entrances
        <Citation
          citation-id="guidelines"
          :index="3"
          id-prefix="preview-source"
          label="Citation 3: Motion guidelines"
        />.
      </p>
      <Citations
        id-prefix="preview-source"
        :citations="citations.slice(0, visible)"
        default-open
      />
    </div>
    <button
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

Compose Citations with its public parts: Citation, Citations, CitationList, CitationFavicon. Import these names from the component barrel.

```text
StreamingResponse
├── Citation
└── Citations
    ├── CitationStack
    └── CitationList
```

<a id="behavior"></a>
### How it works

Connect inline reference markers to inspectable source entries and links.

### Lifecycle

#### Initialize

Configure Citations through citationId, index, idPrefix, label. The API table describes their types and defaults.

#### Update

Provide content through the documented composition; application effects remain with the consumer.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Citations parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes Citation, Citations, CitationList, CitationFavicon through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Streaming Response](https://orvui.efu.me/en/components/agents/streaming-response): Compose a changing assistant response with text, attachments, references and actions.
- [Message](https://orvui.efu.me/en/components/agents/message): Build a conversation entry from content, attachments, sources and action parts.

### Contract

- Owns: Citations owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use Citations when the interface needs this behavior: connect inline reference markers to inspectable source entries and links.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `Citations` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### Citation

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `citationId` | `string` | — | Yes | — |
| `index` | `number` | — | Yes | — |
| `idPrefix` | `string` | — | Yes | — |
| `label` | `string` | — | No | — |

### Citations

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `citations` | `CitationItem[]` | — | Yes | — |
| `title` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Sources"` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `idPrefix` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |

### CitationList

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `citations` | `CitationItem[]` | — | Yes | — |
| `idPrefix` | `string` | `` `citation-list-${instanceId.replace(/:/g, "")}` `` | No | — |

### CitationFavicon

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `url` | `string` | — | No | — |
| `icon` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | No | — |

<a id="about"></a>
## About Citations

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Citations?**

Configure Citations through citationId, index, idPrefix, label. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through the documented composition; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Message](https://orvui.efu.me/en/components/agents/message): Build a conversation entry from content, attachments, sources and action parts.
- [Todo List](https://orvui.efu.me/en/components/agents/todo-list): Show a sequence of work items with expandable details and explicit task states.
- [Streaming Response](https://orvui.efu.me/en/components/agents/streaming-response): Compose a changing assistant response with text, attachments, references and actions.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/citations.json
- Documentation: https://orvui.efu.me/en/components/agents/citations
- `packages/vue/src/agents/citations/src/Citation.vue`
- `packages/vue/src/agents/citations/src/Citations.vue`
- `packages/vue/src/agents/citations/src/CitationList.vue`
- `packages/vue/src/agents/citations/src/CitationFavicon.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
