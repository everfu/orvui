---
title: "Expandable Control"
description: "展开紧凑控件以显示标签或尾部操作，保持原位置联系。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/expandable-control"
markdown: "https://orvui.efu.me/components/motion/expandable-control.md"
license: "MIT"
productVersion: "0.1.0"
---

# Expandable Control

> 展开紧凑控件以显示标签或尾部操作，保持原位置联系。

## 安装

### Expandable Control — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/expandable-control.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

npm 发布后使用下方命令；发布前可安装验证后的本地归档。

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

## 依赖

- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

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

## 关于 Expandable Control

展开紧凑控件以显示标签或尾部操作，保持原位置联系。

### 适用场景

- 当界面需要以下行为时使用 Expandable Control：展开紧凑控件以显示标签或尾部操作，保持原位置联系。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Expandable Control？**

通过 expanded、defaultExpanded、icon、label、disabled、type 配置 Expandable Control；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:expanded，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/expandable-control.json
- 文档: https://orvui.efu.me/components/motion/expandable-control
- `packages/vue/src/motion/expandable-control/src/ExpandableButton.vue`
- `packages/vue/src/motion/expandable-control/src/ExpandableChip.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
