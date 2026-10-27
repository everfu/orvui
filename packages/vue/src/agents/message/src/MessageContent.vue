<script setup lang="ts">
import { cn } from "../../../lib/utils";
import { useMessageAlignment } from "./alignment";
defineOptions({ inheritAttrs: false });
const end = useMessageAlignment();
</script>
<template>
  <div
    data-slot="message-content"
    v-bind="$attrs"
    :class="
      cn(
        'flex min-w-0 flex-1 flex-col gap-1.5',
        end ? 'items-end' : 'items-start',
        $attrs.class,
      )
    "
  >
    <slot />
  </div>
</template>
