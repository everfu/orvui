---
title: "Animated Toast Stack"
description: "在堆叠区域管理临时通知，支持操作与手势关闭。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/animated-toast-stack"
markdown: "https://orvui.efu.me/components/motion/animated-toast-stack.md"
license: "MIT"
productVersion: "0.1.0"
---

# Animated Toast Stack

> 在堆叠区域管理临时通知，支持操作与手势关闭。

## 安装

### Animated Toast Stack — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/animated-toast-stack.json
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
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

## 用法

### Animated Toast Stack

**复制源码**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { Check, LoaderCircle, Sparkles, X } from "lucide-vue-next";
import {
  AnimatedToastStack,
  useAnimatedToastStack,
  type ToastInput,
  type ToastPosition,
} from "@/components/orvui/motion/animated-toast-stack";
const positions: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];
const examples: (ToastInput & { label: string })[] = [
  { label: "Title only", status: "success", title: "Saved", duration: 0 },
  {
    label: "Promise",
    status: "loading",
    title: "Publishing component",
    description: "Bundling source, preview, and registry metadata.",
    duration: 0,
  },
  {
    label: "Success",
    status: "success",
    title: "Component published",
    description: "Registry endpoint and raw source are available.",
  },
  {
    label: "Error",
    status: "error",
    title: "Snapshot failed",
    description: "Retry after the browser target settles.",
  },
];
const position = ref<ToastPosition>("bottom-right"),
  { toasts, showToast, updateToast, dismissToast, clearToasts } =
    useAnimatedToastStack({ defaultDuration: 3600, limit: 5 }),
  timers = new Set<ReturnType<typeof setTimeout>>();
function openToast(input: ToastInput) {
  const id = showToast(input);
  if (input.status !== "loading") return;
  const timer = setTimeout(() => {
    timers.delete(timer);
    updateToast(id, {
      status: "success",
      title: "Publish complete",
      description: "Toast updated in-place from loading to success.",
      duration: 3200,
    });
  }, 1800);
  timers.add(timer);
}
function moveStack(value: ToastPosition) {
  position.value = value;
  showToast({
    status: "info",
    title: "Position changed",
    description: `New toasts open from ${value}.`,
  });
}
onBeforeUnmount(() => {
  for (const timer of timers) clearTimeout(timer);
  timers.clear();
});
</script>
<template>
  <div class="flex min-h-72 w-full flex-col items-center justify-center gap-6">
    <AnimatedToastStack
      :toasts="toasts"
      :position="position"
      placement="fixed"
      :max-visible="4"
      :class-names="{ surface: 'bg-card/95' }"
      :icons="{ neutral: Sparkles }"
      @dismiss="dismissToast"
    />
    <div class="flex flex-col items-center gap-2 text-center">
      <p class="text-sm font-medium text-foreground">Open a real toast</p>
      <p class="max-w-sm text-xs leading-5 text-muted-foreground">
        Toasts render fixed on the screen. Change position to open a toast from
        that edge.
      </p>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <button
        v-for="example in examples"
        :key="example.label"
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground transition-colors press hover:border-(--color-border-strong)"
        @click="openToast(example)"
      >
        <component
          :is="
            example.status === 'loading'
              ? LoaderCircle
              : example.status === 'success'
                ? Check
                : X
          "
          class="h-3.5 w-3.5"
        />{{ example.label }}</button
      ><button
        type="button"
        class="inline-flex h-9 items-center rounded-full px-4 text-xs font-medium text-muted-foreground press hover:bg-foreground/[0.06] hover:text-foreground"
        @click="clearToasts"
      >
        Clear
      </button>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-1.5">
      <button
        v-for="option in positions"
        :key="option"
        type="button"
        :class="[
          'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors press',
          position === option
            ? 'bg-foreground text-background'
            : 'bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground',
        ]"
        @click="moveStack(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { Check, LoaderCircle, Sparkles, X } from "lucide-vue-next";
import { AnimatedToastStack, useAnimatedToastStack, type ToastInput, type ToastPosition } from "@orvui/vue/motion/animated-toast-stack";
const positions: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];
const examples: (ToastInput & { label: string })[] = [
  { label: "Title only", status: "success", title: "Saved", duration: 0 },
  {
    label: "Promise",
    status: "loading",
    title: "Publishing component",
    description: "Bundling source, preview, and registry metadata.",
    duration: 0,
  },
  {
    label: "Success",
    status: "success",
    title: "Component published",
    description: "Registry endpoint and raw source are available.",
  },
  {
    label: "Error",
    status: "error",
    title: "Snapshot failed",
    description: "Retry after the browser target settles.",
  },
];
const position = ref<ToastPosition>("bottom-right"),
  { toasts, showToast, updateToast, dismissToast, clearToasts } =
    useAnimatedToastStack({ defaultDuration: 3600, limit: 5 }),
  timers = new Set<ReturnType<typeof setTimeout>>();
