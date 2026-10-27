<script setup lang="ts">
import { cn } from "../../../lib/utils";
const base = "flex shrink-0 flex-col gap-2 p-3";
</script>
<template>
  <div data-slot="sidebar-header" :class="cn(base, $attrs.class)"><slot /></div>
</template>
