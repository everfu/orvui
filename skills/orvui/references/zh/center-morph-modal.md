# Center Morph Modal · orvui 0.1.1

## 选择与组合

简短非交互提示使用 Tooltip，触发器附近的内容使用 Popover；需要聚焦完成任务时使用 Modal、Drawer 或移动端 Bottom Sheet。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Center Morph Modal"
description: "围绕中心向各方向展开模态框，关闭时回到同一点。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/center-morph-modal"
markdown: "https://orvui.efu.me/components/motion/center-morph-modal.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Center Morph Modal

> 围绕中心向各方向展开模态框，关闭时回到同一点。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Center Morph Modal：围绕中心向各方向展开模态框，关闭时回到同一点。

<a id="install"></a>
## 安装

### Center Morph Modal — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/center-morph-modal.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
### Center Morph Modal

**复制源码**

```vue
<script setup lang="ts">
import { useId } from "vue";
import { ArrowUpRight, Check } from "lucide-vue-next";
import { CenterMorphModal, CenterMorphModalClose, CenterMorphModalContent, CenterMorphModalTrigger } from "@/components/orvui/motion/center-morph-modal";
const descriptionId = `${useId()}-description`;
const features = ["Animated Vue components", "Composition API and TypeScript", "Editable source and registry"];
</script>
<template><div class="flex min-h-[420px] w-full items-center justify-center"><CenterMorphModal>
  <CenterMorphModalTrigger><button type="button" class="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Open modal</button></CenterMorphModalTrigger>
  <CenterMorphModalContent ariaLabel="orvui" :ariaDescribedBy="descriptionId"><div class="p-7 sm:p-8"><p class="text-sm font-medium text-muted-foreground">orvui</p>
    <h2 class="mt-5 max-w-xs pr-8 text-2xl font-medium tracking-tight text-foreground">Ship the whole experience.</h2>
    <p :id="descriptionId" class="mt-3 text-sm leading-relaxed text-muted-foreground">Create distinctive Vue interfaces with accessible controls and thoughtful movement throughout.</p>
    <div class="mt-7 space-y-3 border-y border-border py-5"><div v-for="feature in features" :key="feature" class="flex items-center gap-3 text-sm text-foreground"><Check class="h-4 w-4 text-muted-foreground" aria-hidden="true" /><span>{{ feature }}</span></div></div>
    <CenterMorphModalClose><button class="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Start creating<ArrowUpRight class="h-4 w-4" aria-hidden="true" /></button></CenterMorphModalClose>
  </div></CenterMorphModalContent>
</CenterMorphModal></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { useId } from "vue";
import { ArrowUpRight, Check } from "lucide-vue-next";
import { CenterMorphModal, CenterMorphModalClose, CenterMorphModalContent, CenterMorphModalTrigger } from "@orvui/vue/motion/center-morph-modal";
const descriptionId = `${useId()}-description`;
const features = ["Animated Vue components", "Composition API and TypeScript", "Editable source and registry"];
</script>
<template><div class="flex min-h-[420px] w-full items-center justify-center"><CenterMorphModal>
  <CenterMorphModalTrigger><button type="button" class="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">Open modal</button></CenterMorphModalTrigger>
  <CenterMorphModalContent ariaLabel="orvui" :ariaDescribedBy="descriptionId"><div class="p-7 sm:p-8"><p class="text-sm font-medium text-muted-foreground">orvui</p>
    <h2 class="mt-5 max-w-xs pr-8 text-2xl font-medium tracking-tight text-foreground">Ship the whole experience.</h2>
    <p :id="descriptionId" class="mt-3 text-sm leading-relaxed text-muted-foreground">Create distinctive Vue interfaces with accessible controls and thoughtful movement throughout.</p>
    <div class="mt-7 space-y-3 border-y border-border py-5"><div v-for="feature in features" :key="feature" class="flex items-center gap-3 text-sm text-foreground"><Check class="h-4 w-4 text-muted-foreground" aria-hidden="true" /><span>{{ feature }}</span></div></div>
    <CenterMorphModalClose><button class="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Start creating<ArrowUpRight class="h-4 w-4" aria-hidden="true" /></button></CenterMorphModalClose>
  </div></CenterMorphModalContent>
</CenterMorphModal></div></template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `CenterMorphModal` | `v-model:open` | `boolean` | `update:open` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### CenterMorphModal

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `false` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `open: opened` | — |

### CenterMorphModalClose

### CenterMorphModalContent

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | — | 是 | — |
| `ariaDescribedBy` | `string` | — | 否 | — |
| `dismissible` | `boolean` | `true` | 否 | — |
| `showCloseButton` | `boolean` | `true` | 否 | — |
| `closeButtonLabel` | `string` | `"Close modal"` | 否 | — |
| `backdropClassName` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### CenterMorphModalTrigger

<a id="about"></a>
## 关于 Center Morph Modal

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Center Morph Modal？**

通过 open、defaultOpen 配置 Center Morph Modal；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Popover](https://orvui.efu.me/components/motion/popover): 将浮动表面连接到触发器，支持常规过渡与连续变形过渡。
- [Select](https://orvui.efu.me/components/motion/select): 从浮动列表选择选项，面板可从触发器连续展开。
- [Color Picker](https://orvui.efu.me/components/motion/color-picker): 使用二维颜色区域、通道输入、预设与吸管编辑颜色。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/center-morph-modal.json
- 文档: https://orvui.efu.me/components/motion/center-morph-modal
- `packages/vue/src/motion/center-morph-modal/src/CenterMorphModal.vue`
- `packages/vue/src/motion/center-morph-modal/src/CenterMorphModalClose.vue`
- `packages/vue/src/motion/center-morph-modal/src/CenterMorphModalContent.vue`
- `packages/vue/src/motion/center-morph-modal/src/CenterMorphModalTrigger.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

