# Shared Layout Background · orvui 0.1.1

## 选择与组合

在已有结构上增加动效：文字变化、共享选中背景或滚动反馈按需组合，并为减少动态效果保留清晰的静态状态。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Shared Layout Background"
description: "在注册选项之间移动同一个背景表面，表示当前选择。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/shared-layout-bg"
markdown: "https://orvui.efu.me/components/motion/shared-layout-bg.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Shared Layout Background

> 在注册选项之间移动同一个背景表面，表示当前选择。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Shared Layout Background：在注册选项之间移动同一个背景表面，表示当前选择。

<a id="install"></a>
## 安装

### Shared Layout Background — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/shared-layout-bg.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Shared Layout Background

**复制源码**

```vue
<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import { SharedLayoutBg } from "@/components/orvui/motion/shared-layout-bg";
const entries = [
  { title: "Inbox", body: "12 unread threads and 3 mentions today." }, { title: "Drafts", body: "4 posts are ready for a final review." },
  { title: "Releases", body: "Version 0.4.1 was released 2 days ago." }, { title: "Billing", body: "Your plan renews on the first next month." },
];
</script>
<template><div class="w-full max-w-lg px-2"><SharedLayoutBg>
  <button v-for="entry in entries" :key="entry.title" type="button" class="group flex flex-col gap-1 px-2 py-3 text-left"><div class="flex items-center justify-between gap-3"><span class="text-sm font-medium text-foreground">{{ entry.title }}</span><ArrowUpRight class="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div><p class="text-sm text-muted-foreground">{{ entry.body }}</p></button>
</SharedLayoutBg></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import { SharedLayoutBg } from "@orvui/vue/motion/shared-layout-bg";
const entries = [
  { title: "Inbox", body: "12 unread threads and 3 mentions today." }, { title: "Drafts", body: "4 posts are ready for a final review." },
  { title: "Releases", body: "Version 0.4.1 was released 2 days ago." }, { title: "Billing", body: "Your plan renews on the first next month." },
];
</script>
<template><div class="w-full max-w-lg px-2"><SharedLayoutBg>
  <button v-for="entry in entries" :key="entry.title" type="button" class="group flex flex-col gap-1 px-2 py-3 text-left"><div class="flex items-center justify-between gap-3"><span class="text-sm font-medium text-foreground">{{ entry.title }}</span><ArrowUpRight class="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div><p class="text-sm text-muted-foreground">{{ entry.body }}</p></button>
</SharedLayoutBg></div></template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### SharedLayoutBg

<a id="about"></a>
## 关于 Shared Layout Background

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Shared Layout Background？**

Shared Layout Background 通过插槽与原生元素属性组合。

**如何连接到应用状态？**

通过文档中的组合方式提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Preview Rail](https://orvui.efu.me/components/motion/preview-rail): 在紧凑导航轨道中预览目标，焦点项目附近的刻度随之展开。
- [Dock](https://orvui.efu.me/components/motion/dock): 将紧凑导航操作分组，由指示器跟随当前活动项目。
- [Scroll Animation](https://orvui.efu.me/components/motion/scroll-animation): 将滚动与进度、视差、内容出现效果及主动定位连接。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/shared-layout-bg.json
- 文档: https://orvui.efu.me/components/motion/shared-layout-bg
- `packages/vue/src/motion/shared-layout-bg/src/SharedLayoutBg.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

