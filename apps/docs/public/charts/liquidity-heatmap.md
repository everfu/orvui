---
title: "Liquidity Heatmap"
description: "通过可选择强度带的网格检查时间与价格维度的流动性。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/liquidity-heatmap"
markdown: "https://orvui.efu.me/charts/liquidity-heatmap.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Liquidity Heatmap

> 通过可选择强度带的网格检查时间与价格维度的流动性。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Liquidity Heatmap：通过可选择强度带的网格检查时间与价格维度的流动性。

<a id="install"></a>
## 安装

### Liquidity Heatmap — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/liquidity-heatmap.json https://orvui.efu.me/r/button.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
```

```bash
pnpm add lucide-vue-next@^0.468.0
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
### Liquidity Heatmap

**复制源码**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { RefreshCw } from "lucide-vue-next";
import { Button } from "@/components/orvui/motion/button";
import { LiquidityHeatmap, type LiquiditySnapshot } from "@/components/orvui/charts/liquidity-heatmap";
const phase = ref(0);
const snapshots = computed<LiquiditySnapshot[]>(() =>
  Array.from({ length: 24 }, (_, minute) => ({
    id: `minute-${minute}`,
    label: `14:${String(minute * 2).padStart(2, "0")}`,
    price:
      245.5 +
      Math.sin(minute * 0.27 + phase.value * 0.4) * 1.2 +
      minute * 0.035,
    levels: Array.from({ length: 18 }, (_, row) => {
      const upper = Math.exp(
        -((row - 4 - Math.sin(minute * 0.18 + phase.value) * 0.7) ** 2) / 0.8,
      );
      const lower = Math.exp(
        -((row - 13 + Math.cos(minute * 0.15 + phase.value) * 0.8) ** 2) / 1.2,
      );
      const noise =
        (Math.sin(row * 12.9 + minute * 7.3 + phase.value * 2.1) + 1) / 2;
      return {
        price: 250 - row * 0.5,
        size: Math.round(
          90 +
            noise * 350 +
            (upper + lower) *
              (1500 + Math.sin(minute * 0.3 + phase.value) * 450),
        ),
      };
    }),
  })),
);
const formatPrice = (price: number) => `$${price.toFixed(2)}`;
</script>
<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-medium">Where liquidity rests</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          SOL / USD · Simulated depth
        </p>
      </div>
      <Button variant="ghost" size="sm" class="gap-2" @click="phase++"
        ><RefreshCw aria-hidden="true" class="size-3.5" />Resimulate</Button
      >
    </div>
    <LiquidityHeatmap
      :snapshots="snapshots"
      :max-size="2400"
      unit="SOL"
      :format-price="formatPrice"
    />
    <p class="text-center text-[11px] text-muted-foreground">
      Brighter bands hold more liquidity · White line tracks price
    </p>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { RefreshCw } from "lucide-vue-next";
import { Button } from "@orvui/vue/motion/button";
import { LiquidityHeatmap, type LiquiditySnapshot } from "@orvui/vue/charts/liquidity-heatmap";
const phase = ref(0);
const snapshots = computed<LiquiditySnapshot[]>(() =>
  Array.from({ length: 24 }, (_, minute) => ({
    id: `minute-${minute}`,
    label: `14:${String(minute * 2).padStart(2, "0")}`,
    price:
      245.5 +
      Math.sin(minute * 0.27 + phase.value * 0.4) * 1.2 +
      minute * 0.035,
    levels: Array.from({ length: 18 }, (_, row) => {
      const upper = Math.exp(
        -((row - 4 - Math.sin(minute * 0.18 + phase.value) * 0.7) ** 2) / 0.8,
      );
      const lower = Math.exp(
        -((row - 13 + Math.cos(minute * 0.15 + phase.value) * 0.8) ** 2) / 1.2,
      );
      const noise =
        (Math.sin(row * 12.9 + minute * 7.3 + phase.value * 2.1) + 1) / 2;
      return {
        price: 250 - row * 0.5,
        size: Math.round(
          90 +
            noise * 350 +
            (upper + lower) *
              (1500 + Math.sin(minute * 0.3 + phase.value) * 450),
        ),
      };
    }),
  })),
);
const formatPrice = (price: number) => `$${price.toFixed(2)}`;
</script>
<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-medium">Where liquidity rests</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          SOL / USD · Simulated depth
        </p>
      </div>
      <Button variant="ghost" size="sm" class="gap-2" @click="phase++"
        ><RefreshCw aria-hidden="true" class="size-3.5" />Resimulate</Button
      >
    </div>
    <LiquidityHeatmap
      :snapshots="snapshots"
      :max-size="2400"
      unit="SOL"
      :format-price="formatPrice"
    />
    <p class="text-center text-[11px] text-muted-foreground">
      Brighter bands hold more liquidity · White line tracks price
    </p>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### LiquidityHeatmap

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `snapshots` | `readonly LiquiditySnapshot[]` | — | 是 | — |
| `maxSize` | `number` | — | 否 | — |
| `unit` | `string` | `"units"` | 否 | — |
| `label` | `string` | `"Liquidity heatmap"` | 否 | — |
| `formatPrice` | `(value: number) => string` | `formatNumber` | 否 | — |
| `formatSize` | `(value: number) => string` | `formatCompact` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### LiquidityHeatmapPlot

### LiquidityHeatmapLegend

<a id="about"></a>
## 关于 Liquidity Heatmap

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Liquidity Heatmap？**

通过 snapshots、maxSize、unit、label、formatPrice、formatSize、className 配置 Liquidity Heatmap；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Order Book](https://orvui.efu.me/charts/order-book): 在订单簿中检查买卖档位、累计深度与价格选择。
- [Bump Chart](https://orvui.efu.me/charts/bump-chart): 跟踪序列排名随时间的变化，并固定某条序列以便检查。
- [Composition Chart](https://orvui.efu.me/charts/composition-chart): 使用归一化柱形或堆叠面积比较不同分类的组成贡献。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/liquidity-heatmap.json
- 文档: https://orvui.efu.me/charts/liquidity-heatmap
- `packages/vue/src/charts/liquidity-heatmap/src/LiquidityHeatmap.vue`
- `packages/vue/src/charts/liquidity-heatmap/src/LiquidityHeatmapPlot.vue`
- `packages/vue/src/charts/liquidity-heatmap/src/LiquidityHeatmapLegend.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
