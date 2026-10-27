<script setup lang="ts">
import { cn } from "../../../lib/utils";
defineOptions({ inheritAttrs: false });
</script>
<template>
  <div
    data-slot="message-marker"
    v-bind="$attrs"
    :class="
      cn(
        'mx-auto flex w-fit max-w-[88%] items-center gap-1.5 rounded-full bg-muted/70 px-2.5 py-1 text-center text-xs text-muted-foreground',
        $attrs.class,
      )
    "
  >
    <slot />
  </div>
</template>
