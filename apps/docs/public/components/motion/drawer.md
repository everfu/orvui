---
title: "Drawer"
description: "从视口左右一侧呈现对话框，并管理焦点与背景滚动。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/drawer"
markdown: "https://orvui.efu.me/components/motion/drawer.md"
license: "MIT"
productVersion: "0.1.0"
---

# Drawer

> 从视口左右一侧呈现对话框，并管理焦点与背景滚动。

从视口左右一侧呈现对话框，并管理焦点与背景滚动。

## 适用场景

- 当界面需要以下行为时使用 Drawer：从视口左右一侧呈现对话框，并管理焦点与背景滚动。

## 安装

### Drawer — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/drawer.json
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

### Drawer

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Drawer } from "@/components/orvui/motion/drawer";
const open = ref(false), side = ref<"left" | "right">("right");
function reveal(edge: "left" | "right") { side.value = edge; open.value = true; }
</script>
<template><div class="flex items-center gap-3">
  <button type="button" @click="reveal('left')" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-card/70">Open left</button>
  <button type="button" @click="reveal('right')" class="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Open right</button>
  <Drawer v-model:open="open" :side="side" aria-label="Demo drawer" class="gap-4 p-6"><h2 class="text-sm font-semibold text-foreground">Drawer</h2><p class="text-sm text-muted-foreground">Enter from the {{ side }} edge. Use Escape or the backdrop to dismiss.</p><button type="button" @click="open = false" class="mt-auto inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-card/70">Close</button></Drawer>
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Drawer } from "@orvui/vue/motion/drawer";
const open = ref(false), side = ref<"left" | "right">("right");
function reveal(edge: "left" | "right") { side.value = edge; open.value = true; }
</script>
<template><div class="flex items-center gap-3">
  <button type="button" @click="reveal('left')" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-card/70">Open left</button>
  <button type="button" @click="reveal('right')" class="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Open right</button>
  <Drawer v-model:open="open" :side="side" aria-label="Demo drawer" class="gap-4 p-6"><h2 class="text-sm font-semibold text-foreground">Drawer</h2><p class="text-sm text-muted-foreground">Enter from the {{ side }} edge. Use Escape or the backdrop to dismiss.</p><button type="button" @click="open = false" class="mt-auto inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-card/70">Close</button></Drawer>
</div></template>
```

## API 参考

### Drawer

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `false` | 是 | — |
| `side` | `"left" \| "right"` | `"right"` | 否 | — |
| `ariaLabel` | `string` | — | 否 | — |
| `dismissable` | `boolean` | `true` | 否 | — |
| `backdropClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## 关于 Drawer

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Drawer？**

通过 open、side、ariaLabel、dismissable、backdropClassName 配置 Drawer；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/drawer.json
- 文档: https://orvui.efu.me/components/motion/drawer
- `packages/vue/src/motion/drawer/src/Drawer.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
