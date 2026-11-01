---
title: "Prediction Market"
description: "查看市场信息，选择结果并组合包含收益估算的买卖票据。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/prediction-market"
markdown: "https://orvui.efu.me/components/blocks/prediction-market.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Prediction Market

> 查看市场信息，选择结果并组合包含收益估算的买卖票据。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Prediction Market：查看市场信息，选择结果并组合包含收益估算的买卖票据。

<a id="install"></a>
## 安装

### Prediction Market — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/prediction-market.json
```

### Market Cards — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/prediction-market-card.json
```

### Trade Ticket — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/prediction-market.json
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

- `@floating-ui/dom@^1.7.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Prediction Market

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { PredictionMarket, type PredictionMarketOrderValue } from "@/components/orvui/blocks/prediction-market";
const outcomes = [
  { id: "yes", label: "Yes", price: 0.167 },
  { id: "no", label: "No", price: 0.834 },
];
const order = ref<PredictionMarketOrderValue>({
  mode: "buy",
  outcomeId: "yes",
  amount: "115",
});
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <PredictionMarket
      v-model="order"
      :outcomes="outcomes"
      :balance="500"
      :positions="{ yes: 125, no: 48 }"
      :quick-amounts="[1, 5, 10, 100]"
    />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { PredictionMarket, type PredictionMarketOrderValue } from "@orvui/vue/blocks/prediction-market";
const outcomes = [
  { id: "yes", label: "Yes", price: 0.167 },
  { id: "no", label: "No", price: 0.834 },
];
const order = ref<PredictionMarketOrderValue>({
  mode: "buy",
  outcomeId: "yes",
  amount: "115",
});
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <PredictionMarket
      v-model="order"
      :outcomes="outcomes"
      :balance="500"
      :positions="{ yes: 125, no: 48 }"
      :quick-amounts="[1, 5, 10, 100]"
    />
  </div>
</template>
```

<a id="market-cards"></a>
### Market Cards

比较市场列表、检查赔率与收益，并收藏单张卡片。

**复制源码**

