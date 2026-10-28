---
title: "Funnel Chart"
description: "跟踪连续阶段，并检查相邻步骤之间的转化与流失。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/funnel-chart"
markdown: "https://orvui.efu.me/charts/funnel-chart.md"
license: "MIT"
productVersion: "0.1.0"
---

# Funnel Chart

> 跟踪连续阶段，并检查相邻步骤之间的转化与流失。

跟踪连续阶段，并检查相邻步骤之间的转化与流失。

## 适用场景

- 当界面需要以下行为时使用 Funnel Chart：跟踪连续阶段，并检查相邻步骤之间的转化与流失。

## 安装

### Funnel Chart — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/funnel-chart.json https://orvui.efu.me/r/button.json
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

```bash
pnpm add lucide-vue-next@^0.468.0
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`
- `lucide-vue-next@^0.468.0`

## 用法

### Funnel Chart

**复制源码**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { RefreshCw } from "lucide-vue-next";
import { Button } from "@/components/orvui/motion/button";
import { FunnelChart } from "@/components/orvui/charts/funnel-chart";
const labels = [
  "Visitors",
  "Signed up",
  "Activated",
  "Started trial",
  "Subscribed",
];
const cohorts = [
  [24000, 15600, 10800, 7200, 4320],
  [28000, 18200, 13650, 9100, 6370],
  [22000, 13200, 7920, 4752, 2376],
];
const direction = ref<"vertical" | "horizontal">("vertical");
const cohort = ref(0);
const stages = computed(() =>
  labels.map((label, index) => ({
    id: label,
    label,
    value: cohorts[cohort.value][index],
  })),
);
const directions = ["vertical", "horizontal"] as const;
function nextCohort() {
  cohort.value = (cohort.value + 1) % cohorts.length;
}
</script>

<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-medium">From first visit to first payment</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          Product conversion · Sample cohorts
        </p>
      </div>
      <Button variant="ghost" size="sm" class="gap-2" @click="nextCohort"
        ><RefreshCw class="size-3.5" aria-hidden="true" />Next cohort</Button
      >
    </div>
    <fieldset
      aria-label="Funnel direction"
      class="inline-flex gap-1 rounded-full bg-muted/50 p-1"
    >
      <Button
        v-for="orientation in directions"
        :key="orientation"
        variant="ghost"
        size="sm"
        :aria-pressed="direction === orientation"
        :class="
          direction === orientation
            ? 'bg-background shadow-sm'
            : 'text-muted-foreground'
        "
        @click="direction = orientation"
        >{{ orientation === "vertical" ? "Vertical" : "Horizontal" }}</Button
      >
    </fieldset>
    <FunnelChart :direction="direction" :stages="stages" />
    <p class="text-center text-[11px] text-muted-foreground">
      Inspect a stage to see conversion and drop-off
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
import { FunnelChart } from "@orvui/vue/charts/funnel-chart";
const labels = [
  "Visitors",
  "Signed up",
  "Activated",
  "Started trial",
  "Subscribed",
];
const cohorts = [
  [24000, 15600, 10800, 7200, 4320],
  [28000, 18200, 13650, 9100, 6370],
  [22000, 13200, 7920, 4752, 2376],
];
const direction = ref<"vertical" | "horizontal">("vertical");
const cohort = ref(0);
const stages = computed(() =>
  labels.map((label, index) => ({
    id: label,
    label,
    value: cohorts[cohort.value][index],
  })),
);
const directions = ["vertical", "horizontal"] as const;
function nextCohort() {
  cohort.value = (cohort.value + 1) % cohorts.length;
}
</script>

<template>
  <div class="w-full space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-sm font-medium">From first visit to first payment</h3>
        <p class="mt-1 text-xs text-muted-foreground">
          Product conversion · Sample cohorts
        </p>
      </div>
      <Button variant="ghost" size="sm" class="gap-2" @click="nextCohort"
        ><RefreshCw class="size-3.5" aria-hidden="true" />Next cohort</Button
      >
    </div>
    <fieldset
      aria-label="Funnel direction"
      class="inline-flex gap-1 rounded-full bg-muted/50 p-1"
    >
      <Button
        v-for="orientation in directions"
        :key="orientation"
        variant="ghost"
        size="sm"
        :aria-pressed="direction === orientation"
        :class="
          direction === orientation
            ? 'bg-background shadow-sm'
            : 'text-muted-foreground'
        "
        @click="direction = orientation"
        >{{ orientation === "vertical" ? "Vertical" : "Horizontal" }}</Button
      >
    </fieldset>
    <FunnelChart :direction="direction" :stages="stages" />
    <p class="text-center text-[11px] text-muted-foreground">
      Inspect a stage to see conversion and drop-off
    </p>
  </div>
</template>
```

## API 参考

### FunnelChart

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `stages` | `readonly FunnelStage[]` | — | 是 | — |
| `direction` | `"vertical" \| "horizontal"` | `"vertical"` | 否 | — |
| `unit` | `string` | `"people"` | 否 | — |
| `label` | `string` | `"Conversion funnel"` | 否 | — |
| `formatValue` | `(value: number) => string` | `formatNumber` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### FunnelChartPlot

### FunnelChartSummary

## 关于 Funnel Chart

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Funnel Chart？**

通过 stages、direction、unit、label、formatValue、className 配置 Funnel Chart；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/funnel-chart.json
- 文档: https://orvui.efu.me/charts/funnel-chart
- `packages/vue/src/charts/funnel-chart/src/FunnelChart.vue`
- `packages/vue/src/charts/funnel-chart/src/FunnelChartPlot.vue`
- `packages/vue/src/charts/funnel-chart/src/FunnelChartSummary.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
