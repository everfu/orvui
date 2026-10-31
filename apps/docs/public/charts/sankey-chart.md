---
title: "Sankey Chart"
description: "通过连接节点与按权重分配的带状路径追踪阶段间流向。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/sankey-chart"
markdown: "https://orvui.efu.me/charts/sankey-chart.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Sankey Chart

> 通过连接节点与按权重分配的带状路径追踪阶段间流向。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Sankey Chart：通过连接节点与按权重分配的带状路径追踪阶段间流向。

<a id="install"></a>
## 安装

### Sankey Chart — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/sankey-chart.json https://orvui.efu.me/r/tabs.json
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

- `@floating-ui/dom@^1.7.0`
- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Sankey Chart

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
import { SankeyChart, type SankeyNode, type SankeyLink } from "@/components/orvui/charts/sankey-chart";
const nodes: SankeyNode[] = [
  { id: "subscriptions", label: "Subscriptions", color: "#2563eb" },
  { id: "services", label: "Services", color: "#38bdf8" },
  { id: "marketplace", label: "Marketplace", color: "#6366f1" },
  { id: "revenue", label: "Revenue", color: "#64748b" },
  { id: "cost", label: "Cost of revenue", color: "#e11d48" },
  { id: "gross", label: "Gross profit", color: "#0d9488" },
  { id: "rnd", label: "R&D", color: "#f59e0b" },
  { id: "sales", label: "Sales & marketing", color: "#fb923c" },
  { id: "admin", label: "G&A", color: "#fbbf24" },
  { id: "operating", label: "Operating profit", color: "#16a34a" },
];
function income([
  subscriptions,
  services,
  marketplace,
  cost,
  rnd,
  sales,
  admin,
]: number[]): SankeyLink[] {
  const revenue = subscriptions + services + marketplace,
    gross = revenue - cost;
  return [
    { source: "subscriptions", target: "revenue", value: subscriptions },
    { source: "services", target: "revenue", value: services },
    { source: "marketplace", target: "revenue", value: marketplace },
    { source: "revenue", target: "cost", value: cost },
    { source: "revenue", target: "gross", value: gross },
    { source: "gross", target: "rnd", value: rnd },
    { source: "gross", target: "sales", value: sales },
    { source: "gross", target: "admin", value: admin },
    {
      source: "gross",
      target: "operating",
      value: gross - rnd - sales - admin,
    },
  ];
}
const quarters = {
  q2: income([62, 18, 10, 34, 20, 16, 7]),
  q3: income([70, 17, 14, 36, 22, 17, 7]),
};
const quarter = ref<keyof typeof quarters>("q3");
const currency = (value: number) => `$${value.toLocaleString("en-US")}M`;
</script>
<template>
  <div class="w-full max-w-3xl space-y-4">
    <Tabs v-model="quarter" variant="segment"
      ><TabsList
        ><TabsTrigger value="q2">Q2</TabsTrigger
        ><TabsTrigger value="q3">Q3</TabsTrigger></TabsList
      ></Tabs
    ><SankeyChart
      :nodes="nodes"
      :links="quarters[quarter]"
      :format-value="currency"
      :label="`Income statement, ${quarter.toUpperCase()}`"
    />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
import { SankeyChart, type SankeyNode, type SankeyLink } from "@orvui/vue/charts/sankey-chart";
const nodes: SankeyNode[] = [
  { id: "subscriptions", label: "Subscriptions", color: "#2563eb" },
  { id: "services", label: "Services", color: "#38bdf8" },
  { id: "marketplace", label: "Marketplace", color: "#6366f1" },
  { id: "revenue", label: "Revenue", color: "#64748b" },
  { id: "cost", label: "Cost of revenue", color: "#e11d48" },
  { id: "gross", label: "Gross profit", color: "#0d9488" },
  { id: "rnd", label: "R&D", color: "#f59e0b" },
  { id: "sales", label: "Sales & marketing", color: "#fb923c" },
  { id: "admin", label: "G&A", color: "#fbbf24" },
  { id: "operating", label: "Operating profit", color: "#16a34a" },
];
function income([
  subscriptions,
  services,
  marketplace,
  cost,
  rnd,
  sales,
  admin,
]: number[]): SankeyLink[] {
  const revenue = subscriptions + services + marketplace,
    gross = revenue - cost;
  return [
    { source: "subscriptions", target: "revenue", value: subscriptions },
    { source: "services", target: "revenue", value: services },
    { source: "marketplace", target: "revenue", value: marketplace },
    { source: "revenue", target: "cost", value: cost },
    { source: "revenue", target: "gross", value: gross },
    { source: "gross", target: "rnd", value: rnd },
    { source: "gross", target: "sales", value: sales },
    { source: "gross", target: "admin", value: admin },
    {
      source: "gross",
      target: "operating",
      value: gross - rnd - sales - admin,
    },
  ];
}
const quarters = {
  q2: income([62, 18, 10, 34, 20, 16, 7]),
  q3: income([70, 17, 14, 36, 22, 17, 7]),
};
const quarter = ref<keyof typeof quarters>("q3");
const currency = (value: number) => `$${value.toLocaleString("en-US")}M`;
</script>
<template>
  <div class="w-full max-w-3xl space-y-4">
    <Tabs v-model="quarter" variant="segment"
      ><TabsList
        ><TabsTrigger value="q2">Q2</TabsTrigger
        ><TabsTrigger value="q3">Q3</TabsTrigger></TabsList
      ></Tabs
    ><SankeyChart
      :nodes="nodes"
      :links="quarters[quarter]"
      :format-value="currency"
      :label="`Income statement, ${quarter.toUpperCase()}`"
    />
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `SankeyChart` | `v-model:activeId` | `null \| string` | `update:activeId` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### SankeyChart

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `nodes` | `readonly SankeyNode[]` | — | 是 | — |
| `links` | `readonly SankeyLink[]` | — | 是 | — |
| `label` | `string` | `"Sankey chart"` | 否 | — |
| `formatValue` | `(value: number) => string` | `formatNumber` | 否 | — |
| `colors` | `readonly string[]` | `SANKEY_COLORS` | 否 | — |
| `nodeWidth` | `number` | `12` | 否 | — |
| `nodePadding` | `number` | `16` | 否 | — |
| `activeId` | `null \| string` | — | 否 | — |
| `defaultActiveId` | `null \| string` | `null` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:activeId` | — | — |
| `activeChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### SankeyChartPlot

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `showValues` | `boolean` | `true` | 否 | — |

### SankeyChartTooltip

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `active: chart.active` | — |

<a id="about"></a>
## 关于 Sankey Chart

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Sankey Chart？**

通过 nodes、links、label、formatValue、colors、nodeWidth、nodePadding、activeId、defaultActiveId、className 配置 Sankey Chart；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:activeId、activeChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Treemap](https://orvui.efu.me/charts/treemap): 用面积随数值变化的嵌套矩形比较层级数据。
- [Funnel Chart](https://orvui.efu.me/charts/funnel-chart): 跟踪连续阶段，并检查相邻步骤之间的转化与流失。
- [Returns Calendar](https://orvui.efu.me/charts/returns-calendar): 通过日历、月份汇总和可选日期内容比较每日正负收益。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/sankey-chart.json
- 文档: https://orvui.efu.me/charts/sankey-chart
- `packages/vue/src/charts/sankey-chart/src/SankeyChart.vue`
- `packages/vue/src/charts/sankey-chart/src/SankeyChartPlot.vue`
- `packages/vue/src/charts/sankey-chart/src/SankeyChartTooltip.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
