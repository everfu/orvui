---
title: "AI Sidebar"
description: "在可搜索树中组织助手资源，支持选择与移动操作。"
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/agents/ai-sidebar"
markdown: "https://orvui.efu.me/components/agents/ai-sidebar.md"
license: "MIT"
productVersion: "0.1.0"
---

# AI Sidebar

> 在可搜索树中组织助手资源，支持选择与移动操作。

## 安装

### AI Sidebar — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/ai-sidebar.json https://orvui.efu.me/r/animated-sidebar.json
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

### AI Sidebar

**复制源码**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import {
  Clock3,
  GitPullRequest,
  LayoutGrid,
  PanelLeft,
  Plug,
  SquarePen,
} from "lucide-vue-next";
import {
  AISidebar,
  findResource,
  type SidebarResource,
  type SidebarResourceMove,
} from "@/components/orvui/agents/ai-sidebar";
import {
  AnimatedSidebar,
  AnimatedSidebarContent,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarInset,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
  AnimatedSidebarProvider,
  AnimatedSidebarRail,
  AnimatedSidebarTrigger,
} from "@/components/orvui/motion/animated-sidebar";
const resources: SidebarResource[] = [
  {
    id: "design-system",
    label: "Design system",
    kind: "project",
  },
  {
    id: "client-portal",
    label: "Client portal",
    kind: "project",
  },
  {
    id: "marketing-site",
    label: "Marketing website",
    kind: "project",
  },
  {
    id: "platform",
    label: "Platform",
    kind: "project",
    children: [
      { id: "api", label: "API migration", kind: "file" },
      { id: "billing", label: "Billing states", kind: "file" },
      { id: "docs", label: "Read platform docs", kind: "bookmark" },
    ],
  },
  {
    id: "mobile-app",
    label: "Mobile app",
    kind: "project",
  },
  {
    id: "research-lab",
    label: "Research lab",
    kind: "folder",
  },
  {
    id: "agent-workspace",
    label: "Agent workspace",
    kind: "project",
    children: [
      {
        id: "resource-review",
        label: "Review resource sidebar interaction details",
        kind: "file",
      },
      {
        id: "release-offer",
        label: "Prepare release announcement",
        kind: "file",
      },
      {
        id: "haptics",
        label: "Explore interaction feedback",
        kind: "bookmark",
      },
      {
        id: "promotion",
        label: "Plan launch distribution",
        kind: "file",
      },
      {
        id: "motion-research",
        label: "Research motion implementation patterns",
        kind: "bookmark",
      },
    ],
  },
  {
    id: "release-notes",
    label: "Release notes",
    kind: "file",
  },
];

const actions = [
  { label: "New workspace", icon: SquarePen },
  { label: "Pull requests", icon: GitPullRequest },
  { label: "Sites", icon: LayoutGrid },
  { label: "Scheduled", icon: Clock3 },
  { label: "Extensions", icon: Plug },
];
const active = ref("resource-review"),
  items = ref(resources);
