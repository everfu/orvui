# OTP Input · orvui 0.1.1

## 选择与组合

固定选项使用 Select，可搜索单选使用 Combobox，多选使用 Multi Select；即时设置用 Switch，需要随表单提交的勾选用 Checkbox。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "OTP Input"
description: "通过分组输入框键入或粘贴固定长度验证码，并获取完成反馈。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/otp-input"
markdown: "https://orvui.efu.me/components/blocks/otp-input.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# OTP Input

> 通过分组输入框键入或粘贴固定长度验证码，并获取完成反馈。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 OTP Input：通过分组输入框键入或粘贴固定长度验证码，并获取完成反馈。

<a id="install"></a>
## 安装

### OTP Input — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/otp-input.json
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
### OTP Input

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { OTPInput, type OTPStatus } from "@/components/orvui/blocks/otp-input";
const code = ref("");
const verification = ref<OTPStatus>("idle");
function verify(value: string) {
  verification.value = value === "123456" ? "success" : "error";
}
function reset() {
  verification.value = "idle";
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <OTPInput
      v-model="code"
      :status="verification"
      label="Verification code"
      hint="Enter 123456 to verify."
      success-message="Verified."
      error-message="Wrong code, try again."
      @change="reset"
      @complete="verify"
    />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { OTPInput, type OTPStatus } from "@orvui/vue/blocks/otp-input";
const code = ref("");
const verification = ref<OTPStatus>("idle");
function verify(value: string) {
  verification.value = value === "123456" ? "success" : "error";
}
function reset() {
  verification.value = "idle";
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <OTPInput
      v-model="code"
      :status="verification"
      label="Verification code"
      hint="Enter 123456 to verify."
      success-message="Verified."
      error-message="Wrong code, try again."
      @change="reset"
      @complete="verify"
    />
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `OTPInput` | `v-model` | `string` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### OTPInput

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `length` | `number` | `6` | 否 | — |
| `modelValue` | `string` | `props.value` | 否 | — |
| `value` | `string` | — | 否 | — |
| `defaultValue` | `string` | `""` | 否 | — |
| `label` | `string` | — | 否 | — |
| `hint` | `string` | — | 否 | — |
| `successMessage` | `string` | — | 否 | — |
| `errorMessage` | `string` | — | 否 | — |
| `status` | `"success" \| "idle" \| "error"` | `"idle"` | 否 | — |
| `mask` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `autoFocus` | `boolean` | `false` | 否 | — |
| `ariaLabel` | `string` | `"One-time passcode"` | 否 | — |
| `className` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `[value: string]` | — |
| `change` | `[value: string]` | — |
| `complete` | `[value: string]` | — |

<a id="about"></a>
## 关于 OTP Input

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 OTP Input？**

通过 length、modelValue、value、defaultValue、label、hint、successMessage、errorMessage、status、mask、disabled、autoFocus、ariaLabel、className 配置 OTP Input；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change、complete，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Feedback Widget](https://orvui.efu.me/components/blocks/feedback-widget): 将反馈触发器展开为表单，包含发送、成功和重试状态。
- [Availability Scheduler](https://orvui.efu.me/components/blocks/availability-scheduler): 使用时间区间编辑每周可用时间，并将安排复制到指定日期。
- [File Upload](https://orvui.efu.me/components/blocks/file-upload): 在队列或附件工作区管理文件、预览、进度与重试操作。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/otp-input.json
- 文档: https://orvui.efu.me/components/blocks/otp-input
- `packages/vue/src/blocks/otp-input/src/OTPInput.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

