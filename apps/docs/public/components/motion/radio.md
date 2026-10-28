---
title: "Radio Group"
description: "从带标签、支持键盘导航的选项组中选择一个值。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/radio"
markdown: "https://orvui.efu.me/components/motion/radio.md"
license: "MIT"
productVersion: "0.1.0"
---

# Radio Group

> 从带标签、支持键盘导航的选项组中选择一个值。

从带标签、支持键盘导航的选项组中选择一个值。

## 适用场景

- 当界面需要以下行为时使用 Radio Group：从带标签、支持键盘导航的选项组中选择一个值。

## 安装

### Radio Group — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/radio.json
```

### Radio Group — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/radio.json
```

### With Description — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/radio.json
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

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### Radio Group

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "@/components/orvui/motion/radio";
const selected = ref("pro");
const options = [{ value: "starter", label: "Starter, free" }, { value: "pro", label: "Pro, $12/mo" }, { value: "team", label: "Team, $29/mo" }, { value: "legacy", label: "Legacy plan", disabled: true }];
</script>
<template><RadioGroup v-model="selected" class="min-w-48"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "@orvui/vue/motion/radio";
const selected = ref("pro");
const options = [{ value: "starter", label: "Starter, free" }, { value: "pro", label: "Pro, $12/mo" }, { value: "team", label: "Team, $29/mo" }, { value: "legacy", label: "Legacy plan", disabled: true }];
</script>
<template><RadioGroup v-model="selected" class="min-w-48"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
```

### Radio Group

在原生单选项之间移动选中圆点，并提供按压反馈。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "@/components/orvui/motion/radio";
const selected = ref("pro");
const options = [{ value: "starter", label: "Starter, free" }, { value: "pro", label: "Pro, $12/mo" }, { value: "team", label: "Team, $29/mo" }, { value: "legacy", label: "Legacy plan", disabled: true }];
</script>
<template><RadioGroup v-model="selected" class="min-w-48"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "@orvui/vue/motion/radio";
const selected = ref("pro");
const options = [{ value: "starter", label: "Starter, free" }, { value: "pro", label: "Pro, $12/mo" }, { value: "team", label: "Team, $29/mo" }, { value: "legacy", label: "Legacy plan", disabled: true }];
</script>
<template><RadioGroup v-model="selected" class="min-w-48"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
```

### With Description

为每个单选项添加辅助文字，并关联其无障碍描述。

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "@/components/orvui/motion/radio";
const selected = ref("once");
const options = [
  { value: "once", label: "Run once", description: "Start one run immediately." },
  { value: "schedule", label: "Run on a schedule", description: "Use a recurring interval until you stop it." },
  { value: "trigger", label: "Run on a trigger", description: "Start after the selected event arrives." },
  { value: "manual", label: "Manual approval", description: "Choose another plan to use this option.", disabled: true },
];
</script>
<template><RadioGroup v-model="selected" class="w-full max-w-64"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "@orvui/vue/motion/radio";
const selected = ref("once");
const options = [
  { value: "once", label: "Run once", description: "Start one run immediately." },
  { value: "schedule", label: "Run on a schedule", description: "Use a recurring interval until you stop it." },
  { value: "trigger", label: "Run on a trigger", description: "Start after the selected event arrives." },
  { value: "manual", label: "Manual approval", description: "Choose another plan to use this option.", disabled: true },
];
</script>
<template><RadioGroup v-model="selected" class="w-full max-w-64"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
```

## API 参考

### RadioGroup

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | — | 否 | — |
| `defaultValue` | `string` | `""` | 否 | — |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | 否 | — |
| `name` | `string` | `instanceId` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### RadioGroupItem

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | 是 | — |
| `label` | `string` | — | 否 | — |
| `description` | `string` | — | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `id` | `string` | `generatedId` | 否 | — |

## 关于 Radio Group

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Radio Group？**

通过 modelValue、defaultValue、orientation、name 配置 Radio Group；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/radio.json
- 文档: https://orvui.efu.me/components/motion/radio
- `packages/vue/src/motion/radio/src/RadioGroup.vue`
- `packages/vue/src/motion/radio/src/RadioGroupItem.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
