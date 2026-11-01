---
title: "Volume Profile"
description: "通过横向双向条形图比较各价格区间的成交量。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/volume-profile"
markdown: "https://orvui.efu.me/charts/volume-profile.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Volume Profile

> 通过横向双向条形图比较各价格区间的成交量。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Volume Profile：通过横向双向条形图比较各价格区间的成交量。

<a id="install"></a>
## 安装

### Volume Profile — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/volume-profile.json https://orvui.efu.me/r/tabs.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
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
### Volume Profile

**复制源码**

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { Tabs, TabsList, TabsTrigger } from "@/components/orvui/motion/tabs";
import {
  VolumeProfile,
  VolumeProfilePlot,
  VolumeProfileTooltip,
  VolumeProfileSummary,
  type VolumeProfileBin,
} from "@/components/orvui/charts/volume-profile";
const sessions = [
  {
    id: "today",
    label: "Today",
    volumes: [
      18, 27, 36, 52, 70, 96, 135, 172, 205, 241, 278, 225, 192, 146, 108, 79,
      56, 42, 31, 22, 16, 11, 8, 5,
    ],
  },
  {
    id: "previous",
    label: "Previous",
    volumes: [
      6, 9, 13, 18, 27, 40, 56, 74, 95, 114, 146, 188, 242, 286, 253, 208, 165,
      126, 92, 65, 42, 30, 21, 14,
    ],
  },
  {
    id: "week",
    label: "Week",
    volumes: [
      75, 104, 143, 214, 305, 382, 494, 626, 795, 902, 1028, 1182, 1097, 973,
      825, 695, 589, 481, 372, 289, 195, 154, 119, 84,
    ],
  },
];
const data: Record<string, readonly VolumeProfileBin[]> = {};
for (const session of sessions)
  data[session.id] = session.volumes.map((volume, index) => ({
    id: `price-${64000 + index * 100}`,
    priceLow: 64000 + index * 100,
    priceHigh: 64100 + index * 100,
    volume,
  }));
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const formatPrice = (price: number) => currency.format(price),
  formatVolume = (volume: number) => amount.format(volume);
const session = ref("today"),
  previewId = useId(),
  panelId = previewId + "-profile";
</script>
<template>
  <div class="w-full max-w-xl min-w-0 py-2">
    <Tabs v-model="session"
      ><div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div class="space-y-1">
          <p class="text-sm font-medium">BTC / USD</p>
          <p class="text-xs text-muted-foreground">
            Volume by price · Demo data
          </p>
        </div>
        <TabsList
          aria-label="Profile session"
          wrapper-class-name="w-auto"
          class="bg-muted"
          ><TabsTrigger
            v-for="item in sessions"
            :key="item.id"
            :value="item.id"
            :id="`${previewId}-${item.id}`"
            :aria-controls="panelId"
            :tabindex="session === item.id ? 0 : -1"
            indicator-class-name="bg-background"
            class="min-h-8 px-3 py-1.5 text-xs [&_[data-tabs-label]]:text-foreground"
            >{{ item.label }}</TabsTrigger
          ></TabsList
        >
      </div>
      <div
        :id="panelId"
        role="tabpanel"
        :aria-labelledby="`${previewId}-${session}`"
      >
        <VolumeProfile
          :data="data[session]"
          :format-price="formatPrice"
          :format-volume="formatVolume"
          unit="BTC"
          label="BTC volume profile"
          ><VolumeProfilePlot
            class="h-72 sm:h-80" /><VolumeProfileTooltip /><VolumeProfileSummary
        /></VolumeProfile></div
    ></Tabs>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref, useId } from "vue";
