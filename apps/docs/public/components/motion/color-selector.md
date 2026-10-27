---
title: "Animated Color Selector"
description: "用移动选择轮廓与原生单选行为选择命名色块。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/color-selector"
markdown: "https://orvui.efu.me/components/motion/color-selector.md"
license: "MIT"
productVersion: "0.1.0"
---

# Animated Color Selector

> 用移动选择轮廓与原生单选行为选择命名色块。

## 安装

### Animated Color Selector — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/color-selector.json
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

### Animated Color Selector

**复制源码**

```vue
<script setup lang="ts">
import { ColorSelector, ColorSelectorItem, ColorSelectorLabel, ColorSelectorList } from "@/components/orvui/motion/color-selector";
const swatches = [
  { value: "blue", color: "#3478f6", label: "Blue" }, { value: "purple", color: "#9270e8", label: "Purple" },
  { value: "pink", color: "#e66aa4", label: "Pink" }, { value: "red", color: "#e55656", label: "Red" },
  { value: "orange", color: "#ed9141", label: "Orange" }, { value: "amber", color: "#e5b63c", label: "Amber" },
  { value: "green", color: "#65a65a", label: "Green" }, { value: "teal", color: "#169d83", label: "Teal" },
];
</script>
<template>
  <ColorSelector default-value="blue" name="accent"><ColorSelectorLabel>Accent</ColorSelectorLabel><ColorSelectorList>
    <ColorSelectorItem v-for="swatch in swatches" :key="swatch.value" v-bind="swatch" />
  </ColorSelectorList></ColorSelector>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ColorSelector, ColorSelectorItem, ColorSelectorLabel, ColorSelectorList } from "@orvui/vue/motion/color-selector";
const swatches = [
  { value: "blue", color: "#3478f6", label: "Blue" }, { value: "purple", color: "#9270e8", label: "Purple" },
  { value: "pink", color: "#e66aa4", label: "Pink" }, { value: "red", color: "#e55656", label: "Red" },
  { value: "orange", color: "#ed9141", label: "Orange" }, { value: "amber", color: "#e5b63c", label: "Amber" },
  { value: "green", color: "#65a65a", label: "Green" }, { value: "teal", color: "#169d83", label: "Teal" },
];
</script>
<template>
  <ColorSelector default-value="blue" name="accent"><ColorSelectorLabel>Accent</ColorSelectorLabel><ColorSelectorList>
    <ColorSelectorItem v-for="swatch in swatches" :key="swatch.value" v-bind="swatch" />
  </ColorSelectorList></ColorSelector>
</template>
```

## API 参考

### ColorSelector

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | — | 否 | — |
| `defaultValue` | `string` | `""` | 否 | — |
| `name` | `string` | `instanceId` | 否 | — |
| `form` | `string` | — | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `required` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ColorSelectorItem

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | 是 | — |
| `color` | `string` | — | 是 | — |
| `label` | `string` | — | 是 | — |
| `disabled` | `boolean` | `false` | 否 | — |

### ColorSelectorLabel

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

### ColorSelectorList

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => any` | — | — |

## 关于 Animated Color Selector

用移动选择轮廓与原生单选行为选择命名色块。

### 适用场景

- 当界面需要以下行为时使用 Animated Color Selector：用移动选择轮廓与原生单选行为选择命名色块。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Animated Color Selector？**

通过 modelValue、defaultValue、name、form、disabled、required 配置 Animated Color Selector；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/color-selector.json
- 文档: https://orvui.efu.me/components/motion/color-selector
- `packages/vue/src/motion/color-selector/src/ColorSelector.vue`
- `packages/vue/src/motion/color-selector/src/ColorSelectorItem.vue`
- `packages/vue/src/motion/color-selector/src/ColorSelectorLabel.vue`
- `packages/vue/src/motion/color-selector/src/ColorSelectorList.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
