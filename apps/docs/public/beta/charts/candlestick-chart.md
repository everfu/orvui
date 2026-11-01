---
title: "Candlestick Chart"
description: "借助指针或键盘十字线检查开高低收与成交量数据。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/candlestick-chart"
markdown: "https://orvui.efu.me/charts/candlestick-chart.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Candlestick Chart

> 借助指针或键盘十字线检查开高低收与成交量数据。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Candlestick Chart：借助指针或键盘十字线检查开高低收与成交量数据。

<a id="install"></a>
## 安装

### Candlestick Chart — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/candlestick-chart.json https://orvui.efu.me/beta/r/button.json
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
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `tailwind-merge@^3.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Candlestick Chart

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "@/components/orvui/motion/button";
import {
  CandlestickChart,
  CandlestickChartLegend,
  CandlestickChartPlot,
  type Candle,
} from "@/components/orvui/charts/candlestick-chart";
const label = (seconds: number) =>
  `${String(Math.floor(seconds / 3600) % 24).padStart(2, "0")}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}`;
function initial(): Candle[] {
  let previous = 2380;
  return Array.from({ length: 48 }, (_, index) => {
    const open = previous,
      close =
        open *
        (1 + Math.sin(index * 0.7) * 0.004 + Math.cos(index * 0.23) * 0.003);
    const reach =
        Math.abs(close - open) * 0.6 +
        1.5 +
        Math.abs(Math.sin(index * 1.9)) * 3,
      start = 43200 + index * 300;
    previous = close;
    return {
      id: String(start),
      label: label(start),
      open,
      close,
      high: Math.max(open, close) + reach * Math.abs(Math.cos(index * 1.3)),
      low: Math.min(open, close) - reach * Math.abs(Math.sin(index * 0.9)),
      volume: 120 + Math.abs(Math.sin(index * 0.6)) * 420,
    };
  });
}
const playing = ref(true),
  state = ref({ tick: 0, candles: initial() });
function advance() {
  const tick = state.value.tick + 1,
    candles = state.value.candles,
    last = candles.at(-1)!;
  const price =
    last.close *
    (1 + Math.sin(tick * 1.7) * 0.0012 + Math.cos(tick * 0.6) * 0.0006);
  const next = [
    ...candles.slice(0, -1),
    {
      ...last,
      close: price,
      high: Math.max(last.high, price),
      low: Math.min(last.low, price),
      volume: last.volume + 12 + Math.abs(Math.sin(tick)) * 30,
    },
  ];
  if (tick % 8 === 0) {
    next.shift();
    const start = Number(last.id) + 300;
    next.push({
      id: String(start),
      label: label(start),
      open: price,
      close: price,
      high: price,
      low: price,
      volume: 0,
    });
  }
  state.value = { tick, candles: next };
}
function step() {
  playing.value = false;
  advance();
}
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => {
    if (playing.value && !document.hidden) advance();
  }, 650);
});
onBeforeUnmount(() => clearInterval(timer));
const price = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatPrice = (value: number) => price.format(value);
</script>
<template>
  <div class="w-full max-w-3xl space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3 px-1">
      <div class="flex items-center gap-2 text-sm font-medium">
        ETH / USD · 5m<span
          class="rounded border border-border px-1.5 py-0.5 text-[9px] font-normal uppercase tracking-wider text-muted-foreground"
          >Simulated</span
        >
      </div>
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="sm" @click="playing = !playing">{{
          playing ? "Pause" : "Resume"
        }}</Button
        ><Button variant="ghost" size="sm" @click="step">Step</Button>
      </div>
    </div>
    <CandlestickChart
      :candles="state.candles"
      :last-price="state.candles.at(-1)?.close"
      label="Simulated ETH / USD, 5 minute candles"
      :format-price="formatPrice"
      ><CandlestickChartLegend /><CandlestickChartPlot
        :height="320"
        class="mt-4"
    /></CandlestickChart>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "@orvui/vue/motion/button";
import { CandlestickChart, CandlestickChartLegend, CandlestickChartPlot, type Candle } from "@orvui/vue/charts/candlestick-chart";
const label = (seconds: number) =>
  `${String(Math.floor(seconds / 3600) % 24).padStart(2, "0")}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}`;
function initial(): Candle[] {
  let previous = 2380;
  return Array.from({ length: 48 }, (_, index) => {
    const open = previous,
      close =
        open *
        (1 + Math.sin(index * 0.7) * 0.004 + Math.cos(index * 0.23) * 0.003);
    const reach =
        Math.abs(close - open) * 0.6 +
        1.5 +
        Math.abs(Math.sin(index * 1.9)) * 3,
      start = 43200 + index * 300;
    previous = close;
    return {
      id: String(start),
      label: label(start),
      open,
      close,
      high: Math.max(open, close) + reach * Math.abs(Math.cos(index * 1.3)),
      low: Math.min(open, close) - reach * Math.abs(Math.sin(index * 0.9)),
      volume: 120 + Math.abs(Math.sin(index * 0.6)) * 420,
    };
  });
}
const playing = ref(true),
  state = ref({ tick: 0, candles: initial() });
function advance() {
  const tick = state.value.tick + 1,
    candles = state.value.candles,
    last = candles.at(-1)!;
  const price =
    last.close *
    (1 + Math.sin(tick * 1.7) * 0.0012 + Math.cos(tick * 0.6) * 0.0006);
  const next = [
    ...candles.slice(0, -1),
    {
      ...last,
      close: price,
      high: Math.max(last.high, price),
      low: Math.min(last.low, price),
      volume: last.volume + 12 + Math.abs(Math.sin(tick)) * 30,
    },
  ];
  if (tick % 8 === 0) {
    next.shift();
    const start = Number(last.id) + 300;
    next.push({
      id: String(start),
      label: label(start),
      open: price,
      close: price,
      high: price,
      low: price,
      volume: 0,
    });
  }
  state.value = { tick, candles: next };
}
function step() {
  playing.value = false;
  advance();
}
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => {
    if (playing.value && !document.hidden) advance();
  }, 650);
});
onBeforeUnmount(() => clearInterval(timer));
const price = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatPrice = (value: number) => price.format(value);
</script>
<template>
  <div class="w-full max-w-3xl space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3 px-1">
      <div class="flex items-center gap-2 text-sm font-medium">
        ETH / USD · 5m<span
          class="rounded border border-border px-1.5 py-0.5 text-[9px] font-normal uppercase tracking-wider text-muted-foreground"
          >Simulated</span
        >
      </div>
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="sm" @click="playing = !playing">{{
          playing ? "Pause" : "Resume"
        }}</Button
        ><Button variant="ghost" size="sm" @click="step">Step</Button>
      </div>
    </div>
    <CandlestickChart
      :candles="state.candles"
      :last-price="state.candles.at(-1)?.close"
      label="Simulated ETH / USD, 5 minute candles"
      :format-price="formatPrice"
      ><CandlestickChartLegend /><CandlestickChartPlot
        :height="320"
        class="mt-4"
    /></CandlestickChart>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `CandlestickChart` | `v-model:activeId` | `null \| string` | `update:activeId` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### CandlestickChart

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `candles` | `readonly Candle[]` | — | 是 | — |
| `lastPrice` | `number` | — | 否 | — |
| `activeId` | `null \| string` | — | 否 | — |
| `defaultActiveId` | `null \| string` | `null` | 否 | — |
| `formatPrice` | `(value: number) => string` | `formatNumber` | 否 | — |
| `formatVolume` | `(value: number) => string` | `formatCompact` | 否 | — |
| `label` | `string` | `"Candlestick chart"` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:activeId` | — | — |
| `activeIdChange` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### CandlestickChartLegend

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `candle: candle`, `change: change` | — |

### CandlestickChartPlot

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `height` | `number` | `320` | 否 | — |

<a id="about"></a>
## 关于 Candlestick Chart

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Candlestick Chart？**

通过 candles、lastPrice、activeId、defaultActiveId、formatPrice、formatVolume、label、className 配置 Candlestick Chart；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:activeId、activeIdChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Volume Profile](https://orvui.efu.me/charts/volume-profile): 通过横向双向条形图比较各价格区间的成交量。
- [Price Target Fan](https://orvui.efu.me/charts/price-target-fan): 使用从共同起点延伸的目标路径比较价格预测。
- [Order Book](https://orvui.efu.me/charts/order-book): 在订单簿中检查买卖档位、累计深度与价格选择。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/candlestick-chart.json
- 文档: https://orvui.efu.me/charts/candlestick-chart
- `packages/vue/src/charts/candlestick-chart/src/CandlestickChart.vue`
- `packages/vue/src/charts/candlestick-chart/src/CandlestickChartLegend.vue`
- `packages/vue/src/charts/candlestick-chart/src/CandlestickChartPlot.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
