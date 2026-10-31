---
title: "Project Folder"
description: "Fan out document previews and expand a selected folder into a focused surface."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/project-folder"
markdown: "https://orvui.efu.me/en/components/blocks/project-folder.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Project Folder

> Fan out document previews and expand a selected folder into a focused surface.

<a id="when-to-use"></a>

## When to use it

- Use Project Folder when the interface needs this behavior: fan out document previews and expand a selected folder into a focused surface.

<a id="install"></a>
## Install

### Project Folder — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/project-folder.json
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
### Project Folder

**Registry source**

```vue
<script setup lang="ts">
import { h } from "vue";
import { ProjectFolder } from "@/components/orvui/blocks/project-folder";
const sheets = [
  ["emerald", "#a7f3d0"],
  ["orange", "#fed7aa"],
  ["sky", "#bae6fd"],
  ["violet", "#ddd6fe"],
  ["amber", "#fef3c7"],
];
const previews = sheets.map(([id, background], index) => ({
  id,
  content: h(
    "span",
    { class: "relative block h-full w-full", style: { background } },
    [
      h("span", {
        class: "absolute left-3 top-3 h-2 w-8 rounded-full bg-black/15",
      }),
      ...["top-8", "top-11"].map((top) =>
        h("span", { class: `absolute inset-x-3 ${top} h-px bg-black/10` }),
      ),
      h(
        "span",
        {
          class: "absolute bottom-3 right-3 text-sm font-medium text-black/50",
        },
        String.fromCharCode(65 + index),
      ),
    ],
  ),
}));
</script>
<template>
  <div class="flex min-h-80 w-full items-center justify-center px-6 py-10">
    <ProjectFolder
      title="Brand direction"
      description="Updated recently"
      :count="5"
      :previews="previews"
    />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { h } from "vue";
import { ProjectFolder } from "@orvui/vue/blocks/project-folder";
const sheets = [
  ["emerald", "#a7f3d0"],
  ["orange", "#fed7aa"],
  ["sky", "#bae6fd"],
  ["violet", "#ddd6fe"],
  ["amber", "#fef3c7"],
];
const previews = sheets.map(([id, background], index) => ({
  id,
  content: h(
    "span",
    { class: "relative block h-full w-full", style: { background } },
    [
      h("span", {
        class: "absolute left-3 top-3 h-2 w-8 rounded-full bg-black/15",
      }),
      ...["top-8", "top-11"].map((top) =>
        h("span", { class: `absolute inset-x-3 ${top} h-px bg-black/10` }),
      ),
      h(
        "span",
        {
          class: "absolute bottom-3 right-3 text-sm font-medium text-black/50",
        },
        String.fromCharCode(65 + index),
      ),
    ],
  ),
}));
</script>
<template>
  <div class="flex min-h-80 w-full items-center justify-center px-6 py-10">
    <ProjectFolder
      title="Brand direction"
      description="Updated recently"
      :count="5"
      :previews="previews"
    />
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `ProjectFolder` | `v-model:open` | `boolean` | `update:open` |
| `ProjectFolder` | `v-model:expanded` | `boolean` | `update:expanded` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### ProjectFolder

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | — | Yes | — |
| `description` | `string` | `"Updated recently"` | No | — |
| `previews` | `ProjectFolderPreview[]` | `() => []` | No | — |
| `count` | `number` | `props.previews.length` | No | — |
| `itemLabel` | `string` | `"file"` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `expanded` | `boolean` | `undefined` | No | — |
| `defaultExpanded` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `ariaLabel` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |
| `update:expanded` | `[expanded: boolean]` | — |
| `expandedChange` | `[expanded: boolean]` | — |
| `click` | `[]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `preview` | — | `preview: preview` | — |

<a id="about"></a>
## About Project Folder

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Project Folder?**

Configure Project Folder through title, description, previews, count, itemLabel, open, defaultOpen, expanded, defaultExpanded, disabled, ariaLabel. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open, openChange, update:expanded, expandedChange, click to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Card Folder](https://orvui.efu.me/en/components/blocks/card-folder): Reveal a group of cards from a folded pocket with a coordinated opening movement.
- [Expandable Action Bar](https://orvui.efu.me/en/components/blocks/expandable-action-bar): Reveal labels around the active action in a compact row of icon controls.
- [Notification Stack](https://orvui.efu.me/en/components/blocks/notification-stack): Expand a compact stack of notifications into separately readable entries.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/project-folder.json
- Documentation: https://orvui.efu.me/en/components/blocks/project-folder
- `packages/vue/src/blocks/project-folder/src/ProjectFolder.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
