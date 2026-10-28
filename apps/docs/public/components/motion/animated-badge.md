---
title: "Animated Badge"
description: "将紧凑状态标签与图标组合，并可加入脉冲反馈。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/animated-badge"
markdown: "https://orvui.efu.me/components/motion/animated-badge.md"
license: "MIT"
productVersion: "0.1.0"
---

# Animated Badge

> 将紧凑状态标签与图标组合，并可加入脉冲反馈。

将紧凑状态标签与图标组合，并可加入脉冲反馈。

## 适用场景

- 当界面需要以下行为时使用 Animated Badge：将紧凑状态标签与图标组合，并可加入脉冲反馈。

## 安装

### Animated Badge — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/animated-badge.json
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

### Animated Badge

**复制源码**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { AnimatedBadge, type AnimatedBadgeStatus } from "@/components/orvui/motion/animated-badge";
const sequence = [
  { status: "loading", label: "Syncing" }, { status: "success", label: "Synced" },
  { status: "warning", label: "Review" }, { status: "danger", label: "Failed" },
] as const;
const samples = [["neutral", "Queued"], ["info", "Live"], ["loading", "Indexing"], ["success", "Verified"], ["warning", "Pending"], ["danger", "Blocked"]] as const;
const step = ref(0), current = computed(() => sequence[step.value % sequence.length]!);
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => { step.value += 1; }, 1600); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex h-16 items-center justify-center"><AnimatedBadge :status="current.status" size="md" aria-live="polite">{{ current.label }}</AnimatedBadge></div>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3"><AnimatedBadge v-for="[status, label] in samples" :key="status" :status="status" size="sm">{{ label }}</AnimatedBadge></div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { AnimatedBadge, type AnimatedBadgeStatus } from "@orvui/vue/motion/animated-badge";
const sequence = [
  { status: "loading", label: "Syncing" }, { status: "success", label: "Synced" },
  { status: "warning", label: "Review" }, { status: "danger", label: "Failed" },
] as const;
const samples = [["neutral", "Queued"], ["info", "Live"], ["loading", "Indexing"], ["success", "Verified"], ["warning", "Pending"], ["danger", "Blocked"]] as const;
const step = ref(0), current = computed(() => sequence[step.value % sequence.length]!);
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => { step.value += 1; }, 1600); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex h-16 items-center justify-center"><AnimatedBadge :status="current.status" size="md" aria-live="polite">{{ current.label }}</AnimatedBadge></div>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3"><AnimatedBadge v-for="[status, label] in samples" :key="status" :status="status" size="sm">{{ label }}</AnimatedBadge></div>
  </div>
</template>
```

## API 参考

### AnimatedBadge

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `status` | `"info" \| "success" \| "warning" \| "loading" \| "neutral" \| "danger"` | `"neutral"` | 否 | — |
| `size` | `"sm" \| "md"` | `"md"` | 否 | — |
| `icon` | `any` | `({ neutral: Circle, info: Info, success: Check, warning: TriangleAlert, danger: X, loading: LoaderCircle })[props.status]` | 否 | — |
| `showIcon` | `boolean` | `true` | 否 | — |
| `pulse` | `boolean` | `undefined` | 否 | — |
| `contentKey` | `string \| number` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `icon` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

## 关于 Animated Badge

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Animated Badge？**

通过 status、size、icon、showIcon、pulse、contentKey 配置 Animated Badge；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过icon、default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/animated-badge.json
- 文档: https://orvui.efu.me/components/motion/animated-badge
- `packages/vue/src/motion/animated-badge/src/AnimatedBadge.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
