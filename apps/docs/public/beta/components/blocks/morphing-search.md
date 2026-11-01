---
title: "Morphing Search"
description: "将搜索框展开为建议、最近记录或可编辑筛选标签。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/morphing-search"
markdown: "https://orvui.efu.me/components/blocks/morphing-search.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Morphing Search

> 将搜索框展开为建议、最近记录或可编辑筛选标签。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Morphing Search：将搜索框展开为建议、最近记录或可编辑筛选标签。

<a id="install"></a>
## 安装

### Morphing Search — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/morphing-search.json
```

### Chip Search — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/morphing-search-chips.json
```

### Morphing Search — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/morphing-search.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

安装本地 Beta 归档，制作方法见 Beta 安装指南。

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
```

```bash
pnpm add lucide-vue-next@^0.468.0
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Morphing Search

**复制源码**

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

**组件包**

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

将提交的词语转换为可移除标签，搜索表面围绕标签展开。

**复制源码**

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

**组件包**

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

通过指针或键盘，从输入框或紧凑触发器打开较大的搜索表面。

**复制源码**

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

**组件包**

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
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `MorphingSearch` | `v-model:open` | `boolean` | `update:open` |
| `MorphingSearchChips` | `v-model:chips` | `string[]` | `update:chips` |
| `MorphingSearchChips` | `v-model:query` | `string` | `update:query` |
| `MorphingSearchChips` | `v-model:recents` | `string[]` | `update:recents` |
| `MorphingSearchChips` | `v-model:open` | `boolean` | `update:open` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### MorphingSearch

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `MorphingSearchItem[]` | — | 是 | — |
| `placeholder` | `string` | `"Search"` | 否 | — |
| `shortcut` | `string` | `"f"` | 否 | — |
| `iconOnly` | `boolean` | `false` | 否 | — |
| `emptyMessage` | `string` | `"No results found."` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |
| `queryChange` | `[query: string]` | — |
| `select` | `[item: MorphingSearchItem]` | — |

### MorphingSearchChips

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `chips` | `string[]` | — | 否 | — |
| `defaultChips` | `string[]` | `() => []` | 否 | — |
| `query` | `string` | — | 否 | — |
| `defaultQuery` | `string` | `""` | 否 | — |
| `recents` | `string[]` | `localRecents.value` | 否 | — |
| `defaultRecents` | `string[]` | `() => []` | 否 | — |
| `storageKey` | `string` | — | 否 | — |
| `maxRecents` | `number` | `5` | 否 | — |
| `suggestions` | `string[]` | `() => []` | 否 | — |
| `filter` | `false \| (term: string, query: string) => boolean` | `undefined` | 否 | — |
| `maxSuggestions` | `number` | `6` | 否 | — |
| `loading` | `boolean` | `false` | 否 | — |
| `maxChips` | `number` | — | 否 | — |
| `normalize` | `(term: string) => string \| null` | — | 否 | — |
| `emptyState` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | 否 | — |
| `side` | `"top" \| "bottom" \| "auto"` | `"top"` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `name` | `string` | — | 否 | — |
| `placeholder` | `string` | `"Search"` | 否 | — |
| `label` | `string` | `"Search"` | 否 | — |
| `actions` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:chips` | `[chips: string[]]` | — |
| `chipsChange` | `[chips: string[]]` | — |
| `update:query` | `[query: string]` | — |
| `queryChange` | `[query: string]` | — |
| `update:recents` | `[recents: string[]]` | — |
| `recentsChange` | `[recents: string[]]` | — |
| `update:open` | `[open: boolean]` | — |
| `openChange` | `[open: boolean]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `empty` | `() => VNodeChild` | — | — |
| `actions` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Morphing Search

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Morphing Search？**

通过 items、placeholder、shortcut、iconOnly、emptyMessage、open、defaultOpen 配置 Morphing Search；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open、openChange、queryChange、select，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Expandable Action Bar](https://orvui.efu.me/components/blocks/expandable-action-bar): 在紧凑图标操作行中，为当前活动操作展开标签。
- [Expandable Tabs](https://orvui.efu.me/components/blocks/expandable-tabs): 在图标条中导航，选中项展开以显示标签。
- [Morphing Tabs](https://orvui.efu.me/components/blocks/morphing-tabs): 在连续布局过渡中切换标签页并调整其排列顺序。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/morphing-search.json
- 文档: https://orvui.efu.me/components/blocks/morphing-search
- `packages/vue/src/blocks/morphing-search/src/MorphingSearch.vue`
- `packages/vue/src/blocks/morphing-search/src/MorphingSearchChips.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
