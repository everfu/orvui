<script setup lang="ts">
import { cn } from "../../../lib/utils";
const base =
  "flex shrink-0 flex-col gap-2 border-border border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]";
</script>
<template>
  <div data-slot="sidebar-footer" :class="cn(base, $attrs.class)"><slot /></div>
</template>
