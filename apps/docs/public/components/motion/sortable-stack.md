---
title: "Sortable List"
description: "使用指针或键盘重排列表，并提供撤销操作。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/sortable-stack"
markdown: "https://orvui.efu.me/components/motion/sortable-stack.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Sortable List

> 使用指针或键盘重排列表，并提供撤销操作。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Sortable List：使用指针或键盘重排列表，并提供撤销操作。

<a id="install"></a>
## 安装

### Sortable List — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/sortable-stack.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
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
### Sortable List

**复制源码**

```vue
<script setup lang="ts">
import { Circle, FileText, Layers, Palette, Rocket } from "lucide-vue-next";
import { SortableList, SortableListGroup, SortableListItem, SortableListHandle, SortableListItemContent, SortableListUndo } from "@/components/orvui/motion/sortable-stack";
const priorities = [
  { id: "research", title: "Collect references", detail: "Find the right direction", icon: FileText, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: "design", title: "Explore the visual system", detail: "Type, color, and composition", icon: Palette, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { id: "build", title: "Build the first prototype", detail: "Make the interaction tangible", icon: Layers, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { id: "ship", title: "Ship something useful", detail: "Polish the details and release", icon: Rocket, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
];
</script>
<template>
  <div class="w-full max-w-md"><div class="mb-5 flex items-end justify-between gap-4 px-1"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">In the studio</p><h3 class="text-lg font-medium tracking-tight">Make room for what matters.</h3></div><span class="shrink-0 text-xs tabular-nums text-muted-foreground">04 tasks</span></div>
    <SortableList :default-items="priorities" label="Studio priorities" :get-item-label="item => item.title"><template #default="{ items }"><SortableListGroup><SortableListItem v-for="(item, index) in items" :key="item.id" :id="item.id"><SortableListHandle /><SortableListItemContent><div class="flex items-center gap-3"><span :class="['flex size-10 shrink-0 items-center justify-center rounded-xl', item.color]"><component :is="item.icon" :size="18" aria-hidden="true" /></span><div class="min-w-0 flex-1"><p class="text-sm font-medium">{{ item.title }}</p><p class="mt-0.5 text-xs text-muted-foreground">{{ item.detail }}</p></div><span class="text-[10px] tabular-nums text-muted-foreground">{{ String(index + 1).padStart(2, '0') }}</span><Circle :size="14" class="text-border" aria-hidden="true" /></div></SortableListItemContent></SortableListItem></SortableListGroup><SortableListUndo /></template></SortableList>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { Circle, FileText, Layers, Palette, Rocket } from "lucide-vue-next";
import { SortableList, SortableListGroup, SortableListItem, SortableListHandle, SortableListItemContent, SortableListUndo } from "@orvui/vue/motion/sortable-stack";
const priorities = [
  { id: "research", title: "Collect references", detail: "Find the right direction", icon: FileText, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: "design", title: "Explore the visual system", detail: "Type, color, and composition", icon: Palette, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { id: "build", title: "Build the first prototype", detail: "Make the interaction tangible", icon: Layers, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { id: "ship", title: "Ship something useful", detail: "Polish the details and release", icon: Rocket, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
];
</script>
<template>
  <div class="w-full max-w-md"><div class="mb-5 flex items-end justify-between gap-4 px-1"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">In the studio</p><h3 class="text-lg font-medium tracking-tight">Make room for what matters.</h3></div><span class="shrink-0 text-xs tabular-nums text-muted-foreground">04 tasks</span></div>
    <SortableList :default-items="priorities" label="Studio priorities" :get-item-label="item => item.title"><template #default="{ items }"><SortableListGroup><SortableListItem v-for="(item, index) in items" :key="item.id" :id="item.id"><SortableListHandle /><SortableListItemContent><div class="flex items-center gap-3"><span :class="['flex size-10 shrink-0 items-center justify-center rounded-xl', item.color]"><component :is="item.icon" :size="18" aria-hidden="true" /></span><div class="min-w-0 flex-1"><p class="text-sm font-medium">{{ item.title }}</p><p class="mt-0.5 text-xs text-muted-foreground">{{ item.detail }}</p></div><span class="text-[10px] tabular-nums text-muted-foreground">{{ String(index + 1).padStart(2, '0') }}</span><Circle :size="14" class="text-border" aria-hidden="true" /></div></SortableListItemContent></SortableListItem></SortableListGroup><SortableListUndo /></template></SortableList>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `SortableList` | `v-model` | `any[]` | `update:modelValue` |
| `SortableList` | `v-model:items` | `any[]` | `update:items` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### SortableList

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `any[]` | — | 否 | — |
| `items` | `any[]` | `model.value` | 否 | — |
| `defaultItems` | `any[]` | `() => []` | 否 | — |
| `getItemLabel` | `(item: any) => string` | — | 否 | — |
| `label` | `string` | `"Sortable items"` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `showUndo` | `boolean` | `true` | 否 | — |
| `itemClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `update:items` | — | — |
| `itemsChange` | — | — |
| `change` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `items: items`, `move-item: move`, `undo: undo` | — |
| `item` | — | `item: item`, `index: index` | — |

### SortableListGroup

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SortableListItem

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | `string` | — | 是 | — |
| `label` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SortableListHandle

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SortableListItemContent

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SortableListUndo

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Sortable List

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Sortable List？**

通过 modelValue、items、defaultItems、getItemLabel、label、disabled、showUndo、itemClassName 配置 Sortable List；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、update:items、itemsChange、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Date Range Picker](https://orvui.efu.me/components/motion/date-range-picker): 在行内或浮动日历中选择日期区间的起点与终点。
- [Animated Color Selector](https://orvui.efu.me/components/motion/color-selector): 用移动选择轮廓与原生单选行为选择命名色块。
- [Image Viewer](https://orvui.efu.me/components/motion/image-viewer): 从缩略图打开画廊图片，在大图中切换、缩放或平移。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/sortable-stack.json
- 文档: https://orvui.efu.me/components/motion/sortable-stack
- `packages/vue/src/motion/sortable-stack/src/SortableList.vue`
- `packages/vue/src/motion/sortable-stack/src/SortableListGroup.vue`
- `packages/vue/src/motion/sortable-stack/src/SortableListItem.vue`
- `packages/vue/src/motion/sortable-stack/src/SortableListHandle.vue`
- `packages/vue/src/motion/sortable-stack/src/SortableListItemContent.vue`
- `packages/vue/src/motion/sortable-stack/src/SortableListUndo.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
