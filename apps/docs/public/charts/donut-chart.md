---
title: "Donut Chart"
description: "通过圆环、可选择图例和中心数值比较整体中的各部分。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/donut-chart"
markdown: "https://orvui.efu.me/charts/donut-chart.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Donut Chart

> 通过圆环、可选择图例和中心数值比较整体中的各部分。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Donut Chart：通过圆环、可选择图例和中心数值比较整体中的各部分。

<a id="install"></a>
## 安装

### Donut Chart — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/donut-chart.json
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

<a id="examples"></a>
## 用法

<a id="default"></a>
### Donut Chart

**复制源码**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import {
  DonutChart,
  DonutChartCenter,
  DonutChartLegend,
  DonutChartPlot,
  type DonutSegment,
} from "@/components/orvui/charts/donut-chart";
const plans: DonutSegment[] = [
  { id: "team", name: "Team", value: 42900, color: "#2563eb" },
  { id: "business", name: "Business", value: 31250, color: "#38bdf8" },
  { id: "enterprise", name: "Enterprise", value: 22600, color: "#0d9488" },
  { id: "starter", name: "Starter", value: 18400, color: "#fbbf24" },
];
const selected = ref<string | null>(null);
const message = computed(() =>
  selected.value
    ? `Filtering by ${plans.find((plan) => plan.id === selected.value)?.name}`
    : "Select a plan to filter",
);
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const formatValue = (value: number) => currency.format(value);
function select(id: string) {
  selected.value = id === selected.value ? null : id;
}
</script>

<template>
  <div class="w-full max-w-xl space-y-3">
    <DonutChart
      :segments="plans"
      :format-value="formatValue"
      :selected-id="selected"
      label="Monthly revenue by plan"
      @select="select"
    >
      <div class="grid items-center gap-6 sm:grid-cols-[minmax(0,15rem)_1fr]">
        <DonutChartPlot
          ><DonutChartCenter total-label="Monthly revenue"
        /></DonutChartPlot>
        <DonutChartLegend />
      </div>
    </DonutChart>
    <p aria-live="polite" class="px-1 text-xs text-muted-foreground">
      {{ message }}
    </p>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { DonutChart, DonutChartCenter, DonutChartLegend, DonutChartPlot, type DonutSegment } from "@orvui/vue/charts/donut-chart";
const plans: DonutSegment[] = [
  { id: "team", name: "Team", value: 42900, color: "#2563eb" },
  { id: "business", name: "Business", value: 31250, color: "#38bdf8" },
  { id: "enterprise", name: "Enterprise", value: 22600, color: "#0d9488" },
  { id: "starter", name: "Starter", value: 18400, color: "#fbbf24" },
];
const selected = ref<string | null>(null);
const message = computed(() =>
  selected.value
    ? `Filtering by ${plans.find((plan) => plan.id === selected.value)?.name}`
    : "Select a plan to filter",
);
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const formatValue = (value: number) => currency.format(value);
function select(id: string) {
  selected.value = id === selected.value ? null : id;
}
</script>

<template>
  <div class="w-full max-w-xl space-y-3">
    <DonutChart
      :segments="plans"
      :format-value="formatValue"
      :selected-id="selected"
      label="Monthly revenue by plan"
      @select="select"
    >
      <div class="grid items-center gap-6 sm:grid-cols-[minmax(0,15rem)_1fr]">
        <DonutChartPlot
          ><DonutChartCenter total-label="Monthly revenue"
        /></DonutChartPlot>
        <DonutChartLegend />
      </div>
    </DonutChart>
    <p aria-live="polite" class="px-1 text-xs text-muted-foreground">
      {{ message }}
    </p>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `DonutChart` | `v-model:activeId` | `null \| string` | `update:activeId` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### DonutChart

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `segments` | `readonly DonutSegment[]` | — | 是 | — |
| `thickness` | `number` | `22` | 否 | — |
| `gap` | `number` | `3` | 否 | — |
| `activeId` | `null \| string` | — | 否 | — |
| `defaultActiveId` | `null \| string` | `null` | 否 | — |
| `selectedId` | `null \| string` | `null` | 否 | — |
| `formatValue` | `(value: number) => string` | `formatNumber` | 否 | — |
| `label` | `string` | `"Donut chart"` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:activeId` | — | — |
| `activeChange` | — | — |
| `select` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### DonutChartCenter

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `totalLabel` | `string` | `"Total"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `segment: segment`, `total: chart.total` | — |

### DonutChartLegend

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `value` | — | `segment: segment` | — |
| `detail` | — | `segment: segment` | — |

### DonutChartPlot

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Donut Chart

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Donut Chart？**

通过 segments、thickness、gap、activeId、defaultActiveId、selectedId、formatValue、label、className 配置 Donut Chart；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:activeId、activeChange、select，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Composition Chart](https://orvui.efu.me/charts/composition-chart): 使用归一化柱形或堆叠面积比较不同分类的组成贡献。
- [Treemap](https://orvui.efu.me/charts/treemap): 用面积随数值变化的嵌套矩形比较层级数据。
- [Status Bar](https://orvui.efu.me/charts/status-bar): 在按比例分段的条形图中汇总各命名状态的数量。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/donut-chart.json
- 文档: https://orvui.efu.me/charts/donut-chart
- `packages/vue/src/charts/donut-chart/src/DonutChart.vue`
- `packages/vue/src/charts/donut-chart/src/DonutChartCenter.vue`
- `packages/vue/src/charts/donut-chart/src/DonutChartLegend.vue`
- `packages/vue/src/charts/donut-chart/src/DonutChartPlot.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
