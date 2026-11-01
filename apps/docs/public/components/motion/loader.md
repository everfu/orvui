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

<a id="overview"></a>
# Loader

> 为结果尚未返回的操作选择紧凑动态指示器。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Loader：为结果尚未返回的操作选择紧凑动态指示器。

<a id="install"></a>
## 安装

### Loader — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/loader.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
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

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### Loader

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `variant` | `"morph" \| "bars" \| "metaballs" \| "dots" \| "spinner" \| "dot-matrix" \| "dither" \| "ascii" \| "ascii-line" \| "ascii-braille" \| "ascii-blocks" \| "ascii-bounce" \| "comet" \| "scramble" \| "newton" \| "helix" \| "percent"` | `"spinner"` | 否 | — |
| `size` | `number` | `32` | 否 | — |
| `speed` | `number` | `1` | 否 | — |
| `label` | `string` | `"Loading"` | 否 | — |

<a id="about"></a>
## 关于 Loader

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Loader？**

通过 variant、size、speed、label 配置 Loader；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过文档中的组合方式提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Animated Badge](https://orvui.efu.me/components/motion/animated-badge): 将紧凑状态标签与图标组合，并可加入脉冲反馈。
- [Text Animation](https://orvui.efu.me/components/motion/text-animation): 揭示、闪烁、解码或替换文字，同时保持稳定的无障碍读值。
- [Number Animation](https://orvui.efu.me/components/motion/number): 通过计数、滚动或保持数位位置的方式呈现数值变化。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/loader.json
- 文档: https://orvui.efu.me/components/motion/loader
- `packages/vue/src/motion/loader/src/Loader.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
