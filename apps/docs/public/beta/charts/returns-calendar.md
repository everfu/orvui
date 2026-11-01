---
title: "Returns Calendar"
description: "通过日历、月份汇总和可选日期内容比较每日正负收益。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/returns-calendar"
markdown: "https://orvui.efu.me/charts/returns-calendar.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Returns Calendar

> 通过日历、月份汇总和可选日期内容比较每日正负收益。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Returns Calendar：通过日历、月份汇总和可选日期内容比较每日正负收益。

<a id="install"></a>
## 安装

### Returns Calendar — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/returns-calendar.json
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

- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Returns Calendar

**复制源码**

```vue
<script setup lang="ts">
import { ReturnsCalendar } from "@/components/orvui/charts/returns-calendar";
const years = [2021, 2022, 2023, 2024, 2025];
let seed = 2021;
function sample() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
const returns = years.map((_, index) =>
  Array.from(
    { length: 12 },
    () =>
      Math.round(((index === 1 ? -1.6 : 0.9) + (sample() - 0.5) * 12) * 10) /
      10,
  ),
);
</script>
<template><ReturnsCalendar :years="years" :returns="returns" /></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ReturnsCalendar } from "@orvui/vue/charts/returns-calendar";
const years = [2021, 2022, 2023, 2024, 2025];
let seed = 2021;
function sample() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
const returns = years.map((_, index) =>
  Array.from(
    { length: 12 },
    () =>
      Math.round(((index === 1 ? -1.6 : 0.9) + (sample() - 0.5) * 12) * 10) /
      10,
  ),
);
</script>
<template><ReturnsCalendar :years="years" :returns="returns" /></template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `ReturnsCalendar` | `v-model:selection` | `null \| ReturnsCalendarSelection` | `update:selection` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### ReturnsCalendar

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `years` | `number[]` | `[]` | 否 | Row labels, one per row of `returns`. |
| `returns` | `number[][]` | `[]` | 否 | `returns[year][month]` in percent, twelve months per row. |
| `className` | `string` | — | 否 | — |
| `selection` | `null \| ReturnsCalendarSelection` | — | 否 | — |
| `defaultSelection` | `null \| ReturnsCalendarSelection` | `null` | 否 | — |
| `onSelectionChange` | `(selection: ReturnsCalendarSelection \| null) => void` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:selection` | — | — |
| `selectionChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ReturnsCalendarGrid

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### ReturnsCalendarTooltip

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `label: calendar.tipLabel`, `value: calendar.tipValue`, `note: calendar.tipNote` | — |

<a id="about"></a>
## 关于 Returns Calendar

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Returns Calendar？**

通过带作用域的默认插槽定制日期内容，并读取日期与收益数值。

**如何连接到应用状态？**

监听 update:selection、selectionChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Heat Calendar](https://orvui.efu.me/charts/heat-calendar): 在紧凑日历网格中展示每日活动，检查时可读取精确数值。
- [Price Target Fan](https://orvui.efu.me/charts/price-target-fan): 使用从共同起点延伸的目标路径比较价格预测。
- [Treemap](https://orvui.efu.me/charts/treemap): 用面积随数值变化的嵌套矩形比较层级数据。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/returns-calendar.json
- 文档: https://orvui.efu.me/charts/returns-calendar
- `packages/vue/src/charts/returns-calendar/src/ReturnsCalendar.vue`
- `packages/vue/src/charts/returns-calendar/src/ReturnsCalendarGrid.vue`
- `packages/vue/src/charts/returns-calendar/src/ReturnsCalendarTooltip.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