const activeLabel = computed(
  () => findResource(items.value, active.value)?.label ?? active.value,
);
const pending = new Map<ReturnType<typeof setTimeout>, () => void>();
function move(_event: SidebarResourceMove) {
  return new Promise<void>((resolve) => {
    const handle = setTimeout(() => {
      pending.delete(handle);
      resolve();
    }, 450);
    pending.set(handle, resolve);
  });
}
onBeforeUnmount(() => {
  pending.forEach((resolve, handle) => {
    clearTimeout(handle);
    resolve();
  });
  pending.clear();
});
</script>
<template>
  <div class="w-full px-0 py-2 sm:p-3">
    <AnimatedSidebarProvider
      :style="{ '--sidebar-width': '16rem' }"
      class="h-[720px] min-h-0 w-full overflow-hidden rounded-2xl border border-foreground/[0.08] bg-background"
    >
      <AnimatedSidebar
        aria-label="Workspace resources"
        collapsible="offcanvas"
        class="min-h-0 w-full"
        panel-class-name="h-full bg-background"
        ><AnimatedSidebarContent class="gap-4 overflow-hidden px-2 py-4"
          ><AnimatedSidebarGroup class="shrink-0 px-1 py-0"
            ><AnimatedSidebarGroupContent
              ><AnimatedSidebarMenu class="gap-1"
                ><AnimatedSidebarMenuItem
                  v-for="action in actions"
                  :key="action.label"
                  ><AnimatedSidebarMenuButton
                    class="font-normal text-foreground"
                    ><template #icon
                      ><component :is="action.icon" class="size-4" /></template
                    >{{ action.label }}</AnimatedSidebarMenuButton
                  ></AnimatedSidebarMenuItem
                ></AnimatedSidebarMenu
              ></AnimatedSidebarGroupContent
            ></AnimatedSidebarGroup
          >
          <AnimatedSidebarGroup class="min-h-0 flex-1 px-1 py-0"
            ><AnimatedSidebarGroupLabel
              class="mb-1 h-8 px-2 text-xs font-medium normal-case tracking-normal"
              >Projects</AnimatedSidebarGroupLabel
            ><AnimatedSidebarGroupContent
              class="relative min-h-0 flex-1 overflow-hidden"
              ><div
                class="h-full overflow-y-auto overscroll-contain pb-8 [overflow-anchor:none] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <AISidebar
                  v-model:items="items"
                  v-model:active-id="active"
                  :default-expanded-ids="['platform', 'agent-workspace']"
                  :on-move="move"
                />
              </div>
              <div
                aria-hidden="true"
                class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-8 bg-gradient-to-t from-background via-background/80 to-transparent" /></AnimatedSidebarGroupContent></AnimatedSidebarGroup></AnimatedSidebarContent
        ><AnimatedSidebarRail
      /></AnimatedSidebar>
      <AnimatedSidebarInset class="min-h-0 bg-background"
        ><header
          class="flex h-14 shrink-0 items-center justify-between gap-4 border-border border-b px-5"
        >
          <div class="flex min-w-0 items-center gap-3">
            <AnimatedSidebarTrigger
              class="-ml-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              ><PanelLeft aria-hidden="true" class="size-4"
            /></AnimatedSidebarTrigger>
            <div class="min-w-0">
              <p
                class="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
              >
                Workspace
              </p>
              <p class="truncate text-sm font-medium text-foreground">
                Agent workspace
              </p>
            </div>
          </div>
          <span
            class="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
            >Draft</span
          >
        </header>
        <div class="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
          <div class="mx-auto max-w-xl">
            <p class="text-xs text-muted-foreground">Selected resource</p>
            <h3
              class="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              {{ activeLabel }}
            </h3>
            <p class="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              Keep the resource tree predictable while files move between
              projects, labels overflow, and folders expand around the current
              selection.
            </p>
            <div class="mt-8 border-border border-t pt-6">
              <p class="text-sm font-medium text-foreground">
                Interaction notes
              </p>
              <ul
                class="mt-3 space-y-3 text-sm leading-6 text-muted-foreground"
              >
                <li
                  v-for="note in [
                    'Folders only reveal their contents.',
                    'Files can be selected, moved, or renamed.',
                    'Rejected moves return to their previous location.',
                  ]"
                  :key="note"
                >
                  {{ note }}
                </li>
              </ul>
            </div>
          </div>
        </div></AnimatedSidebarInset
      >
    </AnimatedSidebarProvider>
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import {
  Clock3,
  GitPullRequest,
  LayoutGrid,
  PanelLeft,
  Plug,
  SquarePen,
} from "lucide-vue-next";
import { AISidebar, findResource, type SidebarResource, type SidebarResourceMove } from "@orvui/vue/agents/ai-sidebar";
import { AnimatedSidebar, AnimatedSidebarContent, AnimatedSidebarGroup, AnimatedSidebarGroupContent, AnimatedSidebarGroupLabel, AnimatedSidebarInset, AnimatedSidebarMenu, AnimatedSidebarMenuButton, AnimatedSidebarMenuItem, AnimatedSidebarProvider, AnimatedSidebarRail, AnimatedSidebarTrigger } from "@orvui/vue/motion/animated-sidebar";
const resources: SidebarResource[] = [
  {
    id: "design-system",
    label: "Design system",
    kind: "project",
  },
  {
    id: "client-portal",
    label: "Client portal",
    kind: "project",
  },
  {
    id: "marketing-site",
    label: "Marketing website",
    kind: "project",
  },
  {
    id: "platform",
    label: "Platform",
    kind: "project",
    children: [
      { id: "api", label: "API migration", kind: "file" },
      { id: "billing", label: "Billing states", kind: "file" },
      { id: "docs", label: "Read platform docs", kind: "bookmark" },
    ],
  },
  {
    id: "mobile-app",
    label: "Mobile app",
    kind: "project",
  },
  {
    id: "research-lab",
    label: "Research lab",
    kind: "folder",
  },
  {
    id: "agent-workspace",
    label: "Agent workspace",
    kind: "project",
    children: [
      {
        id: "resource-review",
        label: "Review resource sidebar interaction details",
        kind: "file",
      },
      {
        id: "release-offer",
        label: "Prepare release announcement",
        kind: "file",
      },
      {
        id: "haptics",
        label: "Explore interaction feedback",
        kind: "bookmark",
      },
      {
        id: "promotion",
        label: "Plan launch distribution",
        kind: "file",
      },
      {
        id: "motion-research",
        label: "Research motion implementation patterns",
        kind: "bookmark",
      },
    ],
  },
  {
    id: "release-notes",
    label: "Release notes",
    kind: "file",
  },
];

