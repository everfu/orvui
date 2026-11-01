---
title: "Combobox"
description: "通过输入框筛选分组选项，键盘焦点保持在输入区域。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/combobox"
markdown: "https://orvui.efu.me/components/motion/combobox.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Combobox

> 通过输入框筛选分组选项，键盘焦点保持在输入区域。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Combobox：通过输入框筛选分组选项，键盘焦点保持在输入区域。

<a id="install"></a>
## 安装

### Combobox — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/combobox.json
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
### Combobox

**复制源码**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { Blocks, Box, Component, Layers3 } from "lucide-vue-next";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxSeparator,
  ComboboxLabel,
  ComboboxItem,
} from "@/components/orvui/motion/combobox";
const selected = ref("studio");
const workspaces = [
  {
    value: "studio",
    label: "Design studio",
    detail: "12 projects",
    group: "Recent",
    icon: Component,
    color: "bg-amber-400/20 text-amber-700 dark:text-amber-300",
  },
  {
    value: "product",
    label: "Product team",
    detail: "8 projects",
    group: "Recent",
    icon: Layers3,
    color: "bg-sky-400/20 text-sky-700 dark:text-sky-300",
  },
  {
    value: "playground",
    label: "Playground",
    detail: "24 experiments",
    group: "Workspaces",
    icon: Blocks,
    color: "bg-emerald-400/20 text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "archive",
    label: "Component archive",
    detail: "41 components",
    group: "Workspaces",
    icon: Box,
    color: "bg-rose-400/20 text-rose-700 dark:text-rose-300",
  },
];
const groups = computed(() =>
  ["Recent", "Workspaces"].map((label) => ({
    label,
    items: workspaces.filter((item) => item.group === label),
  })),
);
</script>
<template>
  <div class="w-full max-w-72">
    <p class="mb-2 text-xs font-medium text-muted-foreground">Workspace</p>
    <Combobox v-model="selected"
      ><ComboboxTrigger class="h-12 rounded-2xl px-2.5"
        ><ComboboxInput
          aria-label="Search workspaces"
          placeholder="Search workspaces…" /></ComboboxTrigger
      ><ComboboxContent class="w-72 rounded-2xl"
        ><ComboboxList aria-label="Workspaces" class="p-2"
          ><ComboboxEmpty>No workspaces found.</ComboboxEmpty
          ><ComboboxGroup v-for="(group, index) in groups" :key="group.label"
            ><ComboboxSeparator v-if="index" /><ComboboxLabel>{{
              group.label
            }}</ComboboxLabel
            ><ComboboxItem
              v-for="workspace in group.items"
              :key="workspace.value"
              :value="workspace.value"
              :text-value="workspace.label"
              :keywords="[workspace.detail, workspace.group]"
              class="py-2"
              ><span class="flex min-w-0 items-center gap-2.5"
                ><span
                  :class="[
                    'grid size-7 shrink-0 place-items-center rounded-lg',
                    workspace.color,
                  ]"
                  ><component :is="workspace.icon" class="size-3.5" /></span
                ><span class="min-w-0"
                  ><span class="block truncate font-medium text-foreground">{{
                    workspace.label
                  }}</span
                  ><span class="block truncate text-xs text-muted-foreground">{{
                    workspace.detail
                  }}</span></span
                ></span
              ></ComboboxItem
            ></ComboboxGroup
          ></ComboboxList
        ></ComboboxContent
      ></Combobox
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { Blocks, Box, Component, Layers3 } from "lucide-vue-next";
import { Combobox, ComboboxTrigger, ComboboxInput, ComboboxContent, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxSeparator, ComboboxLabel, ComboboxItem } from "@orvui/vue/motion/combobox";
const selected = ref("studio");
const workspaces = [
  {
    value: "studio",
    label: "Design studio",
    detail: "12 projects",
    group: "Recent",
    icon: Component,
    color: "bg-amber-400/20 text-amber-700 dark:text-amber-300",
  },
  {
    value: "product",
    label: "Product team",
    detail: "8 projects",
    group: "Recent",
    icon: Layers3,
    color: "bg-sky-400/20 text-sky-700 dark:text-sky-300",
  },
  {
    value: "playground",
    label: "Playground",
    detail: "24 experiments",
    group: "Workspaces",
    icon: Blocks,
    color: "bg-emerald-400/20 text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "archive",
    label: "Component archive",
    detail: "41 components",
    group: "Workspaces",
    icon: Box,
    color: "bg-rose-400/20 text-rose-700 dark:text-rose-300",
  },
];
const groups = computed(() =>
  ["Recent", "Workspaces"].map((label) => ({
    label,
    items: workspaces.filter((item) => item.group === label),
  })),
);
</script>
<template>
  <div class="w-full max-w-72">
    <p class="mb-2 text-xs font-medium text-muted-foreground">Workspace</p>
    <Combobox v-model="selected"
      ><ComboboxTrigger class="h-12 rounded-2xl px-2.5"
        ><ComboboxInput
          aria-label="Search workspaces"
          placeholder="Search workspaces…" /></ComboboxTrigger
      ><ComboboxContent class="w-72 rounded-2xl"
        ><ComboboxList aria-label="Workspaces" class="p-2"
          ><ComboboxEmpty>No workspaces found.</ComboboxEmpty
          ><ComboboxGroup v-for="(group, index) in groups" :key="group.label"
            ><ComboboxSeparator v-if="index" /><ComboboxLabel>{{
              group.label
            }}</ComboboxLabel
            ><ComboboxItem
              v-for="workspace in group.items"
              :key="workspace.value"
              :value="workspace.value"
              :text-value="workspace.label"
              :keywords="[workspace.detail, workspace.group]"
              class="py-2"
              ><span class="flex min-w-0 items-center gap-2.5"
                ><span
                  :class="[
                    'grid size-7 shrink-0 place-items-center rounded-lg',
                    workspace.color,
                  ]"
                  ><component :is="workspace.icon" class="size-3.5" /></span
                ><span class="min-w-0"
                  ><span class="block truncate font-medium text-foreground">{{
                    workspace.label
                  }}</span
                  ><span class="block truncate text-xs text-muted-foreground">{{
                    workspace.detail
                  }}</span></span
                ></span
              ></ComboboxItem
            ></ComboboxGroup
          ></ComboboxList
        ></ComboboxContent
      ></Combobox
    >
  </div>
