# Adaptive Stepper · orvui 0.1.1

## 选择与组合

页面内相关视图使用 Tabs；页面层级使用 Breadcrumb；长文章定位使用 Table of Contents；跨功能区导航可使用 Animated Sidebar。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Adaptive Stepper"
description: "调整有边界的数值，不可用操作让出的空间由数值接替。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/adaptive-stepper"
markdown: "https://orvui.efu.me/components/motion/adaptive-stepper.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Adaptive Stepper

> 调整有边界的数值，不可用操作让出的空间由数值接替。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Adaptive Stepper：调整有边界的数值，不可用操作让出的空间由数值接替。

<a id="install"></a>
## 安装

### Adaptive Stepper — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/adaptive-stepper.json
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
### Adaptive Stepper

**复制源码**

```vue
<script setup lang="ts">
import { AdaptiveStepper, AdaptiveStepperDecrement, AdaptiveStepperIncrement, AdaptiveStepperValue } from "@/components/orvui/motion/adaptive-stepper";
const limits = { min: 0, max: 3, defaultValue: 2 };
</script>
<template><div class="flex min-h-[320px] w-full items-center justify-center px-4"><AdaptiveStepper v-bind="limits" aria-label="Guests"><AdaptiveStepperDecrement /><AdaptiveStepperValue /><AdaptiveStepperIncrement /></AdaptiveStepper></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { AdaptiveStepper, AdaptiveStepperDecrement, AdaptiveStepperIncrement, AdaptiveStepperValue } from "@orvui/vue/motion/adaptive-stepper";
const limits = { min: 0, max: 3, defaultValue: 2 };
</script>
<template><div class="flex min-h-[320px] w-full items-center justify-center px-4"><AdaptiveStepper v-bind="limits" aria-label="Guests"><AdaptiveStepperDecrement /><AdaptiveStepperValue /><AdaptiveStepperIncrement /></AdaptiveStepper></div></template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `AdaptiveStepper` | `v-model` | `number` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### AdaptiveStepper

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `modelValue` | `number` | — | 否 | — |
| `defaultValue` | `number` | `0` | 否 | — |
| `min` | `number` | `0` | 否 | — |
| `max` | `number` | `10` | 否 | — |
| `step` | `number` | `1` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `name` | `string` | — | 否 | — |
| `formatValueText` | `(value: number) => string` | — | 否 | — |
| `ariaLabel` | `string` | `"Quantity"` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AdaptiveStepperDecrement

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AdaptiveStepperIncrement

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AdaptiveStepperValue

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `value: state.value.value` | — |

<a id="about"></a>
## 关于 Adaptive Stepper

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Adaptive Stepper？**

通过 modelValue、defaultValue、min、max、step、disabled、name、formatValueText、ariaLabel 配置 Adaptive Stepper；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Color Picker](https://orvui.efu.me/components/motion/color-picker): 使用二维颜色区域、通道输入、预设与吸管编辑颜色。
- [Center Morph Modal](https://orvui.efu.me/components/motion/center-morph-modal): 围绕中心向各方向展开模态框，关闭时回到同一点。
- [Select](https://orvui.efu.me/components/motion/select): 从浮动列表选择选项，面板可从触发器连续展开。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/adaptive-stepper.json
- 文档: https://orvui.efu.me/components/motion/adaptive-stepper
- `packages/vue/src/motion/adaptive-stepper/src/AdaptiveStepper.vue`
- `packages/vue/src/motion/adaptive-stepper/src/AdaptiveStepperDecrement.vue`
- `packages/vue/src/motion/adaptive-stepper/src/AdaptiveStepperIncrement.vue`
- `packages/vue/src/motion/adaptive-stepper/src/AdaptiveStepperValue.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

