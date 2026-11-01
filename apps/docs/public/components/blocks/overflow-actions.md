---
title: "Overflow Actions"
description: "展开紧凑操作轨道，展示静止宽度下无法容纳的控件。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/overflow-actions"
markdown: "https://orvui.efu.me/components/blocks/overflow-actions.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Overflow Actions

> 展开紧凑操作轨道，展示静止宽度下无法容纳的控件。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Overflow Actions：展开紧凑操作轨道，展示静止宽度下无法容纳的控件。

<a id="install"></a>
## 安装

### Overflow Actions — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/overflow-actions.json
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
### Overflow Actions

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CalendarClock, Eye, GitBranch, Pin } from "lucide-vue-next";
import { OverflowActions } from "@/components/orvui/blocks/overflow-actions";
const expanded = ref(false);
const primary = [
  { id: "preview", label: "Preview", icon: Eye },
  { id: "pin", label: "Pin", icon: Pin },
];
const extra = [
  { id: "branch", label: "Branch", icon: GitBranch },
  { id: "schedule", label: "Schedule", icon: CalendarClock },
];
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <OverflowActions
      :primary-actions="primary"
      :overflow-actions="extra"
      v-model:expanded="expanded"
      open-label="Open action rail"
      close-label="Collapse action rail"
    />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { CalendarClock, Eye, GitBranch, Pin } from "lucide-vue-next";
import { OverflowActions } from "@orvui/vue/blocks/overflow-actions";
const expanded = ref(false);
const primary = [
  { id: "preview", label: "Preview", icon: Eye },
  { id: "pin", label: "Pin", icon: Pin },
];
const extra = [
  { id: "branch", label: "Branch", icon: GitBranch },
  { id: "schedule", label: "Schedule", icon: CalendarClock },
];
</script>
<template>
  <div class="flex w-full items-center justify-center">
    <OverflowActions
      :primary-actions="primary"
      :overflow-actions="extra"
      v-model:expanded="expanded"
      open-label="Open action rail"
      close-label="Collapse action rail"
    />
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `OverflowActions` | `v-model:expanded` | `boolean` | `update:expanded` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### OverflowActions

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `primaryActions` | `OverflowActionItem[]` | — | 是 | — |
| `overflowActions` | `OverflowActionItem[]` | — | 是 | — |
| `expanded` | `boolean` | `undefined` | 否 | — |
| `defaultExpanded` | `boolean` | `false` | 否 | — |
| `collapseOnAction` | `boolean` | `false` | 否 | — |
| `size` | `"sm" \| "md"` | `"md"` | 否 | — |
| `openLabel` | `string` | `"Show extra actions"` | 否 | — |
| `closeLabel` | `string` | `"Hide extra actions"` | 否 | — |
| `classNames` | `OverflowActionsClassNames` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:expanded` | `[value: boolean]` | — |
| `expandedChange` | `[value: boolean]` | — |
| `action` | `[item: OverflowActionItem]` | — |

<a id="about"></a>
## 关于 Overflow Actions

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Overflow Actions？**

通过 primaryActions、overflowActions、expanded、defaultExpanded、collapseOnAction、size、openLabel、closeLabel、classNames 配置 Overflow Actions；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:expanded、expandedChange、action，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Expandable Action Bar](https://orvui.efu.me/components/blocks/expandable-action-bar): 在紧凑图标操作行中，为当前活动操作展开标签。
- [Expandable Tabs](https://orvui.efu.me/components/blocks/expandable-tabs): 在图标条中导航，选中项展开以显示标签。
- [Bloom Menu](https://orvui.efu.me/components/blocks/bloom-menu): 围绕共同中心展开一组操作，并在关闭时恢复焦点。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/overflow-actions.json
- 文档: https://orvui.efu.me/components/blocks/overflow-actions
- `packages/vue/src/blocks/overflow-actions/src/OverflowActions.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
