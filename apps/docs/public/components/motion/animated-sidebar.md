---
title: "Animated Sidebar"
description: "组合嵌套导航，支持展开、仅图标和移动抽屉等呈现方式。"
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/components/motion/animated-sidebar"
markdown: "https://orvui.efu.me/components/motion/animated-sidebar.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Animated Sidebar

> 组合嵌套导航，支持展开、仅图标和移动抽屉等呈现方式。

<a id="when-to-use"></a>

## 适用场景

- 用于工作区的分组导航，在多个功能区域之间切换。

<a id="install"></a>
## 安装

### Animated Sidebar — 复制源码

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/animated-sidebar.json
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

<a id="examples"></a>
## 用法

<a id="default"></a>
### Animated Sidebar

**复制源码**

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Building2,
  ChevronRight,
  ChevronsUpDown,
  CircleUserRound,
  Command,
  Inbox,
  LayoutGrid,
  ListTodo,
  NotebookTabs,
  PanelLeft,
  Search,
  Sparkles,
  Target,
  Workflow,
  X,
} from "lucide-vue-next";
import {
  AnimatedSidebar,
  AnimatedSidebarClose,
  AnimatedSidebarContent,
  AnimatedSidebarFooter,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupContent,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarHeader,
  AnimatedSidebarInset,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
  AnimatedSidebarMenuSub,
  AnimatedSidebarMenuSubButton,
  AnimatedSidebarMenuSubItem,
  AnimatedSidebarProvider,
  AnimatedSidebarRail,
  AnimatedSidebarTrigger,
} from "@/components/orvui/motion/animated-sidebar";
const destinations = [
  {
    label: "People",
    icon: CircleUserRound,
    children: ["All people", "Recent activity", "Segments"],
  },
  { label: "Companies", icon: Building2 },
  {
    label: "Opportunities",
    icon: Target,
    children: ["Pipeline", "Forecast", "Closed deals"],
  },
  { label: "Tasks", icon: ListTodo },
  { label: "Notes", icon: NotebookTabs },
  {
    label: "Workflows",
    icon: Workflow,
    children: ["Automations", "Runs", "Templates"],
  },
  { label: "Dashboard", icon: LayoutGrid },
];
const quick = [
    { label: "Search", icon: Search },
    { label: "AI Assistant", icon: Sparkles },
    { label: "Inbox", icon: Inbox, badge: "4" },
  ],
  active = ref("People"),
  openSection = ref<string | null>(null);
