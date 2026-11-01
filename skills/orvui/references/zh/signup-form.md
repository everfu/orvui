# Sign Up Form · orvui 0.1.1

## 选择与组合

固定选项使用 Select，可搜索单选使用 Combobox，多选使用 Multi Select；即时设置用 Switch，需要随表单提交的勾选用 Checkbox。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Sign Up Form"
description: "逐步填写注册字段，并获得本地校验与明确提交状态。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/signup-form"
markdown: "https://orvui.efu.me/components/blocks/signup-form.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Sign Up Form

> 逐步填写注册字段，并获得本地校验与明确提交状态。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Sign Up Form：逐步填写注册字段，并获得本地校验与明确提交状态。

<a id="install"></a>
## 安装

### Sign Up Form — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/signup-form.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Sign Up Form

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { SignUpForm, type SignUpValues } from "@/components/orvui/blocks/signup-form";
const error = ref<string>();
let timer: ReturnType<typeof setTimeout> | undefined,
  finish: (() => void) | undefined,
  disposed = false;
async function submit(values: SignUpValues) {
  error.value = undefined;
  await new Promise<void>((resolve) => {
    finish = resolve;
    timer = setTimeout(() => {
      finish = undefined;
      resolve();
    }, 1200);
  });
  if (disposed) return;
  if (values.email.toLowerCase().startsWith("taken@")) {
    error.value = "This address belongs to an existing demo account.";
    throw new Error("Demo account already exists");
  }
}
onBeforeUnmount(() => {
  disposed = true;
  clearTimeout(timer);
  finish?.();
});
</script>
<template>
  <div class="flex w-full justify-center py-4">
    <SignUpForm
      description="Use taken@example.com to preview a rejected signup."
      :error-message="error"
      :on-submit="submit"
      ><template #footer
        >Have a workspace already?
        <button
          type="button"
          class="font-medium text-foreground underline underline-offset-4"
        >
          Sign in
        </button></template
      ></SignUpForm
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { SignUpForm, type SignUpValues } from "@orvui/vue/blocks/signup-form";
const error = ref<string>();
let timer: ReturnType<typeof setTimeout> | undefined,
  finish: (() => void) | undefined,
  disposed = false;
async function submit(values: SignUpValues) {
  error.value = undefined;
  await new Promise<void>((resolve) => {
    finish = resolve;
    timer = setTimeout(() => {
      finish = undefined;
      resolve();
    }, 1200);
  });
  if (disposed) return;
  if (values.email.toLowerCase().startsWith("taken@")) {
    error.value = "This address belongs to an existing demo account.";
    throw new Error("Demo account already exists");
  }
}
onBeforeUnmount(() => {
  disposed = true;
  clearTimeout(timer);
  finish?.();
});
</script>
<template>
  <div class="flex w-full justify-center py-4">
    <SignUpForm
      description="Use taken@example.com to preview a rejected signup."
      :error-message="error"
      :on-submit="submit"
      ><template #footer
        >Have a workspace already?
        <button
          type="button"
          class="font-medium text-foreground underline underline-offset-4"
        >
          Sign in
        </button></template
      ></SignUpForm
    >
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `SignUpForm` | `v-model` | `SignUpValues` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### SignUpForm

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `SignUpValues` | `options.values` | 否 | — |
| `values` | `SignUpValues` | — | 否 | — |
| `defaultValues` | `Partial<SignUpValues>` | — | 否 | — |
| `validate` | `(values: SignUpValues) => SignUpErrors` | `defaultValidate` | 否 | — |
| `status` | `"success" \| "idle" \| "loading" \| "error"` | `localStatus.value` | 否 | — |
| `errorMessage` | `string` | — | 否 | — |
| `title` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Create your account"` | 否 | — |
| `description` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Start building in under a minute."` | 否 | — |
| `submitLabel` | `string` | `"Create account"` | 否 | — |
| `footer` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | — | 否 | — |
| `strengthMeter` | `boolean` | `true` | 否 | — |
| `className` | `string` | — | 否 | — |
| `classNames` | `SignUpFormClassNames` | — | 否 | — |
| `onSubmit` | `(values: SignUpValues) => void \| Promise<void>` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `[values: SignUpValues]` | — |
| `valuesChange` | `[values: SignUpValues]` | — |
| `success` | `[values: SignUpValues]` | — |
| `error` | `[error: unknown]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `footer` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Sign Up Form

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Sign Up Form？**

通过 modelValue、values、defaultValues、validate、status、errorMessage、title、description、submitLabel、footer、strengthMeter、className、classNames、onSubmit 配置 Sign Up Form；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valuesChange、success、error，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Swipeable List](https://orvui.efu.me/components/blocks/swipeable-list): 通过指针或键盘输入，展示列表行左右两侧的操作。
- [Feedback Widget](https://orvui.efu.me/components/blocks/feedback-widget): 将反馈触发器展开为表单，包含发送、成功和重试状态。
- [Project Folder](https://orvui.efu.me/components/blocks/project-folder): 扇形展开文档预览，并将选中文件夹展开为聚焦表面。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/signup-form.json
- 文档: https://orvui.efu.me/components/blocks/signup-form
- `packages/vue/src/blocks/signup-form/src/SignUpForm.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

