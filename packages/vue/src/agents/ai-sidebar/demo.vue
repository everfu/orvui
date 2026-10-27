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
} from "./index";
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
} from "../../motion/animated-sidebar";
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
