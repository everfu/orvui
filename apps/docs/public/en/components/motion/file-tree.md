---
title: "File Tree"
description: "Explore nested files and folders with expandable branches and keyboard selection."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/file-tree"
markdown: "https://orvui.efu.me/en/components/motion/file-tree.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# File Tree

> Explore nested files and folders with expandable branches and keyboard selection.

<a id="when-to-use"></a>

## When to use it

- Use File Tree when the interface needs this behavior: explore nested files and folders with expandable branches and keyboard selection.

<a id="install"></a>
## Install

### File Tree — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/file-tree.json
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
### File Tree

**Registry source**

```vue
<script setup lang="ts">
import { h } from "vue";
import { Braces, FileCode2, FileJson2, FileText, Palette } from "lucide-vue-next";
import { FileTree, FileTreeFile, FileTreeFolder } from "@/components/orvui/motion/file-tree";
const source = () => h(Braces, { class: "size-4 text-sky-500" });
const entries = [
  { value: "app", name: "App.vue", icon: () => h(FileCode2, { class: "size-4 text-sky-500" }) },
  { value: "styles", name: "style.css", icon: () => h(Palette, { class: "size-4 text-violet-500" }) },
];
const documents = [
  { value: "package", name: "package.json", icon: () => h(FileJson2, { class: "size-4 text-amber-500" }) },
  { value: "readme", name: "README.md", icon: () => h(FileText, { class: "size-4 text-muted-foreground" }) },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center px-4 pt-10"><div class="w-full max-w-xs p-2">
    <FileTree default-value="file-tree" :default-expanded-ids="['src', 'components']" aria-label="Project files">
      <FileTreeFolder value="src" name="src"><FileTreeFolder value="components" name="components"><FileTreeFile v-for="file in ['file-tree', 'button']" :key="file" :value="file" :name="`${file}.vue`" :icon="source" /></FileTreeFolder><FileTreeFile v-for="entry in entries" :key="entry.value" v-bind="entry" /></FileTreeFolder>
      <FileTreeFolder value="public" name="public"><FileTreeFile v-for="file in ['logo', 'grid']" :key="file" :value="file" :name="`${file}.svg`" /></FileTreeFolder>
      <FileTreeFile v-for="entry in documents" :key="entry.value" v-bind="entry" />
    </FileTree>
  </div></div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { h } from "vue";
import { Braces, FileCode2, FileJson2, FileText, Palette } from "lucide-vue-next";
import { FileTree, FileTreeFile, FileTreeFolder } from "@orvui/vue/motion/file-tree";
const source = () => h(Braces, { class: "size-4 text-sky-500" });
const entries = [
  { value: "app", name: "App.vue", icon: () => h(FileCode2, { class: "size-4 text-sky-500" }) },
  { value: "styles", name: "style.css", icon: () => h(Palette, { class: "size-4 text-violet-500" }) },
];
const documents = [
  { value: "package", name: "package.json", icon: () => h(FileJson2, { class: "size-4 text-amber-500" }) },
  { value: "readme", name: "README.md", icon: () => h(FileText, { class: "size-4 text-muted-foreground" }) },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center px-4 pt-10"><div class="w-full max-w-xs p-2">
    <FileTree default-value="file-tree" :default-expanded-ids="['src', 'components']" aria-label="Project files">
      <FileTreeFolder value="src" name="src"><FileTreeFolder value="components" name="components"><FileTreeFile v-for="file in ['file-tree', 'button']" :key="file" :value="file" :name="`${file}.vue`" :icon="source" /></FileTreeFolder><FileTreeFile v-for="entry in entries" :key="entry.value" v-bind="entry" /></FileTreeFolder>
      <FileTreeFolder value="public" name="public"><FileTreeFile v-for="file in ['logo', 'grid']" :key="file" :value="file" :name="`${file}.svg`" /></FileTreeFolder>
      <FileTreeFile v-for="entry in documents" :key="entry.value" v-bind="entry" />
    </FileTree>
  </div></div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `FileTree` | `v-model` | `null \| string` | `update:modelValue` |
| `FileTree` | `v-model:expandedIds` | `string[]` | `update:expandedIds` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### FileTree

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `null \| string` | — | No | — |
| `defaultValue` | `null \| string` | `null` | No | — |
| `expandedIds` | `string[]` | — | No | — |
| `defaultExpandedIds` | `string[]` | `() => []` | No | — |
| `ariaLabel` | `string` | `"Files"` | No | — |
| `indent` | `number` | `18` | No | — |
| `classNames` | `FileTreeClassNames` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `update:expandedIds` | — | — |
| `expandedChange` | — | — |

### FileTreeFile

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | — |
| `name` | `string` | — | Yes | — |
| `icon` | `any` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |

### FileTreeFolder

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | Yes | — |
| `name` | `string` | — | Yes | — |
| `icon` | `any` | — | No | — |
| `disabled` | `boolean` | `false` | No | — |

<a id="about"></a>
## About File Tree

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure File Tree?**

Configure File Tree through modelValue, defaultValue, expandedIds, defaultExpandedIds, ariaLabel, indent, classNames. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:modelValue, change, update:expandedIds, expandedChange to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Animated Context Menu](https://orvui.efu.me/en/components/motion/context-menu): Open a menu at a pointer position with checkbox, radio and submenu compositions.
- [Image Viewer](https://orvui.efu.me/en/components/motion/image-viewer): Open a gallery image from its thumbnail and navigate, zoom or pan the enlarged view.
- [Animated Color Selector](https://orvui.efu.me/en/components/motion/color-selector): Choose one named swatch with a moving selection outline and native radio behavior.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/file-tree.json
- Documentation: https://orvui.efu.me/en/components/motion/file-tree
- `packages/vue/src/motion/file-tree/src/FileTree.vue`
- `packages/vue/src/motion/file-tree/src/FileTreeFile.vue`
- `packages/vue/src/motion/file-tree/src/FileTreeFolder.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
