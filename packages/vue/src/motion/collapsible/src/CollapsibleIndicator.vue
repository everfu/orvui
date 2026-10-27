<script setup lang="ts">
import { inject } from "vue";
import { motion } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import { SPRING_LAYOUT } from "../../../lib/ease";
import type { CollapsibleContext } from "./context";
const state = inject<CollapsibleContext>("orvui-collapsible");
if (!state) throw new Error("CollapsibleIndicator must be inside Collapsible");
</script>
<template>
  <motion.span aria-hidden="true" data-slot="collapsible-indicator" :initial="false"
    :animate="{ transform: `rotate(${state.open.value ? 180 : 0}deg)` }" :transition="state.reduce.value ? { duration: 0 } : SPRING_LAYOUT"
    class="ml-auto inline-flex shrink-0 items-center justify-center text-muted-foreground"><slot><ChevronDown class="size-4" /></slot></motion.span>
</template>