```vue
<script setup lang="ts">
import { h, ref } from "vue";
import { PredictionMarketCard } from "@/components/orvui/blocks/prediction-market";
import { Button } from "@/components/orvui/motion/button";
// Synthetic club emblems authored for this demonstration; no external team marks.
function badge(label: string, color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path fill="${color}" d="M32 3 57 17v30L32 61 7 47V17Z"/><path fill="none" stroke="white" stroke-opacity=".6" stroke-width="2" d="m32 9 20 11v24L32 55 12 44V20Z"/><text x="32" y="39" fill="white" text-anchor="middle" font-family="system-ui,sans-serif" font-size="21" font-weight="700">${label}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
const boston = badge("GH", "#15803d"), lakers = badge("GD", "#b45309"), rays = badge("BB", "#2563eb"), braves = badge("RS", "#be123c");
const markets = [
  {
    id: "basketball",
    title: "Green Harbor vs. Golden District",
    category: "Basketball",
    status: "Sunday · 7:30 PM",
    volume: "$2.4M",
    live: false,
    image: boston,
    history: [12, 18, 15, 26, 20, 32, 29, 38, 34, 48, 43, 58],
    outcomes: [
      {
        id: "boston",
        label: "Harbor",
        probability: 0.51,
        next: 0.56,
        color: "#34d399",
        image: boston,
      },
      {
        id: "lakers",
        label: "District",
        probability: 0.49,
        next: 0.44,
        color: "#fbbf24",
        image: lakers,
      },
    ],
  },
  {
    id: "baseball",
    title: "Blue Bay vs. Rose Summit",
    category: "MLB",
    status: "Mid 6th",
    volume: "$458K",
    live: true,
    image: rays,
    history: [8, 12, 10, 19, 15, 28, 23, 34, 30, 40, 36, 45],
    outcomes: [
      {
        id: "rays",
        label: "Blue Bay",
        probability: 0.46,
        next: 0.52,
        color: "#60a5fa",
        image: rays,
      },
      {
        id: "braves",
        label: "Summit",
        probability: 0.54,
        next: 0.48,
        color: "#fb7185",
        image: braves,
      },
    ],
  },
  {
    id: "rates",
    title: "Where will interest rates land by the end of the year?",
    category: "Economics",
    status: "Dec 31",
    volume: "$347K",
    live: false,
    image:
      badge("RB", "#475569"),
    history: [15, 11, 17, 14, 24, 21, 30, 25, 32, 29, 39, 42],
    outcomes: [
      {
        id: "below",
        label: "Below 3.5%",
        probability: 0.68,
        next: 0.72,
        color: "#34d399",
        image: null,
      },
      {
        id: "above",
        label: "Above 4.0%",
        probability: 0.23,
        next: 0.18,
        color: "#60a5fa",
        image: null,
      },
    ],
  },
];
const updated = ref(false),
  saved = ref<Record<string, boolean>>({});
const icon =
  (url: string, classes: string, size = 32) =>
  () =>
    h("img", { src: url, alt: "", width: size, height: size, class: classes });
</script>
<template>
  <div class="@container w-full max-w-3xl space-y-5">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-sm font-medium">On the radar</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Demo markets · simulated prices
        </p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        class="shrink-0"
        @click="updated = !updated"
        >Update odds</Button
      >
    </div>
    <div class="grid auto-rows-fr gap-4 @min-[640px]:grid-cols-2">
      <PredictionMarketCard
        v-for="market in markets"
        :key="market.id"
        :title="market.title"
        :category="market.category"
        :status="market.status"
        :live="market.live"
        :icon="
          icon(
            market.image,
            market.id === 'rates'
              ? 'size-full bg-white object-contain p-1'
              : 'size-full object-contain p-1',
            48,
          )
        "
        :volume="market.volume"
        :volume-history="market.history"
        :bookmarked="saved[market.id] ?? false"
        :outcomes="
          market.outcomes.map((outcome) => ({
            ...outcome,
            probability: updated ? outcome.next : outcome.probability,
            icon: outcome.image
              ? icon(outcome.image, 'size-full object-contain p-0.5')
              : undefined,
          }))
        "
        @bookmark-change="saved = { ...saved, [market.id]: $event }"
      />
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { h, ref } from "vue";
import { PredictionMarketCard } from "@orvui/vue/blocks/prediction-market";
import { Button } from "@orvui/vue/motion/button";
// Synthetic club emblems authored for this demonstration; no external team marks.
function badge(label: string, color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path fill="${color}" d="M32 3 57 17v30L32 61 7 47V17Z"/><path fill="none" stroke="white" stroke-opacity=".6" stroke-width="2" d="m32 9 20 11v24L32 55 12 44V20Z"/><text x="32" y="39" fill="white" text-anchor="middle" font-family="system-ui,sans-serif" font-size="21" font-weight="700">${label}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
const boston = badge("GH", "#15803d"), lakers = badge("GD", "#b45309"), rays = badge("BB", "#2563eb"), braves = badge("RS", "#be123c");
const markets = [
  {
    id: "basketball",
    title: "Green Harbor vs. Golden District",
    category: "Basketball",
    status: "Sunday · 7:30 PM",
    volume: "$2.4M",
    live: false,
    image: boston,
    history: [12, 18, 15, 26, 20, 32, 29, 38, 34, 48, 43, 58],
    outcomes: [
      {
        id: "boston",
        label: "Harbor",
        probability: 0.51,
        next: 0.56,
        color: "#34d399",
        image: boston,
      },
      {
        id: "lakers",
        label: "District",
        probability: 0.49,
        next: 0.44,
        color: "#fbbf24",
        image: lakers,
      },
    ],
  },
  {
    id: "baseball",
    title: "Blue Bay vs. Rose Summit",
    category: "MLB",
    status: "Mid 6th",
    volume: "$458K",
    live: true,
    image: rays,
    history: [8, 12, 10, 19, 15, 28, 23, 34, 30, 40, 36, 45],
    outcomes: [
      {
        id: "rays",
        label: "Blue Bay",
        probability: 0.46,
        next: 0.52,
        color: "#60a5fa",
        image: rays,
      },
      {
        id: "braves",
        label: "Summit",
        probability: 0.54,
        next: 0.48,
        color: "#fb7185",
        image: braves,
      },
    ],
  },
  {
    id: "rates",
    title: "Where will interest rates land by the end of the year?",
    category: "Economics",
    status: "Dec 31",
    volume: "$347K",
    live: false,
    image:
      badge("RB", "#475569"),
    history: [15, 11, 17, 14, 24, 21, 30, 25, 32, 29, 39, 42],
    outcomes: [
      {
        id: "below",
        label: "Below 3.5%",
        probability: 0.68,
        next: 0.72,
        color: "#34d399",
        image: null,
      },
      {
        id: "above",
        label: "Above 4.0%",
        probability: 0.23,
        next: 0.18,
        color: "#60a5fa",
        image: null,
      },
    ],
  },
];
const updated = ref(false),
  saved = ref<Record<string, boolean>>({});
const icon =
  (url: string, classes: string, size = 32) =>
  () =>
    h("img", { src: url, alt: "", width: size, height: size, class: classes });
</script>
<template>
  <div class="@container w-full max-w-3xl space-y-5">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-sm font-medium">On the radar</p>
        <p class="mt-1 text-xs text-muted-foreground">
          Demo markets · simulated prices
        </p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        class="shrink-0"
        @click="updated = !updated"
        >Update odds</Button
      >
    </div>
    <div class="grid auto-rows-fr gap-4 @min-[640px]:grid-cols-2">
      <PredictionMarketCard
        v-for="market in markets"
        :key="market.id"
        :title="market.title"
        :category="market.category"
        :status="market.status"
        :live="market.live"
        :icon="
          icon(
            market.image,
            market.id === 'rates'
              ? 'size-full bg-white object-contain p-1'
              : 'size-full object-contain p-1',
            48,
          )
        "
        :volume="market.volume"
        :volume-history="market.history"
        :bookmarked="saved[market.id] ?? false"
        :outcomes="
          market.outcomes.map((outcome) => ({
            ...outcome,
            probability: updated ? outcome.next : outcome.probability,
            icon: outcome.image
              ? icon(outcome.image, 'size-full object-contain p-0.5')
              : undefined,
          }))
        "
        @bookmark-change="saved = { ...saved, [market.id]: $event }"
      />
    </div>
  </div>
</template>
```

