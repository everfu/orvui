---
title: "Composition Chart"
description: "使用归一化柱形或堆叠面积比较不同分类的组成贡献。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/composition-chart"
markdown: "https://orvui.efu.me/charts/composition-chart.md"
license: "MIT"
productVersion: "0.1.0"
---

# Composition Chart

> 使用归一化柱形或堆叠面积比较不同分类的组成贡献。

## 安装

### Composition Chart — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/composition-chart.json
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

### Composition Chart

**复制源码**

```vue
<script setup lang="ts">
import { CompositionChart } from "@/components/orvui/charts/composition-chart";
const dates = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const periods = Array.from({ length: 36 }, (_, index) =>
  dates.format(new Date(Date.UTC(2026, 7, index + 1))),
);
const channels = [
  {
    id: "organic",
    name: "Organic search",
    color: "#2563eb",
    base: 46,
    trend: -0.45,
  },
  { id: "direct", name: "Direct", color: "#38bdf8", base: 24, trend: 0.12 },
  {
    id: "referral",
    name: "Referrals",
    color: "#0d9488",
    base: 10,
    trend: 0.32,
  },
  { id: "social", name: "Social", color: "#fbbf24", base: 12, trend: 0.06 },
  { id: "email", name: "Email", color: "#a78bfa", base: 5, trend: 0.09 },
  { id: "other", name: "Other", color: "#a1a1aa", base: 3, trend: 0.02 },
];
const series = channels.map(({ base, trend, ...channel }, index) => ({
  ...channel,
  values: periods.map((_, day) =>
    Math.round(
      (base +
        day * trend +
        Math.sin(day * 1.7 + index * 2) * Math.min(base / 3, 5)) *
        120,
    ),
  ),
}));
const formatVisits = (value: number) => `${value.toLocaleString("en")} visits`;
</script>
<template>
  <div class="w-full space-y-10">
    <CompositionChart
      view="bar"
      :series="series"
      :periods="periods"
      label="Illustrative acquisition channel shares"
      :format-value="formatVisits"
    />
    <div class="border-t border-border pt-10">
      <CompositionChart
        view="area"
        :series="series"
        :periods="periods"
        label="Illustrative acquisition channel shares"
        :format-value="formatVisits"
      />
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { CompositionChart } from "@orvui/vue/charts/composition-chart";
const dates = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const periods = Array.from({ length: 36 }, (_, index) =>
  dates.format(new Date(Date.UTC(2026, 7, index + 1))),
);
const channels = [
  {
    id: "organic",
    name: "Organic search",
    color: "#2563eb",
    base: 46,
    trend: -0.45,
  },
  { id: "direct", name: "Direct", color: "#38bdf8", base: 24, trend: 0.12 },
  {
    id: "referral",
    name: "Referrals",
    color: "#0d9488",
    base: 10,
    trend: 0.32,
  },
  { id: "social", name: "Social", color: "#fbbf24", base: 12, trend: 0.06 },
  { id: "email", name: "Email", color: "#a78bfa", base: 5, trend: 0.09 },
  { id: "other", name: "Other", color: "#a1a1aa", base: 3, trend: 0.02 },
];
const series = channels.map(({ base, trend, ...channel }, index) => ({
  ...channel,
  values: periods.map((_, day) =>
    Math.round(
      (base +
        day * trend +
        Math.sin(day * 1.7 + index * 2) * Math.min(base / 3, 5)) *
        120,
    ),
  ),
}));
const formatVisits = (value: number) => `${value.toLocaleString("en")} visits`;
</script>
<template>
  <div class="w-full space-y-10">
    <CompositionChart
      view="bar"
      :series="series"
      :periods="periods"
      label="Illustrative acquisition channel shares"
      :format-value="formatVisits"
    />
    <div class="border-t border-border pt-10">
      <CompositionChart
        view="area"
        :series="series"
        :periods="periods"
        label="Illustrative acquisition channel shares"
        :format-value="formatVisits"
      />
    </div>
  </div>
</template>
```

## API 参考

### CompositionChart

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `series` | `readonly CompositionSeries[]` | — | 是 | — |
| `periods` | `readonly string[]` | — | 是 | — |
| `view` | `"bar" \| "area"` | `"bar"` | 否 | — |
| `period` | `string` | — | 否 | — |
| `defaultPeriod` | `string` | `""` | 否 | — |
| `formatValue` | `(value: number) => string` | `formatNumber` | 否 | — |
| `label` | `string` | `"Composition over time"` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:period` | — | — |
| `periodChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### CompositionChartPlot

### CompositionTooltipContent

### CompositionChartLegend

## 关于 Composition Chart

使用归一化柱形或堆叠面积比较不同分类的组成贡献。

### 适用场景

- 当界面需要以下行为时使用 Composition Chart：使用归一化柱形或堆叠面积比较不同分类的组成贡献。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Composition Chart？**

通过 series、periods、view、period、defaultPeriod、formatValue、label、className 配置 Composition Chart；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:period、periodChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/composition-chart.json
- 文档: https://orvui.efu.me/charts/composition-chart
- `packages/vue/src/charts/composition-chart/src/CompositionChart.vue`
- `packages/vue/src/charts/composition-chart/src/CompositionChartPlot.vue`
- `packages/vue/src/charts/composition-chart/src/CompositionTooltipContent.vue`
- `packages/vue/src/charts/composition-chart/src/CompositionChartLegend.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
