<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { ListTodo } from "lucide-vue-next";
import { EASE_OUT, SPRING_SWAP } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
defineProps<{ complete: boolean }>();
const reduced = useReducedMotion();
// Own normalized three-point mark; the path renderer retains the draw animation.
const check = [
  [7.8, 12],
  [10.7, 15],
  [16.4, 9.3],
]
  .map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`)
  .join("");
</script>
<template>
  <span
    aria-hidden="true"
    class="relative grid size-6 shrink-0 place-items-center"
    ><AnimatePresence :initial="false" mode="popLayout">
      <motion.svg
        v-if="complete"
        key="complete"
        viewBox="0 0 24 24"
        class="absolute size-5.5 overflow-visible text-emerald-500"
        :initial="reduced ? { opacity: 1 } : { opacity: 0, scale: 0.72 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0 }"
        :transition="reduced ? { duration: 0 } : SPRING_SWAP"
      >
        <circle cx="12" cy="12" r="9" fill="currentColor" /><motion.path
          :d="check"
          fill="none"
          stroke="white"
          :stroke-width="2.25"
          stroke-linecap="round"
          stroke-linejoin="round"
          :initial="{ pathLength: reduced ? 1 : 0 }"
          :animate="{ pathLength: 1 }"
          :transition="
            reduced ? { duration: 0 } : { duration: 0.24, ease: EASE_OUT }
          "
        />
      </motion.svg>
      <motion.span
        v-else
        key="todo"
        class="absolute grid place-items-center text-muted-foreground"
        :initial="reduced ? { opacity: 1 } : { opacity: 0, scale: 0.8 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="reduced ? { opacity: 0 } : { opacity: 0, scale: 0.72 }"
        :transition="reduced ? { duration: 0 } : SPRING_SWAP"
        ><ListTodo class="size-4"
      /></motion.span> </AnimatePresence
  ></span>
</template>
