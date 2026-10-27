<script setup lang="ts">
import { cn } from "../../../lib/utils";
const base = "flex w-full min-w-0 flex-col px-1 py-1.5";
</script>
<template>
  <div data-slot="sidebar-group" :class="cn(base, $attrs.class)"><slot /></div>
</template>
