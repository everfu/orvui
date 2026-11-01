# Swipeable List · orvui 0.1.1

## 选择与组合

先确定内容结构：表格数据使用 Table，层级文件用 File Tree，可展开补充内容用 Collapsible；多个互斥折叠项使用 Bouncy Accordion。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Swipeable List"
description: "通过指针或键盘输入，展示列表行左右两侧的操作。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/swipeable-list"
markdown: "https://orvui.efu.me/components/blocks/swipeable-list.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Swipeable List

> 通过指针或键盘输入，展示列表行左右两侧的操作。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Swipeable List：通过指针或键盘输入，展示列表行左右两侧的操作。

<a id="install"></a>
## 安装

### Swipeable List — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/swipeable-list.json
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

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `SwipeableList` | `v-model` | `null \| SwipeableListValue` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
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

<a id="about"></a>
## 关于 Swipeable List

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Swipeable List？**

通过 items、modelValue、defaultValue、actionWidth、revealThreshold、closeOnAction、classNames 配置 Swipeable List；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange、action，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Dynamic Island](https://orvui.efu.me/components/blocks/dynamic-island): 在多个实时活动视图间切换紧凑胶囊，保持对象身份连续。
- [404 / Not Found](https://orvui.efu.me/components/blocks/not-found): 通过动态视觉呈现缺失目标，并提供返回有效内容的路径。
- [Sign Up Form](https://orvui.efu.me/components/blocks/signup-form): 逐步填写注册字段，并获得本地校验与明确提交状态。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/swipeable-list.json
- 文档: https://orvui.efu.me/components/blocks/swipeable-list
- `packages/vue/src/blocks/swipeable-list/src/SwipeableList.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

