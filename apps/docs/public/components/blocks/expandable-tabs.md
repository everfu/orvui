---
title: "Expandable Tabs"
description: "在图标条中导航，选中项展开以显示标签。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/expandable-tabs"
markdown: "https://orvui.efu.me/components/blocks/expandable-tabs.md"
license: "MIT"
productVersion: "0.1.0"
---

# Expandable Tabs

> 在图标条中导航，选中项展开以显示标签。

在图标条中导航，选中项展开以显示标签。

## 适用场景

- 当界面需要以下行为时使用 Expandable Tabs：在图标条中导航，选中项展开以显示标签。

## 安装

### Expandable Tabs — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/expandable-tabs.json
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

### Expandable Tabs

**复制源码**

```vue
<script setup lang="ts">
import { h, type Component } from "vue";
import {
  BadgeCheck,
  Brush,
  CalendarClock,
  ChartSpline,
  ChevronRight,
  ClipboardCheck,
  CloudUpload,
  FileText,
  Gauge,
  GitBranch,
  Images,
  Inbox,
  Megaphone,
  MessageCircle,
  PackageOpen,
  RefreshCw,
  Rocket,
  Siren,
  SwatchBook,
  UploadCloud,
  Users,
  Webhook,
  Workflow,
} from "lucide-vue-next";
import { ExpandableTabs, type ExpandableTabsItem } from "@/components/orvui/blocks/expandable-tabs";
type MenuRow = readonly [Component, string];
function content(rows: readonly MenuRow[]) {
  return () =>
    h(
      "div",
      { class: "flex w-[17.125rem] flex-col gap-0.5" },
      rows.map(([icon, label]) =>
        h(
          "button",
          {
            key: label,
            type: "button",
            class:
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted",
          },
          [
            h(icon, { class: "h-4 w-4 text-muted-foreground" }),
            h("span", { class: "flex-1" }, label),
            h(ChevronRight, { class: "h-4 w-4 text-muted-foreground" }),
          ],
        ),
      ),
    );
}
const sections: readonly {
  id: string;
  label: string;
  icon: Component;
  rows: readonly MenuRow[];
}[] = [
  {
    id: "launch",
    label: "Launch",
    icon: Rocket,
    rows: [
      [FileText, "Release Brief"],
      [ClipboardCheck, "Launch Checklist"],
      [Megaphone, "Campaign Notes"],
      [CalendarClock, "Rollout Calendar"],
      [CloudUpload, "Ship Build"],
    ],
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: Inbox,
    rows: [
      [MessageCircle, "Client Feedback"],
      [Users, "Team Requests"],
      [BadgeCheck, "Approval Notes"],
    ],
  },
  {
    id: "flows",
    label: "Flows",
    icon: Workflow,
    rows: [
      [GitBranch, "Trigger Map"],
      [Webhook, "Webhook Runs"],
      [RefreshCw, "Retry Queue"],
    ],
  },
  {
    id: "assets",
    label: "Assets",
    icon: PackageOpen,
    rows: [
      [SwatchBook, "Brand Kit"],
      [Images, "Mockup Library"],
      [Brush, "Design Tokens"],
      [UploadCloud, "Export Queue"],
    ],
  },
  {
    id: "status",
    label: "Status",
    icon: ChartSpline,
    rows: [
      [Gauge, "Activation"],
      [ChartSpline, "Conversion"],
      [Siren, "Incidents"],
    ],
  },
];
const items: ExpandableTabsItem[] = sections.map(({ rows, ...section }) => ({
  ...section,
  content: content(rows),
}));
</script>

<template>
  <div class="flex min-h-88 w-full items-end justify-center">
    <ExpandableTabs :items="items" />
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { h, type Component } from "vue";
import {
  BadgeCheck,
  Brush,
  CalendarClock,
  ChartSpline,
  ChevronRight,
  ClipboardCheck,
  CloudUpload,
  FileText,
  Gauge,
  GitBranch,
  Images,
  Inbox,
  Megaphone,
  MessageCircle,
  PackageOpen,
  RefreshCw,
  Rocket,
  Siren,
  SwatchBook,
  UploadCloud,
  Users,
  Webhook,
  Workflow,
} from "lucide-vue-next";
import { ExpandableTabs, type ExpandableTabsItem } from "@orvui/vue/blocks/expandable-tabs";
type MenuRow = readonly [Component, string];
function content(rows: readonly MenuRow[]) {
  return () =>
    h(
      "div",
      { class: "flex w-[17.125rem] flex-col gap-0.5" },
      rows.map(([icon, label]) =>
        h(
          "button",
          {
            key: label,
            type: "button",
            class:
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted",
          },
          [
            h(icon, { class: "h-4 w-4 text-muted-foreground" }),
            h("span", { class: "flex-1" }, label),
            h(ChevronRight, { class: "h-4 w-4 text-muted-foreground" }),
          ],
        ),
      ),
    );
}
const sections: readonly {
  id: string;
  label: string;
  icon: Component;
  rows: readonly MenuRow[];
}[] = [
  {
    id: "launch",
    label: "Launch",
    icon: Rocket,
    rows: [
      [FileText, "Release Brief"],
      [ClipboardCheck, "Launch Checklist"],
      [Megaphone, "Campaign Notes"],
      [CalendarClock, "Rollout Calendar"],
      [CloudUpload, "Ship Build"],
    ],
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: Inbox,
    rows: [
      [MessageCircle, "Client Feedback"],
      [Users, "Team Requests"],
      [BadgeCheck, "Approval Notes"],
    ],
  },
  {
    id: "flows",
    label: "Flows",
    icon: Workflow,
    rows: [
      [GitBranch, "Trigger Map"],
      [Webhook, "Webhook Runs"],
      [RefreshCw, "Retry Queue"],
    ],
  },
  {
    id: "assets",
    label: "Assets",
    icon: PackageOpen,
    rows: [
      [SwatchBook, "Brand Kit"],
      [Images, "Mockup Library"],
      [Brush, "Design Tokens"],
      [UploadCloud, "Export Queue"],
    ],
  },
  {
    id: "status",
    label: "Status",
    icon: ChartSpline,
    rows: [
      [Gauge, "Activation"],
      [ChartSpline, "Conversion"],
      [Siren, "Incidents"],
    ],
  },
];
const items: ExpandableTabsItem[] = sections.map(({ rows, ...section }) => ({
  ...section,
  content: content(rows),
}));
</script>

<template>
  <div class="flex min-h-88 w-full items-end justify-center">
    <ExpandableTabs :items="items" />
  </div>
</template>
```

## API 参考

### ExpandableTabs

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `ExpandableTabsItem[]` | — | 是 | — |
| `modelValue` | `null \| string` | — | 否 | — |
| `defaultValue` | `null \| string` | `null` | 否 | — |
| `classNames` | `ExpandableTabsClassNames` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `[value: string \| null]` | — |
| `valueChange` | `[value: string \| null]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `content` | — | `item: item`, `item: active` | — |

## 关于 Expandable Tabs

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Expandable Tabs？**

通过 items、modelValue、defaultValue、classNames 配置 Expandable Tabs；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/expandable-tabs.json
- 文档: https://orvui.efu.me/components/blocks/expandable-tabs
- `packages/vue/src/blocks/expandable-tabs/src/ExpandableTabs.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
