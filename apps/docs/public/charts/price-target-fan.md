---
title: "Price Target Fan"
description: "使用从共同起点延伸的目标路径比较价格预测。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/price-target-fan"
markdown: "https://orvui.efu.me/charts/price-target-fan.md"
license: "MIT"
productVersion: "0.1.0"
---

# Price Target Fan

> 使用从共同起点延伸的目标路径比较价格预测。

## 安装

### Price Target Fan — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/price-target-fan.json
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

## 用法

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

## 关于 Price Target Fan

使用从共同起点延伸的目标路径比较价格预测。

### 适用场景

- 当界面需要以下行为时使用 Price Target Fan：使用从共同起点延伸的目标路径比较价格预测。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Price Target Fan？**

通过 label、current、targets、dates、history、active、defaultActive、onActiveChange、className 配置 Price Target Fan；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:active、activeChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/price-target-fan.json
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
