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

# Marquee

> 连续重复水平或垂直内容带，并可在悬停时暂停。

## 安装

### Marquee — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/marquee.json
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
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

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

## 关于 Marquee

连续重复水平或垂直内容带，并可在悬停时暂停。

### 适用场景

- 当界面需要以下行为时使用 Marquee：连续重复水平或垂直内容带，并可在悬停时暂停。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Marquee？**

通过 direction、speed、pauseOnHover、gap、fade 配置 Marquee；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过文档中的组合方式提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/marquee.json
- 文档: https://orvui.efu.me/components/motion/marquee
- `packages/vue/src/motion/marquee/src/Marquee.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
