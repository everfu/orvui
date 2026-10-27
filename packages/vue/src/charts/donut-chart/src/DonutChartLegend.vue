<script setup lang="ts">
import { motion } from "motion-v";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { moveFocus } from "../../shared";
import { useDonutChart } from "./context";
const chart = useDonutChart();
function hover(id: string | null) {
  if (chart.canHover) chart.setActive(id);
}
</script>

<template>
  <ul data-chart-keyboard class="space-y-1">
    <li v-for="(segment, index) in chart.placed" :key="segment.id">
      <button
        type="button"
        data-chart-item
        :aria-pressed="chart.selectedId === segment.id"
        class="w-full rounded-xl px-3 py-2 text-left outline-none transition-colors duration-150 aria-pressed:ring-1 aria-pressed:ring-inset aria-pressed:ring-border focus-visible:ring-2 focus-visible:ring-ring aria-pressed:focus-visible:ring-2 aria-pressed:focus-visible:ring-ring"
        :class="chart.active === segment.id ? 'bg-muted' : 'hover:bg-muted/60'"
        @focus="chart.setActive(segment.id)"
        @blur="chart.setActive(null)"
        @pointerenter="hover(segment.id)"
        @pointerleave="hover(null)"
        @click="chart.select(segment.id)"
        @keydown="moveFocus($event, index, chart.placed.length)"
      >
        <span class="flex items-center gap-3">
          <span
            aria-hidden="true"
            class="size-2.5 shrink-0 rounded-full"
            :style="{ backgroundColor: segment.color }"
          />
          <span class="min-w-0 flex-1 truncate text-sm font-medium">{{
            segment.name
          }}</span>
          <span class="shrink-0 text-right text-sm tabular-nums">
            <slot name="value" :segment="segment">
              <span class="font-medium"
                >{{ (segment.share * 100).toFixed(1) }}%</span
              >
              <span class="ml-2 text-muted-foreground">{{
                chart.formatValue(segment.value)
              }}</span>
            </slot>
          </span>
        </span>
        <span
          v-if="$slots.detail"
          class="mt-0.5 block pl-5.5 text-xs text-muted-foreground"
          ><slot name="detail" :segment="segment"
        /></span>
        <span
          aria-hidden="true"
          class="mt-2 ml-5.5 block h-1 overflow-hidden rounded-full bg-muted"
        >
          <motion.span
            class="block h-full origin-left rounded-full"
            :style="{ backgroundColor: segment.color }"
            :initial="chart.reduce ? false : { scaleX: 0 }"
            :animate="{ scaleX: segment.share }"
            :transition="
              chart.reduce
                ? { duration: 0 }
                : { ...SPRING_LAYOUT, delay: 0.2 + index * 0.06 }
            "
          />
        </span>
      </button>
    </li>
  </ul>
</template>
