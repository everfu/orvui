<script setup lang="ts">
import { cn } from "../../../lib/utils";
const base =
  "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden overscroll-contain px-2 py-2";
</script>
<template>
  <div data-slot="sidebar-content" :class="cn(base, $attrs.class)">
    <slot />
  </div>
</template>