const actions = [
  { label: "New workspace", icon: SquarePen },
  { label: "Pull requests", icon: GitPullRequest },
  { label: "Sites", icon: LayoutGrid },
  { label: "Scheduled", icon: Clock3 },
  { label: "Extensions", icon: Plug },
];
const active = ref("resource-review"),
  items = ref(resources);
const activeLabel = computed(
  () => findResource(items.value, active.value)?.label ?? active.value,
);
const pending = new Map<ReturnType<typeof setTimeout>, () => void>();
function move(_event: SidebarResourceMove) {
  return new Promise<void>((resolve) => {
    const handle = setTimeout(() => {
      pending.delete(handle);
      resolve();
    }, 450);
    pending.set(handle, resolve);
  });
}
onBeforeUnmount(() => {
  pending.forEach((resolve, handle) => {
    clearTimeout(handle);
    resolve();
  });
  pending.clear();
});
</script>
<template>
  <div class="w-full px-0 py-2 sm:p-3">
    <AnimatedSidebarProvider
      :style="{ '--sidebar-width': '16rem' }"
      class="h-[720px] min-h-0 w-full overflow-hidden rounded-2xl border border-foreground/[0.08] bg-background"
    >
      <AnimatedSidebar
        aria-label="Workspace resources"
        collapsible="offcanvas"
        class="min-h-0 w-full"
        panel-class-name="h-full bg-background"
        ><AnimatedSidebarContent class="gap-4 overflow-hidden px-2 py-4"
          ><AnimatedSidebarGroup class="shrink-0 px-1 py-0"
            ><AnimatedSidebarGroupContent
              ><AnimatedSidebarMenu class="gap-1"
                ><AnimatedSidebarMenuItem
                  v-for="action in actions"
                  :key="action.label"
                  ><AnimatedSidebarMenuButton
                    class="font-normal text-foreground"
                    ><template #icon
                      ><component :is="action.icon" class="size-4" /></template
                    >{{ action.label }}</AnimatedSidebarMenuButton
                  ></AnimatedSidebarMenuItem
                ></AnimatedSidebarMenu
              ></AnimatedSidebarGroupContent
            ></AnimatedSidebarGroup
          >
          <AnimatedSidebarGroup class="min-h-0 flex-1 px-1 py-0"
            ><AnimatedSidebarGroupLabel
              class="mb-1 h-8 px-2 text-xs font-medium normal-case tracking-normal"
              >Projects</AnimatedSidebarGroupLabel
            ><AnimatedSidebarGroupContent
              class="relative min-h-0 flex-1 overflow-hidden"
              ><div
                class="h-full overflow-y-auto overscroll-contain pb-8 [overflow-anchor:none] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <AISidebar
                  v-model:items="items"
                  v-model:active-id="active"
                  :default-expanded-ids="['platform', 'agent-workspace']"
                  :on-move="move"
                />
              </div>
              <div
                aria-hidden="true"
                class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-8 bg-gradient-to-t from-background via-background/80 to-transparent" /></AnimatedSidebarGroupContent></AnimatedSidebarGroup></AnimatedSidebarContent
        ><AnimatedSidebarRail
      /></AnimatedSidebar>
      <AnimatedSidebarInset class="min-h-0 bg-background"
        ><header
          class="flex h-14 shrink-0 items-center justify-between gap-4 border-border border-b px-5"
        >
          <div class="flex min-w-0 items-center gap-3">
            <AnimatedSidebarTrigger
              class="-ml-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              ><PanelLeft aria-hidden="true" class="size-4"
            /></AnimatedSidebarTrigger>
            <div class="min-w-0">
              <p
                class="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
              >
                Workspace
              </p>
              <p class="truncate text-sm font-medium text-foreground">
                Agent workspace
              </p>
            </div>
          </div>
          <span
            class="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
            >Draft</span
          >
        </header>
        <div class="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
          <div class="mx-auto max-w-xl">
            <p class="text-xs text-muted-foreground">Selected resource</p>
            <h3
              class="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              {{ activeLabel }}
            </h3>
            <p class="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              Keep the resource tree predictable while files move between
              projects, labels overflow, and folders expand around the current
              selection.
            </p>
            <div class="mt-8 border-border border-t pt-6">
              <p class="text-sm font-medium text-foreground">
                Interaction notes
              </p>
              <ul
                class="mt-3 space-y-3 text-sm leading-6 text-muted-foreground"
              >
                <li
                  v-for="note in [
                    'Folders only reveal their contents.',
                    'Files can be selected, moved, or renamed.',
                    'Rejected moves return to their previous location.',
                  ]"
                  :key="note"
                >
                  {{ note }}
                </li>
              </ul>
            </div>
          </div>
        </div></AnimatedSidebarInset
      >
    </AnimatedSidebarProvider>
  </div>
