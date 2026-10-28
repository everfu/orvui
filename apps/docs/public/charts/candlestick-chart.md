---
title: "Candlestick Chart"
description: "借助指针或键盘十字线检查开高低收与成交量数据。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/candlestick-chart"
markdown: "https://orvui.efu.me/charts/candlestick-chart.md"
license: "MIT"
productVersion: "0.1.0"
---

# Candlestick Chart

> 借助指针或键盘十字线检查开高低收与成交量数据。

借助指针或键盘十字线检查开高低收与成交量数据。

## 适用场景

- 当界面需要以下行为时使用 Candlestick Chart：借助指针或键盘十字线检查开高低收与成交量数据。

## 安装

### Candlestick Chart — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/candlestick-chart.json https://orvui.efu.me/r/button.json
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
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `tailwind-merge@^3.0.0`

## 用法

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

## 关于 Candlestick Chart

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Candlestick Chart？**

通过 candles、lastPrice、activeId、defaultActiveId、formatPrice、formatVolume、label、className 配置 Candlestick Chart；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:activeId、activeIdChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/candlestick-chart.json
- 文档: https://orvui.efu.me/charts/candlestick-chart
- `packages/vue/src/charts/candlestick-chart/src/CandlestickChart.vue`
- `packages/vue/src/charts/candlestick-chart/src/CandlestickChartLegend.vue`
- `packages/vue/src/charts/candlestick-chart/src/CandlestickChartPlot.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
