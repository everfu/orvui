---
title: "Morphing Search"
description: "Expand a search field into suggestions, recent items or editable filter chips."
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/blocks/morphing-search"
markdown: "https://orvui.efu.me/en/components/blocks/morphing-search.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Morphing Search

> Expand a search field into suggestions, recent items or editable filter chips.

<a id="when-to-use"></a>

## When to use it

- Use Morphing Search when the interface needs this behavior: expand a search field into suggestions, recent items or editable filter chips.

<a id="install"></a>
## Install

### Morphing Search — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/morphing-search.json
```

### Chip Search — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/morphing-search-chips.json
```

### Morphing Search — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/morphing-search.json
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

<a id="examples"></a>
## Usage

<a id="default"></a>
### Morphing Search

**Registry source**

```vue
<script setup lang="ts">
import { Blocks, BookOpen, Bot, FolderOpen, Palette } from "lucide-vue-next";
import { MorphingSearch, type MorphingSearchItem } from "@/components/orvui/blocks/morphing-search";
const entries = [
  [
    "project-folder",
    "Project Folder",
    "Block · Files and previews",
    ["files", "overlay"],
    FolderOpen,
  ],
  [
    "motion-components",
    "Motion components",
    "Collection · Interaction primitives",
    ["animation", "components"],
    Blocks,
  ],
  [
    "agent-interfaces",
    "Agent interfaces",
    "Collection · AI building blocks",
    ["ai", "chat"],
    Bot,
  ],
  [
    "installation",
    "Installation guide",
    "Documentation · Add your first component",
    ["setup", "shadcn"],
    BookOpen,
  ],
  [
    "design-tokens",
    "Design tokens",
    "Documentation · Color, type, and motion",
    ["theme", "styles"],
    Palette,
  ],
] as const;
const items: MorphingSearchItem[] = entries.map(
  ([id, title, description, keywords, icon]) => ({
    id,
    title,
    description,
    keywords: [...keywords],
    icon,
  }),
);
</script>
<template>
  <div class="flex w-full max-w-[22rem] items-center gap-3">
    <MorphingSearch
      :items="items"
      placeholder="Find components"
    /><MorphingSearch
      :items="items"
      placeholder="Find components"
      shortcut=""
      icon-only
    />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { Blocks, BookOpen, Bot, FolderOpen, Palette } from "lucide-vue-next";
import { MorphingSearch, type MorphingSearchItem } from "@orvui/vue/blocks/morphing-search";
const entries = [
  [
    "project-folder",
    "Project Folder",
    "Block · Files and previews",
    ["files", "overlay"],
    FolderOpen,
  ],
  [
    "motion-components",
    "Motion components",
    "Collection · Interaction primitives",
    ["animation", "components"],
    Blocks,
  ],
  [
    "agent-interfaces",
    "Agent interfaces",
    "Collection · AI building blocks",
    ["ai", "chat"],
    Bot,
  ],
  [
    "installation",
    "Installation guide",
    "Documentation · Add your first component",
    ["setup", "shadcn"],
    BookOpen,
  ],
  [
    "design-tokens",
    "Design tokens",
    "Documentation · Color, type, and motion",
    ["theme", "styles"],
    Palette,
  ],
] as const;
const items: MorphingSearchItem[] = entries.map(
  ([id, title, description, keywords, icon]) => ({
    id,
    title,
    description,
    keywords: [...keywords],
    icon,
  }),
);
</script>
<template>
  <div class="flex w-full max-w-[22rem] items-center gap-3">
    <MorphingSearch
      :items="items"
      placeholder="Find components"
    /><MorphingSearch
      :items="items"
      placeholder="Find components"
      shortcut=""
      icon-only
    />
  </div>
</template>
```

<a id="chips"></a>
### Chip Search

Convert submitted terms into removable chips while the search surface expands around them.

**Registry source**

