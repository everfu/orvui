<script setup lang="ts">
import { Circle, FileText, Layers, Palette, Rocket } from "lucide-vue-next";
import { SortableList, SortableListGroup, SortableListItem, SortableListHandle, SortableListItemContent, SortableListUndo } from "./index";
const priorities = [
  { id: "research", title: "Collect references", detail: "Find the right direction", icon: FileText, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: "design", title: "Explore the visual system", detail: "Type, color, and composition", icon: Palette, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { id: "build", title: "Build the first prototype", detail: "Make the interaction tangible", icon: Layers, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { id: "ship", title: "Ship something useful", detail: "Polish the details and release", icon: Rocket, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
];
</script>
<template>
  <div class="w-full max-w-md"><div class="mb-5 flex items-end justify-between gap-4 px-1"><div><p class="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">In the studio</p><h3 class="text-lg font-medium tracking-tight">Make room for what matters.</h3></div><span class="shrink-0 text-xs tabular-nums text-muted-foreground">04 tasks</span></div>
    <SortableList :default-items="priorities" label="Studio priorities" :get-item-label="item => item.title"><template #default="{ items }"><SortableListGroup><SortableListItem v-for="(item, index) in items" :key="item.id" :id="item.id"><SortableListHandle /><SortableListItemContent><div class="flex items-center gap-3"><span :class="['flex size-10 shrink-0 items-center justify-center rounded-xl', item.color]"><component :is="item.icon" :size="18" aria-hidden="true" /></span><div class="min-w-0 flex-1"><p class="text-sm font-medium">{{ item.title }}</p><p class="mt-0.5 text-xs text-muted-foreground">{{ item.detail }}</p></div><span class="text-[10px] tabular-nums text-muted-foreground">{{ String(index + 1).padStart(2, '0') }}</span><Circle :size="14" class="text-border" aria-hidden="true" /></div></SortableListItemContent></SortableListItem></SortableListGroup><SortableListUndo /></template></SortableList>
  </div>
</template>
