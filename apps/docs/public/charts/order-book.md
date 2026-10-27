---
title: "Order Book"
description: "在订单簿中检查买卖档位、累计深度与价格选择。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/order-book"
markdown: "https://orvui.efu.me/charts/order-book.md"
license: "MIT"
productVersion: "0.1.0"
---

# Order Book

> 在订单簿中检查买卖档位、累计深度与价格选择。

## 安装

### Order Book — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/order-book.json https://orvui.efu.me/r/button.json
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

### Order Book

**复制源码**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "@/components/orvui/motion/button";
import {
  OrderBook,
  OrderBookHeader,
  OrderBookSide,
  OrderBookSpread,
  OrderBookBalance,
  OrderBookDepthSummary,
} from "@/components/orvui/charts/order-book";
const sizes = {
  ask: [284, 574, 363, 278, 1800, 2200, 1100, 1200, 782],
  bid: [194, 543, 314, 592, 715, 744, 789, 735, 1100],
};
const playing = ref(true),
  selected = ref<number | null>(null),
  tick = ref(0);
function levels(side: "ask" | "bid") {
  const direction = side === "ask" ? 1 : -1;
  return sizes[side].map((size, index) => {
    const phase = (index + (direction === 1 ? 1 : 0)) % 3;
    const updated = tick.value - ((tick.value + phase) % 3);
    return {
      price: Number((245.85 + direction * (index + 1) * 0.15).toFixed(2)),
      size:
        updated <= 0
          ? size
          : Math.round(
              size *
                (1 + Math.sin(updated * 1.3 + index * 2.1 + direction) * 0.32),
            ),
    };
  });
}
const book = computed(() => ({ asks: levels("ask"), bids: levels("bid") }));
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => {
    if (playing.value && !document.hidden) tick.value++;
  }, 950);
});
onBeforeUnmount(() => clearInterval(timer));
function step() {
  playing.value = false;
  tick.value++;
}
</script>
<template>
  <div class="w-full max-w-[520px] space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3 px-1">
      <div class="text-sm font-medium">
        SOL / USD
        <span
          class="ml-2 rounded border border-border px-1.5 py-0.5 text-[9px] uppercase text-muted-foreground"
          >Simulated</span
        >
      </div>
      <div class="flex gap-2">
        <Button variant="ghost" size="sm" @click="playing = !playing">{{
          playing ? "Pause" : "Resume"
        }}</Button
        ><Button variant="ghost" size="sm" @click="step">Step</Button>
      </div>
    </div>
    <OrderBook
      :bids="book.bids"
      :asks="book.asks"
      base-symbol="SOL"
      quote-symbol="USD"
      label="Simulated SOL / USD order book"
      @level-select="selected = $event.price"
      ><OrderBookHeader /><OrderBookSide
        side="ask" /><OrderBookSpread /><OrderBookSide
        side="bid" /><OrderBookDepthSummary /><OrderBookBalance
    /></OrderBook>
    <p aria-live="polite" class="px-1 text-xs text-muted-foreground">
      {{
        selected === null
          ? "Click a price to use it, for example in an order ticket."
          : `Selected ${selected.toFixed(2)} USD`
      }}
    </p>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Button } from "@orvui/vue/motion/button";
import { OrderBook, OrderBookHeader, OrderBookSide, OrderBookSpread, OrderBookBalance, OrderBookDepthSummary } from "@orvui/vue/charts/order-book";
const sizes = {
  ask: [284, 574, 363, 278, 1800, 2200, 1100, 1200, 782],
  bid: [194, 543, 314, 592, 715, 744, 789, 735, 1100],
};
const playing = ref(true),
  selected = ref<number | null>(null),
  tick = ref(0);
