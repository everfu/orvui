<script setup lang="ts">
import { cn } from "../../../lib/utils";
defineProps<{ inset?: boolean }>();
defineSlots<{ default(): unknown }>();
</script>
<template>
  <div
    :class="
      cn(
        'px-2.5 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground',
        inset && 'pl-8',
        $attrs.class,
      )
    "
  >
    <slot />
  </div>
</template>
