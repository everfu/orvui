# Expandable Action Bar · orvui 0.1.1

## 选择与组合

以明确操作为入口：普通操作使用 Button，需要持续按压或滑动确认时查看 CTA Buttons；紧凑工具栏可选择 Expandable Action Bar。

## SSR、动效与应用边界

在 Vue / Nuxt 中显式导入，保持服务端与客户端的初始数据和 ID 一致；浏览器资源在挂载后创建并在卸载时释放。保留减少动态效果、键盘操作及语义主题覆盖。仅使用下方真实 API 中成对存在的状态绑定。示例数据与演示动作不提供业务服务；应用负责请求、权限和持久化。具体限制见下方常见问题。

## 完整组件参考

---
title: "Expandable Action Bar"
description: "在紧凑图标操作行中，为当前活动操作展开标签。"
category: "Blocks"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/blocks/expandable-action-bar"
markdown: "https://orvui.efu.me/components/blocks/expandable-action-bar.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# Expandable Action Bar

> 在紧凑图标操作行中，为当前活动操作展开标签。

<a id="when-to-use"></a>

## 适用场景

- 当界面需要以下行为时使用 Expandable Action Bar：在紧凑图标操作行中，为当前活动操作展开标签。

<a id="install"></a>
## 安装

### Expandable Action Bar — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/expandable-action-bar.json
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
pnpm add lucide-vue-next@^0.468.0 motion-v@^1.10.0
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
### Expandable Action Bar

**复制源码**

