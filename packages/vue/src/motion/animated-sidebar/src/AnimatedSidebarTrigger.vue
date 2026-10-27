<script setup lang="ts">
import { computed } from "vue";
import { PanelLeft } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { useSidebar } from "./context";
const ctx = useSidebar(),
  trigger = ctx.triggerRef,
  expanded = computed(() =>
    ctx.mobile.value ? ctx.mobileOpen.value : ctx.open.value,
  );
function click(event: MouseEvent) {
  if (!event.defaultPrevented) ctx.toggle();
}
</script>
<template>
  <button
    ref="trigger"
    type="button"
    aria-label="Toggle sidebar"
    :aria-expanded="expanded"
    data-slot="sidebar-trigger"
    :data-state="expanded ? 'expanded' : 'collapsed'"
    :class="
      cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        $attrs.class,
      )
    "
    @click="click"
  >
    <slot><PanelLeft class="size-4" /></slot>
  </button>
</template>
