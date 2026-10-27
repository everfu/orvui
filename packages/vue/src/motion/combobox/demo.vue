<script setup lang="ts">
import { computed, ref } from "vue";
import { Blocks, Box, Component, Layers3 } from "lucide-vue-next";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxSeparator,
  ComboboxLabel,
  ComboboxItem,
} from "./index";
const selected = ref("studio");
const workspaces = [
  {
    value: "studio",
    label: "Design studio",
    detail: "12 projects",
    group: "Recent",
    icon: Component,
    color: "bg-amber-400/20 text-amber-700 dark:text-amber-300",
  },
  {
    value: "product",
    label: "Product team",
    detail: "8 projects",
    group: "Recent",
    icon: Layers3,
    color: "bg-sky-400/20 text-sky-700 dark:text-sky-300",
  },
  {
    value: "playground",
    label: "Playground",
    detail: "24 experiments",
    group: "Workspaces",
    icon: Blocks,
    color: "bg-emerald-400/20 text-emerald-700 dark:text-emerald-300",
  },
  {
    value: "archive",
    label: "Component archive",
    detail: "41 components",
    group: "Workspaces",
    icon: Box,
    color: "bg-rose-400/20 text-rose-700 dark:text-rose-300",
  },
];
const groups = computed(() =>
  ["Recent", "Workspaces"].map((label) => ({
    label,
    items: workspaces.filter((item) => item.group === label),
  })),
);
</script>
<template>
  <div class="w-full max-w-72">
    <p class="mb-2 text-xs font-medium text-muted-foreground">Workspace</p>
    <Combobox v-model="selected"
      ><ComboboxTrigger class="h-12 rounded-2xl px-2.5"
        ><ComboboxInput
          aria-label="Search workspaces"
          placeholder="Search workspaces…" /></ComboboxTrigger
      ><ComboboxContent class="w-72 rounded-2xl"
        ><ComboboxList aria-label="Workspaces" class="p-2"
          ><ComboboxEmpty>No workspaces found.</ComboboxEmpty
          ><ComboboxGroup v-for="(group, index) in groups" :key="group.label"
            ><ComboboxSeparator v-if="index" /><ComboboxLabel>{{
              group.label
            }}</ComboboxLabel
            ><ComboboxItem
              v-for="workspace in group.items"
              :key="workspace.value"
              :value="workspace.value"
              :text-value="workspace.label"
              :keywords="[workspace.detail, workspace.group]"
              class="py-2"
              ><span class="flex min-w-0 items-center gap-2.5"
                ><span
                  :class="[
                    'grid size-7 shrink-0 place-items-center rounded-lg',
                    workspace.color,
                  ]"
                  ><component :is="workspace.icon" class="size-3.5" /></span
                ><span class="min-w-0"
                  ><span class="block truncate font-medium text-foreground">{{
                    workspace.label
                  }}</span
                  ><span class="block truncate text-xs text-muted-foreground">{{
                    workspace.detail
                  }}</span></span
                ></span
              ></ComboboxItem
            ></ComboboxGroup
          ></ComboboxList
        ></ComboboxContent
      ></Combobox
    >
  </div>
</template>
