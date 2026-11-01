---
title: "Expandable Control"
description: "展开紧凑控件以显示标签或尾部操作，保持原位置联系。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/expandable-control"
markdown: "https://orvui.efu.me/components/motion/expandable-control.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Expandable Control

> 展开紧凑控件以显示标签或尾部操作，保持原位置联系。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Expandable Control：展开紧凑控件以显示标签或尾部操作，保持原位置联系。

<a id="install"></a>
## 安装

### Expandable Control — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/expandable-control.json
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
### Expandable Control

**复制源码**

```vue
<script setup lang="ts">
import { Bell, X } from "lucide-vue-next";
import { ExpandableButton, ExpandableChip } from "@/components/orvui/motion/expandable-control";
const notificationLabel = "Notifications";
</script>
<template><div class="flex flex-col items-center gap-6">
  <div class="flex items-center gap-2"><ExpandableButton :label="notificationLabel"><template #icon><Bell class="size-4" /></template></ExpandableButton></div>
  <div class="flex items-center gap-2"><ExpandableChip label="Vue" action-label="Remove Vue"><template #actionIcon><X class="size-3.5" /></template></ExpandableChip></div>
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { Bell, X } from "lucide-vue-next";
import { ExpandableButton, ExpandableChip } from "@orvui/vue/motion/expandable-control";
const notificationLabel = "Notifications";
</script>
<template><div class="flex flex-col items-center gap-6">
  <div class="flex items-center gap-2"><ExpandableButton :label="notificationLabel"><template #icon><Bell class="size-4" /></template></ExpandableButton></div>
  <div class="flex items-center gap-2"><ExpandableChip label="Vue" action-label="Remove Vue"><template #actionIcon><X class="size-3.5" /></template></ExpandableChip></div>
</div></template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `ExpandableButton` | `v-model:expanded` | `boolean` | `update:expanded` |
| `ExpandableChip` | `v-model:expanded` | `boolean` | `update:expanded` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### ExpandableButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `expanded` | `boolean` | `undefined` | 否 | — |
| `defaultExpanded` | `boolean` | `false` | 否 | — |
| `icon` | `any` | — | 否 | — |
| `label` | `string` | `"Create new"` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:expanded` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `icon` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

### ExpandableChip

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `expanded` | `boolean` | `undefined` | 否 | — |
| `defaultExpanded` | `boolean` | `false` | 否 | — |
| `label` | `string` | — | 是 | — |
| `actionIcon` | `any` | — | 否 | — |
| `actionLabel` | `string` | `"Remove"` | 否 | — |
| `collapseOnAction` | `boolean` | `true` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `labelClassName` | `string` | — | 否 | — |
| `actionClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:expanded` | — | — |
| `action` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `actionIcon` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Expandable Control

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Expandable Control？**

通过 expanded、defaultExpanded、icon、label、disabled、type 配置 Expandable Control；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:expanded，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Popover](https://orvui.efu.me/components/motion/popover): 将浮动表面连接到触发器，支持常规过渡与连续变形过渡。
- [Theme Toggle](https://orvui.efu.me/components/motion/theme-toggle): 通过圆形、矩形或百叶窗过渡揭示新的页面主题。
- [Card](https://orvui.efu.me/components/motion/card): 组合标题、正文、操作和页脚形成卡片，也可加入选择状态。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/expandable-control.json
- 文档: https://orvui.efu.me/components/motion/expandable-control
- `packages/vue/src/motion/expandable-control/src/ExpandableButton.vue`
- `packages/vue/src/motion/expandable-control/src/ExpandableChip.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
