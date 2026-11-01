---
title: "Feedback Widget"
description: "将反馈触发器展开为表单，包含发送、成功和重试状态。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/feedback-widget"
markdown: "https://orvui.efu.me/components/blocks/feedback-widget.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Feedback Widget

> 将反馈触发器展开为表单，包含发送、成功和重试状态。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Feedback Widget：将反馈触发器展开为表单，包含发送、成功和重试状态。

<a id="install"></a>
## 安装

### Feedback Widget — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/feedback-widget.json
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
### Feedback Widget

**复制源码**

```vue
<script setup lang="ts">
import { FeedbackWidget } from "@/components/orvui/blocks/feedback-widget";
let submissions = 0;
async function submit() {
  await new Promise<void>((resolve) => setTimeout(resolve, 900));
  if (++submissions === 1) throw new Error("Preview submission failed");
}
</script>
<template>
  <div
    class="relative h-80 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background"
  >
    <div class="border-b border-border px-5 py-3">
      <div class="h-2.5 w-24 rounded-full bg-muted-foreground/20" />
    </div>
    <div class="flex flex-col gap-3 p-5">
      <div class="h-2.5 w-3/4 rounded-full bg-muted-foreground/15" />
      <div class="h-2.5 w-1/2 rounded-full bg-muted-foreground/15" />
      <div class="h-24 w-full rounded-xl bg-muted-foreground/[0.06]" />
      <div class="h-2.5 w-2/3 rounded-full bg-muted-foreground/15" />
    </div>
    <FeedbackWidget :on-submit="submit" />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { FeedbackWidget } from "@orvui/vue/blocks/feedback-widget";
let submissions = 0;
async function submit() {
  await new Promise<void>((resolve) => setTimeout(resolve, 900));
  if (++submissions === 1) throw new Error("Preview submission failed");
}
</script>
<template>
  <div
    class="relative h-80 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background"
  >
    <div class="border-b border-border px-5 py-3">
      <div class="h-2.5 w-24 rounded-full bg-muted-foreground/20" />
    </div>
    <div class="flex flex-col gap-3 p-5">
      <div class="h-2.5 w-3/4 rounded-full bg-muted-foreground/15" />
      <div class="h-2.5 w-1/2 rounded-full bg-muted-foreground/15" />
      <div class="h-24 w-full rounded-xl bg-muted-foreground/[0.06]" />
      <div class="h-2.5 w-2/3 rounded-full bg-muted-foreground/15" />
    </div>
    <FeedbackWidget :on-submit="submit" />
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
## API 参考

### FeedbackWidget

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `position` | `"bottom-left" \| "bottom-right"` | `"bottom-right"` | 否 | — |
| `title` | `string` | `"Help us improve"` | 否 | — |
| `placeholder` | `string` | `"Share an idea or report a bug"` | 否 | — |
| `icon` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `undefined` | 否 | — |
| `onSubmit` | `(data: FeedbackData) => void \| Promise<void>` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `success` | `[data: FeedbackData]` | — |
| `error` | `[error: unknown]` | — |

<a id="about"></a>
## 关于 Feedback Widget

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Feedback Widget？**

通过 position、title、placeholder、icon、onSubmit 配置 Feedback Widget；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 success、error，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [OTP Input](https://orvui.efu.me/components/blocks/otp-input): 通过分组输入框键入或粘贴固定长度验证码，并获取完成反馈。
- [File Upload](https://orvui.efu.me/components/blocks/file-upload): 在队列或附件工作区管理文件、预览、进度与重试操作。
- [Availability Scheduler](https://orvui.efu.me/components/blocks/availability-scheduler): 使用时间区间编辑每周可用时间，并将安排复制到指定日期。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/feedback-widget.json
- 文档: https://orvui.efu.me/components/blocks/feedback-widget
- `packages/vue/src/blocks/feedback-widget/src/FeedbackWidget.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
