---
title: "Cylinder Carousel"
description: "将画廊项目排列在凹面或凸面圆柱上，并通过拖动控制。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/cylinder-carousel"
markdown: "https://orvui.efu.me/components/motion/cylinder-carousel.md"
license: "MIT"
productVersion: "0.1.0"
---

# Cylinder Carousel

> 将画廊项目排列在凹面或凸面圆柱上，并通过拖动控制。

将画廊项目排列在凹面或凸面圆柱上，并通过拖动控制。

## 适用场景

- 当界面需要以下行为时使用 Cylinder Carousel：将画廊项目排列在凹面或凸面圆柱上，并通过拖动控制。

## 安装

### Cylinder Carousel — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/cylinder-carousel.json https://orvui.efu.me/r/shader-background.json https://orvui.efu.me/r/tabs.json
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
- `@paper-design/shaders@^0.0.76`
- `clsx@^2.1.1`
- `tailwind-merge@^3.0.0`
- `lucide-vue-next@^0.468.0`

## 用法

### Cylinder Carousel

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CylinderCarousel } from "@/components/orvui/motion/cylinder-carousel";
import { ShaderBackground } from "@/components/orvui/motion/shader-background";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
const curvature = ref<"concave" | "convex">("concave");
const surfaces = [
  ["dithering", { colorBack: "#1a1030", colorFront: "#b98cff", speed: .3 }],
  ["metaballs", { colors: ["#e8e8ef", "#8a8a9a", "#1a1a22"], colorBack: "#c9b9a8", speed: .4 }],
  ["warp", { colors: ["#c8ff00", "#3a5a00", "#c8ff00", "#88bb00"], speed: .4 }],
  ["god-rays", { colors: ["#6a7bff", "#00114d"], colorBack: "#000000", speed: .5 }],
  ["swirl", { colorBack: "#1a0000", colors: ["#ffd1a8", "#ff6a3d", "#b31a57"], speed: .3 }],
  ["mesh-gradient", { colors: ["#e0eaff", "#241d9a", "#f75092", "#9f50d3"], speed: .3 }],
  ["voronoi", { colors: ["#ff8247", "#ffe53d"], speed: .3 }],
  ["neuro-noise", { colorFront: "#ffffff", colorMid: "#47a6ff", colorBack: "#000000", speed: .4 }],
] as const;
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4 p-6">
    <Tabs v-model="curvature" variant="segment"><TabsList><TabsTrigger v-for="mode in ['concave', 'convex']" :key="mode" :value="mode">{{ mode === 'concave' ? 'Concave' : 'Convex' }}</TabsTrigger></TabsList></Tabs>
    <div class="w-full rounded-3xl border border-border/60 bg-muted/20 py-6 [clip-path:inset(0_round_1.5rem)]"><CylinderCarousel :variant="curvature" :item-size="230" :height="310" class="w-full"><div v-for="[variant, settings] in surfaces" :key="variant" class="h-full w-full overflow-hidden rounded-full border border-border/40"><ShaderBackground :variant="variant as any" v-bind="settings" class="h-full w-full" /></div></CylinderCarousel></div>
    <p class="text-xs text-muted-foreground">Drag, scroll or use arrow keys to roll</p>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CylinderCarousel } from "@orvui/vue/motion/cylinder-carousel";
import { ShaderBackground } from "@orvui/vue/motion/shader-background";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
const curvature = ref<"concave" | "convex">("concave");
const surfaces = [
  ["dithering", { colorBack: "#1a1030", colorFront: "#b98cff", speed: .3 }],
  ["metaballs", { colors: ["#e8e8ef", "#8a8a9a", "#1a1a22"], colorBack: "#c9b9a8", speed: .4 }],
  ["warp", { colors: ["#c8ff00", "#3a5a00", "#c8ff00", "#88bb00"], speed: .4 }],
  ["god-rays", { colors: ["#6a7bff", "#00114d"], colorBack: "#000000", speed: .5 }],
  ["swirl", { colorBack: "#1a0000", colors: ["#ffd1a8", "#ff6a3d", "#b31a57"], speed: .3 }],
  ["mesh-gradient", { colors: ["#e0eaff", "#241d9a", "#f75092", "#9f50d3"], speed: .3 }],
  ["voronoi", { colors: ["#ff8247", "#ffe53d"], speed: .3 }],
  ["neuro-noise", { colorFront: "#ffffff", colorMid: "#47a6ff", colorBack: "#000000", speed: .4 }],
] as const;
</script>
<template>
  <div class="flex w-full flex-col items-center gap-4 p-6">
    <Tabs v-model="curvature" variant="segment"><TabsList><TabsTrigger v-for="mode in ['concave', 'convex']" :key="mode" :value="mode">{{ mode === 'concave' ? 'Concave' : 'Convex' }}</TabsTrigger></TabsList></Tabs>
    <div class="w-full rounded-3xl border border-border/60 bg-muted/20 py-6 [clip-path:inset(0_round_1.5rem)]"><CylinderCarousel :variant="curvature" :item-size="230" :height="310" class="w-full"><div v-for="[variant, settings] in surfaces" :key="variant" class="h-full w-full overflow-hidden rounded-full border border-border/40"><ShaderBackground :variant="variant as any" v-bind="settings" class="h-full w-full" /></div></CylinderCarousel></div>
    <p class="text-xs text-muted-foreground">Drag, scroll or use arrow keys to roll</p>
  </div>
</template>
```

## API 参考

### CylinderCarousel

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `itemSize` | `number` | `200` | 否 | — |
| `visibleItems` | `number` | `5` | 否 | — |
| `variant` | `"concave" \| "convex"` | `"concave"` | 否 | — |
| `minScale` | `number` | `.55` | 否 | — |
| `dragSpeed` | `number` | `1.5` | 否 | — |
| `arc` | `number` | — | 否 | — |
| `snap` | `boolean` | `true` | 否 | — |
| `autoRotate` | `boolean` | `false` | 否 | — |
| `autoRotateSpeed` | `number` | `.4` | 否 | — |
| `defaultIndex` | `number` | `0` | 否 | — |
| `height` | `number` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `indexChange` | — | — |

## 关于 Cylinder Carousel

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Cylinder Carousel？**

通过 itemSize、visibleItems、variant、minScale、dragSpeed、arc、snap、autoRotate、autoRotateSpeed、defaultIndex、height 配置 Cylinder Carousel；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 indexChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/cylinder-carousel.json
- 文档: https://orvui.efu.me/components/motion/cylinder-carousel
- `packages/vue/src/motion/cylinder-carousel/src/CylinderCarousel.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
