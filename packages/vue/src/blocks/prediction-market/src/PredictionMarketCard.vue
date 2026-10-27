<script setup lang="ts">
import { computed, useId } from "vue";
import { motion } from "motion-v";
import { Bookmark } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { Tooltip } from "../../../motion/tooltip";
import { RenderNode, useControllable, type Content } from "../../shared";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
import { historyPoints, probability } from "./utils";
import MarketOddsButton from "./MarketOddsButton.vue";
export interface PredictionMarketCardOutcome {
  id: string;
  label: string;
  probability: number;
  icon?: Content;
  color?: string;
}
export interface PredictionMarketCardSelection {
  outcomeId: string;
  side: "yes" | "no";
}
const props = withDefaults(
  defineProps<{
    title: string;
    icon?: Content;
    category?: string;
    volume: string;
    volumeHistory?: number[];
    status?: string;
    live?: boolean;
    outcomes: PredictionMarketCardOutcome[];
    bookmarked?: boolean;
    defaultBookmarked?: boolean;
  }>(),
  {
    bookmarked: undefined,
    volumeHistory: () => [],
    defaultBookmarked: false,
    live: false,
  },
);
const emit = defineEmits<{
  outcomeClick: [selection: PredictionMarketCardSelection];
  "update:bookmarked": [bookmarked: boolean];
  bookmarkChange: [bookmarked: boolean];
}>();
const saved = useControllable(
    () => props.bookmarked,
    props.defaultBookmarked,
    (value) => {
      emit("update:bookmarked", value);
      emit("bookmarkChange", value);
    },
  ),
  reduce = useReducedMotion(),
  titleId = useId(),
  chartId = useId(),
  points = computed(() => historyPoints(props.volumeHistory));
</script>
<template>
  <article
    :aria-labelledby="titleId"
    class="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-3xl bg-card text-foreground"
  >
    <header class="flex shrink-0 items-center gap-3 px-4 py-3">
      <div
        v-if="icon"
        aria-hidden="true"
        class="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background text-foreground"
      >
        <RenderNode :node="icon" />
      </div>
      <div class="min-w-0 flex-1">
        <h3
          :id="titleId"
          class="break-words font-display text-base font-medium leading-snug tracking-tight"
        >
          {{ title }}
        </h3>
        <p
          class="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
        >
          <span
            v-if="status"
            :class="
              cn('inline-flex items-center gap-1.5', live && 'text-rose-500')
            "
            ><span
              v-if="live"
              aria-hidden="true"
              class="size-1.5 rounded-full bg-current"
            />{{ status }}</span
          ><span v-if="status && category" aria-hidden="true">·</span
          ><span v-if="category">{{ category }}</span>
        </p>
      </div>
    </header>
    <div
      class="mx-2 mb-2 flex flex-1 flex-col rounded-3xl bg-background px-4 py-3"
    >
      <div class="flex flex-1 flex-col justify-center gap-3">
        <div
          v-for="(outcome, index) in outcomes"
          :key="outcome.id"
          class="space-y-1"
        >
          <div class="flex min-h-10 items-center gap-2">
            <span
              v-if="outcome.icon"
              aria-hidden="true"
              class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted"
              ><RenderNode :node="outcome.icon" /></span
            ><span class="min-w-0 flex-1 break-words text-sm font-medium">{{
              outcome.label
            }}</span
            ><Tooltip
              content="Potential payout per $1 if this outcome wins, including your stake. Before fees; based on the displayed price."
              class="w-44 whitespace-normal text-center leading-relaxed"
              ><button
                type="button"
                :aria-label="`Potential payout for ${outcome.label}`"
                class="shrink-0 rounded-md py-2 text-sm tabular-nums text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                {{
                  probability(outcome.probability) > 0
                    ? `${(1 / probability(outcome.probability)).toFixed(1)}×`
                    : "—"
                }}
              </button></Tooltip
            ><MarketOddsButton
              :positive="index % 2 === 0"
              :outcome="outcome"
              @click="
                emit('outcomeClick', { outcomeId: outcome.id, side: 'yes' })
              "
            />
          </div>
          <div
            aria-hidden="true"
            class="h-0.5 w-24 overflow-hidden rounded-full"
          >
            <motion.div
              :initial="false"
              :animate="{ scaleX: probability(outcome.probability) }"
              :transition="
                reduce ? { duration: 0 } : { duration: 0.25, ease: EASE_OUT }
              "
              class="h-full origin-left rounded-full bg-emerald-300/70 dark:bg-emerald-400/40"
              :style="
                outcome.color ? { backgroundColor: outcome.color } : undefined
              "
            />
          </div>
        </div>
      </div>
      <footer
        class="mt-2 flex shrink-0 items-center gap-2 text-xs text-muted-foreground"
      >
        <svg
          v-if="points"
          aria-hidden="true"
          viewBox="0 0 48 22"
          class="h-5 w-12 shrink-0 text-emerald-500 dark:text-emerald-400"
          fill="none"
        >
          <defs>
            <linearGradient :id="chartId" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stop-color="currentColor"
                :stop-opacity="0.22"
              />
              <stop offset="100%" stop-color="currentColor" :stop-opacity="0" />
            </linearGradient>
          </defs>
          <polygon
            :points="`2,22 ${points} 46,22`"
            :fill="`url(#${chartId})`"
          />
          <polyline
            :points="points"
            stroke="currentColor"
            :stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          /></svg
        ><span class="shrink-0">{{ volume }} vol.</span
        ><motion.button
          type="button"
          :aria-label="`Bookmark ${title}`"
          :aria-pressed="saved"
          :while-press="reduce ? undefined : { scale: 0.85 }"
          :transition="SPRING_PRESS"
          :class="
            cn(
              'ml-auto flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring',
              saved && 'text-foreground',
            )
          "
          @click="saved = !saved"
          ><motion.span
            :animate="{ scale: saved && !reduce ? [1, 1.2, 1] : 1 }"
            :transition="{ duration: 0.22, ease: EASE_OUT }"
            ><Bookmark
              aria-hidden="true"
              :class="cn('size-4', saved && 'fill-current')" /></motion.span
        ></motion.button>
      </footer>
    </div>
  </article>
</template>
