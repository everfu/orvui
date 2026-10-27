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
} from "./index";
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
