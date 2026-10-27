<script setup lang="ts">
import { inject } from "vue";
import { motion } from "motion-v";
import { X } from "lucide-vue-next";
import { SPRING_PRESS } from "../../../lib/ease";
import type { AlertContext } from "./context";
const state = inject<AlertContext>("orvui-alert");
if (!state) throw new Error("AlertClose must be inside Alert");
function dismiss(event: MouseEvent) { if (!event.defaultPrevented) state!.dismiss(); }
</script>
<template>
  <motion.button type="button" aria-label="Dismiss alert" :tabindex="0" data-slot="alert-close"
    :layout="state.reduce.value ? false : 'position'" :transition="SPRING_PRESS"
    :while-press="state.reduce.value ? undefined : { scale: 0.94 }" @click="dismiss"
    class="-m-1.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
    <slot><X aria-hidden="true" class="size-4" /></slot>
  </motion.button>
</template>
