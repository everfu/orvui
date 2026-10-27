---
title: "Swipeable List"
description: "通过指针或键盘输入，展示列表行左右两侧的操作。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/swipeable-list"
markdown: "https://orvui.efu.me/components/blocks/swipeable-list.md"
license: "MIT"
productVersion: "0.1.0"
---

# Swipeable List

> 通过指针或键盘输入，展示列表行左右两侧的操作。

## 安装

### Swipeable List — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/swipeable-list.json
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

### Swipeable List

**复制源码**

```vue
<script setup lang="ts">
import { h, shallowRef } from "vue";
import {
  Check,
  Clock3,
  FileText,
  Flag,
  Mail,
  Pin,
  RotateCcw,
  Trash2,
  UserRound,
} from "lucide-vue-next";
import {
  SwipeableList,
  type SwipeAction,
  type SwipeableListItem,
} from "@/components/orvui/blocks/swipeable-list";
const leftActions: SwipeAction[] = [
  { id: "done", label: "Done", icon: Check, tone: "success" },
  { id: "pin", label: "Pin", icon: Pin, tone: "primary" },
];
const rightActions: SwipeAction[] = [
  { id: "later", label: "Later", icon: Clock3, tone: "warning" },
  { id: "trash", label: "Trash", icon: Trash2, tone: "danger" },
];
const descriptions = [
  {
    id: "brief",
    title: "Launch brief",
    description: "Finalize the announcement copy",
    meta: "9:41",
    icon: FileText,
  },
  {
    id: "feedback",
    title: "Client feedback",
    description: "Three comments need a response",
    meta: "11:08",
    icon: Mail,
  },
  {
    id: "review",
    title: "Design review",
    description: "Check spacing before handoff",
    meta: "13:20",
    icon: UserRound,
  },
  {
    id: "incident",
    title: "Flagged run",
    description: "Retry queue has one failed job",
    meta: "Now",
    icon: Flag,
  },
];
const initial: SwipeableListItem[] = descriptions.map(({ icon, ...item }) => ({
  ...item,
  leftActions,
  rightActions,
  leading: () =>
    h(
      "div",
      {
        class:
          "grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground",
      },
      [h(icon, { class: "h-4 w-4" })],
    ),
}));
const items = shallowRef(initial),
  lastAction = shallowRef("Ready");
function action({
  item,
  action,
}: {
  item: SwipeableListItem;
  action: SwipeAction;
}) {
  lastAction.value = `${action.label} · ${item.title}`;
  if (action.id === "trash")
    items.value = items.value.filter((row) => row.id !== item.id);
}
function reset() {
  items.value = initial;
  lastAction.value = "Queue restored";
}
</script>
<template>
  <div class="flex min-h-96 w-full items-center justify-center">
    <div
      class="w-full max-w-sm rounded-[2rem] border border-border bg-background p-3 shadow-2xl"
    >
      <div class="mb-3 flex items-center justify-between px-1">
        <div>
          <p class="text-sm font-semibold text-foreground">Priority queue</p>
          <p class="text-xs text-muted-foreground">{{ lastAction }}</p>
        </div>
        <button
          type="button"
          @click="reset"
          class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw class="h-3.5 w-3.5" />Reset
        </button>
      </div>
      <SwipeableList :items="items" @action="action" />
      <div
        class="mt-3 flex items-center justify-between px-1 text-[11px] font-medium text-muted-foreground"
      >
        <span>{{ items.length }} open</span><span>Today</span>
      </div>
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { h, shallowRef } from "vue";
import {
  Check,
  Clock3,
  FileText,
  Flag,
  Mail,
  Pin,
  RotateCcw,
  Trash2,
  UserRound,
} from "lucide-vue-next";
import { SwipeableList, type SwipeAction, type SwipeableListItem } from "@orvui/vue/blocks/swipeable-list";
const leftActions: SwipeAction[] = [
  { id: "done", label: "Done", icon: Check, tone: "success" },
  { id: "pin", label: "Pin", icon: Pin, tone: "primary" },
];
const rightActions: SwipeAction[] = [
  { id: "later", label: "Later", icon: Clock3, tone: "warning" },
  { id: "trash", label: "Trash", icon: Trash2, tone: "danger" },
];
const descriptions = [
  {
    id: "brief",
    title: "Launch brief",
    description: "Finalize the announcement copy",
    meta: "9:41",
    icon: FileText,
  },
  {
    id: "feedback",
    title: "Client feedback",
    description: "Three comments need a response",
    meta: "11:08",
    icon: Mail,
  },
  {
    id: "review",
    title: "Design review",
    description: "Check spacing before handoff",
    meta: "13:20",
    icon: UserRound,
  },
  {
    id: "incident",
    title: "Flagged run",
    description: "Retry queue has one failed job",
    meta: "Now",
    icon: Flag,
  },
];
const initial: SwipeableListItem[] = descriptions.map(({ icon, ...item }) => ({
  ...item,
  leftActions,
  rightActions,
  leading: () =>
    h(
      "div",
      {
        class:
          "grid h-10 w-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground",
      },
      [h(icon, { class: "h-4 w-4" })],
    ),
}));
const items = shallowRef(initial),
  lastAction = shallowRef("Ready");
function action({
  item,
  action,
}: {
  item: SwipeableListItem;
  action: SwipeAction;
}) {
  lastAction.value = `${action.label} · ${item.title}`;
  if (action.id === "trash")
    items.value = items.value.filter((row) => row.id !== item.id);
}
function reset() {
  items.value = initial;
  lastAction.value = "Queue restored";
}
</script>
<template>
  <div class="flex min-h-96 w-full items-center justify-center">
    <div
      class="w-full max-w-sm rounded-[2rem] border border-border bg-background p-3 shadow-2xl"
    >
      <div class="mb-3 flex items-center justify-between px-1">
        <div>
          <p class="text-sm font-semibold text-foreground">Priority queue</p>
          <p class="text-xs text-muted-foreground">{{ lastAction }}</p>
        </div>
        <button
          type="button"
          @click="reset"
          class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw class="h-3.5 w-3.5" />Reset
        </button>
      </div>
      <SwipeableList :items="items" @action="action" />
      <div
        class="mt-3 flex items-center justify-between px-1 text-[11px] font-medium text-muted-foreground"
      >
        <span>{{ items.length }} open</span><span>Today</span>
      </div>
    </div>
  </div>
</template>
```

