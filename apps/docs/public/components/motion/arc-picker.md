---
title: "Arc Picker"
description: "通过手势或键盘让弧形标签列表穿过固定选择点。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/arc-picker"
markdown: "https://orvui.efu.me/components/motion/arc-picker.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Arc Picker

> 通过手势或键盘让弧形标签列表穿过固定选择点。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Arc Picker：通过手势或键盘让弧形标签列表穿过固定选择点。

<a id="install"></a>
## 安装

### Arc Picker — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/arc-picker.json https://orvui.efu.me/r/button.json
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Arc Picker

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ArcPicker, type ArcPickerSide } from "@/components/orvui/motion/arc-picker";
import { Button } from "@/components/orvui/motion/button";
const directions = ["top", "bottom", "left", "right"] as const;
const times = ["First light", "Dawn", "Daybreak", "Sunrise", "Early morning", "Morning", "Late morning", "Midday", "Noon", "Afternoon", "Golden hour", "Sunset", "Blue hour", "Dusk", "Twilight", "Evening", "Nightfall", "Night", "Late night", "Midnight", "Deep night", "Starlight"];
const options = times.map(label => ({ label, value: label.toLowerCase().replaceAll(" ", "-") }));
const value = ref("golden-hour");
const side = ref<ArcPickerSide>("right");
</script>
<template><div class="w-full max-w-xl py-5"><fieldset class="flex flex-wrap items-center justify-center gap-1 px-4"><legend class="sr-only">Curve side</legend><Button v-for="direction in directions" :key="direction" size="sm" :variant="side === direction ? 'secondary' : 'ghost'" :aria-pressed="side === direction" @click="side = direction" class="capitalize">{{ direction }}</Button></fieldset><div class="my-8 flex min-h-108 items-center sm:my-10"><ArcPicker v-model="value" :options="options" aria-label="Time of day" :side="side" :radius="260" :visible-count="9" :item-height="48" /></div><p class="px-6 text-center text-xs text-muted-foreground">Drag {{ side === 'top' || side === 'bottom' ? 'horizontally' : 'vertically' }}, scroll or use the arrow keys.</p></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ArcPicker, type ArcPickerSide } from "@orvui/vue/motion/arc-picker";
import { Button } from "@orvui/vue/motion/button";
const directions = ["top", "bottom", "left", "right"] as const;
const times = ["First light", "Dawn", "Daybreak", "Sunrise", "Early morning", "Morning", "Late morning", "Midday", "Noon", "Afternoon", "Golden hour", "Sunset", "Blue hour", "Dusk", "Twilight", "Evening", "Nightfall", "Night", "Late night", "Midnight", "Deep night", "Starlight"];
const options = times.map(label => ({ label, value: label.toLowerCase().replaceAll(" ", "-") }));
const value = ref("golden-hour");
const side = ref<ArcPickerSide>("right");
</script>
<template><div class="w-full max-w-xl py-5"><fieldset class="flex flex-wrap items-center justify-center gap-1 px-4"><legend class="sr-only">Curve side</legend><Button v-for="direction in directions" :key="direction" size="sm" :variant="side === direction ? 'secondary' : 'ghost'" :aria-pressed="side === direction" @click="side = direction" class="capitalize">{{ direction }}</Button></fieldset><div class="my-8 flex min-h-108 items-center sm:my-10"><ArcPicker v-model="value" :options="options" aria-label="Time of day" :side="side" :radius="260" :visible-count="9" :item-height="48" /></div><p class="px-6 text-center text-xs text-muted-foreground">Drag {{ side === 'top' || side === 'bottom' ? 'horizontally' : 'vertically' }}, scroll or use the arrow keys.</p></div></template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `ArcPicker` | `v-model` | `string` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### ArcPicker

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `options` | `readonly ArcPickerOption[]` | — | 是 | — |
| `modelValue` | `string` | — | 否 | — |
| `defaultValue` | `string` | `props.options.find(option => !option.disabled)?.value` | 否 | — |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"right"` | 否 | — |
| `radius` | `number` | `280` | 否 | — |
| `itemHeight` | `number` | `48` | 否 | — |
| `visibleCount` | `number` | `7` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `name` | `string` | — | 否 | — |
| `ariaLabel` | `string` | `"Choose an option"` | 否 | — |
| `ariaDescribedby` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

<a id="about"></a>
## 关于 Arc Picker

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Arc Picker？**

通过 options、modelValue、defaultValue、side、radius、itemHeight、visibleCount、disabled、name、ariaLabel、ariaDescribedby 配置 Arc Picker；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Color Picker](https://orvui.efu.me/components/motion/color-picker): 使用二维颜色区域、通道输入、预设与吸管编辑颜色。
- [Range Slider](https://orvui.efu.me/components/motion/range-slider): 通过拖动手势或键盘步进，在轨道上调整数值。
- [Wheel Picker](https://orvui.efu.me/components/motion/wheel-picker): 从旋转滚轮中选择数值，支持惯性与行吸附。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/arc-picker.json
- 文档: https://orvui.efu.me/components/motion/arc-picker
- `packages/vue/src/motion/arc-picker/src/ArcPicker.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
