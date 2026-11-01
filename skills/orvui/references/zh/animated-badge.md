# Animated Badge · orvui 0.1.1

## 选择与组合

页面内的持久说明使用 Alert，短暂操作反馈使用 Toast Stack；过程等待使用 Loader，明确进度与成功结果应由应用状态驱动。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Animated Badge"
description: "将紧凑状态标签与图标组合，并可加入脉冲反馈。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/animated-badge"
markdown: "https://orvui.efu.me/components/motion/animated-badge.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Animated Badge

> 将紧凑状态标签与图标组合，并可加入脉冲反馈。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Animated Badge：将紧凑状态标签与图标组合，并可加入脉冲反馈。

<a id="install"></a>
## 安装

### Animated Badge — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/animated-badge.json
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

<a id="state-and-events"></a>
## 状态与事件

此示例组合没有声明成对的受控属性与 update 事件。使用已列出的属性、原生事件和插槽组合内容；不要为它添加未公开的 v-model。

<a id="api-reference"></a>
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

<a id="about"></a>
## 关于 Animated Badge

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Animated Badge？**

通过 status、size、icon、showIcon、pulse、contentKey 配置 Animated Badge；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过icon、default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Loader](https://orvui.efu.me/components/motion/loader): 为结果尚未返回的操作选择紧凑动态指示器。
- [Action Swap](https://orvui.efu.me/components/motion/action-swap): 使用模糊、滚动或错开过渡替换简短操作文字与图标。
- [Animated Toast Stack](https://orvui.efu.me/components/motion/animated-toast-stack): 在堆叠区域管理临时通知，支持操作与手势关闭。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/animated-badge.json
- 文档: https://orvui.efu.me/components/motion/animated-badge
- `packages/vue/src/motion/animated-badge/src/AnimatedBadge.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

