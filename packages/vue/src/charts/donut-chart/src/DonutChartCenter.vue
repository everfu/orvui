<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { DigitSwap } from "../../../motion/number";
import { EASE_OUT } from "../../../lib/ease";
import { useDonutChart } from "./context";
withDefaults(defineProps<{ totalLabel?: string }>(), { totalLabel: "Total" });
const chart = useDonutChart();
const segment = computed(
  () => chart.placed.find((item) => item.id === chart.active) ?? null,
);
const value = computed(() =>
  segment.value ? segment.value.value : chart.total,
);
const direction = ref<"up" | "down">("up");
watch(
  value,
  (next, previous) => {
    direction.value = next > previous ? "up" : "down";
  },
  { flush: "sync" },
);
const labelKey = computed(() => segment.value?.id ?? "total");
const slideIn = computed(() => ({
  opacity: 0,
  y: chart.reduce ? "0%" : "100%",
}));
const slideOut = computed(() => ({
  opacity: 0,
  y: chart.reduce ? "0%" : "-100%",
}));
</script>

<template>
  <div aria-live="polite" class="relative max-w-[56%]">
    <slot :segment="segment" :total="chart.total">
      <p class="text-2xl font-medium tracking-tight tabular-nums">
        <DigitSwap :value="chart.formatValue(value)" :direction="direction" />
      </p>
      <div class="relative mt-1 h-4 overflow-hidden">
        <AnimatePresence :initial="false" mode="popLayout">
          <motion.p
            :key="labelKey"
            :initial="slideIn"
            :animate="{ opacity: 1, y: '0%' }"
            :exit="slideOut"
            :transition="{
              duration: chart.reduce ? 0.12 : 0.22,
              ease: EASE_OUT,
            }"
            class="flex items-center justify-center gap-1.5 whitespace-nowrap text-xs leading-4 text-muted-foreground"
          >
            <template v-if="segment">
              <span
                aria-hidden="true"
                class="size-2 shrink-0 rounded-full"
                :style="{ backgroundColor: segment.color }"
              />
              <span class="truncate"
                >{{ segment.name }} ·
                {{ (segment.share * 100).toFixed(1) }}%</span
              >
            </template>
            <template v-else>{{ totalLabel }}</template>
          </motion.p>
        </AnimatePresence>
      </div>
    </slot>
  </div>
</template>
