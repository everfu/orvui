<script setup lang="ts">
import { motion } from "motion-v";
import { SPRING_PANEL } from "../../../lib/ease";
import { useNotFoundScene } from "./use-not-found-scene";
import { NOT_FOUND_DEFAULTS, type NotFoundProps } from "./types";
import NotFoundStage from "./NotFoundStage.vue";
import NotFoundCopy from "./NotFoundCopy.vue";
import NotFoundActions from "./NotFoundActions.vue";
const options = withDefaults(defineProps<NotFoundProps>(), NOT_FOUND_DEFAULTS);
const { hover } = useNotFoundScene();
const sheets = [-1, 1].map(direction => ({
  rest: { rotate: 0, x: 0, y: 0 },
  hover: { rotate: direction * 9, x: direction * 28, y: 8 },
}));
</script>
<template>
  <NotFoundStage>
    <motion.div class="relative h-44 w-64" initial="rest" animate="rest" :while-hover="hover ? 'hover' : undefined">
      <motion.div v-for="(sheet, index) in sheets" :key="index" aria-hidden="true" :variants="sheet" :transition="SPRING_PANEL" class="absolute inset-0 rounded-3xl border border-border bg-card shadow-sm" />
      <motion.div :variants="{ rest: { y: 0 }, hover: { y: -6 } }" :transition="SPRING_PANEL" class="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-3xl border border-border bg-card shadow-md">
        <h1 class="select-none font-bold leading-none tracking-tighter text-foreground [font-size:clamp(3.5rem,9vw,5rem)]">{{ options.code }}</h1>
        <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">out of the deck</span>
      </motion.div>
    </motion.div>
    <NotFoundCopy :title="options.title" :description="options.description" />
    <NotFoundActions v-bind="options" />
  </NotFoundStage>
</template>