</template>
```

## 组件指南

<a id="composition"></a>
### 组合结构

使用公开部件 Combobox, ComboboxTrigger, ComboboxInput, ComboboxContent, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxSeparator, ComboboxLabel, ComboboxItem 组合 Combobox，并从该组件的公开入口导入。

```text
Combobox
├── ComboboxTrigger
│   └── ComboboxInput
└── ComboboxContent
    └── ComboboxList
        ├── ComboboxEmpty
        ├── ComboboxGroup
        │   ├── ComboboxLabel
        │   └── ComboboxItem
        └── ComboboxSeparator
```

<a id="behavior"></a>
### 工作方式

通过输入框筛选分组选项，键盘焦点保持在输入区域。

### 生命周期

#### 初始化

通过 modelValue、defaultValue、open、defaultOpen、query、defaultQuery、disabled、filter 配置 Combobox；API 表列出其类型与默认值。

#### 更新

监听 update:modelValue、change、update:open、update:query，将组件连接到应用状态。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 Combobox 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 Combobox, ComboboxTrigger, ComboboxInput, ComboboxContent, ComboboxList, ComboboxEmpty, ComboboxGroup, ComboboxSeparator, ComboboxLabel, ComboboxItem，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

### 能力边界

- 负责: Combobox 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 Combobox：通过输入框筛选分组选项，键盘焦点保持在输入区域。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `Combobox` | `v-model` | `string` | `update:modelValue` |
| `Combobox` | `v-model:open` | `boolean` | `update:open` |
| `Combobox` | `v-model:query` | `string` | `update:query` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### Combobox

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | — | 否 | — |
| `defaultValue` | `string` | `(multiple ? [] : undefined)` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `query` | `string` | — | 否 | — |
| `defaultQuery` | `string` | `""` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `filter` | `(value: string, query: string, keywords: string[]) => boolean` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `update:open` | — | — |
| `update:query` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value`, `open: state.open.value`, `query: state.query.value` | — |

### ComboboxTrigger

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ComboboxInput

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Search…"` | 否 | — |
| `wrapperClassName` | `string` | — | 否 | — |
| `showIcon` | `boolean` | `true` | 否 | — |

### ComboboxContent

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom"` | `"bottom"` | 否 | — |
| `align` | `"start" \| "center" \| "end"` | `"start"` | 否 | — |
| `sideOffset` | `number` | `6` | 否 | — |
| `avoidCollisions` | `boolean` | `true` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ComboboxList

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `"Options"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ComboboxEmpty

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ComboboxGroup

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ComboboxSeparator

### ComboboxLabel

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ComboboxItem

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | 是 | — |
| `textValue` | `string` | — | 否 | — |
| `label` | `string` | — | 否 | — |
| `keywords` | `string[]` | `() => []` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `select` | `[value: string]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Combobox

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Combobox？**

通过 modelValue、defaultValue、open、defaultOpen、query、defaultQuery、disabled、filter 配置 Combobox；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change、update:open、update:query，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Multi Select](https://orvui.efu.me/components/motion/multi-select): 在可搜索控件中选择多个选项，并管理生成的标签。
- [Sortable List](https://orvui.efu.me/components/motion/sortable-stack): 使用指针或键盘重排列表，并提供撤销操作。
- [Image Viewer](https://orvui.efu.me/components/motion/image-viewer): 从缩略图打开画廊图片，在大图中切换、缩放或平移。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/combobox.json
- 文档: https://orvui.efu.me/components/motion/combobox
- `packages/vue/src/motion/combobox/src/Combobox.vue`
- `packages/vue/src/motion/combobox/src/ComboboxTrigger.vue`
- `packages/vue/src/motion/combobox/src/ComboboxInput.vue`
- `packages/vue/src/motion/combobox/src/ComboboxContent.vue`
- `packages/vue/src/motion/combobox/src/ComboboxList.vue`
- `packages/vue/src/motion/combobox/src/ComboboxEmpty.vue`
- `packages/vue/src/motion/combobox/src/ComboboxGroup.vue`
- `packages/vue/src/motion/combobox/src/ComboboxSeparator.vue`
- `packages/vue/src/motion/combobox/src/ComboboxLabel.vue`
- `packages/vue/src/motion/combobox/src/ComboboxItem.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
