---
title: "Treemap"
description: "用面积随数值变化的嵌套矩形比较层级数据。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/treemap"
markdown: "https://orvui.efu.me/charts/treemap.md"
license: "MIT"
productVersion: "0.1.0"
---

# Treemap

> 用面积随数值变化的嵌套矩形比较层级数据。

用面积随数值变化的嵌套矩形比较层级数据。

## 适用场景

- 当界面需要以下行为时使用 Treemap：用面积随数值变化的嵌套矩形比较层级数据。

## 安装

### Treemap — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/treemap.json https://orvui.efu.me/r/tabs.json
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

## 用法

### Treemap

**复制源码**

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
import {
  Treemap,
  TreemapPlot,
  TreemapTooltip,
  TreemapLegend,
  type TreemapNode,
} from "@/components/orvui/charts/treemap";
const sectors = [
  {
    id: "technology",
    label: "Technology",
    color: "#3454b5",
    companies: ["AAPL", "MSFT", "NVDA"],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    color: "#087e6c",
    companies: ["LLY", "UNH", "JNJ"],
  },
  {
    id: "finance",
    label: "Finance",
    color: "#7c3db5",
    companies: ["JPM", "V", "BAC"],
  },
  {
    id: "energy",
    label: "Energy",
    color: "#a35318",
    companies: ["XOM", "CVX", "SHEL"],
  },
];
const quarters = [
  {
    id: "q1",
    label: "Q1",
    values: [210, 190, 130, 128, 85, 45, 80, 95, 30, 74, 62, 44],
  },
  {
    id: "q2",
    label: "Q2",
    values: [170, 220, 175, 108, 50, 60, 90, 75, 56, 68, 69, 34],
  },
  {
    id: "q3",
    label: "Q3",
    values: [260, 205, 155, 100, 95, 46, 140, 150, 0, 40, 50, 25],
  },
];
const data: Record<string, readonly TreemapNode[]> = {};
for (const quarter of quarters)
  data[quarter.id] = sectors.map((sector, index) => ({
    id: sector.id,
    label: sector.label,
    color: sector.color,
    children: sector.companies.map((company, child) => ({
      id: company,
      label: company,
      value: quarter.values[index * 3 + child] * 1000,
    })),
  }));
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const formatValue = (value: number) => currency.format(value);
const quarter = ref("q1"),
  previewId = useId(),
  panelId = previewId + "-treemap";
</script>
<template>
  <div class="w-full max-w-2xl min-w-0 py-2">
    <Tabs v-model="quarter"
      ><div class="mb-5 flex items-center justify-between gap-3">
        <div class="space-y-1">
          <p class="text-sm font-medium">Portfolio allocation</p>
          <p class="text-xs text-muted-foreground">Demo data</p>
        </div>
        <TabsList
          aria-label="Portfolio quarter"
          wrapper-class-name="w-auto"
          class="bg-muted"
          ><TabsTrigger
            v-for="item in quarters"
            :key="item.id"
            :value="item.id"
            :id="`${previewId}-${item.id}`"
            :aria-controls="panelId"
            :tabindex="quarter === item.id ? 0 : -1"
            indicator-class-name="bg-background"
            class="min-h-8 px-3 py-1.5 text-xs [&_[data-tabs-label]]:text-foreground"
            >{{ item.label }}</TabsTrigger
          ></TabsList
        >
      </div>
      <div
        :id="panelId"
        role="tabpanel"
        :aria-labelledby="`${previewId}-${quarter}`"
      >
        <Treemap
          :data="data[quarter]"
          :format-value="formatValue"
          label="Portfolio allocation"
          ><TreemapPlot class="h-72 sm:h-80" /><TreemapTooltip /><TreemapLegend
        /></Treemap></div
    ></Tabs>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
