# Expandable Tabs · orvui 0.1.1

## 选择与组合

页面内相关视图使用 Tabs；页面层级使用 Breadcrumb；长文章定位使用 Table of Contents；跨功能区导航可使用 Animated Sidebar。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Expandable Tabs"
description: "在图标条中导航，选中项展开以显示标签。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/expandable-tabs"
markdown: "https://orvui.efu.me/components/blocks/expandable-tabs.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Expandable Tabs

> 在图标条中导航，选中项展开以显示标签。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Expandable Tabs：在图标条中导航，选中项展开以显示标签。

<a id="install"></a>
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
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## 用法

<a id="default"></a>
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

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `ExpandableTabs` | `v-model` | `null \| string` | `update:modelValue` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
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

<a id="about"></a>
## 关于 Expandable Tabs

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Expandable Tabs？**

通过 items、modelValue、defaultValue、classNames 配置 Expandable Tabs；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、valueChange，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Expandable Action Bar](https://orvui.efu.me/components/blocks/expandable-action-bar): 在紧凑图标操作行中，为当前活动操作展开标签。
- [Bloom Menu](https://orvui.efu.me/components/blocks/bloom-menu): 围绕共同中心展开一组操作，并在关闭时恢复焦点。
- [Overflow Actions](https://orvui.efu.me/components/blocks/overflow-actions): 展开紧凑操作轨道，展示静止宽度下无法容纳的控件。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/expandable-tabs.json
- 文档: https://orvui.efu.me/components/blocks/expandable-tabs
- `packages/vue/src/blocks/expandable-tabs/src/ExpandableTabs.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