```vue
<script setup lang="ts">
import { h, computed, ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Archive, Bell, Copy, Download, Send, Settings } from "lucide-vue-next";
import { ExpandableActionBar, type ExpandableActionBarItem } from "@/components/orvui/blocks/expandable-action-bar";
const expanded = ref(false),
  activeId = ref("send");
const descriptors = [
  {
    id: "send",
    label: "Send",
    icon: Send,
    shortcut: "S",
    motion: "motion-safe:group-hover:animate-action-send",
  },
  {
    id: "copy",
    label: "Copy",
    icon: Copy,
    shortcut: "C",
    motion: "motion-safe:group-hover:animate-action-copy",
  },
  {
    id: "download",
    label: "Export",
    icon: Download,
    shortcut: "E",
    motion: "motion-safe:group-hover:animate-action-download",
  },
  {
    id: "archive",
    label: "Archive",
    icon: Archive,
    motion: "motion-safe:group-hover:animate-action-archive",
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: Bell,
    badge: "3",
    motion: "origin-top motion-safe:group-hover:animate-action-bell",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    motion: "motion-safe:group-hover:animate-action-settings",
  },
];
const items = computed<ExpandableActionBarItem[]>(() =>
  descriptors.map(({ icon, motion: animation, ...item }) => ({
    ...item,
    active: item.id === activeId.value,
    icon: () => h(icon, { class: `h-4 w-4 ${animation}` }),
  })),
);
</script>
<template>
  <div class="flex min-h-72 w-full flex-col items-center justify-center gap-6">
    <div class="flex min-h-24 w-full items-center justify-center">
      <ExpandableActionBar
        :items="items"
        v-model:expanded="expanded"
        :active-id="activeId"
        @action="activeId = $event.id"
        :class-names="{ item: 'group' }"
      />
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <motion.button
        type="button"
        @click="expanded = !expanded"
        class="relative flex h-9 w-[110px] items-center justify-center overflow-hidden rounded-full border border-border bg-card text-xs font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
        :while-hover="{ scale: 1.02 }"
        :while-press="{ scale: 0.96 }"
        ><motion.div layout class="flex items-center gap-1.5"
          ><motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            :stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-3.5 w-3.5 shrink-0"
            ><motion.path
              :initial="false"
              :animate="{
                d: expanded ? 'M 10 20 L 10 14 L 4 14' : 'M 9 21 L 3 21 L 3 15',
              }"
              :transition="{
                type: 'spring',
                bounce: 0,
                duration: 0.3,
              }" /><motion.path
              :initial="false"
              :animate="{
                d: expanded ? 'M 14 4 L 14 10 L 20 10' : 'M 15 3 L 21 3 L 21 9',
              }"
              :transition="{ type: 'spring', bounce: 0, duration: 0.3 }" /><line
              x1="14"
              x2="21"
              y1="10"
              y2="3" /><line x1="3" x2="10" y1="21" y2="14" /></motion.svg
          ><AnimatePresence mode="popLayout" :initial="false"
            ><motion.span
              :key="expanded ? 'expanded' : 'collapsed'"
              :initial="{ opacity: 0, y: -25, filter: 'blur(4px)' }"
              :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
              :exit="{ opacity: 0, y: 25, filter: 'blur(4px)' }"
              :transition="{ type: 'spring', bounce: 0, duration: 0.3 }"
              >{{ expanded ? "Collapse" : "Expand" }}</motion.span
            ></AnimatePresence
          ></motion.div
        ></motion.button
      >
    </div>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { h, computed, ref } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { Archive, Bell, Copy, Download, Send, Settings } from "lucide-vue-next";
import { ExpandableActionBar, type ExpandableActionBarItem } from "@orvui/vue/blocks/expandable-action-bar";
const expanded = ref(false),
  activeId = ref("send");
const descriptors = [
  {
    id: "send",
    label: "Send",
    icon: Send,
    shortcut: "S",
    motion: "motion-safe:group-hover:animate-action-send",
  },
  {
    id: "copy",
    label: "Copy",
    icon: Copy,
    shortcut: "C",
    motion: "motion-safe:group-hover:animate-action-copy",
  },
  {
    id: "download",
    label: "Export",
    icon: Download,
    shortcut: "E",
    motion: "motion-safe:group-hover:animate-action-download",
  },
  {
    id: "archive",
    label: "Archive",
    icon: Archive,
    motion: "motion-safe:group-hover:animate-action-archive",
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: Bell,
    badge: "3",
    motion: "origin-top motion-safe:group-hover:animate-action-bell",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    motion: "motion-safe:group-hover:animate-action-settings",
  },
];
const items = computed<ExpandableActionBarItem[]>(() =>
  descriptors.map(({ icon, motion: animation, ...item }) => ({
    ...item,
    active: item.id === activeId.value,
    icon: () => h(icon, { class: `h-4 w-4 ${animation}` }),
  })),
);
</script>
<template>
  <div class="flex min-h-72 w-full flex-col items-center justify-center gap-6">
    <div class="flex min-h-24 w-full items-center justify-center">
      <ExpandableActionBar
        :items="items"
        v-model:expanded="expanded"
        :active-id="activeId"
        @action="activeId = $event.id"
        :class-names="{ item: 'group' }"
      />
    </div>
    <div class="flex flex-wrap items-center justify-center gap-2">
      <motion.button
        type="button"
        @click="expanded = !expanded"
        class="relative flex h-9 w-[110px] items-center justify-center overflow-hidden rounded-full border border-border bg-card text-xs font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
        :while-hover="{ scale: 1.02 }"
        :while-press="{ scale: 0.96 }"
        ><motion.div layout class="flex items-center gap-1.5"
          ><motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            :stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-3.5 w-3.5 shrink-0"
            ><motion.path
              :initial="false"
              :animate="{
                d: expanded ? 'M 10 20 L 10 14 L 4 14' : 'M 9 21 L 3 21 L 3 15',
              }"
              :transition="{
                type: 'spring',
                bounce: 0,
                duration: 0.3,
              }" /><motion.path
              :initial="false"
              :animate="{
                d: expanded ? 'M 14 4 L 14 10 L 20 10' : 'M 15 3 L 21 3 L 21 9',
              }"
              :transition="{ type: 'spring', bounce: 0, duration: 0.3 }" /><line
              x1="14"
              x2="21"
              y1="10"
              y2="3" /><line x1="3" x2="10" y1="21" y2="14" /></motion.svg
          ><AnimatePresence mode="popLayout" :initial="false"
            ><motion.span
              :key="expanded ? 'expanded' : 'collapsed'"
              :initial="{ opacity: 0, y: -25, filter: 'blur(4px)' }"
              :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
              :exit="{ opacity: 0, y: 25, filter: 'blur(4px)' }"
              :transition="{ type: 'spring', bounce: 0, duration: 0.3 }"
              >{{ expanded ? "Collapse" : "Expand" }}</motion.span
            ></AnimatePresence
          ></motion.div
        ></motion.button
      >
    </div>
  </div>
</template>
```

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `ExpandableActionBar` | `v-model:expanded` | `boolean` | `update:expanded` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### ExpandableActionBar

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `ExpandableActionBarItem[]` | — | 是 | — |
| `expanded` | `boolean` | `undefined` | 否 | — |
| `defaultExpanded` | `boolean` | `false` | 否 | — |
| `activeId` | `string` | — | 否 | — |
| `size` | `"sm" \| "md"` | `"md"` | 否 | — |
| `expandOnHover` | `boolean` | `true` | 否 | — |
| `expandOnFocus` | `boolean` | `true` | 否 | — |
| `collapseDelay` | `number` | `90` | 否 | — |
| `classNames` | `ExpandableActionBarClassNames` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:expanded` | `[value: boolean]` | — |
| `expandedChange` | `[value: boolean]` | — |
| `action` | `[item: ExpandableActionBarItem]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `item` | — | `item: item`, `expanded: expanded`, `active: item.active \|\| props.activeId === item.id` | — |

<a id="about"></a>
## 关于 Expandable Action Bar

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Expandable Action Bar？**

通过 items、expanded、defaultExpanded、activeId、size、expandOnHover、expandOnFocus、collapseDelay、classNames 配置 Expandable Action Bar；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:expanded、expandedChange、action，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Expandable Tabs](https://orvui.efu.me/components/blocks/expandable-tabs): 在图标条中导航，选中项展开以显示标签。
- [Overflow Actions](https://orvui.efu.me/components/blocks/overflow-actions): 展开紧凑操作轨道，展示静止宽度下无法容纳的控件。
- [Bloom Menu](https://orvui.efu.me/components/blocks/bloom-menu): 围绕共同中心展开一组操作，并在关闭时恢复焦点。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/expandable-action-bar.json
- 文档: https://orvui.efu.me/components/blocks/expandable-action-bar
- `packages/vue/src/blocks/expandable-action-bar/src/ExpandableActionBar.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)

