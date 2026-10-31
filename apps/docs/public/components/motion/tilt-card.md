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

<a id="overview"></a>
# Tilt Card

> 让卡片朝指针方向倾斜，并在表面移动高光。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Tilt Card：让卡片朝指针方向倾斜，并在表面移动高光。

<a id="install"></a>
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

<a id="examples"></a>
## 用法

<a id="default"></a>
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

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
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

<a id="about"></a>
## 关于 Tilt Card

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Tilt Card？**

通过 max、glare 配置 Tilt Card；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Marquee](https://orvui.efu.me/components/motion/marquee): 连续重复水平或垂直内容带，并可在悬停时暂停。
- [Theme Toggle](https://orvui.efu.me/components/motion/theme-toggle): 通过圆形、矩形或百叶窗过渡揭示新的页面主题。
- [Shader Background](https://orvui.efu.me/components/motion/shader-background): 通过 Vue 适配器调用 Paper Design Shader 运行时呈现动态背景。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/tilt-card.json
- 文档: https://orvui.efu.me/components/motion/tilt-card
- `packages/vue/src/motion/tilt-card/src/TiltCard.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