function select(item: (typeof destinations)[number]) {
  if (item.children)
    openSection.value = openSection.value === item.label ? null : item.label;
  else {
    active.value = item.label;
    openSection.value = null;
  }
}
</script>
<template>
  <div class="w-full px-0 py-2 sm:p-3">
    <AnimatedSidebarProvider
      class="h-[720px] min-h-0 overflow-hidden rounded-2xl border border-foreground/[0.08] bg-background"
      ><AnimatedSidebar
        aria-label="Solace workspace"
        collapsible="icon"
        class="min-h-0"
        panel-class-name="h-full border-foreground/[0.08]"
        ><AnimatedSidebarHeader class="p-3 pb-2"
          ><div class="flex min-h-11 items-center gap-3 overflow-hidden px-2">
            <div
              class="grid size-7 shrink-0 place-items-center rounded-lg bg-foreground text-background"
            >
              <Command aria-hidden="true" class="size-4" />
            </div>
            <button
              type="button"
              class="flex min-w-0 flex-1 items-center gap-2 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring group-data-[state=collapsed]/sidebar:hidden"
            >
              <span class="truncate text-sm font-semibold text-foreground"
                >Acme Inc</span
              ><ChevronsUpDown
                aria-hidden="true"
                class="size-3.5 shrink-0 text-muted-foreground"
              /></button
            ><AnimatedSidebarClose
              class="ml-auto text-muted-foreground hover:bg-muted md:hidden"
              ><X class="size-4"
            /></AnimatedSidebarClose></div></AnimatedSidebarHeader
        ><AnimatedSidebarContent class="px-2 pt-1"
          ><AnimatedSidebarGroup class="pb-2"
            ><AnimatedSidebarGroupContent
              ><AnimatedSidebarMenu
                ><AnimatedSidebarMenuItem
                  v-for="item in quick"
                  :key="item.label"
                  ><AnimatedSidebarMenuButton
                    :badge="item.badge"
                    @select="active = item.label"
                    ><template #icon
                      ><component :is="item.icon" class="size-4" /></template
                    >{{ item.label }}</AnimatedSidebarMenuButton
                  ></AnimatedSidebarMenuItem
                ></AnimatedSidebarMenu
              ></AnimatedSidebarGroupContent
            ></AnimatedSidebarGroup
          ><AnimatedSidebarGroup class="pt-1"
            ><AnimatedSidebarGroupLabel>Workspaces</AnimatedSidebarGroupLabel
            ><AnimatedSidebarGroupContent
              ><AnimatedSidebarMenu
                ><AnimatedSidebarMenuItem
                  v-for="item in destinations"
                  :key="item.label"
                  ><AnimatedSidebarMenuButton
                    :is-active="
                      active === item.label || item.children?.includes(active)
                    "
                    :aria-expanded="
                      item.children ? openSection === item.label : undefined
                    "
                    @select="select(item)"
                    ><template #icon
                      ><component :is="item.icon" class="size-4" /></template
                    >{{ item.label }}</AnimatedSidebarMenuButton
                  ><AnimatedSidebarMenuSub
                    v-if="item.children"
                    :open="openSection === item.label"
                    ><AnimatedSidebarMenuSubItem
                      v-for="child in item.children"
                      :key="child"
                      ><AnimatedSidebarMenuSubButton
                        :is-active="active === child"
                        @select="active = child"
                        >{{ child }}</AnimatedSidebarMenuSubButton
                      ></AnimatedSidebarMenuSubItem
                    ></AnimatedSidebarMenuSub
                  ></AnimatedSidebarMenuItem
                ></AnimatedSidebarMenu
              ></AnimatedSidebarGroupContent
            ></AnimatedSidebarGroup
          ></AnimatedSidebarContent
        ><AnimatedSidebarFooter class="gap-3 border-none p-3"
          ><button
            type="button"
            class="flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-xl p-1 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              class="grid size-9 shrink-0 place-items-center rounded-full bg-[#d5ff66] text-xs font-semibold text-[#172000]"
              >AS</span
            ><span
              class="min-w-0 flex-1 group-data-[state=collapsed]/sidebar:hidden"
              ><span class="block truncate text-sm font-medium text-foreground"
                >Ava Stone</span
              ><span class="block truncate text-xs text-muted-foreground"
                >ava@solace.app</span
              ></span
            ><ChevronRight
              aria-hidden="true"
              class="size-4 shrink-0 text-muted-foreground group-data-[state=collapsed]/sidebar:hidden"
            /></button></AnimatedSidebarFooter
        ><AnimatedSidebarRail /></AnimatedSidebar
      ><AnimatedSidebarInset class="min-h-0 bg-background"
        ><header
          class="flex h-16 shrink-0 items-center gap-3 border-border border-b px-4"
        >
          <AnimatedSidebarTrigger
            class="text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            ><PanelLeft aria-hidden="true" class="size-4"
          /></AnimatedSidebarTrigger>
          <div class="h-5 w-px bg-border" />
          <p class="text-sm font-medium text-foreground">{{ active }}</p>
        </header>
        <div
          class="flex min-h-0 flex-1 flex-col justify-between overflow-hidden p-5 sm:p-7"
        >
          <div>
            <p class="text-xs font-medium text-muted-foreground">
              Wednesday, July 29
            </p>
            <h3
              class="mt-2 max-w-md text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              Good morning, Ava.
            </h3>
            <p class="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Your workspace stays in place while the navigation folds down to a
              focused icon rail.
            </p>
          </div>
          <div
            class="flex items-end justify-between border-border border-t pt-4"
          >
            <div>
              <p
                class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
              >
                Active view
              </p>
              <p class="mt-1 text-sm font-medium text-foreground">
                {{ active }}
              </p>
            </div>
            <p class="hidden text-xs text-muted-foreground sm:block">
              Press ⌘B to toggle
            </p>
          </div>
        </div></AnimatedSidebarInset
      ></AnimatedSidebarProvider
    >
  </div>
</template>
```

**组件包**

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Building2,
  ChevronRight,
  ChevronsUpDown,
  CircleUserRound,
  Command,
  Inbox,
  LayoutGrid,
  ListTodo,
  NotebookTabs,
  PanelLeft,
  Search,
  Sparkles,
  Target,
  Workflow,
  X,
} from "lucide-vue-next";
import { AnimatedSidebar, AnimatedSidebarClose, AnimatedSidebarContent, AnimatedSidebarFooter, AnimatedSidebarGroup, AnimatedSidebarGroupContent, AnimatedSidebarGroupLabel, AnimatedSidebarHeader, AnimatedSidebarInset, AnimatedSidebarMenu, AnimatedSidebarMenuButton, AnimatedSidebarMenuItem, AnimatedSidebarMenuSub, AnimatedSidebarMenuSubButton, AnimatedSidebarMenuSubItem, AnimatedSidebarProvider, AnimatedSidebarRail, AnimatedSidebarTrigger } from "@orvui/vue/motion/animated-sidebar";
const destinations = [
  {
    label: "People",
    icon: CircleUserRound,
    children: ["All people", "Recent activity", "Segments"],
  },
  { label: "Companies", icon: Building2 },
  {
    label: "Opportunities",
    icon: Target,
    children: ["Pipeline", "Forecast", "Closed deals"],
  },
  { label: "Tasks", icon: ListTodo },
  { label: "Notes", icon: NotebookTabs },
  {
    label: "Workflows",
    icon: Workflow,
    children: ["Automations", "Runs", "Templates"],
  },
  { label: "Dashboard", icon: LayoutGrid },
];
const quick = [
    { label: "Search", icon: Search },
    { label: "AI Assistant", icon: Sparkles },
    { label: "Inbox", icon: Inbox, badge: "4" },
  ],
  active = ref("People"),
  openSection = ref<string | null>(null);
function select(item: (typeof destinations)[number]) {
  if (item.children)
    openSection.value = openSection.value === item.label ? null : item.label;
  else {
    active.value = item.label;
    openSection.value = null;
  }
}
</script>
<template>
  <div class="w-full px-0 py-2 sm:p-3">
    <AnimatedSidebarProvider
      class="h-[720px] min-h-0 overflow-hidden rounded-2xl border border-foreground/[0.08] bg-background"
      ><AnimatedSidebar
        aria-label="Solace workspace"
        collapsible="icon"
        class="min-h-0"
        panel-class-name="h-full border-foreground/[0.08]"
        ><AnimatedSidebarHeader class="p-3 pb-2"
          ><div class="flex min-h-11 items-center gap-3 overflow-hidden px-2">
            <div
              class="grid size-7 shrink-0 place-items-center rounded-lg bg-foreground text-background"
            >
              <Command aria-hidden="true" class="size-4" />
            </div>
            <button
              type="button"
              class="flex min-w-0 flex-1 items-center gap-2 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring group-data-[state=collapsed]/sidebar:hidden"
            >
              <span class="truncate text-sm font-semibold text-foreground"
                >Acme Inc</span
              ><ChevronsUpDown
                aria-hidden="true"
                class="size-3.5 shrink-0 text-muted-foreground"
              /></button
            ><AnimatedSidebarClose
              class="ml-auto text-muted-foreground hover:bg-muted md:hidden"
              ><X class="size-4"
            /></AnimatedSidebarClose></div></AnimatedSidebarHeader
        ><AnimatedSidebarContent class="px-2 pt-1"
          ><AnimatedSidebarGroup class="pb-2"
            ><AnimatedSidebarGroupContent
              ><AnimatedSidebarMenu
                ><AnimatedSidebarMenuItem
                  v-for="item in quick"
                  :key="item.label"
                  ><AnimatedSidebarMenuButton
                    :badge="item.badge"
                    @select="active = item.label"
                    ><template #icon
                      ><component :is="item.icon" class="size-4" /></template
                    >{{ item.label }}</AnimatedSidebarMenuButton
                  ></AnimatedSidebarMenuItem
                ></AnimatedSidebarMenu
              ></AnimatedSidebarGroupContent
            ></AnimatedSidebarGroup
          ><AnimatedSidebarGroup class="pt-1"
            ><AnimatedSidebarGroupLabel>Workspaces</AnimatedSidebarGroupLabel
            ><AnimatedSidebarGroupContent
              ><AnimatedSidebarMenu
                ><AnimatedSidebarMenuItem
                  v-for="item in destinations"
                  :key="item.label"
                  ><AnimatedSidebarMenuButton
                    :is-active="
                      active === item.label || item.children?.includes(active)
                    "
                    :aria-expanded="
                      item.children ? openSection === item.label : undefined
                    "
                    @select="select(item)"
                    ><template #icon
                      ><component :is="item.icon" class="size-4" /></template
                    >{{ item.label }}</AnimatedSidebarMenuButton
                  ><AnimatedSidebarMenuSub
                    v-if="item.children"
                    :open="openSection === item.label"
                    ><AnimatedSidebarMenuSubItem
                      v-for="child in item.children"
                      :key="child"
                      ><AnimatedSidebarMenuSubButton
                        :is-active="active === child"
                        @select="active = child"
                        >{{ child }}</AnimatedSidebarMenuSubButton
                      ></AnimatedSidebarMenuSubItem
                    ></AnimatedSidebarMenuSub
                  ></AnimatedSidebarMenuItem
                ></AnimatedSidebarMenu
              ></AnimatedSidebarGroupContent
            ></AnimatedSidebarGroup
          ></AnimatedSidebarContent
        ><AnimatedSidebarFooter class="gap-3 border-none p-3"
          ><button
            type="button"
            class="flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-xl p-1 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              class="grid size-9 shrink-0 place-items-center rounded-full bg-[#d5ff66] text-xs font-semibold text-[#172000]"
              >AS</span
            ><span
              class="min-w-0 flex-1 group-data-[state=collapsed]/sidebar:hidden"
              ><span class="block truncate text-sm font-medium text-foreground"
                >Ava Stone</span
              ><span class="block truncate text-xs text-muted-foreground"
                >ava@solace.app</span
              ></span
            ><ChevronRight
              aria-hidden="true"
              class="size-4 shrink-0 text-muted-foreground group-data-[state=collapsed]/sidebar:hidden"
            /></button></AnimatedSidebarFooter
        ><AnimatedSidebarRail /></AnimatedSidebar
      ><AnimatedSidebarInset class="min-h-0 bg-background"
        ><header
          class="flex h-16 shrink-0 items-center gap-3 border-border border-b px-4"
        >
          <AnimatedSidebarTrigger
            class="text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            ><PanelLeft aria-hidden="true" class="size-4"
          /></AnimatedSidebarTrigger>
          <div class="h-5 w-px bg-border" />
          <p class="text-sm font-medium text-foreground">{{ active }}</p>
        </header>
        <div
          class="flex min-h-0 flex-1 flex-col justify-between overflow-hidden p-5 sm:p-7"
        >
          <div>
            <p class="text-xs font-medium text-muted-foreground">
              Wednesday, July 29
            </p>
            <h3
              class="mt-2 max-w-md text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              Good morning, Ava.
            </h3>
            <p class="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Your workspace stays in place while the navigation folds down to a
              focused icon rail.
            </p>
          </div>
          <div
            class="flex items-end justify-between border-border border-t pt-4"
          >
            <div>
              <p
                class="text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
              >
                Active view
              </p>
              <p class="mt-1 text-sm font-medium text-foreground">
                {{ active }}
              </p>
            </div>
            <p class="hidden text-xs text-muted-foreground sm:block">
              Press ⌘B to toggle
            </p>
          </div>
        </div></AnimatedSidebarInset
      ></AnimatedSidebarProvider
    >
  </div>
</template>
```

## 组件指南

<a id="composition"></a>
### 组合结构

使用公开部件 AnimatedSidebar, AnimatedSidebarClose, AnimatedSidebarContent, AnimatedSidebarFooter, AnimatedSidebarGroup, AnimatedSidebarGroupContent, AnimatedSidebarGroupLabel, AnimatedSidebarHeader, AnimatedSidebarInset, AnimatedSidebarMenu, AnimatedSidebarMenuButton, AnimatedSidebarMenuItem, AnimatedSidebarMenuSub, AnimatedSidebarMenuSubButton, AnimatedSidebarMenuSubItem, AnimatedSidebarProvider, AnimatedSidebarRail, AnimatedSidebarTrigger 组合 Animated Sidebar，并从该组件的公开入口导入。

```text
AnimatedSidebarProvider
├── AnimatedSidebar
│   ├── AnimatedSidebarHeader
│   ├── AnimatedSidebarContent
│   │   └── AnimatedSidebarMenu
│   ├── AnimatedSidebarFooter
│   └── AnimatedSidebarRail
└── AnimatedSidebarInset
```

<a id="behavior"></a>
### 工作方式

组合嵌套导航，支持展开、仅图标和移动抽屉等呈现方式。

### 生命周期

#### 初始化

通过 side、variant、collapsible、ariaLabel、panelClassName 配置 Animated Sidebar；API 表列出其类型与默认值。

#### 更新

通过default 插槽提供内容，应用副作用由调用方管理。

#### 释放

不再需要时移除整个组合；挂载的监听、观察器和动画由各自的所有者释放。

### 设计原则

#### 公开组合

使用文档列出的 Animated Sidebar 部件，避免导入私有实现文件。

#### 应用所有权

将发出的更新连接到应用状态，网络请求与持久化由应用管理。

#### 可访问内容

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

### Vue 集成

Usage 区域通过 Vue props、事件与插槽组合 AnimatedSidebar, AnimatedSidebarClose, AnimatedSidebarContent, AnimatedSidebarFooter, AnimatedSidebarGroup, AnimatedSidebarGroupContent, AnimatedSidebarGroupLabel, AnimatedSidebarHeader, AnimatedSidebarInset, AnimatedSidebarMenu, AnimatedSidebarMenuButton, AnimatedSidebarMenuItem, AnimatedSidebarMenuSub, AnimatedSidebarMenuSubButton, AnimatedSidebarMenuSubItem, AnimatedSidebarProvider, AnimatedSidebarRail, AnimatedSidebarTrigger，请选择与安装方式一致的 npm 包或复制源码示例。

### 关联组件

- [AI Sidebar](https://orvui.efu.me/components/agents/ai-sidebar): 在可搜索树中组织助手资源，支持选择与移动操作。

### 能力边界

- 负责: Animated Sidebar 负责文档定义的呈现与局部交互。
- 由应用负责: 应用数据、授权、网络副作用与持久化仍由调用方负责。

### 使用建议

- 适用: 用于工作区的分组导航，在多个功能区域之间切换。
- 不适用: 如果文档定义的交互模型不适合任务，应选择其他组合。

<a id="state-and-events"></a>
## 状态与事件

需要由表单、路由或父组件管理时，绑定下列状态并接收对应更新。v-model 是属性与 update 事件的简写；值的类型应与 API 一致。

| 组件 | Vue 绑定 | 类型 | 更新事件 |
| --- | --- | --- | --- |
| `AnimatedSidebarProvider` | `v-model:open` | `boolean` | `update:open` |
| `AnimatedSidebarProvider` | `v-model:openMobile` | `boolean` | `update:openMobile` |
| `AnimatedSidebarProvider` | `v-model:mobileOpen` | `boolean` | `update:mobileOpen` |

可选受控属性未传入时，按组件文档的默认行为工作；不要用固定的 false 或空值代替未传入。异步请求和持久化在应用中处理，再把结果传回组件。

<a id="api-reference"></a>
## API 参考

### AnimatedSidebar

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `side` | `"left" \| "right"` | `"left"` | 否 | — |
| `variant` | `"sidebar" \| "floating" \| "inset"` | `"sidebar"` | 否 | — |
| `collapsible` | `"icon" \| "offcanvas" \| "none"` | `"icon"` | 否 | — |
| `ariaLabel` | `string` | `"Sidebar"` | 否 | — |
| `panelClassName` | `string` | — | 否 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarClose

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarContent

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarFooter

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarGroup

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarGroupContent

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarGroupLabel

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarHeader

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarInset

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarMenu

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarMenuButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `href` | `string` | — | 否 | — |
| `isActive` | `boolean` | `false` | 否 | — |
| `ariaExpanded` | `boolean` | `undefined` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `closeOnSelect` | `boolean` | `undefined` | 否 | — |
| `icon` | `any` | — | 否 | — |
| `badge` | `any` | — | 否 | — |
| `target` | `string` | — | 否 | — |
| `rel` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `select` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `icon` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarMenuItem

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarMenuSub

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `false` | 是 | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarMenuSubButton

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `href` | `string` | — | 否 | — |
| `isActive` | `boolean` | `false` | 否 | — |
| `disabled` | `boolean` | `false` | 否 | — |
| `closeOnSelect` | `boolean` | `true` | 否 | — |
| `icon` | `any` | — | 否 | — |
| `target` | `string` | — | 否 | — |
| `rel` | `string` | — | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `select` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `icon` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarMenuSubItem

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarProvider

#### 属性

| 属性 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | 否 | — |
| `defaultOpen` | `boolean` | `true` | 否 | — |
| `openMobile` | `boolean` | `undefined` | 否 | — |
| `defaultOpenMobile` | `boolean` | `undefined` | 否 | — |
| `mobileOpen` | `boolean` | `undefined` | 否 | — |
| `defaultMobileOpen` | `boolean` | `false` | 否 | — |
| `shortcut` | `boolean` | `true` | 否 | — |
| `expandedWidth` | `number` | `256` | 否 | — |
| `collapsedWidth` | `number` | `68` | 否 | — |

#### 事件

| 事件 | 载荷 | 说明 |
| --- | --- | --- |
| `update:open` | — | — |
| `openChange` | — | — |
| `update:openMobile` | — | — |
| `openMobileChange` | — | — |
| `update:mobileOpen` | — | — |

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | — | `open: open`, `toggle: toggle` | — |

### AnimatedSidebarRail

### AnimatedSidebarTrigger

#### 插槽

| 插槽 | 签名 | 暴露的绑定 | 说明 |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## 关于 Animated Sidebar

<a id="accessibility"></a>
### 无障碍

为交互控件提供明确的无障碍名称。保留文档中的键盘路径、可见焦点与减少动态效果状态；自定义插槽应继续保留所替代部件的语义。

<a id="faq"></a>
### 常见问题

**如何配置 Animated Sidebar？**

通过 side、variant、collapsible、ariaLabel、panelClassName 配置 Animated Sidebar；API 表列出其类型与默认值。

**如何连接到应用状态？**

通过default 插槽提供内容，应用副作用由调用方管理。

**可以在服务端渲染吗？**

可以在 Vue SSR 应用中正常渲染。服务端与客户端的初始 props 应保持一致；浏览器测量与交互资源在挂载后启动。

<a id="related-components"></a>
## 相关组件

- [Image Viewer](https://orvui.efu.me/components/motion/image-viewer): 从缩略图打开画廊图片，在大图中切换、缩放或平移。
- [Combobox](https://orvui.efu.me/components/motion/combobox): 通过输入框筛选分组选项，键盘焦点保持在输入区域。
- [File Tree](https://orvui.efu.me/components/motion/file-tree): 通过展开分支和键盘选择浏览嵌套文件与文件夹。

<a id="licenses"></a>
## 源码

- 注册表详情: https://orvui.efu.me/r/animated-sidebar.json
- 文档: https://orvui.efu.me/components/motion/animated-sidebar
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebar.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarClose.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarContent.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarFooter.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarGroup.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarGroupContent.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarGroupLabel.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarHeader.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarInset.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarMenu.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarMenuButton.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarMenuItem.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarMenuSub.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarMenuSubButton.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarMenuSubItem.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarProvider.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarRail.vue`
- `packages/vue/src/motion/animated-sidebar/src/AnimatedSidebarTrigger.vue`

Copyright (c) 2026 everfu。版权声明及第三方条款见 LICENSE 与 NOTICE。
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
