<script setup lang="ts">
import { ref } from "vue";
import { Bold, Italic, Link2, Strikethrough, Underline } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../index";
const selected = ref(new Set(["bold"]));
const actions = [
  { id: "bold", label: "Bold", shortcut: "⌘B", keys: "Meta+B", icon: Bold },
  {
    id: "italic",
    label: "Italic",
    shortcut: "⌘I",
    keys: "Meta+I",
    icon: Italic,
  },
  {
    id: "underline",
    label: "Underline",
    shortcut: "⌘U",
    keys: "Meta+U",
    icon: Underline,
  },
  {
    id: "strike",
    label: "Strikethrough",
    shortcut: "⌘⇧X",
    keys: "Meta+Shift+X",
    icon: Strikethrough,
  },
];
function toggle(id: string) {
  const next = new Set(selected.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selected.value = next;
}
</script>
<template>
  <TooltipProvider :delay="300" :skip-delay="400"
    ><div class="flex w-full flex-col items-center gap-8 py-6">
      <div
        class="flex items-center gap-1 rounded-xl border border-border bg-card p-1"
      >
        <Tooltip v-for="action in actions" :key="action.id" as-label
          ><TooltipTrigger
            :aria-pressed="selected.has(action.id)"
            :aria-keyshortcuts="action.keys"
            :class="
              cn(
                'grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
                selected.has(action.id) && 'bg-muted text-foreground',
              )
            "
            @click="toggle(action.id)"
            ><component
              :is="action.icon"
              aria-hidden="true"
              class="size-4" /></TooltipTrigger
          ><TooltipContent side="bottom" arrow
            ><span class="flex items-center gap-2"
              >{{ action.label
              }}<span
                aria-hidden="true"
                class="text-[10px] text-muted-foreground"
                >{{ action.shortcut }}</span
              ></span
            ></TooltipContent
          ></Tooltip
        ><span aria-hidden="true" class="mx-1 h-5 w-px bg-border" /><Tooltip
          as-label
          :disabled="selected.size === 0"
          ><TooltipTrigger
            :disabled="selected.size === 0"
            class="grid size-8 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            ><Link2 aria-hidden="true" class="size-4" /></TooltipTrigger
          ><TooltipContent side="bottom" align="end" arrow
            >Insert link</TooltipContent
          ></Tooltip
        >
      </div>
      <p class="max-w-xs text-center text-xs text-muted-foreground">
        The first label waits, the next ones open instantly. Click hides it
        until the pointer leaves.
      </p>
    </div></TooltipProvider
  >
</template>
