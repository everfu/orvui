---
title: "Price Target Fan"
description: "使用从共同起点延伸的目标路径比较价格预测。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/price-target-fan"
markdown: "https://orvui.efu.me/charts/price-target-fan.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Price Target Fan

> 使用从共同起点延伸的目标路径比较价格预测。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Price Target Fan：使用从共同起点延伸的目标路径比较价格预测。

<a id="install"></a>
## 安装

### Price Target Fan — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/price-target-fan.json
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Price Target Fan

**复制源码**

```vue
<script setup lang="ts">
import { PriceTargetFan, type PriceTarget } from "@/components/orvui/charts/price-target-fan";
const prices = [
  158.4, 164.2, 160.8, 173.1, 170.6, 181.3, 175.8, 183.7, 178.2, 184.1, 180.5,
  177.3, 178.52,
];
const history = prices.map((price, index) => ({
  date: new Date(Date.UTC(2025, 8 + index, 14)).toISOString().slice(0, 10),
  price,
}));
const targets: [PriceTarget, PriceTarget, PriceTarget] = [
  { key: "High", price: 232, analysts: 9 },
  { key: "Mean", price: 205, analysts: 34 },
  { key: "Low", price: 168, analysts: 6 },
];
</script>
<template>
  <PriceTargetFan
    :current="178.52"
    :history="history"
    :targets="targets"
    :dates="{ horizon: 'Sep 2027' }"
  />
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { PriceTargetFan, type PriceTarget } from "@orvui/vue/charts/price-target-fan";
const prices = [
  158.4, 164.2, 160.8, 173.1, 170.6, 181.3, 175.8, 183.7, 178.2, 184.1, 180.5,
  177.3, 178.52,
];
const history = prices.map((price, index) => ({
  date: new Date(Date.UTC(2025, 8 + index, 14)).toISOString().slice(0, 10),
  price,
}));
const targets: [PriceTarget, PriceTarget, PriceTarget] = [
  { key: "High", price: 232, analysts: 9 },
  { key: "Mean", price: 205, analysts: 34 },
  { key: "Low", price: 168, analysts: 6 },
];
</script>
<template>
  <PriceTargetFan
    :current="178.52"
    :history="history"
    :targets="targets"
    :dates="{ horizon: 'Sep 2027' }"
  />
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `PriceTargetFan` | `v-model:active` | `null \| { type: "history"; date: string; } \| { type: "target"; key: string; }` | `update:active` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### PriceTargetFan

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | `string` | `"Price target · 12 months"` | 否 | Accessible name of the chart. |
| `current` | `number` | — | 是 | Last traded price; the history walks to this point. |
| `targets` | `[PriceTarget, PriceTarget, PriceTarget]` | — | 是 | High, mean and low targets, in that order. |
| `dates` | `{ start?: string; mid?: string; horizon?: string; }` | `{}` | 否 | Axis labels, oldest to horizon. |
| `history` | `PriceHistoryPoint[]` | `[]` | 否 | Actual prices, oldest first, using ISO dates. Empty history renders only the current price and targets. |
| `active` | `null \| { type: "history"; date: string; } \| { type: "target"; key: string; }` | — | 否 | — |
| `defaultActive` | `null \| { type: "history"; date: string; } \| { type: "target"; key: string; }` | `null` | 否 | — |
| `onActiveChange` | `(active: PriceTargetFanActive \| null) => void` | — | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:active` | — | — |
| `activeChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### PriceTargetFanHeader

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### PriceTargetFanPlot

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `(props: {}) => any` | — | — |

### PriceTargetFanSvg

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### PriceTargetFanAxes

### PriceTargetFanHistory

### PriceTargetFanTargets

### PriceTargetFanNow

### PriceTargetFanCursor

### PriceTargetFanTooltip

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `overlay: chart.overlay` | — |

<a id="about"></a>
## 关于 Price Target Fan

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Price Target Fan？**

通过 label、current、targets、dates、history、active、defaultActive、onActiveChange、className 配置 Price Target Fan；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:active、activeChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Heat Calendar](https://orvui.efu.me/charts/heat-calendar): 在紧凑日历网格中展示每日活动，检查时可读取精确数值。
- [Returns Calendar](https://orvui.efu.me/charts/returns-calendar): 通过日历、月份汇总和可选日期内容比较每日正负收益。
- [Candlestick Chart](https://orvui.efu.me/charts/candlestick-chart): 借助指针或键盘十字线检查开高低收与成交量数据。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/price-target-fan.json
- 文档: https://orvui.efu.me/charts/price-target-fan
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFan.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanHeader.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanPlot.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanSvg.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanAxes.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanHistory.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanTargets.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanNow.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanCursor.vue`
- `packages/vue/src/charts/price-target-fan/src/PriceTargetFanTooltip.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
