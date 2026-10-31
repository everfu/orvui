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

<a id="overview"></a>
# Availability Scheduler

> 使用时间区间编辑每周可用时间，并将安排复制到指定日期。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Availability Scheduler：使用时间区间编辑每周可用时间，并将安排复制到指定日期。

<a id="install"></a>
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

<a id="examples"></a>
## 用法

<a id="default"></a>
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

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `AvailabilityScheduler` | `v-model` | `WeekAvailability` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
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

<a id="about"></a>
## 关于 Availability Scheduler

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Availability Scheduler？**

通过 modelValue、defaultValue、step、disabled 配置 Availability Scheduler；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [OTP Input](https://orvui.efu.me/components/blocks/otp-input): 通过分组输入框键入或粘贴固定长度验证码，并获取完成反馈。
- [File Upload](https://orvui.efu.me/components/blocks/file-upload): 在队列或附件工作区管理文件、预览、进度与重试操作。
- [Feedback Widget](https://orvui.efu.me/components/blocks/feedback-widget): 将反馈触发器展开为表单，包含发送、成功和重试状态。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/availability-scheduler.json
- 文档: https://orvui.efu.me/components/blocks/availability-scheduler
- `packages/vue/src/blocks/availability-scheduler/src/AvailabilityScheduler.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
