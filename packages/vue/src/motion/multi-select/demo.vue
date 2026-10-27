<script setup lang="ts">
import { ref } from "vue";
import { Circle } from "lucide-vue-next";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectInput,
  MultiSelectContent,
  MultiSelectList,
  MultiSelectGroup,
  MultiSelectLabel,
  MultiSelectItem,
  MultiSelectEmpty,
} from "./index";
const selected = ref(["design", "engineering"]);
const groups = [
  {
    label: "Product teams",
    items: [
      {
        value: "design",
        label: "Design",
        color: "fill-rose-500 text-rose-500",
      },
      {
        value: "engineering",
        label: "Engineering",
        color: "fill-sky-500 text-sky-500",
      },
      {
        value: "product",
        label: "Product",
        color: "fill-amber-500 text-amber-500",
      },
      {
        value: "research",
        label: "Research",
        color: "fill-violet-500 text-violet-500",
      },
    ],
  },
  {
    label: "Business teams",
    items: [
      {
        value: "marketing",
        label: "Marketing",
        color: "fill-emerald-500 text-emerald-500",
      },
      {
        value: "operations",
        label: "Operations",
        color: "fill-slate-500 text-slate-500",
      },
    ],
  },
];
</script>
<template>
  <div class="flex min-h-[420px] w-full items-start justify-center px-4 pt-24">
    <div class="w-full max-w-sm">
      <MultiSelect v-model="selected"
        ><MultiSelectTrigger
          ><MultiSelectValue placeholder="Choose teams" /><MultiSelectInput
            aria-label="Search teams" /></MultiSelectTrigger
        ><MultiSelectContent
          ><MultiSelectList aria-label="Teams"
            ><MultiSelectGroup v-for="group in groups" :key="group.label"
              ><MultiSelectLabel>{{ group.label }}</MultiSelectLabel
              ><MultiSelectItem
                v-for="team in group.items"
                :key="team.value"
                :value="team.value"
                :text-value="team.label"
                ><span class="flex items-center gap-2.5"
                  ><Circle
                    aria-hidden="true"
                    :class="['size-2.5', team.color]"
                  />{{ team.label }}</span
                ></MultiSelectItem
              ></MultiSelectGroup
            ><MultiSelectEmpty
              >No teams found.</MultiSelectEmpty
            ></MultiSelectList
          ></MultiSelectContent
        ></MultiSelect
      >
    </div>
  </div>
</template>
