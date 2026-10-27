<script setup lang="ts">
import { X } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { useSidebar } from "./context";
const ctx = useSidebar();
function close(event: MouseEvent) {
  if (!event.defaultPrevented)
    (ctx.mobile.value ? ctx.setOpenMobile : ctx.setOpen)(false);
}
</script>
<template>
  <button
    type="button"
    aria-label="Close sidebar"
    :class="
      cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring',
        $attrs.class,
      )
    "
    @click="close"
  >
    <slot><X class="size-4" /></slot>
  </button>
</template>
