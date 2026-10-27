<script setup lang="ts">
import { NOT_FOUND_DEFAULTS, type NotFoundProps } from "./types";
import NotFoundStage from "./NotFoundStage.vue";
import NotFoundCopy from "./NotFoundCopy.vue";
import NotFoundActions from "./NotFoundActions.vue";
import Scramble from "./NotFoundScramble.vue";
const options = withDefaults(defineProps<NotFoundProps>(), NOT_FOUND_DEFAULTS);
const channels = [
  "text-[#ff0040] group-hover:translate-x-[3px]",
  "text-[#00e5ff] group-hover:-translate-x-[3px]",
];
</script>
<template>
  <NotFoundStage>
    <div class="group relative select-none font-mono font-bold leading-none tracking-tighter text-foreground [font-size:clamp(5rem,18vw,11rem)]">
      <span v-for="channel in channels" :key="channel" aria-hidden="true" :class="['pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-[transform,opacity] duration-150 ease-out group-hover:opacity-70 motion-reduce:hidden', channel]"><Scramble :text="options.code" /></span>
      <h1 class="relative"><Scramble :text="options.code" /></h1>
    </div>
    <NotFoundCopy :title="options.title" :description="options.description" />
    <NotFoundActions v-bind="options" />
  </NotFoundStage>
</template>
