---
title: "Notification Stack"
description: "将紧凑通知堆叠展开为可以逐条阅读的条目。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/notification-stack"
markdown: "https://orvui.efu.me/components/blocks/notification-stack.md"
license: "MIT"
productVersion: "0.1.0"
---

# Notification Stack

> 将紧凑通知堆叠展开为可以逐条阅读的条目。

## 安装

### Notification Stack — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/notification-stack.json
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

### Notification Stack

**复制源码**

```vue
<script setup lang="ts">
import { h } from "vue";
import { RotateCw } from "lucide-vue-next";
import { NotificationStack, type NotificationStackItem } from "@/components/orvui/blocks/notification-stack";
const notices = [
  [
    "catalog-retry",
    "Catalog refresh paused",
    "42s · Gateway timeout in phase 2",
  ],
  ["queue-delay", "Queue delay", "2m 11s · Sample indexing"],
  ["media-restored", "Media preview recovered", "5m · Missing file in /media"],
] as const;
const items: NotificationStackItem[] = notices.map(
  ([id, title, description], index) => ({
    id,
    title,
    description,
    ...(index === 0
      ? {
          trailing: () =>
            h(
              "span",
              {
                class:
                  "inline-flex items-center gap-1 text-amber-500 dark:text-amber-400",
              },
              [h(RotateCw, { class: "h-3.5 w-3.5", "aria-hidden": true }), "2"],
            ),
        }
      : {}),
  }),
);
</script>
<template>
  <div class="flex w-full items-center justify-center pt-52 pb-6">
    <NotificationStack :items="items" />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { h } from "vue";
import { RotateCw } from "lucide-vue-next";
import { NotificationStack, type NotificationStackItem } from "@orvui/vue/blocks/notification-stack";
const notices = [
  [
    "catalog-retry",
    "Catalog refresh paused",
    "42s · Gateway timeout in phase 2",
  ],
  ["queue-delay", "Queue delay", "2m 11s · Sample indexing"],
  ["media-restored", "Media preview recovered", "5m · Missing file in /media"],
] as const;
const items: NotificationStackItem[] = notices.map(
  ([id, title, description], index) => ({
    id,
    title,
    description,
    ...(index === 0
      ? {
          trailing: () =>
            h(
              "span",
              {
                class:
                  "inline-flex items-center gap-1 text-amber-500 dark:text-amber-400",
              },
              [h(RotateCw, { class: "h-3.5 w-3.5", "aria-hidden": true }), "2"],
            ),
        }
      : {}),
  }),
);
</script>
<template>
  <div class="flex w-full items-center justify-center pt-52 pb-6">
    <NotificationStack :items="items" />
  </div>
</template>
```

## API 参考

### NotificationStack

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `NotificationStackItem[]` | — | 是 | — |
| `expanded` | `boolean` | `undefined` | 否 | — |
| `defaultExpanded` | `boolean` | `false` | 否 | — |
| `maxVisible` | `number` | `3` | 否 | — |
| `collapsedLabel` | `string` | `"Notifications"` | 否 | — |
| `expandedLabel` | `string` | `"View all"` | 否 | — |
| `emptyLabel` | `string` | `"All caught up"` | 否 | — |
| `classNames` | `NotificationStackClassNames` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:expanded` | `[expanded: boolean]` | — |
| `expandedChange` | `[expanded: boolean]` | — |
| `viewAll` | `[]` | — |

## 关于 Notification Stack

将紧凑通知堆叠展开为可以逐条阅读的条目。

### 适用场景

- 当界面需要以下行为时使用 Notification Stack：将紧凑通知堆叠展开为可以逐条阅读的条目。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Notification Stack？**

通过 items、expanded、defaultExpanded、maxVisible、collapsedLabel、expandedLabel、emptyLabel、classNames 配置 Notification Stack；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:expanded、expandedChange、viewAll，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/notification-stack.json
- 文档: https://orvui.efu.me/components/blocks/notification-stack
- `packages/vue/src/blocks/notification-stack/src/NotificationStack.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
