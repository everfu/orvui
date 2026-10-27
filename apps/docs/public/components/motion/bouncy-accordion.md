---
title: "Bouncy Accordion"
description: "在单项展开的分组中打开内容区，布局通过弹簧连续移动。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/bouncy-accordion"
markdown: "https://orvui.efu.me/components/motion/bouncy-accordion.md"
license: "MIT"
productVersion: "0.1.0"
---

# Bouncy Accordion

> 在单项展开的分组中打开内容区，布局通过弹簧连续移动。

## 安装

### Bouncy Accordion — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/bouncy-accordion.json
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

### Bouncy Accordion

**复制源码**

```vue
<script setup lang="ts">
import { h } from "vue";
import { CalendarClock, FileText, FolderKanban, PackageCheck, RadioTower, ShieldCheck } from "lucide-vue-next";
import { BouncyAccordion } from "@/components/orvui/motion/bouncy-accordion";
const records = [
  ["brief", "Release Brief", "Gather launch notes, accountable owners and known risks into a brief handoff before the release.", FileText],
  ["launch", "Launch Checklist", "Review copy, links, analytics, recovery steps and approvals together before the launch starts.", ShieldCheck],
  ["campaign", "Campaign Notes", "Attach notes for each channel while keeping the closed task list compact and easy to scan.", RadioTower],
  ["calendar", "Rollout Calendar", "Coordinate announcements, staging reviews, reminders and quiet hours on a shared timeline.", CalendarClock],
  ["ship", "Ship Build", "Follow the build artifact, deployment state and final review before completing the release.", PackageCheck],
  ["archive", "Archive Assets", "File the approved copy, graphics and source in the campaign folder after the rollout ends.", FolderKanban],
] as const;
const items = records.map(([id, title, description, icon]) => ({ id, title, description, icon: h(icon, { class: "h-4 w-4" }) }));
</script>
<template><div class="flex min-h-96 w-full items-center justify-center"><div class="w-full max-w-sm h-[480px]"><BouncyAccordion :items="items" default-value="calendar" /></div></div></template>
```

**组件包**

```vue
<script setup lang="ts">
import { h } from "vue";
import { CalendarClock, FileText, FolderKanban, PackageCheck, RadioTower, ShieldCheck } from "lucide-vue-next";
import { BouncyAccordion } from "@orvui/vue/motion/bouncy-accordion";
const records = [
  ["brief", "Release Brief", "Gather launch notes, accountable owners and known risks into a brief handoff before the release.", FileText],
  ["launch", "Launch Checklist", "Review copy, links, analytics, recovery steps and approvals together before the launch starts.", ShieldCheck],
  ["campaign", "Campaign Notes", "Attach notes for each channel while keeping the closed task list compact and easy to scan.", RadioTower],
  ["calendar", "Rollout Calendar", "Coordinate announcements, staging reviews, reminders and quiet hours on a shared timeline.", CalendarClock],
  ["ship", "Ship Build", "Follow the build artifact, deployment state and final review before completing the release.", PackageCheck],
  ["archive", "Archive Assets", "File the approved copy, graphics and source in the campaign folder after the rollout ends.", FolderKanban],
] as const;
const items = records.map(([id, title, description, icon]) => ({ id, title, description, icon: h(icon, { class: "h-4 w-4" }) }));
</script>
<template><div class="flex min-h-96 w-full items-center justify-center"><div class="w-full max-w-sm h-[480px]"><BouncyAccordion :items="items" default-value="calendar" /></div></div></template>
```

## API 参考

### BouncyAccordion

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `{ id: string; title: any; description?: any; icon?: any; disabled?: boolean; }[]` | — | 是 | — |
| `modelValue` | `null \| string` | — | 否 | — |
| `defaultValue` | `null \| string` | `null` | 否 | — |
| `collapsible` | `boolean` | `true` | 否 | — |
| `classNames` | `Record<string, string>` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:modelValue` | — | — |
| `change` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `title` | — | `v-bind: scope` | — |
| `content` | — | `v-bind: scope` | — |

## 关于 Bouncy Accordion

在单项展开的分组中打开内容区，布局通过弹簧连续移动。

### 适用场景

- 当界面需要以下行为时使用 Bouncy Accordion：在单项展开的分组中打开内容区，布局通过弹簧连续移动。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 Bouncy Accordion？**

通过 items、modelValue、defaultValue、collapsible、classNames 配置 Bouncy Accordion；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:modelValue、change，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/bouncy-accordion.json
- 文档: https://orvui.efu.me/components/motion/bouncy-accordion
- `packages/vue/src/motion/bouncy-accordion/src/BouncyAccordion.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
