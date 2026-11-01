---
title: "Checkbox"
description: "通过动态勾选标记表示选中、未选中和半选状态。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/checkbox"
markdown: "https://orvui.efu.me/components/motion/checkbox.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Checkbox

> 通过动态勾选标记表示选中、未选中和半选状态。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Checkbox：通过动态勾选标记表示选中、未选中和半选状态。

<a id="install"></a>
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

在你的应用目录从 npm 安装已发布的组件包。

```bash
pnpm add @orvui/vue
```

```typescript
import '@orvui/vue/style.css';
```

## 依赖

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
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

<a id="default"></a>
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

<a id="description"></a>
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

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `Checkbox` | `v-model` | `boolean` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
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

<a id="about"></a>
## 关于 Checkbox

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Checkbox？**

通过 modelValue、defaultValue、disabled、indeterminate、label、description、id、ariaLabel、ariaDescribedBy 配置 Checkbox；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Radio Group](https://orvui.efu.me/components/motion/radio): 从带标签、支持键盘导航的选项组中选择一个值。
- [Input](https://orvui.efu.me/components/motion/input): 在同一输入框中编辑文字，并可配置标签、图标与校验反馈。
- [Select](https://orvui.efu.me/components/motion/select): 从浮动列表选择选项，面板可从触发器连续展开。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/checkbox.json
- 文档: https://orvui.efu.me/components/motion/checkbox
- `packages/vue/src/motion/checkbox/src/Checkbox.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