<a id="trade-ticket"></a>
### Trade Ticket

选择结果并填写买卖数量，通过可见反馈查看订单状态。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { PredictionMarket, type PredictionMarketOrderValue } from "@/components/orvui/blocks/prediction-market";
const outcomes = [
  { id: "yes", label: "Yes", price: 0.167 },
  { id: "no", label: "No", price: 0.834 },
];
const order = ref<PredictionMarketOrderValue>({
  mode: "buy",
  outcomeId: "yes",
  amount: "115",
});
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <PredictionMarket
      v-model="order"
      :outcomes="outcomes"
      :balance="500"
      :positions="{ yes: 125, no: 48 }"
      :quick-amounts="[1, 5, 10, 100]"
    />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { PredictionMarket, type PredictionMarketOrderValue } from "@orvui/vue/blocks/prediction-market";
const outcomes = [
  { id: "yes", label: "Yes", price: 0.167 },
  { id: "no", label: "No", price: 0.834 },
];
const order = ref<PredictionMarketOrderValue>({
  mode: "buy",
  outcomeId: "yes",
  amount: "115",
});
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <PredictionMarket
      v-model="order"
      :outcomes="outcomes"
      :balance="500"
      :positions="{ yes: 125, no: 48 }"
      :quick-amounts="[1, 5, 10, 100]"
    />
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `PredictionMarket` | `v-model` | `PredictionMarketOrderValue` | `update:modelValue` |
| `PredictionMarketCard` | `v-model:bookmarked` | `boolean` | `update:bookmarked` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### PredictionMarket

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `outcomes` | `PredictionMarketOutcome[]` | `() => [ { id: "up", label: "Up", price: 0.09 }, { id: "down", label: "Down", price: 0.91 }, ]` | 否 | — |
| `modelValue` | `PredictionMarketOrderValue` | — | 否 | — |
| `defaultValue` | `Partial<PredictionMarketOrderValue>` | — | 否 | — |
| `authenticated` | `boolean` | `true` | 否 | — |
| `orderTypeLabel` | `string` | `"Market"` | 否 | — |
| `balance` | `number` | `500` | 否 | — |
| `positions` | `Record<string, number>` | `() => ({ up: 24, down: 16 })` | 否 | — |
| `quickAmounts` | `number[]` | `() => [10, 50, 100, 500]` | 否 | — |
| `minTrade` | `number` | `1` | 否 | — |
| `classNames` | `PredictionMarketClassNames` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `[value: PredictionMarketOrderValue]` | — |
| `valueChange` | `[value: PredictionMarketOrderValue]` | — |
| `trade` | `[order: PredictionMarketOrderValue, quote: PredictionMarketQuote]` | — |
| `signIn` | `[]` | — |

### PredictionMarketCard

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `string` | — | 是 | — |
| `icon` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | 否 | — |
| `category` | `string` | — | 否 | — |
| `volume` | `string` | — | 是 | — |
| `volumeHistory` | `number[]` | `() => []` | 否 | — |
| `status` | `string` | — | 否 | — |
| `live` | `boolean` | `false` | 否 | — |
| `outcomes` | `PredictionMarketCardOutcome[]` | — | 是 | — |
| `bookmarked` | `boolean` | `undefined` | 否 | — |
| `defaultBookmarked` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `outcomeClick` | `[selection: PredictionMarketCardSelection]` | — |
| `update:bookmarked` | `[bookmarked: boolean]` | — |
| `bookmarkChange` | `[bookmarked: boolean]` | — |

<a id="about"></a>
## 关于 Prediction Market

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Prediction Market？**

通过 outcomes、modelValue、defaultValue、authenticated、orderTypeLabel、balance、positions、quickAmounts、minTrade、classNames 配置 Prediction Market；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange、trade、signIn，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Wallet Card](https://orvui.efu.me/components/blocks/wallet-card): 在紧凑卡片中查看余额、切换账户并隐藏敏感金额。
- [Multi-chain Swap](https://orvui.efu.me/components/blocks/swap): 组合资产兑换界面，包含代币选择、数量与目标信息。
- [Feedback Widget](https://orvui.efu.me/components/blocks/feedback-widget): 将反馈触发器展开为表单，包含发送、成功和重试状态。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/prediction-market.json
- 文档: https://orvui.efu.me/components/blocks/prediction-market
- `packages/vue/src/blocks/prediction-market/src/PredictionMarket.vue`
- `packages/vue/src/blocks/prediction-market/src/PredictionMarketCard.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
