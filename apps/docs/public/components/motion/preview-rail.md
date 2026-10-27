---
title: "Preview Rail"
description: "在紧凑导航轨道中预览目标，焦点项目附近的刻度随之展开。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/preview-rail"
markdown: "https://orvui.efu.me/components/motion/preview-rail.md"
license: "MIT"
productVersion: "0.1.0"
---

# Preview Rail

> 在紧凑导航轨道中预览目标，焦点项目附近的刻度随之展开。

## 安装

### Preview Rail — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/preview-rail.json
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

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### Preview Rail

**复制源码**

```vue
<script setup lang="ts">
import { PreviewRail } from "@/components/orvui/motion/preview-rail";
const sections = [
  ["dashboard", "Dashboard", "Return to your workspace overview and recent activity."],
  ["components", "Components", "Browse motion primitives for Vue."],
  ["blocks", "Blocks", "Explore composed, product-ready interface blocks."],
  ["playground", "Playground", "Tune motion values and preview behavior live."],
  ["docs", "Documentation", "Read installation, usage, and API reference notes."],
  ["changelog", "Changelog", "Review newly launched components and improvements."],
  ["source", "Open source", "Explore the component source and implementation notes."],
  ["patterns", "Patterns", "Combine components in reusable interface patterns."],
  ["examples", "Examples", "See components composed in practical interface patterns."],
  ["templates", "Templates", "Start from polished layouts built with orvui components."],
  ["guides", "Guides", "Learn how to combine motion primitives effectively."],
  ["community", "Community", "Discover what other builders are creating with orvui."],
  ["github", "GitHub", "View the source, report issues, and contribute improvements."],
  ["about", "About", "Learn more about the ideas and people behind orvui."],
].map(([id, label, description]) => ({ id, label, description, href: `#${id}` }));
</script>
<template><div class="flex w-full flex-col gap-8"><PreviewRail v-for="orientation in ['vertical', 'horizontal'] as const" :key="orientation" :items="sections" :orientation="orientation" default-active-id="docs" :class="['mx-auto w-full max-w-2xl', orientation === 'vertical' ? 'h-[360px]' : 'h-[280px]']" /></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { PreviewRail } from "@orvui/vue/motion/preview-rail";
const sections = [
  ["dashboard", "Dashboard", "Return to your workspace overview and recent activity."],
  ["components", "Components", "Browse motion primitives for Vue."],
  ["blocks", "Blocks", "Explore composed, product-ready interface blocks."],
  ["playground", "Playground", "Tune motion values and preview behavior live."],
  ["docs", "Documentation", "Read installation, usage, and API reference notes."],
  ["changelog", "Changelog", "Review newly launched components and improvements."],
  ["source", "Open source", "Explore the component source and implementation notes."],
  ["patterns", "Patterns", "Combine components in reusable interface patterns."],
  ["examples", "Examples", "See components composed in practical interface patterns."],
  ["templates", "Templates", "Start from polished layouts built with orvui components."],
  ["guides", "Guides", "Learn how to combine motion primitives effectively."],
  ["community", "Community", "Discover what other builders are creating with orvui."],
  ["github", "GitHub", "View the source, report issues, and contribute improvements."],
  ["about", "About", "Learn more about the ideas and people behind orvui."],
].map(([id, label, description]) => ({ id, label, description, href: `#${id}` }));
</script>
<template><div class="flex w-full flex-col gap-8"><PreviewRail v-for="orientation in ['vertical', 'horizontal'] as const" :key="orientation" :items="sections" :orientation="orientation" default-active-id="docs" :class="['mx-auto w-full max-w-2xl', orientation === 'vertical' ? 'h-[360px]' : 'h-[280px]']" /></div></template>
```

## API 参考

### PreviewRail

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `RailItem[]` | — | 是 | — |
| `label` | `string` | `"Section navigation"` | 否 | — |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | 否 | — |
| `activeId` | `string` | — | 否 | — |
| `defaultActiveId` | `string` | `props.items[0]?.id` | 否 | — |
| `showPreview` | `boolean` | `true` | 否 | — |
| `previewSide` | `"before" \| "after"` | `"after"` | 否 | — |
| `highlightActive` | `boolean` | `false` | 否 | — |
| `itemSize` | `number` | `24` | 否 | — |
| `railClassName` | `string` | — | 否 | — |
| `previewContainerClassName` | `string` | — | 否 | — |
| `previewClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:activeId` | `[id: string]` | — |
| `activeChange` | `[id: string]` | — |
| `itemSelect` | `[item: RailItem]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `preview` | — | `item: item` | — |
| `default` | `() => VNodeChild` | — | — |

## 关于 Preview Rail

在紧凑导航轨道中预览目标，焦点项目附近的刻度随之展开。

### 适用场景

- 当界面需要以下行为时使用 Preview Rail：在紧凑导航轨道中预览目标，焦点项目附近的刻度随之展开。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Preview Rail？**

通过 items、label、orientation、activeId、defaultActiveId、showPreview、previewSide、highlightActive、itemSize、railClassName、previewContainerClassName、previewClassName 配置 Preview Rail；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:activeId、activeChange、itemSelect，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/preview-rail.json
- 文档: https://orvui.efu.me/components/motion/preview-rail
- `packages/vue/src/motion/preview-rail/src/PreviewRail.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