function openToast(input: ToastInput) {
  const id = showToast(input);
  if (input.status !== "loading") return;
  const timer = setTimeout(() => {
    timers.delete(timer);
    updateToast(id, {
      status: "success",
      title: "Publish complete",
      description: "Toast updated in-place from loading to success.",
      duration: 3200,
    });
  }, 1800);
  timers.add(timer);
}
function moveStack(value: ToastPosition) {
  position.value = value;
  showToast({
    status: "info",
    title: "Position changed",
    description: `New toasts open from ${value}.`,
  });
}
onBeforeUnmount(() => {
  for (const timer of timers) clearTimeout(timer);
  timers.clear();
});
</script>
<template>
  <div class="flex min-h-72 w-full flex-col items-center justify-center gap-6">
    <AnimatedToastStack
      :toasts="toasts"
      :position="position"
      placement="fixed"
      :max-visible="4"
      :class-names="{ surface: 'bg-card/95' }"
      :icons="{ neutral: Sparkles }"
      @dismiss="dismissToast"
    />
    <div class="flex flex-col items-center gap-2 text-center">
      <p class="text-sm font-medium text-foreground">Open a real toast</p>
      <p class="max-w-sm text-xs leading-5 text-muted-foreground">
        Toasts render fixed on the screen. Change position to open a toast from
        that edge.
      </p>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <button
        v-for="example in examples"
        :key="example.label"
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground transition-colors press hover:border-(--color-border-strong)"
        @click="openToast(example)"
      >
        <component
          :is="
            example.status === 'loading'
              ? LoaderCircle
              : example.status === 'success'
                ? Check
                : X
          "
          class="h-3.5 w-3.5"
        />{{ example.label }}</button
      ><button
        type="button"
        class="inline-flex h-9 items-center rounded-full px-4 text-xs font-medium text-muted-foreground press hover:bg-foreground/[0.06] hover:text-foreground"
        @click="clearToasts"
      >
        Clear
      </button>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-1.5">
      <button
        v-for="option in positions"
        :key="option"
        type="button"
        :class="[
          'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors press',
          position === option
            ? 'bg-foreground text-background'
            : 'bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground',
        ]"
        @click="moveStack(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>
```

## API 参考

### AnimatedToastStack

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `toasts` | `AnimatedToast[]` | — | 是 | — |
| `position` | `"top-left" \| "top-center" \| "top-right" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | `"bottom-right"` | 否 | — |
| `placement` | `"static" \| "fixed" \| "absolute"` | `(props.fixed ? "fixed" : "static")` | 否 | — |
| `fixed` | `boolean` | `false` | 否 | — |
| `portal` | `boolean` | `undefined` | 否 | — |
| `portalRoot` | `null \| Element` | — | 否 | — |
| `maxVisible` | `number` | `4` | 否 | — |
| `className` | `string` | — | 否 | — |
| `classNames` | `Partial<Record<"action" \| "description" \| "content" \| "root" \| "item" \| "surface" \| "iconWrap" \| "title" \| "close" \| "progress", string>>` | — | 否 | — |
| `icons` | `Partial<Record<ToastStatus, any>>` | — | 否 | — |
| `renderToast` | `(toast: AnimatedToast) => VNodeChild` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `dismiss` | `[id: string]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `toast` | — | `toast: toast` | — |

## 关于 Animated Toast Stack

在堆叠区域管理临时通知，支持操作与手势关闭。

### 适用场景

- 当界面需要以下行为时使用 Animated Toast Stack：在堆叠区域管理临时通知，支持操作与手势关闭。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Animated Toast Stack？**

通过 toasts、position、placement、fixed、portal、portalRoot、maxVisible、className、classNames、icons、renderToast 配置 Animated Toast Stack；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 dismiss，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/animated-toast-stack.json
- 文档: https://orvui.efu.me/components/motion/animated-toast-stack
- `packages/vue/src/motion/animated-toast-stack/src/AnimatedToastStack.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
