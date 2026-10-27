---
title: "Overflow Actions"
description: "展开紧凑操作轨道，展示静止宽度下无法容纳的控件。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/overflow-actions"
markdown: "https://orvui.efu.me/components/blocks/overflow-actions.md"
license: "MIT"
productVersion: "0.1.0"
---

# Overflow Actions

> 展开紧凑操作轨道，展示静止宽度下无法容纳的控件。

## 安装

### Overflow Actions — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/overflow-actions.json
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

## 关于 Overflow Actions

展开紧凑操作轨道，展示静止宽度下无法容纳的控件。

### 适用场景

- 当界面需要以下行为时使用 Overflow Actions：展开紧凑操作轨道，展示静止宽度下无法容纳的控件。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Overflow Actions？**

通过 primaryActions、overflowActions、expanded、defaultExpanded、collapseOnAction、size、openLabel、closeLabel、classNames 配置 Overflow Actions；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:expanded、expandedChange、action，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/overflow-actions.json
- 文档: https://orvui.efu.me/components/blocks/overflow-actions
- `packages/vue/src/blocks/overflow-actions/src/OverflowActions.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
