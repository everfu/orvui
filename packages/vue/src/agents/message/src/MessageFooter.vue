<script setup lang="ts">
import { cn } from "../../../lib/utils";
import { useMessageAlignment } from "./alignment";
defineOptions({ inheritAttrs: false });
const end = useMessageAlignment();
</script>
<template>
  <div
    data-slot="message-footer"
    v-bind="$attrs"
    :class="
      cn(
        'flex min-h-5 items-center gap-1 px-1 text-[11px] text-muted-foreground',
        end ? 'justify-end' : 'justify-start',
        $attrs.class,
      )
    "
  >
    <slot />
  </div>
</template>
