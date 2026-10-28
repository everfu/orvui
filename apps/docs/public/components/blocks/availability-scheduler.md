---
title: "Availability Scheduler"
description: "使用时间区间编辑每周可用时间，并将安排复制到指定日期。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/availability-scheduler"
markdown: "https://orvui.efu.me/components/blocks/availability-scheduler.md"
license: "MIT"
productVersion: "0.1.0"
---

# Availability Scheduler

> 使用时间区间编辑每周可用时间，并将安排复制到指定日期。

使用时间区间编辑每周可用时间，并将安排复制到指定日期。

## 适用场景

- 当界面需要以下行为时使用 Availability Scheduler：使用时间区间编辑每周可用时间，并将安排复制到指定日期。

## 安装

### Availability Scheduler — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/availability-scheduler.json
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
- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### Availability Scheduler

**复制源码**

```vue
<script setup lang="ts">
import { AvailabilityScheduler } from "@/components/orvui/blocks/availability-scheduler";
</script>
<template><AvailabilityScheduler /></template>
```

**组件包**

```vue
<script setup lang="ts">
import { AvailabilityScheduler } from "@orvui/vue/blocks/availability-scheduler";
</script>
<template><AvailabilityScheduler /></template>
```

## API 参考

### AvailabilityScheduler

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `WeekAvailability` | — | 否 | — |
| `defaultValue` | `WeekAvailability` | `defaultWeek()` | 否 | — |
| `step` | `number` | `30` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `[value: WeekAvailability]` | — |
| `change` | `[value: WeekAvailability]` | — |

## 关于 Availability Scheduler

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Availability Scheduler？**

通过 modelValue、defaultValue、step、disabled 配置 Availability Scheduler；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/availability-scheduler.json
- 文档: https://orvui.efu.me/components/blocks/availability-scheduler
- `packages/vue/src/blocks/availability-scheduler/src/AvailabilityScheduler.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
