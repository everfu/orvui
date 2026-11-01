# Radio Group · orvui 0.1.1

## 选择与组合

固定选项使用 Select，可搜索单选使用 Combobox，多选使用 Multi Select；即时设置用 Switch，需要随表单提交的勾选用 Checkbox。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Radio Group"
description: "从带标签、支持键盘导航的选项组中选择一个值。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/radio"
markdown: "https://orvui.efu.me/components/motion/radio.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Radio Group

> 从带标签、支持键盘导航的选项组中选择一个值。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Radio Group：从带标签、支持键盘导航的选项组中选择一个值。

<a id="install"></a>
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

<a id="default"></a>
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

<a id="description"></a>
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

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `RadioGroup` | `v-model` | `string` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
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

<a id="about"></a>
## 关于 Radio Group

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Radio Group？**

通过 modelValue、defaultValue、orientation、name 配置 Radio Group；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Checkbox](https://orvui.efu.me/components/motion/checkbox): 通过动态勾选标记表示选中、未选中和半选状态。
- [Select](https://orvui.efu.me/components/motion/select): 从浮动列表选择选项，面板可从触发器连续展开。
- [Input](https://orvui.efu.me/components/motion/input): 在同一输入框中编辑文字，并可配置标签、图标与校验反馈。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/radio.json
- 文档: https://orvui.efu.me/components/motion/radio
- `packages/vue/src/motion/radio/src/RadioGroup.vue`
- `packages/vue/src/motion/radio/src/RadioGroupItem.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

