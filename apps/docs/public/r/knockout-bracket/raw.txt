<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { motion } from "motion-v";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { EASE_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { bracketLayout, bracketLabel } from "./bracket-model";
import MatchCard from "./MatchCard.vue";
import type { Match, Round } from "./types";
const props = withDefaults(
  defineProps<{
    rounds: Round[];
    initialRound?: number;
    thirdPlace?: Match;
    thirdPlaceLabel?: string;
  }>(),
  { initialRound: 1, thirdPlaceLabel: "Third place play-off" },
);
const maxPage = computed(() =>
    Math.max(0, props.rounds.length - Math.min(2, props.rounds.length)),
  ),
  page = ref(Math.min(maxPage.value, Math.max(0, props.initialRound))),
  visibleCols = computed(() => Math.min(3, props.rounds.length)),
  reduce = useReducedMotion();
const transition = computed(() =>
  reduce.value
    ? { duration: 0 }
    : {
        type: "spring" as const,
        stiffness: 260,
        damping: 32,
        mass: 0.9,
        opacity: { duration: 0.28, ease: EASE_OUT },
      },
);
const containerWidth = computed(() =>
  Math.max(0, visibleCols.value * 250 + (visibleCols.value - 1) * 40 + 16),
);
const colX = (index: number) => 8 + (index - page.value) * 290,
  inWindow = (index: number) =>
    index >= page.value && index < page.value + visibleCols.value;
const layout = computed(() =>
  bracketLayout(props.rounds, page.value, visibleCols.value),
);
const pageStatus = computed(() => {
  const names = props.rounds
    .slice(page.value, page.value + visibleCols.value)
    .map((round) => round.name);
  return names.length <= 1
    ? "Showing " + (names[0] ?? "rounds")
    : names.length === 2
      ? `Showing ${names[0]} and ${names[1]}`
      : `Showing ${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
});
watch(maxPage, (max) => {
  page.value = Math.min(max, page.value);
});
</script>
<template>
  <div class="w-full max-w-full overflow-x-auto overscroll-x-contain">
    <section
      aria-label="Tournament bracket"
      class="relative mx-auto"
      :style="{ width: containerWidth + 'px' }"
    >
      <div class="sr-only" aria-live="polite">{{ pageStatus }}</div>
      <div class="relative" :style="{ height: '44px' }">
        <div class="absolute inset-0 overflow-hidden">
          <motion.div
            v-for="(round, index) in rounds"
            :key="round.name"
            :aria-hidden="inWindow(index) ? undefined : true"
            :initial="false"
            :animate="{ x: colX(index), opacity: inWindow(index) ? 1 : 0 }"
            :transition="transition"
            class="absolute left-0 top-0 flex h-full items-center justify-center text-sm font-bold text-foreground"
            :style="{ width: '250px' }"
            >{{ round.name }}</motion.div
          >
        </div>
        <template v-for="direction in [-1, 1] as const" :key="direction"
          ><button
            v-if="direction < 0 ? page > 0 : page < maxPage"
            type="button"
            :aria-label="direction < 0 ? 'Previous round' : 'Next round'"
            :style="direction < 0 ? { left: '8px' } : { right: '8px' }"
            class="group absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full outline-none"
            @click="page = Math.min(maxPage, Math.max(0, page + direction))"
          >
            <span
              class="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors group-hover:bg-foreground/10 group-hover:text-foreground group-focus-visible:ring-2 group-focus-visible:ring-ring"
              ><component
                :is="direction < 0 ? ChevronLeft : ChevronRight"
                class="size-5"
            /></span></button
        ></template>
      </div>
      <motion.div
        class="relative overflow-hidden"
        :initial="false"
        :animate="{ height: layout.height + 'px' }"
        :transition="transition"
        :style="{ width: containerWidth + 'px' }"
        ><motion.div
          v-for="connector in layout.connectors"
          :key="connector.key"
          aria-hidden="true"
          :initial="false"
          :animate="{
            x: connector.x,
            y: connector.y,
            height: connector.height + 'px',
            opacity: connector.visible ? 1 : 0,
          }"
          :transition="
            connector.visible
              ? transition
              : {
                  ...transition,
                  x: { duration: 0 },
                  y: { duration: 0 },
                  height: { duration: 0 },
                }
          "
          class="pointer-events-none absolute left-0 top-0 rounded-r-xl border-y border-r border-border"
          :style="{ width: '20px', willChange: 'transform' }"
          ><span
            class="absolute left-full top-1/2 h-px bg-border"
            :style="{ width: '20px' }"
        /></motion.div>
        <ul
          v-for="(round, level) in rounds"
          :key="round.name"
          :aria-label="round.name"
          :aria-hidden="inWindow(level) ? undefined : true"
          class="m-0 list-none p-0"
        >
          <motion.li
            v-for="(match, index) in round.matches"
            :key="match.id"
            :aria-label="bracketLabel(round.name, match)"
            :initial="false"
            :animate="{
              x: colX(level),
              y: (layout.centers[level]?.[index] ?? 74) - 62,
              opacity: inWindow(level) ? 1 : 0,
            }"
            :transition="transition"
            class="absolute left-0 top-0"
            :style="{ willChange: 'transform' }"
            ><MatchCard :match="match"
          /></motion.li></ul
      ></motion.div>
      <div
        v-if="thirdPlace"
        class="mt-8 border-t border-border pt-6"
        :style="{ paddingLeft: '8px' }"
      >
        <ul :aria-label="thirdPlaceLabel" class="m-0 list-none p-0">
          <li :aria-label="bracketLabel(thirdPlaceLabel, thirdPlace)">
            <p class="mb-2 text-sm leading-5 text-muted-foreground/80">
              {{ thirdPlaceLabel }}
            </p>
            <MatchCard :match="thirdPlace" />
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