</template>
```

## API 参考

### AISidebar

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `SidebarResource[]` | `props.defaultItems` | 否 | — |
| `defaultItems` | `SidebarResource[]` | `() => []` | 否 | — |
| `activeId` | `null \| string` | `props.defaultActiveId` | 否 | — |
| `defaultActiveId` | `null \| string` | `null` | 否 | — |
| `defaultExpandedIds` | `string[]` | `() => []` | 否 | — |
| `ariaLabel` | `string` | `"Resources"` | 否 | — |
| `className` | `string` | — | 否 | — |
| `onMove` | `(move: SidebarResourceMove) => void \| Promise<void>` | — | 否 | — |
| `onRename` | `(item: SidebarResource, label: string) => void \| Promise<void>` | — | 否 | — |
| `renderIcon` | `(item: SidebarResource) => VNodeChild` | — | 否 | — |
| `renderMenu` | `(item: SidebarResource, controls: SidebarResourceMenuControls) => VNodeChild` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:items` | `[items: SidebarResource[]]` | — |
| `itemsChange` | `[items: SidebarResource[]]` | — |
| `update:activeId` | `[id: string \| null]` | — |
| `activeChange` | `[id: string]` | — |
| `moveError` | `[error: unknown, move: SidebarResourceMove]` | — |
| `renameError` | `[error: unknown, item: SidebarResource]` | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `icon` | — | `v-bind: scope` | — |
| `menu` | — | `v-bind: scope` | — |

## 组件指南

在可搜索树中组织助手资源，支持选择与移动操作。

### 组合结构

使用公开部件 AISidebar 组合 AI Sidebar，并从该组件的公开入口导入。

```text
AnimatedSidebarProvider
├── AnimatedSidebar
│   ├── AnimatedSidebarContent
│   │   └── AISidebar
│   │       ├── Folder or project
│   │       └── File or bookmark
│   └── AnimatedSidebarRail
└── AnimatedSidebarInset
```

### 生命周期

#### 初始化

通过 items、defaultItems、activeId、defaultActiveId、defaultExpandedIds、ariaLabel、className、onMove、onRename、renderIcon、renderMenu 配置 AI Sidebar；API 表列出其类型与默认值。

#### 更新

监听 update:items、itemsChange、update:activeId、activeChange、moveError、renameError，将组件连接到应用状态。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 AI Sidebar 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 AISidebar，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [Message Scroller](https://orvui.efu.me/components/agents/message-scroller): 在新消息加入时跟随内容，同时允许读者离开并返回最新位置。
- [Prompt Input](https://orvui.efu.me/components/agents/prompt-input): 通过自适应高度文本框、附件与键盘操作编写并提交提示词。

### 能力边界

- 负责: AI Sidebar 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 当界面需要以下行为时使用 AI Sidebar：在可搜索树中组织助手资源，支持选择与移动操作。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

## 关于 AI Sidebar

在可搜索树中组织助手资源，支持选择与移动操作。

### 适用场景

- 当界面需要以下行为时使用 AI Sidebar：在可搜索树中组织助手资源，支持选择与移动操作。

### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### 常见问题

**如何配置 AI Sidebar？**

通过 items、defaultItems、activeId、defaultActiveId、defaultExpandedIds、ariaLabel、className、onMove、onRename、renderIcon、renderMenu 配置 AI Sidebar；API 表列出其类型与默认值。

**如何连接到应用状态？**

监听 update:items、itemsChange、update:activeId、activeChange、moveError、renameError，将组件连接到应用状态。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

## 源码

- 注册表详情: https://orvui.efu.me/r/ai-sidebar.json
- 文档: https://orvui.efu.me/components/agents/ai-sidebar
- `packages/vue/src/agents/ai-sidebar/src/AISidebar.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
