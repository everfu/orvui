<script setup lang="ts">
import { cn } from "../../../lib/utils";
import { useMessageAlignment } from "./alignment";
defineOptions({ inheritAttrs: false });
const end = useMessageAlignment();
</script>
<template>
  <div
    data-slot="message-header"
    v-bind="$attrs"
    :class="
      cn(
        'flex items-center gap-1.5 px-1 text-[11px] leading-none text-muted-foreground',
        end ? 'justify-end' : 'justify-start',
        $attrs.class,
      )
    "
  >
    <slot />
  </div>
</template>
