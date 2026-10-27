---
title: "Checkbox"
description: "通过动态勾选标记表示选中、未选中和半选状态。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/checkbox"
markdown: "https://orvui.efu.me/components/motion/checkbox.md"
license: "MIT"
productVersion: "0.1.0"
---

# Checkbox

> 通过动态勾选标记表示选中、未选中和半选状态。

## 安装

### Checkbox — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/checkbox.json
```

### Checkbox — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/checkbox.json
```

### With Description — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/checkbox.json
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

### Checkbox

**复制源码**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "@/components/orvui/motion/checkbox";
const settings = reactive({ terms: true, announcements: false });
</script>
<template><div class="flex flex-col gap-3">
  <Checkbox v-model="settings.terms" label="Accept terms and conditions" /><Checkbox v-model="settings.announcements" label="Email me product updates" />
  <Checkbox :model-value="true" indeterminate label="Select all (partial)" /><Checkbox :model-value="true" disabled label="Disabled" />
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "@orvui/vue/motion/checkbox";
const settings = reactive({ terms: true, announcements: false });
</script>
<template><div class="flex flex-col gap-3">
  <Checkbox v-model="settings.terms" label="Accept terms and conditions" /><Checkbox v-model="settings.announcements" label="Email me product updates" />
  <Checkbox :model-value="true" indeterminate label="Select all (partial)" /><Checkbox :model-value="true" disabled label="Disabled" />
</div></template>
```

### Checkbox

检查选中与半选状态，查看标记描绘和弹簧按压反馈。

**复制源码**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "@/components/orvui/motion/checkbox";
const settings = reactive({ terms: true, announcements: false });
</script>
<template><div class="flex flex-col gap-3">
  <Checkbox v-model="settings.terms" label="Accept terms and conditions" /><Checkbox v-model="settings.announcements" label="Email me product updates" />
  <Checkbox :model-value="true" indeterminate label="Select all (partial)" /><Checkbox :model-value="true" disabled label="Disabled" />
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "@orvui/vue/motion/checkbox";
const settings = reactive({ terms: true, announcements: false });
</script>
<template><div class="flex flex-col gap-3">
  <Checkbox v-model="settings.terms" label="Accept terms and conditions" /><Checkbox v-model="settings.announcements" label="Email me product updates" />
  <Checkbox :model-value="true" indeterminate label="Select all (partial)" /><Checkbox :model-value="true" disabled label="Disabled" />
</div></template>
```

### With Description

在标签下添加解释文字，并将其关联为复选框的描述。

**复制源码**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "@/components/orvui/motion/checkbox";
const selected = reactive<Record<string, boolean>>({ comments: true, mentions: true, digest: false });
const options = [
  { id: "comments", label: "Comments", description: "Replies to conversations you began." },
  { id: "mentions", label: "Mentions", description: "A notification when your name is tagged." },
  { id: "digest", label: "Weekly digest", description: "A Monday overview of recent activity." },
];
</script>
<template><div class="flex w-full max-w-64 flex-col gap-3">
  <Checkbox v-for="option in options" :key="option.id" v-model="selected[option.id]" :label="option.label" :description="option.description" />
  <Checkbox :model-value="false" disabled label="SMS alerts" description="Connect your phone number to begin." />
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "@orvui/vue/motion/checkbox";
const selected = reactive<Record<string, boolean>>({ comments: true, mentions: true, digest: false });
const options = [
  { id: "comments", label: "Comments", description: "Replies to conversations you began." },
  { id: "mentions", label: "Mentions", description: "A notification when your name is tagged." },
  { id: "digest", label: "Weekly digest", description: "A Monday overview of recent activity." },
];
</script>
<template><div class="flex w-full max-w-64 flex-col gap-3">
  <Checkbox v-for="option in options" :key="option.id" v-model="selected[option.id]" :label="option.label" :description="option.description" />
  <Checkbox :model-value="false" disabled label="SMS alerts" description="Connect your phone number to begin." />
</div></template>
```

## API 参考

### Checkbox

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `boolean` | `undefined` | 否 | — |
| `defaultValue` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `indeterminate` | `boolean` | `false` | 否 | — |
| `label` | `string` | — | 否 | — |
| `description` | `string` | — | 否 | — |
| `id` | `string` | `generatedId` | 否 | — |
| `ariaLabel` | `string` | `attrs["aria-label"] as string \| undefined` | 否 | — |
| `ariaDescribedBy` | `string` | `attrs["aria-describedby"]` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

## 关于 Checkbox

通过动态勾选标记表示选中、未选中和半选状态。

### 适用场景

- 当界面需要以下行为时使用 Checkbox：通过动态勾选标记表示选中、未选中和半选状态。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Checkbox？**

通过 modelValue、defaultValue、disabled、indeterminate、label、description、id、ariaLabel、ariaDescribedBy 配置 Checkbox；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/checkbox.json
- 文档: https://orvui.efu.me/components/motion/checkbox
- `packages/vue/src/motion/checkbox/src/Checkbox.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
