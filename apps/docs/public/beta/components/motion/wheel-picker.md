---
title: "Wheel Picker"
description: "从旋转滚轮中选择数值，支持惯性与行吸附。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/wheel-picker"
markdown: "https://orvui.efu.me/components/motion/wheel-picker.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Wheel Picker

> 从旋转滚轮中选择数值，支持惯性与行吸附。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Wheel Picker：从旋转滚轮中选择数值，支持惯性与行吸附。

<a id="install"></a>
## 安装

### Wheel Picker — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/wheel-picker.json https://orvui.efu.me/beta/r/switch.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

安装本地 Beta 归档，制作方法见 Beta 安装指南。

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `clsx@^2.1.1`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `motion-v@^1.10.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Wheel Picker

**复制源码**

```vue
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { WheelPicker } from "@/components/orvui/motion/wheel-picker";
import { Switch } from "@/components/orvui/motion/switch";
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = Array.from({ length: 60 }, (_, index) => String(index + 1980));
const month = ref("June");
const year = ref("2004");
const day = ref("9");
const sound = ref(false);
const days = computed(() => Array.from({ length: new Date(Number(year.value), months.indexOf(month.value) + 1, 0).getDate() }, (_, index) => String(index + 1)));
watch([day, days], () => { if (Number(day.value) > days.value.length) day.value = String(days.value.length); });
</script>
<template><div class="flex flex-col items-center gap-4"><span class="text-sm text-muted-foreground">Born <span class="font-medium text-foreground tabular-nums">{{ month }} {{ day }}, {{ year }}</span></span><div class="flex items-stretch gap-1 rounded-3xl border border-border bg-background p-2"><WheelPicker v-model="month" :options="months" class="w-32 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Month" /><WheelPicker v-model="day" :options="days" class="w-14 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Day" /><WheelPicker v-model="year" :options="years" class="w-20 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Year" /></div><Switch v-model="sound" label="Tick sound" class="origin-left scale-[0.85] [&_label]:text-sm" /></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { WheelPicker } from "@orvui/vue/motion/wheel-picker";
import { Switch } from "@orvui/vue/motion/switch";
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = Array.from({ length: 60 }, (_, index) => String(index + 1980));
const month = ref("June");
const year = ref("2004");
const day = ref("9");
const sound = ref(false);
const days = computed(() => Array.from({ length: new Date(Number(year.value), months.indexOf(month.value) + 1, 0).getDate() }, (_, index) => String(index + 1)));
watch([day, days], () => { if (Number(day.value) > days.value.length) day.value = String(days.value.length); });
</script>
<template><div class="flex flex-col items-center gap-4"><span class="text-sm text-muted-foreground">Born <span class="font-medium text-foreground tabular-nums">{{ month }} {{ day }}, {{ year }}</span></span><div class="flex items-stretch gap-1 rounded-3xl border border-border bg-background p-2"><WheelPicker v-model="month" :options="months" class="w-32 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Month" /><WheelPicker v-model="day" :options="days" class="w-14 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Day" /><WheelPicker v-model="year" :options="years" class="w-20 border-0 bg-transparent" :visible-count="7" :item-height="42" :sound="sound" aria-label="Year" /></div><Switch v-model="sound" label="Tick sound" class="origin-left scale-[0.85] [&_label]:text-sm" /></div></template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `WheelPicker` | `v-model` | `string` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### WheelPicker

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `options` | `WheelPickerOption[]` | — | 是 | — |
| `modelValue` | `string` | — | 否 | — |
| `defaultValue` | `string` | — | 否 | — |
| `visibleCount` | `number` | `5` | 否 | — |
| `itemHeight` | `number` | `36` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `sound` | `boolean` | `false` | 否 | — |
| `ariaLabel` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

<a id="about"></a>
## 关于 Wheel Picker

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Wheel Picker？**

通过 options、modelValue、defaultValue、visibleCount、itemHeight、disabled、sound、ariaLabel 配置 Wheel Picker；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Range Slider](https://orvui.efu.me/components/motion/range-slider): 通过拖动手势或键盘步进，在轨道上调整数值。
- [Checkbox](https://orvui.efu.me/components/motion/checkbox): 通过动态勾选标记表示选中、未选中和半选状态。
- [Radio Group](https://orvui.efu.me/components/motion/radio): 从带标签、支持键盘导航的选项组中选择一个值。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/wheel-picker.json
- 文档: https://orvui.efu.me/components/motion/wheel-picker
- `packages/vue/src/motion/wheel-picker/src/WheelPicker.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
