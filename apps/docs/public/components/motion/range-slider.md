---
title: "Range Slider"
description: "通过拖动手势或键盘步进，在轨道上调整数值。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/range-slider"
markdown: "https://orvui.efu.me/components/motion/range-slider.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Range Slider

> 通过拖动手势或键盘步进，在轨道上调整数值。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Range Slider：通过拖动手势或键盘步进，在轨道上调整数值。

<a id="install"></a>
## 安装

### Range Slider — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider.json
```

### Inline Slider — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider-inline.json
```

### Range Slider — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider.json
```

### Fluid Slider — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider-fluid.json
```

### Wave Slider — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider-wave.json
```

### Bubble Slider — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider-bubble.json
```

### Ruler Slider — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/range-slider-ruler.json
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

<a id="examples"></a>
## 用法

<a id="default"></a>
### Range Slider

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RangeSlider } from "@/components/orvui/motion/range-slider";
const amount = ref(40);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-3"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Drag the handle</span><span class="tabular-nums text-foreground">{{ amount }}</span></div><RangeSlider v-model="amount" :step="5" aria-label="Value" /></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RangeSlider } from "@orvui/vue/motion/range-slider";
const amount = ref(40);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-3"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Drag the handle</span><span class="tabular-nums text-foreground">{{ amount }}</span></div><RangeSlider v-model="amount" :step="5" aria-label="Value" /></div></template>
```

<a id="inline"></a>
### Inline Slider

把标签和数值放在轨道内部，附近刻度为手柄让出空间。

**复制源码**

```vue
<script setup lang="ts">
import { InlineSlider } from "@/components/orvui/motion/range-slider";
const spokenPixels = (value: number) => `${value} pixels`;
</script>
<template><div class="w-full max-w-sm"><InlineSlider :default-value="48" :min="8" :max="128" :step="8" label="Icon size" aria-label="Icon size" :format-value-text="spokenPixels" /></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { InlineSlider } from "@orvui/vue/motion/range-slider";
const spokenPixels = (value: number) => `${value} pixels`;
</script>
<template><div class="w-full max-w-sm"><InlineSlider :default-value="48" :min="8" :max="128" :step="8" label="Icon size" aria-label="Icon size" :format-value-text="spokenPixels" /></div></template>
```

<a id="stepped"></a>
### Range Slider

让窄手柄在标记步进之间吸附，并强调每次落定。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RangeSlider } from "@/components/orvui/motion/range-slider";
const amount = ref(40);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-3"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Drag the handle</span><span class="tabular-nums text-foreground">{{ amount }}</span></div><RangeSlider v-model="amount" :step="5" aria-label="Value" /></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RangeSlider } from "@orvui/vue/motion/range-slider";
const amount = ref(40);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-3"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Drag the handle</span><span class="tabular-nums text-foreground">{{ amount }}</span></div><RangeSlider v-model="amount" :step="5" aria-label="Value" /></div></template>
```

<a id="fluid"></a>
### Fluid Slider

使用圆润的移动填充表示数值，替代独立手柄。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { FluidSlider } from "@/components/orvui/motion/range-slider";
const brightness = ref(35);
</script>
<template><div class="w-full max-w-sm"><FluidSlider v-model="brightness" label="Brightness" aria-label="Brightness" /></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { FluidSlider } from "@orvui/vue/motion/range-slider";
const brightness = ref(35);
</script>
<template><div class="w-full max-w-sm"><FluidSlider v-model="brightness" label="Brightness" aria-label="Brightness" /></div></template>
```

<a id="wave"></a>
### Wave Slider

抬高手柄附近的竖条，形成随位置移动的波形。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { WaveSlider } from "@/components/orvui/motion/range-slider";
const gain = ref(45);
</script>
<template><div class="flex w-full max-w-md flex-col gap-2"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Gain</span><span class="tabular-nums text-foreground">{{ gain }}</span></div><WaveSlider v-model="gain" aria-label="Gain" /></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { WaveSlider } from "@orvui/vue/motion/range-slider";
const gain = ref(45);
</script>
<template><div class="flex w-full max-w-md flex-col gap-2"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Gain</span><span class="tabular-nums text-foreground">{{ gain }}</span></div><WaveSlider v-model="gain" aria-label="Gain" /></div></template>
```

<a id="bubble"></a>
### Bubble Slider