```vue
<script setup lang="ts">
import { MorphingSearchChips } from "@/components/orvui/blocks/morphing-search";
const tileColors = [
  "from-rose-400/40 to-orange-300/30",
  "from-sky-400/40 to-indigo-400/30",
  "from-emerald-400/40 to-teal-300/30",
  "from-amber-300/40 to-rose-300/30",
  "from-violet-400/40 to-fuchsia-300/30",
  "from-teal-300/40 to-sky-300/30",
];
const suggestions = [
  "dashboards",
  "data tables",
  "dark mode",
  "empty states",
  "onboarding",
  "pricing pages",
  "settings",
  "sign in",
];
</script>
<template>
  <div
    class="relative flex h-[440px] w-full max-w-2xl flex-col justify-end overflow-hidden rounded-3xl border border-border bg-muted/40 p-4"
  >
    <div
      aria-hidden="true"
      class="absolute inset-4 grid grid-cols-3 gap-3 opacity-80"
    >
      <div
        v-for="tile in tileColors"
        :key="tile"
        class="rounded-2xl bg-gradient-to-br"
        :class="tile"
      />
    </div>
    <MorphingSearchChips
      class="mx-auto"
      placeholder="Search inspiration"
      label="Search inspiration"
      :default-chips="['onboarding']"
      :default-recents="['dashboards', 'empty states', 'pricing pages']"
      storage-key="orvui:morphing-search-chips:recents"
      :max-chips="4"
      :suggestions="suggestions"
    />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { MorphingSearchChips } from "@orvui/vue/blocks/morphing-search";
const tileColors = [
  "from-rose-400/40 to-orange-300/30",
  "from-sky-400/40 to-indigo-400/30",
  "from-emerald-400/40 to-teal-300/30",
  "from-amber-300/40 to-rose-300/30",
  "from-violet-400/40 to-fuchsia-300/30",
  "from-teal-300/40 to-sky-300/30",
];
const suggestions = [
  "dashboards",
  "data tables",
  "dark mode",
  "empty states",
  "onboarding",
  "pricing pages",
  "settings",
  "sign in",
];
</script>
<template>
  <div
    class="relative flex h-[440px] w-full max-w-2xl flex-col justify-end overflow-hidden rounded-3xl border border-border bg-muted/40 p-4"
  >
    <div
      aria-hidden="true"
      class="absolute inset-4 grid grid-cols-3 gap-3 opacity-80"
    >
      <div
        v-for="tile in tileColors"
        :key="tile"
        class="rounded-2xl bg-gradient-to-br"
        :class="tile"
      />
    </div>
    <MorphingSearchChips
      class="mx-auto"
      placeholder="Search inspiration"
      label="Search inspiration"
      :default-chips="['onboarding']"
      :default-recents="['dashboards', 'empty states', 'pricing pages']"
      storage-key="orvui:morphing-search-chips:recents"
      :max-chips="4"
      :suggestions="suggestions"
    />
  </div>
</template>
```

<a id="overlay"></a>
### Morphing Search

Open a larger search surface from a field or compact trigger using pointer or keyboard input.

**Registry source**

```vue
<script setup lang="ts">
import { Blocks, BookOpen, Bot, FolderOpen, Palette } from "lucide-vue-next";
import { MorphingSearch, type MorphingSearchItem } from "@/components/orvui/blocks/morphing-search";
const entries = [
  [
    "project-folder",
    "Project Folder",
    "Block · Files and previews",
    ["files", "overlay"],
    FolderOpen,
  ],
  [
    "motion-components",
    "Motion components",
    "Collection · Interaction primitives",
    ["animation", "components"],
    Blocks,
  ],
  [
    "agent-interfaces",
    "Agent interfaces",
    "Collection · AI building blocks",
    ["ai", "chat"],
    Bot,
  ],
  [
    "installation",
    "Installation guide",
    "Documentation · Add your first component",
    ["setup", "shadcn"],
    BookOpen,
  ],
  [
    "design-tokens",
    "Design tokens",
    "Documentation · Color, type, and motion",
    ["theme", "styles"],
    Palette,
  ],
] as const;
const items: MorphingSearchItem[] = entries.map(
  ([id, title, description, keywords, icon]) => ({
    id,
    title,
    description,
    keywords: [...keywords],
    icon,
  }),
);
</script>
<template>
  <div class="flex w-full max-w-[22rem] items-center gap-3">
    <MorphingSearch
      :items="items"
      placeholder="Find components"
    /><MorphingSearch
      :items="items"
      placeholder="Find components"
      shortcut=""
      icon-only
    />
  </div>
</template>
```

**Package**

