---
title: "Pull to Refresh"
description: "将向下拖动转换为有意触发的异步刷新，并显示进度。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/pull-to-refresh"
markdown: "https://orvui.efu.me/components/motion/pull-to-refresh.md"
license: "MIT"
productVersion: "0.1.0"
---

# Pull to Refresh

> 将向下拖动转换为有意触发的异步刷新，并显示进度。

将向下拖动转换为有意触发的异步刷新，并显示进度。

## 适用场景

- 当界面需要以下行为时使用 Pull to Refresh：将向下拖动转换为有意触发的异步刷新，并显示进度。

## 安装

### Pull to Refresh — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/pull-to-refresh.json
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

### Pull to Refresh

**复制源码**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { Bell, CheckCircle2, GitPullRequest, MessageCircle } from "lucide-vue-next";
import { PullToRefresh } from "@/components/orvui/motion/pull-to-refresh";
const activity = [
  { id: 1, icon: GitPullRequest, title: "Motion review approved", detail: "The pull request is ready to merge.", time: "4m" },
  { id: 2, icon: MessageCircle, title: "New component feedback", detail: "The spring feels much closer to native now.", time: "18m" },
  { id: 3, icon: CheckCircle2, title: "Registry checks passed", detail: "All component files resolved successfully.", time: "31m" },
  { id: 4, icon: Bell, title: "Preview deployed", detail: "The latest build is ready to inspect.", time: "1h" },
  { id: 5, icon: MessageCircle, title: "Docs comment resolved", detail: "The usage example now covers async refreshes.", time: "2h" },
];
const refreshes = ref(0);
const latest = ref<number | null>(null);
const updates = computed(() => latest.value ? [{ id: latest.value, icon: Bell, title: "You’re all caught up", detail: "The activity feed was refreshed just now.", time: "now" }, ...activity] : activity);
let timer: ReturnType<typeof setTimeout> | undefined;
let release: (() => void) | undefined;
let disposed = false;
function refresh() { return new Promise<void>(resolve => { release = resolve; timer = setTimeout(() => { if (!disposed) { refreshes.value++; latest.value = Date.now(); } release = undefined; resolve(); }, 900); }); }
onBeforeUnmount(() => { disposed = true; clearTimeout(timer); release?.(); });
</script>
<template><div class="flex min-h-[34rem] w-full items-center justify-center p-4"><div class="w-full max-w-sm overflow-hidden rounded-[2rem] border border-border bg-background shadow-2xl"><PullToRefresh ariaLabel="Activity feed" class="h-[30rem]" :on-refresh="refresh"><header class="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 px-5 py-4 backdrop-blur-md"><div><p class="font-semibold text-foreground">Activity</p><p class="text-xs text-muted-foreground">Pull down to check for updates</p></div><span class="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">{{ refreshes ? `${refreshes} refreshed` : 'live' }}</span></header><div class="divide-y divide-border px-2 pb-3"><article v-for="update in updates" :key="update.id" class="flex gap-3 px-3 py-4"><div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm"><component :is="update.icon" class="h-4 w-4" /></div><div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-3"><p class="text-sm font-medium text-foreground">{{ update.title }}</p><span class="shrink-0 font-mono text-[10px] text-muted-foreground">{{ update.time }}</span></div><p class="mt-1 text-xs leading-relaxed text-muted-foreground">{{ update.detail }}</p></div></article></div></PullToRefresh></div></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { Bell, CheckCircle2, GitPullRequest, MessageCircle } from "lucide-vue-next";
import { PullToRefresh } from "@orvui/vue/motion/pull-to-refresh";
const activity = [
  { id: 1, icon: GitPullRequest, title: "Motion review approved", detail: "The pull request is ready to merge.", time: "4m" },
  { id: 2, icon: MessageCircle, title: "New component feedback", detail: "The spring feels much closer to native now.", time: "18m" },
  { id: 3, icon: CheckCircle2, title: "Registry checks passed", detail: "All component files resolved successfully.", time: "31m" },
  { id: 4, icon: Bell, title: "Preview deployed", detail: "The latest build is ready to inspect.", time: "1h" },
  { id: 5, icon: MessageCircle, title: "Docs comment resolved", detail: "The usage example now covers async refreshes.", time: "2h" },
];
const refreshes = ref(0);
const latest = ref<number | null>(null);
const updates = computed(() => latest.value ? [{ id: latest.value, icon: Bell, title: "You’re all caught up", detail: "The activity feed was refreshed just now.", time: "now" }, ...activity] : activity);
let timer: ReturnType<typeof setTimeout> | undefined;
let release: (() => void) | undefined;
let disposed = false;
function refresh() { return new Promise<void>(resolve => { release = resolve; timer = setTimeout(() => { if (!disposed) { refreshes.value++; latest.value = Date.now(); } release = undefined; resolve(); }, 900); }); }
onBeforeUnmount(() => { disposed = true; clearTimeout(timer); release?.(); });
</script>
<template><div class="flex min-h-[34rem] w-full items-center justify-center p-4"><div class="w-full max-w-sm overflow-hidden rounded-[2rem] border border-border bg-background shadow-2xl"><PullToRefresh ariaLabel="Activity feed" class="h-[30rem]" :on-refresh="refresh"><header class="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 px-5 py-4 backdrop-blur-md"><div><p class="font-semibold text-foreground">Activity</p><p class="text-xs text-muted-foreground">Pull down to check for updates</p></div><span class="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground">{{ refreshes ? `${refreshes} refreshed` : 'live' }}</span></header><div class="divide-y divide-border px-2 pb-3"><article v-for="update in updates" :key="update.id" class="flex gap-3 px-3 py-4"><div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm"><component :is="update.icon" class="h-4 w-4" /></div><div class="min-w-0 flex-1"><div class="flex items-start justify-between gap-3"><p class="text-sm font-medium text-foreground">{{ update.title }}</p><span class="shrink-0 font-mono text-[10px] text-muted-foreground">{{ update.time }}</span></div><p class="mt-1 text-xs leading-relaxed text-muted-foreground">{{ update.detail }}</p></div></article></div></PullToRefresh></div></div></template>
```

## API 参考

### PullToRefresh

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `onRefresh` | `() => void \| Promise<void>` | — | 否 | — |
| `refreshing` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `threshold` | `number` | `76` | 否 | — |
| `maxPull` | `number` | `132` | 否 | — |
| `holdDistance` | `number` | `68` | 否 | — |
| `pullingLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Pull to refresh"` | 否 | — |
| `releaseLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Release to refresh"` | 否 | — |
| `refreshingLabel` | `boolean \| null \| string \| number \| void \| VNode<RendererNode, RendererElement, { [key: string]: any; }> \| VNodeArrayChildren \| ComponentOptions<any, any, any, ComputedOptions, MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, ComponentProvideOptions> \| FunctionalComponent<any, {}, any, {}> \| ComponentPublicInstanceConstructor<any, any, any, any, ComputedOptions, MethodOptions>` | `"Refreshing"` | 否 | — |
| `ariaLabel` | `string` | `"Refreshable content"` | 否 | — |
| `contentClassName` | `string` | — | 否 | — |
| `indicatorClassName` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `error` | `[error: unknown]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `status: status`, `progress: amount` | — |

## 关于 Pull to Refresh

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Pull to Refresh？**

通过 onRefresh、refreshing、disabled、threshold、maxPull、holdDistance、pullingLabel、releaseLabel、refreshingLabel、ariaLabel、contentClassName、indicatorClassName 配置 Pull to Refresh；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 error，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/pull-to-refresh.json
- 文档: https://orvui.efu.me/components/motion/pull-to-refresh
- `packages/vue/src/motion/pull-to-refresh/src/PullToRefresh.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
