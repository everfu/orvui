<script setup lang="ts">
import { computed, inject } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-vue-next";
import { EASE_OUT } from "../../../lib/ease";
import type { AlertContext } from "./context";
const state = inject<AlertContext>("orvui-alert");
if (!state) throw new Error("AlertIcon must be inside Alert");
const icon = computed(() => ({ default: Info, info: Info, success: CheckCircle2, warning: TriangleAlert, destructive: AlertCircle })[state.variant.value]);
</script>
<template>
  <span aria-hidden="true" data-slot="alert-icon" class="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center">
    <AnimatePresence :initial="false" mode="popLayout">
      <motion.span :key="state.variant.value"
        :initial="{ opacity: 0, transform: state.reduce.value ? 'translateY(0px) scale(1)' : 'translateY(4px) scale(0.9)' }"
        :animate="{ opacity: 1, transform: 'translateY(0px) scale(1)' }"
        :exit="{ opacity: 0, transform: state.reduce.value ? 'translateY(0px) scale(1)' : 'translateY(-4px) scale(0.9)', transition: { duration: 0.1, ease: EASE_OUT } }"
        :transition="{ duration: 0.18, ease: EASE_OUT }" class="inline-flex [&>svg]:size-4"><slot><component :is="icon" /></slot></motion.span>
    </AnimatePresence>
  </span>
</template>
