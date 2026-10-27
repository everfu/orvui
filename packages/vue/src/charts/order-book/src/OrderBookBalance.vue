<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { SPRING_PANEL } from "../../../lib/ease";
import { useOrderBook } from "./context";
const book = useOrderBook();
const total = computed(() => book.bidTotal + book.askTotal);
const ratio = computed(() => (total.value ? book.bidTotal / total.value : 0.5));
</script>
<template>
  <div class="space-y-2 border-t border-border px-4 pt-3 pb-3">
    <div class="flex justify-between text-[10px]">
      <span class="text-emerald-700 dark:text-emerald-400"
        >Bids {{ total ? (ratio * 100).toFixed(1) + "%" : "—" }}</span
      ><span class="text-muted-foreground">Visible depth</span
      ><span class="text-rose-600 dark:text-rose-400"
        >Asks {{ total ? ((1 - ratio) * 100).toFixed(1) + "%" : "—" }}</span
      >
    </div>
    <div
      aria-hidden="true"
      class="relative h-1 overflow-hidden rounded-full bg-rose-500/25"
    >
      <motion.div
        :initial="false"
        :animate="{ scaleX: ratio }"
        :transition="book.reduce ? { duration: 0 } : SPRING_PANEL"
        class="absolute inset-0 origin-left bg-emerald-500/60"
      />
    </div>
  </div>
</template>
