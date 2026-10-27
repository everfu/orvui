<script setup lang="ts">
import { computed } from "vue";
import Magnetic from "../../../motion/button/src/Magnetic.vue";
import { NOT_FOUND_DEFAULTS, type NotFoundProps } from "./types";
import NotFoundStage from "./NotFoundStage.vue";
import NotFoundCopy from "./NotFoundCopy.vue";
import NotFoundActions from "./NotFoundActions.vue";
const options = withDefaults(defineProps<NotFoundProps>(), NOT_FOUND_DEFAULTS);
const symbols = computed(() => Array.from(options.code));
</script>
<template>
  <NotFoundStage>
    <h1 :aria-label="options.code" class="flex select-none items-center justify-center font-bold leading-none tracking-tighter text-foreground [font-size:clamp(5rem,18vw,12rem)]">
      <Magnetic v-for="(symbol, index) in symbols" :key="index" :strength=".6" :class="{ '-ml-2': index > 0 }"><span aria-hidden="true" class="inline-block px-1 tabular-nums">{{ symbol }}</span></Magnetic>
    </h1>
    <NotFoundCopy :title="options.title" :description="options.description" />
    <NotFoundActions v-bind="options" />
  </NotFoundStage>
</template>