import { Tabs, TabsList, TabsTrigger } from "@orvui/vue/motion/tabs";
import { VolumeProfile, VolumeProfilePlot, VolumeProfileTooltip, VolumeProfileSummary, type VolumeProfileBin } from "@orvui/vue/charts/volume-profile";
const sessions = [
  {
    id: "today",
    label: "Today",
    volumes: [
      18, 27, 36, 52, 70, 96, 135, 172, 205, 241, 278, 225, 192, 146, 108, 79,
      56, 42, 31, 22, 16, 11, 8, 5,
    ],
  },
  {
    id: "previous",
    label: "Previous",
    volumes: [
      6, 9, 13, 18, 27, 40, 56, 74, 95, 114, 146, 188, 242, 286, 253, 208, 165,
      126, 92, 65, 42, 30, 21, 14,
    ],
  },
  {
    id: "week",
    label: "Week",
    volumes: [
      75, 104, 143, 214, 305, 382, 494, 626, 795, 902, 1028, 1182, 1097, 973,
      825, 695, 589, 481, 372, 289, 195, 154, 119, 84,
    ],
  },
];
const data: Record<string, readonly VolumeProfileBin[]> = {};
for (const session of sessions)
  data[session.id] = session.volumes.map((volume, index) => ({
    id: `price-${64000 + index * 100}`,
    priceLow: 64000 + index * 100,
    priceHigh: 64100 + index * 100,
    volume,
  }));
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const amount = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const formatPrice = (price: number) => currency.format(price),
  formatVolume = (volume: number) => amount.format(volume);
const session = ref("today"),
  previewId = useId(),
  panelId = previewId + "-profile";
</script>
<template>
  <div class="w-full max-w-xl min-w-0 py-2">
    <Tabs v-model="session"
      ><div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div class="space-y-1">
          <p class="text-sm font-medium">BTC / USD</p>
          <p class="text-xs text-muted-foreground">
            Volume by price · Demo data
          </p>
        </div>
        <TabsList
          aria-label="Profile session"
          wrapper-class-name="w-auto"
          class="bg-muted"
          ><TabsTrigger
            v-for="item in sessions"
            :key="item.id"
            :value="item.id"
            :id="`${previewId}-${item.id}`"
            :aria-controls="panelId"
            :tabindex="session === item.id ? 0 : -1"
            indicator-class-name="bg-background"
            class="min-h-8 px-3 py-1.5 text-xs [&_[data-tabs-label]]:text-foreground"
            >{{ item.label }}</TabsTrigger
          ></TabsList
        >
      </div>
      <div
        :id="panelId"
        role="tabpanel"
        :aria-labelledby="`${previewId}-${session}`"
      >
        <VolumeProfile
          :data="data[session]"
          :format-price="formatPrice"
          :format-volume="formatVolume"
          unit="BTC"
          label="BTC volume profile"
          ><VolumeProfilePlot
            class="h-72 sm:h-80" /><VolumeProfileTooltip /><VolumeProfileSummary
        /></VolumeProfile></div
    ></Tabs>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `VolumeProfile` | `v-model:activeId` | `null \| string` | `update:activeId` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### VolumeProfile

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `data` | `readonly VolumeProfileBin[]` | — | 是 | — |
| `label` | `string` | `"Volume profile"` | 否 | — |
| `unit` | `string` | `"units"` | 否 | — |
| `formatPrice` | `(value: number) => string` | `formatNumber` | 否 | — |
| `formatVolume` | `(value: number) => string` | `formatNumber` | 否 | — |
| `valueArea` | `number \| false` | `undefined` | 否 | — |
| `color` | `string` | `"#6366f1"` | 否 | — |
| `pocColor` | `string` | `"#f59e0b"` | 否 | — |
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

### VolumeProfilePlot

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `barClassName` | `string` | — | 否 | — |
| `showAxes` | `boolean` | `true` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### VolumeProfileTooltip

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `row: profile.active` | — |

### VolumeProfileSummary

<a id="about"></a>
## 关于 Volume Profile

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Volume Profile？**

通过 data、label、unit、formatPrice、formatVolume、valueArea、color、pocColor、activeId、defaultActiveId、className 配置 Volume Profile；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:activeId、activeChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Candlestick Chart](https://orvui.efu.me/charts/candlestick-chart): 借助指针或键盘十字线检查开高低收与成交量数据。
- [Order Book](https://orvui.efu.me/charts/order-book): 在订单簿中检查买卖档位、累计深度与价格选择。
- [Composition Chart](https://orvui.efu.me/charts/composition-chart): 使用归一化柱形或堆叠面积比较不同分类的组成贡献。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/volume-profile.json
- 文档: https://orvui.efu.me/charts/volume-profile
- `packages/vue/src/charts/volume-profile/src/VolumeProfile.vue`
- `packages/vue/src/charts/volume-profile/src/VolumeProfilePlot.vue`
- `packages/vue/src/charts/volume-profile/src/VolumeProfileTooltip.vue`
- `packages/vue/src/charts/volume-profile/src/VolumeProfileSummary.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
