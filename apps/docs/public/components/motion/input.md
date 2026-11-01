---
title: "Input"
description: "在同一输入框中编辑文字，并可配置标签、图标与校验反馈。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/input"
markdown: "https://orvui.efu.me/components/motion/input.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Input

> 在同一输入框中编辑文字，并可配置标签、图标与校验反馈。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Input：在同一输入框中编辑文字，并可配置标签、图标与校验反馈。

<a id="install"></a>
## 安装

### Input — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/input.json
```

此示例还需要：

```bash
pnpm add lucide-vue-next@^0.468.0
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

- `clsx@^2.1.1`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Input

**复制源码**

```vue
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Eye, EyeOff, Mail, Search } from "lucide-vue-next";
import { Input } from "@/components/orvui/motion/input";
const form = reactive({ email: "", password: "orvui2026", query: "Kai" }), visible = ref(false);
const emailError = computed(() => form.email && !form.email.includes("@") ? "Use a valid email address." : undefined);
</script>
<template><div class="flex w-full max-w-xs flex-col gap-1">
  <Input v-model="form.email" label="Email" type="email" placeholder="you@example.com" :error="emailError" reserve-error-line><template #leftIcon><Mail /></template></Input>
  <Input v-model="form.password" label="Password" :type="visible ? 'text' : 'password'" reserve-error-line><template #rightIcon><button type="button" @click="visible = !visible" :aria-label="visible ? 'Hide password' : 'Show password'" class="pointer-events-auto"><EyeOff v-if="visible" /><Eye v-else /></button></template></Input>
  <Input v-model="form.query" label="Search" :success="form.query.length > 1" reserve-error-line><template #leftIcon><Search /></template></Input>
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Eye, EyeOff, Mail, Search } from "lucide-vue-next";
import { Input } from "@orvui/vue/motion/input";
const form = reactive({ email: "", password: "orvui2026", query: "Kai" }), visible = ref(false);
const emailError = computed(() => form.email && !form.email.includes("@") ? "Use a valid email address." : undefined);
</script>
<template><div class="flex w-full max-w-xs flex-col gap-1">
  <Input v-model="form.email" label="Email" type="email" placeholder="you@example.com" :error="emailError" reserve-error-line><template #leftIcon><Mail /></template></Input>
  <Input v-model="form.password" label="Password" :type="visible ? 'text' : 'password'" reserve-error-line><template #rightIcon><button type="button" @click="visible = !visible" :aria-label="visible ? 'Hide password' : 'Show password'" class="pointer-events-auto"><EyeOff v-if="visible" /><Eye v-else /></button></template></Input>
  <Input v-model="form.query" label="Search" :success="form.query.length > 1" reserve-error-line><template #leftIcon><Search /></template></Input>
</div></template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `Input` | `v-model` | `string` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### Input

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `string` | — | 否 | — |
| `defaultValue` | `string` | `""` | 否 | — |
| `label` | `string` | — | 否 | — |
| `error` | `boolean \| string` | — | 否 | — |
| `reserveErrorLine` | `boolean` | `false` | 否 | — |
| `success` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `type` | `string` | `"text"` | 否 | — |
| `id` | `string` | `generatedId` | 否 | — |
| `leftIcon` | `any` | — | 否 | — |
| `rightIcon` | `any` | — | 否 | — |
| `classNames` | `Record<string, string>` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |
| `focus` | — | — |
| `blur` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `leftIcon` | `() => VNodeChild` | — | — |
| `rightIcon` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Input

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Input？**

通过 modelValue、defaultValue、label、error、reserveErrorLine、success、disabled、type、id、leftIcon、rightIcon、classNames 配置 Input；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change、focus、blur，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Checkbox](https://orvui.efu.me/components/motion/checkbox): 通过动态勾选标记表示选中、未选中和半选状态。
- [Select](https://orvui.efu.me/components/motion/select): 从浮动列表选择选项，面板可从触发器连续展开。
- [Radio Group](https://orvui.efu.me/components/motion/radio): 从带标签、支持键盘导航的选项组中选择一个值。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/input.json
- 文档: https://orvui.efu.me/components/motion/input
- `packages/vue/src/motion/input/src/Input.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
