<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_OUT } from "../../../lib/ease";
const reduce = useReducedMotion();
const hidden = computed(() =>
  reduce.value
    ? { opacity: 0, filter: "blur(0px)" }
    : { opacity: 0, scale: 0.9, y: -8, filter: "blur(5px)" },
);
const shown = computed(() =>
  reduce.value
    ? { opacity: 1, filter: "blur(0px)" }
    : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" },
);
const exit = computed(() =>
  reduce.value
    ? { opacity: 0, filter: "blur(0px)", transition: { duration: 0.1 } }
    : {
        opacity: 0,
        scale: 0.9,
        y: -6,
        filter: "blur(0px)",
        transition: { duration: 0.08, ease: EASE_OUT },
      },
);
</script>
<template>
  <motion.div
    :initial="hidden"
    :animate="shown"
    :exit="exit"
    :transition="
      reduce
        ? { duration: 0.15 }
        : { type: 'spring', duration: 0.8, bounce: 0.35 }
    "
    :style="{ transformOrigin: 'top center' }"
    class="flex items-center justify-center"
    ><slot
  /></motion.div>
</template>
