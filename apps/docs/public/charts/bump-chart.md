---
title: "Bump Chart"
description: "跟踪序列排名随时间的变化，并固定某条序列以便检查。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/bump-chart"
markdown: "https://orvui.efu.me/charts/bump-chart.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Bump Chart

> 跟踪序列排名随时间的变化，并固定某条序列以便检查。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Bump Chart：跟踪序列排名随时间的变化，并固定某条序列以便检查。

<a id="install"></a>
## 安装

### Bump Chart — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/bump-chart.json https://orvui.efu.me/r/button.json
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
### Bump Chart

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Shuffle } from "lucide-vue-next";
import { Button } from "@/components/orvui/motion/button";
import { BumpChart } from "@/components/orvui/charts/bump-chart";
const periods = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const series = ref([
  { id: "studio", name: "Studio", ranks: [4, 3, 2, 3, 2, 1], color: "#8b5cf6" },
  { id: "canvas", name: "Canvas", ranks: [1, 1, 3, 2, 1, 2], color: "#0d9488" },
  { id: "layers", name: "Layers", ranks: [3, 2, 1, 1, 3, 3], color: "#f59e0b" },
  { id: "orbit", name: "Orbit", ranks: [2, 4, 5, 4, 5, 4], color: "#3b82f6" },
  { id: "frame", name: "Frame", ranks: [5, 5, 4, 5, 4, 5], color: "#f43f5e" },
]);
function shuffle() {
  const columns = periods.map(() => {
    const order = series.value.map((_, index) => index + 1);
    for (let remaining = order.length; remaining > 1; remaining--) {
      const index = Math.floor(Math.random() * remaining);
      [order[index], order[remaining - 1]] = [
        order[remaining - 1],
        order[index],
      ];
    }
    return order;
  });
  series.value = series.value.map((row, index) => ({
    ...row,
    ranks: columns.map((column) => column[index]),
  }));
}
</script>
<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 px-2">
      <div>
        <h3 class="text-sm font-medium text-foreground">The leaderboard</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          Five products. Six months. Every move.
        </p>
      </div>
      <Button variant="ghost" size="sm" class="shrink-0 gap-2" @click="shuffle"
        ><Shuffle class="size-3.5" aria-hidden="true" />Shuffle rankings</Button
      >
    </div>
    <BumpChart
      :series="series"
      :periods="periods"
      label="Illustrative product rankings, April to September"
    />
    <p class="text-center text-[11px] text-muted-foreground">
      Inspect a dot for details · Select to pin a product
    </p>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Shuffle } from "lucide-vue-next";
import { Button } from "@orvui/vue/motion/button";
import { BumpChart } from "@orvui/vue/charts/bump-chart";
const periods = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const series = ref([
  { id: "studio", name: "Studio", ranks: [4, 3, 2, 3, 2, 1], color: "#8b5cf6" },
  { id: "canvas", name: "Canvas", ranks: [1, 1, 3, 2, 1, 2], color: "#0d9488" },
  { id: "layers", name: "Layers", ranks: [3, 2, 1, 1, 3, 3], color: "#f59e0b" },
  { id: "orbit", name: "Orbit", ranks: [2, 4, 5, 4, 5, 4], color: "#3b82f6" },
  { id: "frame", name: "Frame", ranks: [5, 5, 4, 5, 4, 5], color: "#f43f5e" },
]);
function shuffle() {
  const columns = periods.map(() => {
    const order = series.value.map((_, index) => index + 1);
    for (let remaining = order.length; remaining > 1; remaining--) {
      const index = Math.floor(Math.random() * remaining);
      [order[index], order[remaining - 1]] = [
        order[remaining - 1],
        order[index],
      ];
    }
    return order;
  });
  series.value = series.value.map((row, index) => ({
    ...row,
    ranks: columns.map((column) => column[index]),
  }));
}
</script>
<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 px-2">
      <div>
        <h3 class="text-sm font-medium text-foreground">The leaderboard</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          Five products. Six months. Every move.
        </p>
      </div>
      <Button variant="ghost" size="sm" class="shrink-0 gap-2" @click="shuffle"
        ><Shuffle class="size-3.5" aria-hidden="true" />Shuffle rankings</Button
      >
    </div>
    <BumpChart
      :series="series"
      :periods="periods"
      label="Illustrative product rankings, April to September"
    />
    <p class="text-center text-[11px] text-muted-foreground">
      Inspect a dot for details · Select to pin a product
    </p>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `BumpChart` | `v-model:active` | `null \| string` | `update:active` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### BumpChart

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `series` | `readonly BumpSeries[]` | — | 是 | — |
| `periods` | `readonly string[]` | — | 是 | — |
| `active` | `null \| string` | — | 否 | — |
| `defaultActive` | `null \| string` | `null` | 否 | — |
| `label` | `string` | `"Rankings over time"` | 否 | — |
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

### BumpChartPlot

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | 否 | — |

### BumpChartLegend

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | 否 | — |

<a id="about"></a>
## 关于 Bump Chart

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Bump Chart？**

通过 series、periods、active、defaultActive、label、className 配置 Bump Chart；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:active、activeChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Status Bar](https://orvui.efu.me/charts/status-bar): 在按比例分段的条形图中汇总各命名状态的数量。
- [Composition Chart](https://orvui.efu.me/charts/composition-chart): 使用归一化柱形或堆叠面积比较不同分类的组成贡献。
- [Funnel Chart](https://orvui.efu.me/charts/funnel-chart): 跟踪连续阶段，并检查相邻步骤之间的转化与流失。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/bump-chart.json
- 文档: https://orvui.efu.me/charts/bump-chart
- `packages/vue/src/charts/bump-chart/src/BumpChart.vue`
- `packages/vue/src/charts/bump-chart/src/BumpChartPlot.vue`
- `packages/vue/src/charts/bump-chart/src/BumpChartLegend.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
