<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { Loader } from "../../../motion/loader";
import { TextScramble } from "../../../motion/text-animation";
import { EASE_OUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { RenderNode, type Content } from "../../shared";
import CascadePhrase from "./CascadePhrase.vue";
import ThinkingShimmer from "./ThinkingShimmer.vue";
export type ReasoningTextVariant = "cascade" | "swap" | "scramble";
const fallback = () => [
  "Thinking",
  "Reading the context",
  "Connecting the details",
  "Forming a response",
];
const props = withDefaults(
  defineProps<{
    phrases?: string[];
    variant?: ReasoningTextVariant;
    interval?: number;
    shimmerDuration?: number;
    indicator?: Content;
  }>(),
  {
    phrases: () => [
      "Thinking",
      "Reading the context",
      "Connecting the details",
      "Forming a response",
    ],
    variant: "cascade",
    interval: 1800,
    shimmerDuration: 2.2,
    indicator: undefined,
  },
);
const reduced = useReducedMotion();
const identity = useId();
const cursor = ref(0);
const choices = computed(() =>
  props.phrases.length ? props.phrases : fallback(),
);
const selected = computed(
  () => choices.value[cursor.value % choices.value.length],
);
const measure = computed(() =>
  choices.value.reduce(
    (previous, candidate) =>
      candidate.length > previous.length ? candidate : previous,
    "",
  ),
);
let active = false;
let clock: ReturnType<typeof setInterval> | undefined;
function cycle() {
  if (clock !== undefined) clearInterval(clock);
  clock = undefined;
  if (!active || choices.value.length < 2) return;
  clock = setInterval(
    () => {
      cursor.value = (cursor.value + 1) % choices.value.length;
    },
    Math.max(600, props.interval),
  );
}
watch([() => props.interval, () => choices.value.length], cycle);
onMounted(() => {
  active = true;
  cycle();
});
onBeforeUnmount(() => {
  active = false;
  if (clock !== undefined) clearInterval(clock);
});
</script>
<template>
  <span
    role="status"
    aria-live="polite"
    :aria-labelledby="identity"
    :class="
      cn(
        'inline-flex items-center gap-2 text-sm font-medium text-muted-foreground',
        $attrs.class,
      )
    "
  >
    <span
      aria-hidden="true"
      class="inline-flex size-3 shrink-0 items-center justify-center"
      ><slot name="indicator"
        ><RenderNode v-if="indicator != null" :node="indicator" /><Loader
          v-else
          variant="ascii-line"
          :size="14"
          :speed="0.8"
          label="Reasoning" /></slot
    ></span>
    <span aria-hidden="true" class="grid overflow-hidden text-left">
      <span class="invisible col-start-1 row-start-1 whitespace-nowrap"
        >{{ measure }}…</span
      >
      <ThinkingShimmer
        v-if="variant === 'cascade' && reduced"
        :duration="shimmerDuration"
        class="col-start-1 row-start-1 inline-block justify-self-start whitespace-pre"
        >{{ selected }}…</ThinkingShimmer
      >
      <AnimatePresence v-else-if="variant === 'cascade'" :initial="false"
        ><CascadePhrase
          :key="selected"
          :phrase="selected"
          :duration="shimmerDuration"
      /></AnimatePresence>
      <TextScramble
        v-else-if="variant === 'scramble'"
        :text="`${selected}…`"
        class="orvui-agent-text-shimmer col-start-1 row-start-1 justify-self-start tabular-nums"
        :style="{
          animation: `orvui-agent-text-shimmer ${shimmerDuration}s linear infinite`,
        }"
      />
      <AnimatePresence v-else :initial="false"
        ><motion.span
          :key="selected"
          class="orvui-agent-text-shimmer col-start-1 row-start-1 inline-block justify-self-start whitespace-nowrap will-change-[opacity,transform]"
          :style="{
            animation: `orvui-agent-text-shimmer ${shimmerDuration}s linear infinite`,
          }"
          :initial="reduced ? { opacity: 0 } : { opacity: 0, y: 3 }"
          :animate="reduced ? { opacity: 1 } : { opacity: 1, y: 0 }"
          :exit="reduced ? { opacity: 0 } : { opacity: 0, y: -3 }"
          :transition="{ duration: reduced ? 0.12 : 0.2, ease: EASE_OUT }"
          >{{ selected }}…</motion.span
        ></AnimatePresence
      > </span
    ><span :id="identity" class="sr-only">{{ selected }}</span>
  </span>
</template>
