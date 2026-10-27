<script setup lang="ts">
import { cn } from "../../../lib/utils";
import { useSidebar, useSidebarPanel } from "./context";
const ctx = useSidebar(),
  panel = useSidebarPanel();
const rail =
  "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 outline-none md:block after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-transparent after:transition-colors hover:after:bg-border data-[side=right]:right-0 data-[side=right]:translate-x-1/2 data-[side=left]:left-full";
</script>
<template>
  <button
    type="button"
    :data-side="panel.side.value"
    tabindex="-1"
    aria-label="Toggle sidebar"
    title="Toggle sidebar"
    :class="cn(rail, $attrs.class)"
    @click="!$event.defaultPrevented && ctx.toggle()"
  />
</template>
