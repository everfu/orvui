<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../../lib/utils";
import { useSidebarPanel } from "./context";
const panel = useSidebarPanel(),
  hidden = computed(() => panel.collapsed.value);
</script>
<template>
  <div
    :aria-hidden="hidden"
    data-slot="sidebar-group-label"
    :class="
      cn(
        'mb-1 h-7 overflow-hidden px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-opacity',
        hidden ? 'opacity-0' : 'opacity-100',
        $attrs.class,
      )
    "
  >
    <slot />
  </div>
</template>
