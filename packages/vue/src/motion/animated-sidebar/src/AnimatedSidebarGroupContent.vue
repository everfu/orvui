<script setup lang="ts">
import { cn } from "../../../lib/utils";
const base = "w-full min-w-0";
</script>
<template>
  <div data-slot="sidebar-group-content" :class="cn(base, $attrs.class)">
    <slot />
  </div>
</template>
