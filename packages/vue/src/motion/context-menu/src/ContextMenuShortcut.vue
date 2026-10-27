<script setup lang="ts">
import { cn } from "../../../lib/utils";
defineSlots<{ default(): unknown }>();
</script>
<template>
  <span
    aria-hidden="true"
    :class="
      cn(
        'ml-auto pl-4 text-[10px] font-medium tracking-wide text-muted-foreground',
        $attrs.class,
      )
    "
    ><slot
  /></span>
</template>
