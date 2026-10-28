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

# Feedback Widget

> 将反馈触发器展开为表单，包含发送、成功和重试状态。

将反馈触发器展开为表单，包含发送、成功和重试状态。

## 适用场景

- 当界面需要以下行为时使用 Feedback Widget：将反馈触发器展开为表单，包含发送、成功和重试状态。

## 安装

### Feedback Widget — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/feedback-widget.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

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

## 关于 Feedback Widget

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Feedback Widget？**

通过 position、title、placeholder、icon、onSubmit 配置 Feedback Widget；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 success、error，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/feedback-widget.json
- 文档: https://orvui.efu.me/components/blocks/feedback-widget
- `packages/vue/src/blocks/feedback-widget/src/FeedbackWidget.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