```vue
<script setup lang="ts">
import { Blocks, BookOpen, Bot, FolderOpen, Palette } from "lucide-vue-next";
import { MorphingSearch, type MorphingSearchItem } from "@orvui/vue/blocks/morphing-search";
const entries = [
  [
    "project-folder",
    "Project Folder",
    "Block · Files and previews",
    ["files", "overlay"],
    FolderOpen,
  ],
  [
    "motion-components",
    "Motion components",
    "Collection · Interaction primitives",
    ["animation", "components"],
    Blocks,
  ],
  [
    "agent-interfaces",
    "Agent interfaces",
    "Collection · AI building blocks",
    ["ai", "chat"],
    Bot,
  ],
  [
    "installation",
    "Installation guide",
    "Documentation · Add your first component",
    ["setup", "shadcn"],
    BookOpen,
  ],
  [
    "design-tokens",
    "Design tokens",
    "Documentation · Color, type, and motion",
    ["theme", "styles"],
    Palette,
  ],
] as const;
const items: MorphingSearchItem[] = entries.map(
  ([id, title, description, keywords, icon]) => ({
    id,
    title,
    description,
    keywords: [...keywords],
    icon,
  }),
);
</script>
<template>
  <div class="flex w-full max-w-[22rem] items-center gap-3">
    <MorphingSearch
      :items="items"
      placeholder="Find components"
    /><MorphingSearch
      :items="items"
      placeholder="Find components"
      shortcut=""
      icon-only
    />
  </div>
</template>
```

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `MorphingSearch` | `v-model:open` | `boolean` | `update:open` |
| `MorphingSearchChips` | `v-model:chips` | `string[]` | `update:chips` |
| `MorphingSearchChips` | `v-model:query` | `string` | `update:query` |
| `MorphingSearchChips` | `v-model:recents` | `string[]` | `update:recents` |
| `MorphingSearchChips` | `v-model:open` | `boolean` | `update:open` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### MorphingSearch

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `MorphingSearchItem[]` | — | Yes | — |
| `placeholder` | `string` | `"Search"` | No | — |
| `shortcut` | `string` | `"f"` | No | — |
| `iconOnly` | `boolean` | `false` | No | — |
| `emptyMessage` | `string` | `"No results found."` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |
| `queryChange` | `[query: string]` | — |
| `select` | `[item: MorphingSearchItem]` | — |

### MorphingSearchChips

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `chips` | `string[]` | — | No | — |
| `defaultChips` | `string[]` | `() => []` | No | — |
| `query` | `string` | — | No | — |
| `defaultQuery` | `string` | `""` | No | — |
| `recents` | `string[]` | `localRecents.value` | No | — |
| `defaultRecents` | `string[]` | `() => []` | No | — |
| `storageKey` | `string` | — | No | — |
| `maxRecents` | `number` | `5` | No | — |
| `suggestions` | `string[]` | `() => []` | No | — |
| `filter` | `false \| (term: string, query: string) => boolean` | `undefined` | No | — |
| `maxSuggestions` | `number` | `6` | No | — |
| `loading` | `boolean` | `false` | No | — |
| `maxChips` | `number` | — | No | — |
| `normalize` | `(term: string) => string \| null` | — | No | — |
| `emptyState` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | No | — |
| `side` | `"top" \| "bottom" \| "auto"` | `"top"` | No | — |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `name` | `string` | — | No | — |
| `placeholder` | `string` | `"Search"` | No | — |
| `label` | `string` | `"Search"` | No | — |
| `actions` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:chips` | `[chips: string[]]` | — |
| `chipsChange` | `[chips: string[]]` | — |
| `update:query` | `[query: string]` | — |
| `queryChange` | `[query: string]` | — |
| `update:recents` | `[recents: string[]]` | — |
| `recentsChange` | `[recents: string[]]` | — |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `empty` | `() => VNodeChild` | — | — |
| `actions` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Morphing Search

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Morphing Search?**

Configure Morphing Search through items, placeholder, shortcut, iconOnly, emptyMessage, open, defaultOpen. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:open, openChange, queryChange, select to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Expandable Action Bar](https://orvui.efu.me/en/components/blocks/expandable-action-bar): Reveal labels around the active action in a compact row of icon controls.
- [Expandable Tabs](https://orvui.efu.me/en/components/blocks/expandable-tabs): Navigate an icon strip whose selected item expands to display its label.
- [Morphing Tabs](https://orvui.efu.me/en/components/blocks/morphing-tabs): Switch and reorder tabs while their surfaces follow a continuous layout transition.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/morphing-search.json
- Documentation: https://orvui.efu.me/en/components/blocks/morphing-search
- `packages/vue/src/blocks/morphing-search/src/MorphingSearch.vue`
- `packages/vue/src/blocks/morphing-search/src/MorphingSearchChips.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
