---
title: "Bottom Sheet"
description: "从底部打开面板，并通过拖动在吸附位置之间移动。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/bottom-sheet"
markdown: "https://orvui.efu.me/components/motion/bottom-sheet.md"
license: "MIT"
productVersion: "0.2.0-beta.1"
---

<a id="overview"></a>
# Bottom Sheet

> 从底部打开面板，并通过拖动在吸附位置之间移动。

<a id="when-to-use"></a>

## 适用场景

- 用于小屏幕上的导航、设置或一组相关操作。

<a id="install"></a>
## 安装

### Bottom Sheet — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/beta/r/bottom-sheet.json
```

通过注册表安装后，在应用样式入口导入一次 `src/components/orvui/styles.css`。

### 组件包

安装本地 Beta 归档，制作方法见 Beta 安装指南。

```bash
pnpm add ./orvui-vue-0.2.0-beta.1.tgz
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
### Bottom Sheet

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BottomSheet } from "@/components/orvui/motion/bottom-sheet";
const open = ref(false);
const actions = ["Share", "Duplicate", "Move to folder", "Rename", "Archive", "Delete"];
</script>
<template><div>
  <button type="button" @click="open = true" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)">Open bottom sheet</button>
  <BottomSheet v-model:open="open" :snap-points="[0.4, 0.85]" title="Quick actions" description="Move the handle or flick downward to close."><ul class="divide-y divide-border"><li v-for="action in actions" :key="action" class="py-3 text-sm text-foreground">{{ action }}</li></ul><div class="py-12 text-center text-xs text-muted-foreground">Flick up for more room, or down to close.</div></BottomSheet>
</div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BottomSheet } from "@orvui/vue/motion/bottom-sheet";
const open = ref(false);
const actions = ["Share", "Duplicate", "Move to folder", "Rename", "Archive", "Delete"];
</script>
<template><div>
  <button type="button" @click="open = true" class="inline-flex h-10 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground press hover:border-(--color-border-strong)">Open bottom sheet</button>
  <BottomSheet v-model:open="open" :snap-points="[0.4, 0.85]" title="Quick actions" description="Move the handle or flick downward to close."><ul class="divide-y divide-border"><li v-for="action in actions" :key="action" class="py-3 text-sm text-foreground">{{ action }}</li></ul><div class="py-12 text-center text-xs text-muted-foreground">Flick up for more room, or down to close.</div></BottomSheet>
</div></template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `BottomSheet` | `v-model:open` | `boolean` | `update:open` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### BottomSheet

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `false` | 是 | — |
| `snapPoints` | `(number \| "auto")[]` | `() => [0.5, 0.92]` | 否 | — |
| `defaultSnap` | `number` | `0` | 否 | — |
| `title` | `string` | — | 否 | — |
| `description` | `string` | — | 否 | — |
| `dismissThreshold` | `number` | `120` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | `[open: boolean]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Bottom Sheet

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Bottom Sheet？**

通过 open、snapPoints、defaultSnap、title、description、dismissThreshold 配置 Bottom Sheet；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:open，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Tooltip](https://orvui.efu.me/components/motion/tooltip): 在悬停或聚焦时显示简短说明，不挤动周围内容。
- [Popover](https://orvui.efu.me/components/motion/popover): 将浮动表面连接到触发器，支持常规过渡与连续变形过渡。
- [Morphing Modal](https://orvui.efu.me/components/motion/morphing-modal): 让对话框内容与高度一起变化，同时保持外层表面连续。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/beta/r/bottom-sheet.json
- 文档: https://orvui.efu.me/components/motion/bottom-sheet
- `packages/vue/src/motion/bottom-sheet/src/BottomSheet.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
