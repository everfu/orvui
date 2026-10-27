---
title: "Status Bar"
description: "在按比例分段的条形图中汇总各命名状态的数量。"
category: "Charts"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/charts/status-bar"
markdown: "https://orvui.efu.me/charts/status-bar.md"
license: "MIT"
productVersion: "0.1.0"
---

# Status Bar

> 在按比例分段的条形图中汇总各命名状态的数量。

## 安装

### Status Bar — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/status-bar.json https://orvui.efu.me/r/button.json
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

- `@floating-ui/dom@^1.7.0`
- `motion-v@^1.10.0`
- `tailwindcss@^4.0.0`
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `tailwind-merge@^3.0.0`

## 用法

### Status Bar

**复制源码**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import {
  StatusBar,
  StatusBarPlot,
  StatusBarTooltip,
  StatusBarLegend,
  STATUS_BAR_STATUSES,
  type StatusBarDatum,
} from "@/components/orvui/charts/status-bar";
import { Button } from "@/components/orvui/motion/button";
const dateLabel = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const history: readonly StatusBarDatum[] = Array.from(
  { length: 48 },
  (_, index) => {
    const date = new Date(Date.UTC(2026, 7, 21 + index));
    const degraded = index === 8;
    return {
      id: date.toISOString().slice(0, 10),
      label: dateLabel.format(date),
      status: degraded ? "degraded" : "operational",
      description: degraded
        ? "Elevated response times for 12 minutes."
        : "All checks passed.",
    };
  },
);
const website = history.map((period) => ({
  ...period,
  status: "operational",
  description: "All checks passed.",
}));
const statuses = STATUS_BAR_STATUSES.slice(0, 3);
const incident = ref(false);
const replay = ref(0);
const api = computed(() =>
  history.map((period, index) => {
    if (!incident.value || index < 45) return period;
    return {
      ...period,
      status: index === 46 ? "outage" : "degraded",
      description:
        index === 46
          ? "Requests failed for 4 minutes."
          : "Elevated response times.",
    };
  }),
);
</script>

<template>
  <div class="w-full max-w-2xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <span class="text-sm text-muted-foreground">48 days of status</span>
      <div class="flex gap-1">
        <Button variant="ghost" size="sm" tabindex="0" @click="replay++"
          >Replay</Button
        ><Button
          variant="ghost"
          size="sm"
          tabindex="0"
          @click="incident = !incident"
          >{{ incident ? "Resolve incident" : "Simulate incident" }}</Button
        >
      </div>
    </div>
    <StatusBar
      :key="'api-' + replay"
      :data="api"
      :statuses="statuses"
      label="API status"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">API</span
        ><span class="text-muted-foreground">{{
          incident ? "Degraded" : "Operational"
        }}</span>
      </div>
      <StatusBarPlot /><StatusBarTooltip />
    </StatusBar>
    <StatusBar
      :key="'website-' + replay"
      class="border-t border-border pt-6"
      :data="website"
      :statuses="statuses"
      label="Website status"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">Website</span
        ><span class="text-muted-foreground">Operational</span>
      </div>
      <StatusBarPlot /><StatusBarLegend class="pt-2" /><StatusBarTooltip />
    </StatusBar>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { StatusBar, StatusBarPlot, StatusBarTooltip, StatusBarLegend, STATUS_BAR_STATUSES, type StatusBarDatum } from "@orvui/vue/charts/status-bar";
import { Button } from "@orvui/vue/motion/button";
const dateLabel = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const history: readonly StatusBarDatum[] = Array.from(
  { length: 48 },
  (_, index) => {
    const date = new Date(Date.UTC(2026, 7, 21 + index));
    const degraded = index === 8;
    return {
      id: date.toISOString().slice(0, 10),
      label: dateLabel.format(date),
      status: degraded ? "degraded" : "operational",
      description: degraded
        ? "Elevated response times for 12 minutes."
        : "All checks passed.",
    };
  },
);
const website = history.map((period) => ({
  ...period,
  status: "operational",
  description: "All checks passed.",
}));
const statuses = STATUS_BAR_STATUSES.slice(0, 3);
const incident = ref(false);
const replay = ref(0);
const api = computed(() =>
  history.map((period, index) => {
    if (!incident.value || index < 45) return period;
    return {
      ...period,
      status: index === 46 ? "outage" : "degraded",
      description:
        index === 46
          ? "Requests failed for 4 minutes."
          : "Elevated response times.",
    };
  }),
);
</script>

<template>
  <div class="w-full max-w-2xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <span class="text-sm text-muted-foreground">48 days of status</span>
      <div class="flex gap-1">
        <Button variant="ghost" size="sm" tabindex="0" @click="replay++"
          >Replay</Button
        ><Button
          variant="ghost"
          size="sm"
          tabindex="0"
          @click="incident = !incident"
          >{{ incident ? "Resolve incident" : "Simulate incident" }}</Button
        >
      </div>
    </div>
    <StatusBar
      :key="'api-' + replay"
      :data="api"
      :statuses="statuses"
      label="API status"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">API</span
        ><span class="text-muted-foreground">{{
          incident ? "Degraded" : "Operational"
        }}</span>
      </div>
      <StatusBarPlot /><StatusBarTooltip />
    </StatusBar>
    <StatusBar
      :key="'website-' + replay"
      class="border-t border-border pt-6"
      :data="website"
      :statuses="statuses"
      label="Website status"
    >
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium">Website</span
        ><span class="text-muted-foreground">Operational</span>
      </div>
      <StatusBarPlot /><StatusBarLegend class="pt-2" /><StatusBarTooltip />
    </StatusBar>
  </div>
</template>
```

## API 参考

### StatusBar

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `data` | `readonly StatusBarDatum[]` | — | 是 | — |
| `statuses` | `readonly StatusBarStatus[]` | `STATUS_BAR_STATUSES` | 否 | — |
| `label` | `string` | `"Status history"` | 否 | — |
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

### StatusBarPlot

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `barClassName` | `string` | — | 否 | — |
| `showLabels` | `boolean` | `true` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### StatusBarTooltip

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `datum: history.active.datum`, `status: history.active.status` | — |

### StatusBarLegend

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `showCounts` | `boolean` | `false` | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

## 关于 Status Bar

在按比例分段的条形图中汇总各命名状态的数量。

### 适用场景

- 当界面需要以下行为时使用 Status Bar：在按比例分段的条形图中汇总各命名状态的数量。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Status Bar？**

通过 data、statuses、label、activeId、defaultActiveId、className 配置 Status Bar；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:activeId、activeChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/status-bar.json
- 文档: https://orvui.efu.me/charts/status-bar
- `packages/vue/src/charts/status-bar/src/StatusBar.vue`
- `packages/vue/src/charts/status-bar/src/StatusBarPlot.vue`
- `packages/vue/src/charts/status-bar/src/StatusBarTooltip.vue`
- `packages/vue/src/charts/status-bar/src/StatusBarLegend.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
