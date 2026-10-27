<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { EASE_OUT, SPRING_SWAP } from "../../../lib/ease";
const props = defineProps<{ phrase: string; duration: number }>();
const glyphs = computed(() => Array.from(`${props.phrase}…`));
const choreography = {
  enter: { opacity: 0, y: "100%" },
  shown: (order: unknown) => ({
    opacity: 1,
    y: "0%",
    transition: { ...SPRING_SWAP, delay: Number(order) * 0.025 },
  }),
  leave: (order: unknown) => ({
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.14,
      ease: EASE_OUT,
      delay: Number(order) * 0.01125,
    },
  }),
};
</script>
<template>
  <motion.span
    class="col-start-1 row-start-1 inline-block justify-self-start whitespace-pre"
    initial="enter"
    animate="shown"
    exit="leave"
  >
    <motion.span
      v-for="(glyph, index) in glyphs"
      :key="index"
      :custom="index"
      :variants="choreography"
      initial="enter"
      animate="shown"
      exit="leave"
      class="orvui-agent-text-shimmer inline-block whitespace-pre will-change-[opacity,transform]"
      :style="{
        animation: `orvui-agent-text-shimmer ${duration}s linear infinite`,
      }"
      >{{ glyph }}</motion.span
    >
  </motion.span>
</template>
