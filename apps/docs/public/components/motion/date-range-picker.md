---
title: "Date Range Picker"
description: "在行内或浮动日历中选择日期区间的起点与终点。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/date-range-picker"
markdown: "https://orvui.efu.me/components/motion/date-range-picker.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Date Range Picker

> 在行内或浮动日历中选择日期区间的起点与终点。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Date Range Picker：在行内或浮动日历中选择日期区间的起点与终点。

<a id="install"></a>
## 安装

### Date Range Picker — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/date-range-picker.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Date Range Picker

**复制源码**

```vue
<script setup lang="ts">
import {
  DateRangePicker,
  DateRangePickerCalendar,
  DateRangePickerClear,
  DateRangePickerContent,
  DateRangePickerFooter,
  DateRangePickerGrid,
  DateRangePickerHeader,
  DateRangePickerSelection,
  DateRangePickerTrigger,
} from "@/components/orvui/motion/date-range-picker";
const reporting = {
  label: "Reporting period",
  defaultMonth: "2026-10-25",
  defaultValue: { from: "2026-10-19", to: "2026-10-25" },
  max: "2026-10-25",
};
</script>
<template>
  <DateRangePicker v-bind="reporting"
    ><DateRangePickerTrigger /><DateRangePickerContent
      ><DateRangePickerCalendar class="w-full rounded-none border-0"
        ><DateRangePickerHeader /><DateRangePickerGrid /><DateRangePickerFooter
          ><div class="flex items-center justify-between gap-2">
            <DateRangePickerSelection /><DateRangePickerClear /></div></DateRangePickerFooter></DateRangePickerCalendar></DateRangePickerContent
  ></DateRangePicker>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { DateRangePicker, DateRangePickerCalendar, DateRangePickerClear, DateRangePickerContent, DateRangePickerFooter, DateRangePickerGrid, DateRangePickerHeader, DateRangePickerSelection, DateRangePickerTrigger } from "@orvui/vue/motion/date-range-picker";
const reporting = {
  label: "Reporting period",
  defaultMonth: "2026-10-25",
  defaultValue: { from: "2026-10-19", to: "2026-10-25" },
  max: "2026-10-25",
};
</script>
<template>
  <DateRangePicker v-bind="reporting"
    ><DateRangePickerTrigger /><DateRangePickerContent
      ><DateRangePickerCalendar class="w-full rounded-none border-0"
        ><DateRangePickerHeader /><DateRangePickerGrid /><DateRangePickerFooter
          ><div class="flex items-center justify-between gap-2">
            <DateRangePickerSelection /><DateRangePickerClear /></div></DateRangePickerFooter></DateRangePickerCalendar></DateRangePickerContent
  ></DateRangePicker>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `DateRangePicker` | `v-model` | `null \| DateRange` | `update:modelValue` |
| `DateRangePicker` | `v-model:open` | `boolean` | `update:open` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### DateRangePicker

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `null \| DateRange` | — | 否 | — |
| `value` | `null \| DateRange` | — | 否 | — |
| `defaultValue` | `null \| DateRange` | `null` | 否 | — |
| `defaultMonth` | `string` | `value.value?.from` | 否 | — |
| `min` | `string` | `"0000-01-01"` | 否 | — |
| `max` | `string` | `"9999-12-31"` | 否 | — |
| `isDateDisabled` | `(date: string) => boolean` | — | 否 | — |
| `presets` | `DateRangePreset[]` | — | 否 | — |
| `locale` | `string` | `"en-US"` | 否 | — |
| `label` | `string` | `"Choose a date range"` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `autoFocus` | `boolean` | `false` | 否 | — |
| `showSummary` | `boolean` | `true` | 否 | — |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |
| `closeOnSelect` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `valueChange` | — | — |
| `change` | — | — |
| `update:open` | — | — |
| `openChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value`, `select-date: state.select`, `clear: state.clear` | — |

### DateRangePickerCalendar

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `showSummary` | `boolean` | `undefined` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DateRangePickerClear

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DateRangePickerContent

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `autoFocus` | `boolean` | `true` | 否 | — |
| `onOpenAutoFocus` | `(content: HTMLDivElement) => void` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DateRangePickerFooter

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `(props: {}) => any` | — | — |

### DateRangePickerGrid

### DateRangePickerHeader

### DateRangePickerSelection

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value` | — |

### DateRangePickerTrigger

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Select dates"` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DateRangePickerSummary

### DateRangePickerPresets

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DateRangePickerPreset

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `DateRange` | — | 是 | — |
| `label` | `string` | `root.value?.textContent?.trim()` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Date Range Picker

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Date Range Picker？**

通过 modelValue、value、defaultValue、defaultMonth、min、max、isDateDisabled、presets、locale、label、disabled、autoFocus、showSummary、open、defaultOpen、closeOnSelect 配置 Date Range Picker；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange、change、update:open、openChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Card](https://orvui.efu.me/components/motion/card): 组合标题、正文、操作和页脚形成卡片，也可加入选择状态。
- [Sortable List](https://orvui.efu.me/components/motion/sortable-stack): 使用指针或键盘重排列表，并提供撤销操作。
- [Color Picker](https://orvui.efu.me/components/motion/color-picker): 使用二维颜色区域、通道输入、预设与吸管编辑颜色。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/date-range-picker.json
- 文档: https://orvui.efu.me/components/motion/date-range-picker
- `packages/vue/src/motion/date-range-picker/src/DateRangePicker.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerCalendar.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerClear.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerContent.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerFooter.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerGrid.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerHeader.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerSelection.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerTrigger.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerSummary.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerPresets.vue`
- `packages/vue/src/motion/date-range-picker/src/DateRangePickerPreset.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
