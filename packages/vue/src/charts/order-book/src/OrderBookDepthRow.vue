<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from "vue";
import { animate, motion, motionValue } from "motion-v";
import { EASE_OUT, SPRING_PANEL } from "../../../lib/ease";
import { useOrderBook } from "./context";
import type { DepthLevel } from "./model";
const props = defineProps<{
  row: DepthLevel;
  side: "bid" | "ask";
  inRange?: boolean;
  fraction: number;
  entranceIndex: number;
}>();
const book = useOrderBook();
const highlight = motionValue(0);
let entered = false,
  revision = 0;
let feedback: ReturnType<typeof animate> | undefined;
let fading: ReturnType<typeof animate> | undefined;
onMounted(() => {
  entered = true;
});
watch(
  () => [props.row.size, book.reduce] as const,
  ([size, reduced], [previous]) => {
    const current = ++revision;
    feedback?.stop();
    fading?.stop();
    if (size === previous || reduced) {
      highlight.set(0);
      return;
    }
    feedback = animate(highlight, 0.1, {
      duration: 0.08,
      ease: EASE_OUT,
      onComplete() {
        if (current === revision)
          fading = animate(highlight, 0, { duration: 0.2, ease: EASE_OUT });
      },
    });
  },
);
onBeforeUnmount(() => {
  revision++;
  feedback?.stop();
  fading?.stop();
  highlight.destroy();
});
function inspect() {
  book.setActiveLevel({ side: props.side, price: props.row.price });
}
</script>
<template>
  <motion.tr
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :transition="{
      duration: 0.18,
      ease: EASE_OUT,
      delay: book.reduce || entered ? 0 : Math.min(entranceIndex, 8) * 0.025,
    }"
    class="group"
    :class="
      side === 'ask'
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-emerald-700 dark:text-emerald-400'
    "
    @pointerenter="inspect"
  >
    <td class="relative h-8 px-4 py-0">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-px left-1 w-[calc(300%-8px)] overflow-hidden rounded-sm"
      >
        <motion.div
          :initial="
            book.reduce ? false : { scaleX: fraction * 0.85, opacity: 0 }
          "
          :animate="{ scaleX: fraction, opacity: 1 }"
          :transition="
            book.reduce
              ? { duration: 0 }
              : {
                  ...SPRING_PANEL,
                  delay: entered ? 0 : Math.min(entranceIndex, 8) * 0.025,
                }
          "
          class="absolute inset-0 origin-right overflow-hidden rounded-sm"
          ><div class="absolute inset-0 bg-current opacity-[0.12]"
        /></motion.div>
        <motion.div
          :style="{ opacity: highlight }"
          class="absolute inset-0 bg-current"
        />
        <div
          class="absolute inset-0 bg-current transition-opacity duration-150"
          :class="
            inRange ? 'opacity-[0.08]' : 'opacity-0 group-hover:opacity-[0.05]'
          "
        />
      </div>
      <button
        v-if="book.selectable"
        type="button"
        class="relative rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        :aria-label="`${side === 'ask' ? 'Ask' : 'Bid'} ${book.formatPrice(row.price)}, size ${book.formatSize(row.size)}, cumulative ${book.formatSize(row.total)}`"
        @focus="inspect"
        @blur="book.setActiveLevel(null)"
        @click="book.select(row, side)"
        @keydown.esc="book.setActiveLevel(null)"
      >
        {{ book.formatPrice(row.price) }}</button
      ><span v-else class="relative">{{ book.formatPrice(row.price) }}</span>
    </td>
    <td class="relative px-4 py-0 text-right text-foreground">
      {{ book.formatSize(row.size) }}
    </td>
    <td class="relative px-4 py-0 text-right text-muted-foreground">
      {{ book.formatSize(row.total) }}
    </td>
  </motion.tr>
</template>
