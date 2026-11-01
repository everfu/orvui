---
title: "Marquee"
description: "连续重复水平或垂直内容带，并可在悬停时暂停。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/marquee"
markdown: "https://orvui.efu.me/components/motion/marquee.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Marquee

> 连续重复水平或垂直内容带，并可在悬停时暂停。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Marquee：连续重复水平或垂直内容带，并可在悬停时暂停。

<a id="install"></a>
## 安装

### Marquee — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/marquee.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `clsx@^2.1.1`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Marquee

**复制源码**

```vue
<script setup lang="ts">
import { Marquee } from "@/components/orvui/motion/marquee";
const names = "Vercel,Linear,Stripe,Figma,GitHub,Notion,Loom,Raycast".split(",");
</script>
<template>
  <div class="w-full"><Marquee :speed="25">
    <div v-for="name in names" :key="name" class="mx-4 flex h-12 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground">{{ name }}</div>
  </Marquee></div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { Marquee } from "@orvui/vue/motion/marquee";
const names = "Vercel,Linear,Stripe,Figma,GitHub,Notion,Loom,Raycast".split(",");
</script>
<template>
  <div class="w-full"><Marquee :speed="25">
    <div v-for="name in names" :key="name" class="mx-4 flex h-12 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground">{{ name }}</div>
  </Marquee></div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### Marquee

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `direction` | `"left" \| "right" \| "up" \| "down"` | `"left"` | 否 | — |
| `speed` | `number` | `30` | 否 | — |
| `pauseOnHover` | `boolean` | `true` | 否 | — |
| `gap` | `string` | `"1rem"` | 否 | — |
| `fade` | `boolean` | `true` | 否 | — |

<a id="about"></a>
## 关于 Marquee

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Marquee？**

通过 direction、speed、pauseOnHover、gap、fade 配置 Marquee；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过文档中的组合方式提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Cylinder Carousel](https://orvui.efu.me/components/motion/cylinder-carousel): 将画廊项目排列在凹面或凸面圆柱上，并通过拖动控制。
- [Tilt Card](https://orvui.efu.me/components/motion/tilt-card): 让卡片朝指针方向倾斜，并在表面移动高光。
- [Theme Toggle](https://orvui.efu.me/components/motion/theme-toggle): 通过圆形、矩形或百叶窗过渡揭示新的页面主题。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/marquee.json
- 文档: https://orvui.efu.me/components/motion/marquee
- `packages/vue/src/motion/marquee/src/Marquee.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
