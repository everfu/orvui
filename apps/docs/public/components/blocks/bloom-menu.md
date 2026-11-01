---
title: "Bloom Menu"
description: "围绕共同中心展开一组操作，并在关闭时恢复焦点。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/bloom-menu"
markdown: "https://orvui.efu.me/components/blocks/bloom-menu.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Bloom Menu

> 围绕共同中心展开一组操作，并在关闭时恢复焦点。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Bloom Menu：围绕共同中心展开一组操作，并在关闭时恢复焦点。

<a id="install"></a>
## 安装

### Bloom Menu — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/bloom-menu.json
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
### Bloom Menu

**复制源码**

```vue
<script setup lang="ts">
import {
  FileText,
  LayoutGrid,
  Table,
  FolderClosed,
  Bell,
  Link,
} from "lucide-vue-next";
import { BloomMenu, type BloomMenuItem } from "@/components/orvui/blocks/bloom-menu";
const entries: BloomMenuItem[] = [
  { label: "Note", icon: FileText },
  { label: "Canvas", icon: LayoutGrid },
  { label: "Grid", icon: Table },
  { label: "Space", icon: FolderClosed },
  { label: "Alert", icon: Bell },
  { label: "URL", icon: Link },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center pt-24">
    <BloomMenu :items="entries" />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import {
  FileText,
  LayoutGrid,
  Table,
  FolderClosed,
  Bell,
  Link,
} from "lucide-vue-next";
import { BloomMenu, type BloomMenuItem } from "@orvui/vue/blocks/bloom-menu";
const entries: BloomMenuItem[] = [
  { label: "Note", icon: FileText },
  { label: "Canvas", icon: LayoutGrid },
  { label: "Grid", icon: Table },
  { label: "Space", icon: FolderClosed },
  { label: "Alert", icon: Bell },
  { label: "URL", icon: Link },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center pt-24">
    <BloomMenu :items="entries" />
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### BloomMenu

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `BloomMenuItem[]` | `() => [ { label: "Doc", icon: FileText }, { label: "Board", icon: LayoutGrid }, { label: "Table", icon: Table }, { label: "Folder", icon: FolderClosed }, { label: "Reminder", icon: Bell }, { label: "Link", icon: Link }, ]` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `select` | `[label: string]` | — |

<a id="about"></a>
## 关于 Bloom Menu

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Bloom Menu？**

通过 items、className 配置 Bloom Menu；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 select，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Expandable Tabs](https://orvui.efu.me/components/blocks/expandable-tabs): 在图标条中导航，选中项展开以显示标签。
- [Expandable Action Bar](https://orvui.efu.me/components/blocks/expandable-action-bar): 在紧凑图标操作行中，为当前活动操作展开标签。
- [Overflow Actions](https://orvui.efu.me/components/blocks/overflow-actions): 展开紧凑操作轨道，展示静止宽度下无法容纳的控件。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/bloom-menu.json
- 文档: https://orvui.efu.me/components/blocks/bloom-menu
- `packages/vue/src/blocks/bloom-menu/src/BloomMenu.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
