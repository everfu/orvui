<script setup lang="ts">
import { computed } from "vue";
import { NOT_FOUND_DEFAULTS, type NotFoundProps } from "./types";
import { useNotFoundScene, useSpotlightPosition } from "./use-not-found-scene";
import NotFoundStage from "./NotFoundStage.vue";
import NotFoundCopy from "./NotFoundCopy.vue";
import NotFoundActions from "./NotFoundActions.vue";
const options = withDefaults(defineProps<NotFoundProps>(), NOT_FOUND_DEFAULTS);
const { hover } = useNotFoundScene();
const { mask, move } = useSpotlightPosition(hover);
const maskStyle = computed(() => hover.value ? { WebkitMaskImage: mask.value, maskImage: mask.value } : undefined);
</script>
<template>
  <NotFoundStage>
    <div @mousemove="move" class="relative isolate flex aspect-[16/9] w-full max-w-xl items-center justify-center overflow-hidden rounded-3xl border border-border bg-neutral-950">
      <span aria-hidden="true" class="select-none font-bold leading-none tracking-tighter text-white/10 [font-size:clamp(5rem,16vw,10rem)]">{{ options.code }}</span>
      <h1 :aria-label="options.code" :style="maskStyle" :class="['absolute select-none font-bold leading-none tracking-tighter text-white [font-size:clamp(5rem,16vw,10rem)]', !hover && 'text-white/90']"><span aria-hidden="true">{{ options.code }}</span></h1>
    </div>
    <NotFoundCopy :title="options.title" :description="options.description" />
    <NotFoundActions v-bind="options" />
  </NotFoundStage>
</template>
