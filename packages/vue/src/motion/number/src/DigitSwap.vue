<script setup lang="ts">
import { computed } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import type { DigitSwapProps } from "./types";
const props = withDefaults(defineProps<DigitSwapProps>(), { direction: "up", duration: 0.18, stagger: 0.006, suffixLength: 0 });
const reduced = useReducedMotion(), text = computed(() => String(props.value));
const glyphs = computed(() => Array.from(text.value, (character, position) => ({ character, position })));
const suffixStart = computed(() => Math.max(0, text.value.length - Math.max(0, props.suffixLength)));
const context = computed(() => ({ direction: props.direction, reduceMotion: reduced.value }));
function hidden(data: unknown, departing: boolean) {
  const state = data as { direction: "up" | "down"; reduceMotion: boolean };
  const sign = state.direction === "up" ? 1 : -1;
  return { opacity: 0, transform: state.reduceMotion ? "none" : `translateY(${45 * sign * (departing ? -1 : 1)}%)` };
}
const poses = { enter: (data: unknown) => hidden(data, false), visible: { opacity: 1, transform: "translateY(0%)" }, exit: (data: unknown) => hidden(data, true) };
function key(character: string, position: number) { return `glyph-${position}-${character}${(props.animationKey ?? props.replayKey) === undefined ? "" : `-${props.animationKey ?? props.replayKey}`}`; }
</script>
<template>
  <span data-slot="digit-swap" :data-direction="direction" :class="['inline-flex items-baseline whitespace-nowrap', className]">
    <span class="sr-only">{{ text }}{{ suffix }}</span>
    <span aria-hidden="true" class="inline-flex items-baseline">
      <template v-for="glyph in glyphs" :key="glyph.position">
        <span v-if="glyph.character === ' '" class="inline-block w-[0.7ch]" />
        <span v-else data-slot="digit-swap-glyph" class="relative inline-block h-[1.1em] shrink-0 leading-[1.1em] [clip-path:inset(0)]" :class="/\d/.test(glyph.character) ? 'w-[1ch] text-center' : undefined">
          <span class="invisible">{{ glyph.character }}</span>
          <AnimatePresence :initial="false" :custom="context">
            <motion.span :key="key(glyph.character, glyph.position)" :custom="context" :variants="poses" initial="enter" animate="visible" exit="exit"
              :transition="{ duration: reduced ? Math.min(duration, 0.12) : duration, delay: reduced ? 0 : glyph.position * stagger, ease: EASE_OUT }"
              :class="cn('absolute inset-0 flex items-center justify-center leading-none', glyphClassName, glyph.position >= suffixStart ? suffixClassName : undefined)">{{ glyph.character }}</motion.span>
          </AnimatePresence>
        </span>
      </template>
      <span v-if="suffix">{{ suffix }}</span>
    </span>
  </span>
</template>
