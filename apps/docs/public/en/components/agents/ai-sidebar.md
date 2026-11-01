---
title: "AI Sidebar"
description: "Organize assistant resources in a searchable tree with selection and move operations."
category: "AI Agents"
publishedAt: "2026-10-26"
updatedAt: "2026-10-26"
documentation: "https://orvui.efu.me/en/components/agents/ai-sidebar"
markdown: "https://orvui.efu.me/en/components/agents/ai-sidebar.md"
license: "MIT"
productVersion: "0.1.1"
---

<a id="overview"></a>
# AI Sidebar

> Organize assistant resources in a searchable tree with selection and move operations.

<a id="when-to-use"></a>

## When to use it

- Use AI Sidebar when the interface needs this behavior: organize assistant resources in a searchable tree with selection and move operations.

<a id="install"></a>
## Install

### AI Sidebar — Registry source

```bash
pnpm dlx shadcn-vue@2.8.2 add https://orvui.efu.me/r/ai-sidebar.json https://orvui.efu.me/r/animated-sidebar.json
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
### AI Sidebar

**Registry source**

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

**Package**

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

## Component Guide

<a id="composition"></a>
### Composition

Compose AI Sidebar with its public parts: AISidebar. Import these names from the component barrel.

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

<a id="behavior"></a>
### How it works

Organize assistant resources in a searchable tree with selection and move operations.

### Lifecycle

#### Initialize

Configure AI Sidebar through items, defaultItems, activeId, defaultActiveId, defaultExpandedIds, ariaLabel, className, onMove, onRename, renderIcon, renderMenu. The API table describes their types and defaults.

#### Update

Observe update:items, itemsChange, update:activeId, activeChange, moveError, renameError to connect the component to application state.

#### Dispose

Remove the composition when it is no longer needed. Mounted listeners, observers and animations are released with their owner.

### Principles

#### Public composition

Use the documented AI Sidebar parts instead of importing private implementation files.

#### Application ownership

Connect emitted updates to application state and keep network calls or persistence in the application.

#### Accessible content

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

### Vue integration

The Usage section composes AISidebar through Vue props, events and slots. Use the package or registry example matching your installation method.

### Connections

- [Message Scroller](https://orvui.efu.me/en/components/agents/message-scroller): Follow appended messages while letting readers leave and return to the latest content.
- [Prompt Input](https://orvui.efu.me/en/components/agents/prompt-input): Compose and submit a prompt with a growing textarea, attachments and keyboard handling.

### Contract

- Owns: AI Sidebar owns its documented presentation and local interactions.
- Leaves to the application: Application data, authorization, network effects and persistence stay with the caller.

### Usage guidance

- Use when: Use AI Sidebar when the interface needs this behavior: organize assistant resources in a searchable tree with selection and move operations.
- Avoid when: Choose another composition if its documented interaction model does not fit the task.

<a id="state-and-events"></a>
## State and events

Bind the states below when a form, router or parent owns them. v-model is shorthand for a prop and its update event; keep the value type consistent with the API.

| Component | Vue binding | Type | Update event |
| --- | --- | --- | --- |
| `AISidebar` | `v-model:items` | `SidebarResource[]` | `update:items` |
| `AISidebar` | `v-model:activeId` | `null \| string` | `update:activeId` |

Omit optional controlled props to use their documented default behavior; a fixed false or empty value does not mean omitted. Handle async requests and persistence in the application, then pass the result back.

<a id="api-reference"></a>
## API Reference

### AISidebar

#### Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `SidebarResource[]` | `props.defaultItems` | No | — |
| `defaultItems` | `SidebarResource[]` | `() => []` | No | — |
| `activeId` | `null \| string` | `props.defaultActiveId` | No | — |
| `defaultActiveId` | `null \| string` | `null` | No | — |
| `defaultExpandedIds` | `string[]` | `() => []` | No | — |
| `ariaLabel` | `string` | `"Resources"` | No | — |
| `className` | `string` | — | No | — |
| `onMove` | `(move: SidebarResourceMove) => void \| Promise<void>` | — | No | — |
| `onRename` | `(item: SidebarResource, label: string) => void \| Promise<void>` | — | No | — |
| `renderIcon` | `(item: SidebarResource) => VNodeChild` | — | No | — |
| `renderMenu` | `(item: SidebarResource, controls: SidebarResourceMenuControls) => VNodeChild` | — | No | — |

#### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:items` | `[items: SidebarResource[]]` | — |
| `itemsChange` | `[items: SidebarResource[]]` | — |
| `update:activeId` | `[id: string \| null]` | — |
| `activeChange` | `[id: string]` | — |
| `moveError` | `[error: unknown, move: SidebarResourceMove]` | — |
| `renameError` | `[error: unknown, item: SidebarResource]` | — |

#### Slots

| Slot | Signature | Exposed bindings | Description |
| --- | --- | --- | --- |
| `icon` | — | `v-bind: scope` | — |
| `menu` | — | `v-bind: scope` | — |

<a id="about"></a>
## About AI Sidebar

<a id="accessibility"></a>
### Accessibility

Keep a meaningful accessible name on interactive controls. Preserve the documented keyboard path, visible focus and reduced-motion presentation; custom slots must retain the semantics of the parts they replace.

<a id="faq"></a>
### FAQ

**How do I configure AI Sidebar?**

Configure AI Sidebar through items, defaultItems, activeId, defaultActiveId, defaultExpandedIds, ariaLabel, className, onMove, onRename, renderIcon, renderMenu. The API table describes their types and defaults.

**How does it connect to application state?**

Observe update:items, itemsChange, update:activeId, activeChange, moveError, renameError to connect the component to application state.

**Can I render it on the server?**

Render the component normally in a Vue SSR application. Keep initial props the same on the server and client; browser measurements and interactive resources start after mounting.

<a id="related-components"></a>
## Related components

- [Chat App](https://orvui.efu.me/en/components/agents/chat-app): Compose navigation, conversation content and a prompt area into an assistant workspace.
- [Citations](https://orvui.efu.me/en/components/agents/citations): Connect inline reference markers to inspectable source entries and links.
- [Message Scroller](https://orvui.efu.me/en/components/agents/message-scroller): Follow appended messages while letting readers leave and return to the latest content.

<a id="licenses"></a>
## Source

- Registry detail: https://orvui.efu.me/r/ai-sidebar.json
- Documentation: https://orvui.efu.me/en/components/agents/ai-sidebar
- `packages/vue/src/agents/ai-sidebar/src/AISidebar.vue`

Copyright (c) 2026 everfu. Copyright notices and third-party terms are provided in LICENSE and NOTICE.
- [LICENSE](https://orvui.efu.me/licenses/MIT.txt)
- [NOTICE](https://orvui.efu.me/licenses/orvui-NOTICE.txt)
