---
title: "Loader"
description: "为结果尚未返回的操作选择紧凑动态指示器。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/loader"
markdown: "https://orvui.efu.me/components/motion/loader.md"
license: "MIT"
productVersion: "0.1.0"
---

# Loader

> 为结果尚未返回的操作选择紧凑动态指示器。

为结果尚未返回的操作选择紧凑动态指示器。

## 适用场景

- 当界面需要以下行为时使用 Loader：为结果尚未返回的操作选择紧凑动态指示器。

## 安装

### Loader — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/loader.json
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

### Loader

**复制源码**

```vue
<script setup lang="ts">
import { Loader, type LoaderVariant } from "@/components/orvui/motion/loader";
const variants: [LoaderVariant, string][] = [
  ["spinner", "Spinner"], ["dots", "Dots"], ["bars", "Bars"], ["dot-matrix", "Dot Matrix"], ["dither", "Dither"],
  ["morph", "Morph"], ["comet", "Comet"], ["metaballs", "Metaballs"], ["newton", "Newton"], ["helix", "Helix"],
  ["scramble", "Scramble"], ["percent", "Percent"], ["ascii", "ASCII"], ["ascii-line", "ASCII Line"],
  ["ascii-braille", "ASCII Braille"], ["ascii-blocks", "ASCII Blocks"], ["ascii-bounce", "ASCII Bounce"],
];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-8 p-8">
  <div v-for="[variant, label] in variants" :key="variant" class="flex flex-col items-center gap-4"><Loader :variant="variant" :size="36" /><span class="text-xs text-muted-foreground">{{ label }}</span></div>
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { Loader, type LoaderVariant } from "@orvui/vue/motion/loader";
const variants: [LoaderVariant, string][] = [
  ["spinner", "Spinner"], ["dots", "Dots"], ["bars", "Bars"], ["dot-matrix", "Dot Matrix"], ["dither", "Dither"],
  ["morph", "Morph"], ["comet", "Comet"], ["metaballs", "Metaballs"], ["newton", "Newton"], ["helix", "Helix"],
  ["scramble", "Scramble"], ["percent", "Percent"], ["ascii", "ASCII"], ["ascii-line", "ASCII Line"],
  ["ascii-braille", "ASCII Braille"], ["ascii-blocks", "ASCII Blocks"], ["ascii-bounce", "ASCII Bounce"],
];
</script>
<template><div class="flex flex-wrap items-center justify-center gap-8 p-8">
  <div v-for="[variant, label] in variants" :key="variant" class="flex flex-col items-center gap-4"><Loader :variant="variant" :size="36" /><span class="text-xs text-muted-foreground">{{ label }}</span></div>
</div></template>
```

## API 参考

### Loader

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `variant` | `"morph" \| "bars" \| "metaballs" \| "dots" \| "spinner" \| "dot-matrix" \| "dither" \| "ascii" \| "ascii-line" \| "ascii-braille" \| "ascii-blocks" \| "ascii-bounce" \| "comet" \| "scramble" \| "newton" \| "helix" \| "percent"` | `"spinner"` | 否 | — |
| `size` | `number` | `32` | 否 | — |
| `speed` | `number` | `1` | 否 | — |
| `label` | `string` | `"Loading"` | 否 | — |

## 关于 Loader

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Loader？**

通过 variant、size、speed、label 配置 Loader；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过文档中的组合方式提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/loader.json
- 文档: https://orvui.efu.me/components/motion/loader
- `packages/vue/src/motion/loader/src/Loader.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