拖动时抬起数值气泡，让其倾斜随移动变化。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BubbleSlider } from "@/components/orvui/motion/range-slider";
const amount = ref(28);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-1"><span class="text-sm text-muted-foreground">Drag fast and the bubble leans</span><BubbleSlider v-model="amount" aria-label="Value" /></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BubbleSlider } from "@orvui/vue/motion/range-slider";
const amount = ref(28);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-1"><span class="text-sm text-muted-foreground">Drag fast and the bubble leans</span><BubbleSlider v-model="amount" aria-label="Value" /></div></template>
```

<a id="ruler"></a>
### Ruler Slider

指针固定在原位，带刻度的标尺在其下方移动。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RulerSlider } from "@/components/orvui/motion/range-slider";
const weight = ref(72.5);
</script>
<template><div class="w-full max-w-sm"><RulerSlider v-model="weight" :min="40" :max="120" :step=".5" :gap="12" :major-every="10" unit="kg" aria-label="Weight" /></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RulerSlider } from "@orvui/vue/motion/range-slider";
const weight = ref(72.5);
</script>
<template><div class="w-full max-w-sm"><RulerSlider v-model="weight" :min="40" :max="120" :step=".5" :gap="12" :major-every="10" unit="kg" aria-label="Weight" /></div></template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `RangeSlider` | `v-model` | `number` | `update:modelValue` |
| `InlineSlider` | `v-model` | `number` | `update:modelValue` |
| `FluidSlider` | `v-model` | `number` | `update:modelValue` |
| `WaveSlider` | `v-model` | `number` | `update:modelValue` |
| `BubbleSlider` | `v-model` | `number` | `update:modelValue` |
| `RulerSlider` | `v-model` | `number` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### RangeSlider

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | 否 | — |
| `defaultValue` | `number` | `0` | 否 | — |
| `min` | `number` | `0` | 否 | — |
| `max` | `number` | `100` | 否 | — |
| `step` | `number` | — | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `ariaLabel` | `string` | — | 否 | — |
| `formatValueText` | `(value: number) => string` | — | 否 | — |
| `showTicks` | `boolean` | `true` | 否 | — |
| `name` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |

### InlineSlider

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | 否 | — |
| `defaultValue` | `number` | — | 否 | — |
| `min` | `number` | — | 否 | — |
| `max` | `number` | — | 否 | — |
| `step` | `number` | `1` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `ariaLabel` | `string` | — | 否 | — |
| `formatValueText` | `(value: number) => string` | — | 否 | — |
| `label` | `string` | — | 是 | — |
| `format` | `(v: number) => string` | `String` | 否 | — |
| `showTicks` | `boolean` | `true` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |

### FluidSlider

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | 否 | — |
| `defaultValue` | `number` | `0` | 否 | — |
| `min` | `number` | `0` | 否 | — |
| `max` | `number` | `100` | 否 | — |
| `step` | `number` | — | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `ariaLabel` | `string` | — | 否 | — |
| `formatValueText` | `(value: number) => string` | — | 否 | — |
| `label` | `string` | — | 否 | — |
| `format` | `(v: number) => string` | `` (v: number) => `${v}%` `` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |

### WaveSlider

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | 否 | — |
| `defaultValue` | `number` | `0` | 否 | — |
| `min` | `number` | `0` | 否 | — |
| `max` | `number` | `100` | 否 | — |
| `step` | `number` | — | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `ariaLabel` | `string` | — | 否 | — |
| `formatValueText` | `(value: number) => string` | — | 否 | — |
| `bars` | `number` | `32` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |

### BubbleSlider

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | 否 | — |
| `defaultValue` | `number` | `0` | 否 | — |
| `min` | `number` | `0` | 否 | — |
| `max` | `number` | `100` | 否 | — |
| `step` | `number` | — | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `ariaLabel` | `string` | — | 否 | — |
| `formatValueText` | `(value: number) => string` | — | 否 | — |
| `format` | `(v: number) => string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |

### RulerSlider

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | 否 | — |
| `defaultValue` | `number` | — | 否 | — |
| `min` | `number` | — | 否 | — |
| `max` | `number` | — | 否 | — |
| `step` | `number` | `1` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `ariaLabel` | `string` | — | 否 | — |
| `formatValueText` | `(value: number) => string` | ``(props.unit ? (value: number) => `${value.toFixed(decimals.value)} ${props.unit}` : undefined)`` | 否 | — |
| `gap` | `number` | `14` | 否 | — |
| `majorEvery` | `number` | `5` | 否 | — |
| `unit` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `valueCommit` | — | — |

<a id="about"></a>
## 关于 Range Slider

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Range Slider？**

通过 modelValue 与 update:modelValue 控制数值；defaultValue 只初始化非受控滑块。

**如何连接到应用状态？**

监听 update:modelValue、change、valueCommit，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Wheel Picker](https://orvui.efu.me/components/motion/wheel-picker): 从旋转滚轮中选择数值，支持惯性与行吸附。
- [Switch](https://orvui.efu.me/components/motion/switch): 通过移动滑块切换二元设置，并可添加说明标签。
- [Input](https://orvui.efu.me/components/motion/input): 在同一输入框中编辑文字，并可配置标签、图标与校验反馈。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/range-slider.json
- 文档: https://orvui.efu.me/components/motion/range-slider
- `packages/vue/src/motion/range-slider/src/RangeSlider.vue`
- `packages/vue/src/motion/range-slider/src/InlineSlider.vue`
- `packages/vue/src/motion/range-slider/src/FluidSlider.vue`
- `packages/vue/src/motion/range-slider/src/WaveSlider.vue`
- `packages/vue/src/motion/range-slider/src/BubbleSlider.vue`
- `packages/vue/src/motion/range-slider/src/RulerSlider.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
