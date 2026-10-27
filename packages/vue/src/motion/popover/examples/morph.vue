<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, Copy, Pencil, Share2, Trash2 } from "lucide-vue-next";
import {
  MorphPopover,
  MorphPopoverTrigger,
  MorphPopoverContent,
} from "../index";
const expanded = ref(false);
const actions = [
  ["Edit", Pencil],
  ["Duplicate", Copy],
  ["Share", Share2],
  ["Delete", Trash2],
].map(([label, icon]) => ({ label: label as string, icon }));
function choose() {
  expanded.value = false;
}
</script>
<template>
  <MorphPopover v-model:open="expanded"
    ><MorphPopoverTrigger
      ><button
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition-colors hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
      >
        Options<ChevronDown
          class="h-4 w-4 text-muted-foreground"
        /></button></MorphPopoverTrigger
    ><MorphPopoverContent align="start" class="w-48 p-1.5"
      ><button
        v-for="action in actions"
        :key="action.label"
        type="button"
        @click="choose"
        class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
      >
        <component :is="action.icon" class="h-4 w-4 text-muted-foreground" />{{
          action.label
        }}
      </button></MorphPopoverContent
    ></MorphPopover
  >
</template>
