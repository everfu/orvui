---
title: "Tilt Card"
description: "让卡片朝指针方向倾斜，并在表面移动高光。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/tilt-card"
markdown: "https://orvui.efu.me/components/motion/tilt-card.md"
license: "MIT"
productVersion: "0.1.0"
---

# Tilt Card

> 让卡片朝指针方向倾斜，并在表面移动高光。

让卡片朝指针方向倾斜，并在表面移动高光。

## 适用场景

- 当界面需要以下行为时使用 Tilt Card：让卡片朝指针方向倾斜，并在表面移动高光。

## 安装

### Tilt Card — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/tilt-card.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

## 用法

### Tilt Card

**复制源码**

```vue
<script setup lang="ts">
import { TiltCard } from "@/components/orvui/motion/tilt-card";
</script>
<template>
  <div class="flex items-center justify-center p-6">
    <TiltCard class="w-[280px] border border-border bg-card p-8">
      <div class="text-xs uppercase tracking-wider text-muted-foreground">Interactive</div>
      <h3 class="mt-2 text-2xl font-semibold text-foreground">A new angle</h3>
      <p class="mt-3 text-sm text-muted-foreground">Move across the surface to follow its depth and reflected light.</p>
    </TiltCard>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { TiltCard } from "@orvui/vue/motion/tilt-card";
</script>
<template>
  <div class="flex items-center justify-center p-6">
    <TiltCard class="w-[280px] border border-border bg-card p-8">
      <div class="text-xs uppercase tracking-wider text-muted-foreground">Interactive</div>
      <h3 class="mt-2 text-2xl font-semibold text-foreground">A new angle</h3>
      <p class="mt-3 text-sm text-muted-foreground">Move across the surface to follow its depth and reflected light.</p>
    </TiltCard>
  </div>
</template>
```

## API 参考

### TiltCard

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `max` | `number` | `12` | 否 | — |
| `glare` | `boolean` | `true` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## 关于 Tilt Card

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Tilt Card？**

通过 max、glare 配置 Tilt Card；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/tilt-card.json
- 文档: https://orvui.efu.me/components/motion/tilt-card
- `packages/vue/src/motion/tilt-card/src/TiltCard.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