import { Treemap, TreemapPlot, TreemapTooltip, TreemapLegend, type TreemapNode } from "@orvui/vue/charts/treemap";
const sectors = [
  {
    id: "technology",
    label: "Technology",
    color: "#3454b5",
    companies: ["AAPL", "MSFT", "NVDA"],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    color: "#087e6c",
    companies: ["LLY", "UNH", "JNJ"],
  },
  {
    id: "finance",
    label: "Finance",
    color: "#7c3db5",
    companies: ["JPM", "V", "BAC"],
  },
  {
    id: "energy",
    label: "Energy",
    color: "#a35318",
    companies: ["XOM", "CVX", "SHEL"],
  },
];
const quarters = [
  {
    id: "q1",
    label: "Q1",
    values: [210, 190, 130, 128, 85, 45, 80, 95, 30, 74, 62, 44],
  },
  {
    id: "q2",
    label: "Q2",
    values: [170, 220, 175, 108, 50, 60, 90, 75, 56, 68, 69, 34],
  },
  {
    id: "q3",
    label: "Q3",
    values: [260, 205, 155, 100, 95, 46, 140, 150, 0, 40, 50, 25],
  },
];
const data: Record<string, readonly TreemapNode[]> = {};
for (const quarter of quarters)
  data[quarter.id] = sectors.map((sector, index) => ({
    id: sector.id,
    label: sector.label,
    color: sector.color,
    children: sector.companies.map((company, child) => ({
      id: company,
      label: company,
      value: quarter.values[index * 3 + child] * 1000,
    })),
  }));
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const formatValue = (value: number) => currency.format(value);
const quarter = ref("q1"),
  previewId = useId(),
  panelId = previewId + "-treemap";
</script>
<template>
  <div class="w-full max-w-2xl min-w-0 py-2">
    <Tabs v-model="quarter"
      ><div class="mb-5 flex items-center justify-between gap-3">
        <div class="space-y-1">
          <p class="text-sm font-medium">Portfolio allocation</p>
          <p class="text-xs text-muted-foreground">Demo data</p>
        </div>
        <TabsList
          aria-label="Portfolio quarter"
          wrapper-class-name="w-auto"
          class="bg-muted"
          ><TabsTrigger
            v-for="item in quarters"
            :key="item.id"
            :value="item.id"
            :id="`${previewId}-${item.id}`"
            :aria-controls="panelId"
            :tabindex="quarter === item.id ? 0 : -1"
            indicator-class-name="bg-background"
            class="min-h-8 px-3 py-1.5 text-xs [&_[data-tabs-label]]:text-foreground"
            >{{ item.label }}</TabsTrigger
          ></TabsList
        >
      </div>
      <div
        :id="panelId"
        role="tabpanel"
        :aria-labelledby="`${previewId}-${quarter}`"
      >
        <Treemap
          :data="data[quarter]"
          :format-value="formatValue"
          label="Portfolio allocation"
          ><TreemapPlot class="h-72 sm:h-80" /><TreemapTooltip /><TreemapLegend
        /></Treemap></div
    ></Tabs>
  </div>
</template>
```

## API 参考

### Treemap

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `data` | `readonly TreemapNode[]` | — | 是 | — |
| `label` | `string` | `"Treemap"` | 否 | — |
| `formatValue` | `(value: number) => string` | `formatNumber` | 否 | — |
| `colors` | `readonly string[]` | `TREEMAP_COLORS` | 否 | — |
| `textColor` | `string` | `"#ffffff"` | 否 | — |
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

### TreemapPlot

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `tileClassName` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `tile` | — | `v-bind: scope` | — |

### TreemapTooltip

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `item: chart.active` | — |

### TreemapLegend

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `showValues` | `boolean` | `false` | 否 | — |

### TreemapCell

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `tile` | `TreemapTile` | — | 是 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `tile: tile` | — |

## 关于 Treemap

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Treemap？**

通过 data、label、formatValue、colors、textColor、activeId、defaultActiveId、className 配置 Treemap；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:activeId、activeChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/treemap.json
- 文档: https://orvui.efu.me/charts/treemap
- `packages/vue/src/charts/treemap/src/Treemap.vue`
- `packages/vue/src/charts/treemap/src/TreemapPlot.vue`
- `packages/vue/src/charts/treemap/src/TreemapTooltip.vue`
- `packages/vue/src/charts/treemap/src/TreemapLegend.vue`
- `packages/vue/src/charts/treemap/src/TreemapCell.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