function levels(side: "ask" | "bid") {
  const direction = side === "ask" ? 1 : -1;
  return sizes[side].map((size, index) => {
    const phase = (index + (direction === 1 ? 1 : 0)) % 3;
    const updated = tick.value - ((tick.value + phase) % 3);
    return {
      price: Number((245.85 + direction * (index + 1) * 0.15).toFixed(2)),
      size:
        updated <= 0
          ? size
          : Math.round(
              size *
                (1 + Math.sin(updated * 1.3 + index * 2.1 + direction) * 0.32),
            ),
    };
  });
}
const book = computed(() => ({ asks: levels("ask"), bids: levels("bid") }));
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => {
    if (playing.value && !document.hidden) tick.value++;
  }, 950);
});
onBeforeUnmount(() => clearInterval(timer));
function step() {
  playing.value = false;
  tick.value++;
}
</script>
<template>
  <div class="w-full max-w-[520px] space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3 px-1">
      <div class="text-sm font-medium">
        SOL / USD
        <span
          class="ml-2 rounded border border-border px-1.5 py-0.5 text-[9px] uppercase text-muted-foreground"
          >Simulated</span
        >
      </div>
      <div class="flex gap-2">
        <Button variant="ghost" size="sm" @click="playing = !playing">{{
          playing ? "Pause" : "Resume"
        }}</Button
        ><Button variant="ghost" size="sm" @click="step">Step</Button>
      </div>
    </div>
    <OrderBook
      :bids="book.bids"
      :asks="book.asks"
      base-symbol="SOL"
      quote-symbol="USD"
      label="Simulated SOL / USD order book"
      @level-select="selected = $event.price"
      ><OrderBookHeader /><OrderBookSide
        side="ask" /><OrderBookSpread /><OrderBookSide
        side="bid" /><OrderBookDepthSummary /><OrderBookBalance
    /></OrderBook>
    <p aria-live="polite" class="px-1 text-xs text-muted-foreground">
      {{
        selected === null
          ? "Click a price to use it, for example in an order ticket."
          : `Selected ${selected.toFixed(2)} USD`
      }}
    </p>
  </div>
</template>
```

## API 参考

### OrderBook

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `bids` | `readonly OrderBookLevel[]` | — | 是 | — |
| `asks` | `readonly OrderBookLevel[]` | — | 是 | — |
| `levels` | `number` | `9` | 否 | — |
| `lastPrice` | `number` | — | 否 | — |
| `label` | `string` | `"Order book"` | 否 | — |
| `baseSymbol` | `string` | `""` | 否 | — |
| `quoteSymbol` | `string` | `"USD"` | 否 | — |
| `formatPrice` | `(value: number) => string` | `((value: number) => priceFormat.format(value))` | 否 | — |
| `formatSize` | `(value: number) => string` | `formatCompact` | 否 | — |
| `activeLevel` | `null \| { side: "bid" \| "ask"; price: number; }` | — | 否 | — |
| `defaultActiveLevel` | `null \| { side: "bid" \| "ask"; price: number; }` | `null` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:activeLevel` | — | — |
| `activeLevelChange` | — | — |
| `levelSelect` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### OrderBookHeader

### OrderBookSide

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `side` | `"bid" \| "ask"` | — | 是 | — |

### OrderBookSpread

### OrderBookBalance

### OrderBookDepthSummary

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Hover a level to see the cost of filling up to it"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `summary: book.summary` | — |

### OrderBookDepthRow

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `row` | `DepthLevel` | — | 是 | — |
| `side` | `"bid" \| "ask"` | — | 是 | — |
| `inRange` | `boolean` | `false` | 否 | — |
| `fraction` | `number` | — | 是 | — |
| `entranceIndex` | `number` | — | 是 | — |

## 关于 Order Book

在订单簿中检查买卖档位、累计深度与价格选择。

### 适用场景

- 当界面需要以下行为时使用 Order Book：在订单簿中检查买卖档位、累计深度与价格选择。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Order Book？**

通过 bids、asks、levels、lastPrice、label、baseSymbol、quoteSymbol、formatPrice、formatSize、activeLevel、defaultActiveLevel、className 配置 Order Book；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:activeLevel、activeLevelChange、levelSelect，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/order-book.json
- 文档: https://orvui.efu.me/charts/order-book
- `packages/vue/src/charts/order-book/src/OrderBook.vue`
- `packages/vue/src/charts/order-book/src/OrderBookHeader.vue`
- `packages/vue/src/charts/order-book/src/OrderBookSide.vue`
- `packages/vue/src/charts/order-book/src/OrderBookSpread.vue`
- `packages/vue/src/charts/order-book/src/OrderBookBalance.vue`
- `packages/vue/src/charts/order-book/src/OrderBookDepthSummary.vue`
- `packages/vue/src/charts/order-book/src/OrderBookDepthRow.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
