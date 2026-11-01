---
title: "Heat Calendar"
description: "在紧凑日历网格中展示每日活动，检查时可读取精确数值。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/heat-calendar"
markdown: "https://orvui.efu.me/charts/heat-calendar.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Heat Calendar

> 在紧凑日历网格中展示每日活动，检查时可读取精确数值。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Heat Calendar：在紧凑日历网格中展示每日活动，检查时可读取精确数值。

<a id="install"></a>
## 安装

### Heat Calendar — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/heat-calendar.json
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
### Heat Calendar

**复制源码**

```vue
<script setup lang="ts">
import { HeatCalendar } from "@/components/orvui/charts/heat-calendar";
const values = Array.from({ length: 16 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const noise = Math.sin(week * 12.9898 + day * 78.233) * 43758.5453;
    const intensity = noise - Math.floor(noise);
    return day >= 5 ? Math.max(0, intensity - 0.55) * 1.4 : intensity;
  }),
);
const end = new Date("2026-10-25T00:00:00Z");
</script>
<template>
  <HeatCalendar
    unit="commits"
    :weeks="16"
    :max-count="14"
    :values="values"
    :end-date="end"
  />
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { HeatCalendar } from "@orvui/vue/charts/heat-calendar";
const values = Array.from({ length: 16 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => {
    const noise = Math.sin(week * 12.9898 + day * 78.233) * 43758.5453;
    const intensity = noise - Math.floor(noise);
    return day >= 5 ? Math.max(0, intensity - 0.55) * 1.4 : intensity;
  }),
);
const end = new Date("2026-10-25T00:00:00Z");
</script>
<template>
  <HeatCalendar
    unit="commits"
    :weeks="16"
    :max-count="14"
    :values="values"
    :end-date="end"
  />
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `HeatCalendar` | `v-model:selection` | `null \| HeatCalendarSelection` | `update:selection` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### HeatCalendar

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `unit` | `string` | `"commits"` | 否 | Noun after every count, e.g. "commits", "ships". |
| `weeks` | `number` | `16` | 否 | Number of week columns. |
| `maxCount` | `number` | `14` | 否 | Count a cell at intensity 1 stands for; a cell reads `intensity × maxCount`. |
| `values` | `number[][]` | — | 否 | `values[week][day]` intensities in 0..1, seven days per week. Missing values are zero. |
| `endDate` | `Date` | — | 否 | Last UTC calendar day of the grid. Defaults to today after mount; explicit dates render identically in every timezone. |
| `color` | `string` | `"var(--accent)"` | 否 | The single hue. Any CSS color; magnitude maps to its strength, never to a second color. |
| `className` | `string` | — | 否 | — |
| `selection` | `null \| HeatCalendarSelection` | — | 否 | Controlled selection; null clears it. Cell coordinates are zero-based week/day (Monday first). |
| `defaultSelection` | `null \| HeatCalendarSelection` | `null` | 否 | — |
| `onSelectionChange` | `(selection: HeatCalendarSelection \| null) => void` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:selection` | — | — |
| `selectionChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### HeatCalendarGrid

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### HeatCalendarLegend

### HeatCalendarTooltip

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `tooltip: calendar.tooltip` | — |

<a id="about"></a>
## 关于 Heat Calendar

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Heat Calendar？**

通过 unit、weeks、maxCount、values、endDate、color、className、selection、defaultSelection、onSelectionChange 配置 Heat Calendar；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:selection、selectionChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Returns Calendar](https://orvui.efu.me/charts/returns-calendar): 通过日历、月份汇总和可选日期内容比较每日正负收益。
- [Price Target Fan](https://orvui.efu.me/charts/price-target-fan): 使用从共同起点延伸的目标路径比较价格预测。
- [Treemap](https://orvui.efu.me/charts/treemap): 用面积随数值变化的嵌套矩形比较层级数据。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/heat-calendar.json
- 文档: https://orvui.efu.me/charts/heat-calendar
- `packages/vue/src/charts/heat-calendar/src/HeatCalendar.vue`
- `packages/vue/src/charts/heat-calendar/src/HeatCalendarGrid.vue`
- `packages/vue/src/charts/heat-calendar/src/HeatCalendarLegend.vue`
- `packages/vue/src/charts/heat-calendar/src/HeatCalendarTooltip.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
