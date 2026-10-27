<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { motion } from "motion-v";
import { NumberTicker } from "../../../motion/number";
import { EASE_OUT } from "../../../lib/ease";
import { useFunnelChart, percentage } from "./context";
import { funnelPath } from "./model";
const funnel = useFunnelChart();
const hot = ref<string | null>(null);
const tooltipId = useId();
const palette = ["#8b5cf6", "#7774ef", "#548ee4", "#2ca6bc", "#14b8a6"];
const stages = computed(() => {
  const proportions = funnel.rows.map((row) => row.proportion);
  return funnel.rows.map((row, index) => ({
    ...row,
    fill: row.color ?? palette[index % palette.length],
    path: funnelPath(proportions, index, funnel.direction),
  }));
});
const dimensions = computed(() => ({
  height: `${funnel.direction === "horizontal" ? 300 : Math.max(320, stages.value.length * 72)}px`,
  minWidth: `${funnel.direction === "horizontal" ? stages.value.length * 110 : 240}px`,
}));
const tracks = computed(() =>
  funnel.direction === "horizontal"
    ? { gridTemplateColumns: `repeat(${stages.value.length},1fr)` }
    : { gridTemplateRows: `repeat(${stages.value.length},1fr)` },
);
</script>

<template>
  <p
    v-if="!stages.length"
    class="py-16 text-center text-sm text-muted-foreground"
  >
    No funnel data
  </p>
  <div v-else class="space-y-5">
    <div class="overflow-x-auto">
      <div class="relative" :style="dimensions">
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          class="absolute inset-0 size-full"
        >
          <motion.path
            v-for="stage in stages"
            :key="stage.id"
            :fill="stage.fill"
            :initial="false"
            :animate="{ d: stage.path }"
            :transition="{ duration: funnel.reduce ? 0 : 0.28, ease: EASE_OUT }"
          />
        </svg>
        <ol
          aria-label="Funnel stages"
          class="absolute inset-0 grid"
          :style="tracks"
        >
          <li
            v-for="(stage, index) in stages"
            :key="stage.id"
            class="relative min-h-0 min-w-0"
          >
            <button
              type="button"
              class="flex size-full items-center justify-center outline-none transition-colors hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              :aria-label="`${stage.label}: ${funnel.formatValue(stage.value)} ${funnel.unit}, ${percentage(stage.conversion)} of starting total`"
              :aria-describedby="hot === stage.id ? tooltipId : undefined"
              @focus="hot = stage.id"
              @blur="hot = null"
              @pointerenter="hot = stage.id"
              @pointerleave="hot = null"
              @keydown.esc="hot = null"
            >
              <span
                class="rounded bg-background/85 px-2 py-1 font-mono text-xs font-medium tabular-nums"
              >
                <NumberTicker
                  :value="stage.value"
                  :format="() => funnel.formatValue(stage.value)"
                  :start-on-view="false"
                  :duration="0.35"
                />
              </span>
            </button>
            <div
              v-if="hot === stage.id"
              :id="tooltipId"
              role="tooltip"
              class="pointer-events-none absolute top-1/2 left-1/2 z-10 min-w-40 rounded-xl border border-border bg-popover p-3 text-xs shadow-lg"
            >
              <p class="text-muted-foreground">{{ stage.label }}</p>
              <p class="mt-1 font-mono">
                <NumberTicker
                  :value="stage.value"
                  :format="() => funnel.formatValue(stage.value)"
                  :start-on-view="false"
                  :duration="0.35"
                />
                {{ funnel.unit }}
              </p>
              <template v-if="index > 0">
                <p class="mt-1">
                  {{ percentage(stage.stepConversion) }} from previous stage
                </p>
                <p class="text-muted-foreground">
                  {{ funnel.formatValue(Math.abs(stage.change ?? 0)) }}
                  {{ (stage.change ?? 0) > 0 ? "gained" : "dropped" }}
                </p>
              </template>
              <p class="mt-1 text-muted-foreground">
                {{ percentage(stage.conversion) }} of starting total
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
    <div class="flex flex-wrap justify-center gap-x-6 gap-y-3">
      <span
        v-for="stage in stages"
        :key="stage.id"
        class="inline-flex items-center gap-2 text-xs"
      >
        <span
          aria-hidden="true"
          class="size-2 shrink-0 rounded-full"
          :style="{ backgroundColor: stage.fill }"
        /><span>{{ stage.label }}</span>
        <span class="font-mono text-[10px] text-muted-foreground">{{
          percentage(stage.conversion)
        }}</span>
      </span>
    </div>
  </div>
</template>
