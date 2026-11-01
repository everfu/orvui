---
title: "Animated Sidebar"
description: "Compose nested navigation with expanded, icon-only and mobile drawer presentations."
category: "Components"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/motion/animated-sidebar"
markdown: "https://orvui.efu.me/en/components/motion/animated-sidebar.md"
license: "MIT"
productVersion: "0.1.0"
---

<a id="overview"></a>
# Animated Sidebar

> Compose nested navigation with expanded, icon-only and mobile drawer presentations.

<a id="when-to-use"></a>

## When to use it

- Use for grouped application navigation where readers move between several areas of a workspace.

<a id="install"></a>
## Install

### Animated Sidebar — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/animated-sidebar.json
```

Import `src/components/orvui/styles.css` once in your application's stylesheet entry after a registry installation.

### Component package

Install the published component package from npm in your application directory.

```bash
pnpm add @orvui/vue
```

```bash
pnpm add lucide-vue-next@^0.468.0
```

```typescript
import '@orvui/vue/style.css';
```

## Dependencies

- `clsx@^2.1.1`
- `lucide-vue-next@^0.468.0`
- `motion-v@^1.10.0`
- `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`

<a id="examples"></a>
## Usage

<a id="default"></a>
### Animated Sidebar

**Registry source**

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

**Package**

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

## Component Guide

<a id="composition"></a>
### Composition

Compose Animated Sidebar with its public parts: AnimatedSidebar, AnimatedSidebarClose, AnimatedSidebarContent, AnimatedSidebarFooter, AnimatedSidebarGroup, AnimatedSidebarGroupContent, AnimatedSidebarGroupLabel, AnimatedSidebarHeader, AnimatedSidebarInset, AnimatedSidebarMenu, AnimatedSidebarMenuButton, AnimatedSidebarMenuItem, AnimatedSidebarMenuSub, AnimatedSidebarMenuSubButton, AnimatedSidebarMenuSubItem, AnimatedSidebarProvider, AnimatedSidebarRail, AnimatedSidebarTrigger. Import these names from the component barrel.

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
### How it works

Compose nested navigation with expanded, icon-only and mobile drawer presentations.

### Lifecycle

#### Initialize

Configure Animated Sidebar through side, variant, collapsible, ariaLabel, panelClassName. The API table describes their types and defaults.

#### Update

Provide content through default; application effects remain with the consumer.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented Animated Sidebar parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes AnimatedSidebar, AnimatedSidebarClose, AnimatedSidebarContent, AnimatedSidebarFooter, AnimatedSidebarGroup, AnimatedSidebarGroupContent, AnimatedSidebarGroupLabel, AnimatedSidebarHeader, AnimatedSidebarInset, AnimatedSidebarMenu, AnimatedSidebarMenuButton, AnimatedSidebarMenuItem, AnimatedSidebarMenuSub, AnimatedSidebarMenuSubButton, AnimatedSidebarMenuSubItem, AnimatedSidebarProvider, AnimatedSidebarRail, AnimatedSidebarTrigger through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [AI Sidebar](https://orvui.efu.me/en/components/agents/ai-sidebar): Organize assistant resources in a searchable tree with selection and move operations.

### Contract

- Owns: Animated Sidebar owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use for grouped application navigation where readers move between several areas of a workspace.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `AnimatedSidebarProvider` | `v-model:open` | `boolean` | `update:open` |
| `AnimatedSidebarProvider` | `v-model:openMobile` | `boolean` | `update:openMobile` |
| `AnimatedSidebarProvider` | `v-model:mobileOpen` | `boolean` | `update:mobileOpen` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### AnimatedSidebar

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `side` | `"left" \| "right"` | `"left"` | No | — |
| `variant` | `"sidebar" \| "floating" \| "inset"` | `"sidebar"` | No | — |
| `collapsible` | `"icon" \| "offcanvas" \| "none"` | `"icon"` | No | — |
| `ariaLabel` | `string` | `"Sidebar"` | No | — |
| `panelClassName` | `string` | — | No | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarClose

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarContent

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarFooter

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarGroup

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarGroupContent

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarGroupLabel

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarHeader

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarInset

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarMenu

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarMenuButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `href` | `string` | — | No | — |
| `isActive` | `boolean` | `false` | No | — |
| `ariaExpanded` | `boolean` | `undefined` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `closeOnSelect` | `boolean` | `undefined` | No | — |
| `icon` | `any` | — | No | — |
| `badge` | `any` | — | No | — |
| `target` | `string` | — | No | — |
| `rel` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `select` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `icon` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarMenuItem

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarMenuSub

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `false` | Yes | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarMenuSubButton

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `href` | `string` | — | No | — |
| `isActive` | `boolean` | `false` | No | — |
| `disabled` | `boolean` | `false` | No | — |
| `closeOnSelect` | `boolean` | `true` | No | — |
| `icon` | `any` | — | No | — |
| `target` | `string` | — | No | — |
| `rel` | `string` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `select` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `icon` | `() => VNodeChild` | — | — |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarMenuSubItem

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

### AnimatedSidebarProvider

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | No | — |
| `defaultOpen` | `boolean` | `true` | No | — |
| `openMobile` | `boolean` | `undefined` | No | — |
| `defaultOpenMobile` | `boolean` | `undefined` | No | — |
| `mobileOpen` | `boolean` | `undefined` | No | — |
| `defaultMobileOpen` | `boolean` | `false` | No | — |
| `shortcut` | `boolean` | `true` | No | — |
| `expandedWidth` | `number` | `256` | No | — |
| `collapsedWidth` | `number` | `68` | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | — | — |
| `openChange` | — | — |
| `update:openMobile` | — | — |
| `openMobileChange` | — | — |
| `update:mobileOpen` | — | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | — | `open: open`, `toggle: toggle` | — |

### AnimatedSidebarRail

### AnimatedSidebarTrigger

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `default` | `() => VNodeChild` | — | — |

<a id="about"></a>
## About Animated Sidebar

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure Animated Sidebar?**

Configure Animated Sidebar through side, variant, collapsible, ariaLabel, panelClassName. The API table describes their types and defaults.

**How does it connect to application state?**

Provide content through default; application effects remain with the consumer.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Image Viewer](https://orvui.efu.me/en/components/motion/image-viewer): Open a gallery image from its thumbnail and navigate, zoom or pan the enlarged view.
- [Combobox](https://orvui.efu.me/en/components/motion/combobox): Filter a grouped option list from an input while keeping keyboard focus in the field.
- [File Tree](https://orvui.efu.me/en/components/motion/file-tree): Explore nested files and folders with expandable branches and keyboard selection.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/animated-sidebar.json
- Documentation: https://orvui.efu.me/en/components/motion/animated-sidebar
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

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