## API 参考

### SwipeableList

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `SwipeableListItem[]` | — | 是 | — |
| `modelValue` | `null \| SwipeableListValue` | — | 否 | — |
| `defaultValue` | `null \| SwipeableListValue` | `null` | 否 | — |
| `actionWidth` | `number` | `56` | 否 | — |
| `revealThreshold` | `number` | `34` | 否 | — |
| `closeOnAction` | `boolean` | `true` | 否 | — |
| `classNames` | `SwipeableListClassNames` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `[value: SwipeableListValue \| null]` | — |
| `valueChange` | `[value: SwipeableListValue \| null]` | — |
| `action` | `[payload: { item: SwipeableListItem; action: SwipeAction; side: SwipeSide; }]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `item` | — | `v-bind: scope` | — |

## 关于 Swipeable List

通过指针或键盘输入，展示列表行左右两侧的操作。

### 适用场景

- 当界面需要以下行为时使用 Swipeable List：通过指针或键盘输入，展示列表行左右两侧的操作。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Swipeable List？**

通过 items、modelValue、defaultValue、actionWidth、revealThreshold、closeOnAction、classNames 配置 Swipeable List；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange、action，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/swipeable-list.json
- 文档: https://orvui.efu.me/components/blocks/swipeable-list
- `packages/vue/src/blocks/swipeable-list/src/SwipeableList.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
