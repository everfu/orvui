---
title: "Input"
description: "在同一输入框中编辑文字，并可配置标签、图标与校验反馈。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/input"
markdown: "https://orvui.efu.me/components/motion/input.md"
license: "MIT"
productVersion: "0.1.0"
---

# Input

> 在同一输入框中编辑文字，并可配置标签、图标与校验反馈。

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

## 用法

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

## 关于 Input

在同一输入框中编辑文字，并可配置标签、图标与校验反馈。

### 适用场景

- 当界面需要以下行为时使用 Input：在同一输入框中编辑文字，并可配置标签、图标与校验反馈。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Input？**

通过 modelValue、defaultValue、label、error、reserveErrorLine、success、disabled、type、id、leftIcon、rightIcon、classNames 配置 Input；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change、focus、blur，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/input.json
- 文档: https://orvui.efu.me/components/motion/input
- `packages/vue/src/motion/input/src/Input.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
