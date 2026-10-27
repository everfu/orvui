<script setup lang="ts">
import { provide, ref } from "vue";
import { createScrollApi, SmoothScrollKey, type SmoothScrollOptions } from "./useSmoothScroll";
const props = withDefaults(defineProps<SmoothScrollOptions>(), {
  root: true, lerp: 0.1, duration: 1.2, orientation: "vertical", wheelMultiplier: 1, touch: false, enabled: true,
});
const wrapper = ref<HTMLElement | null>(null), content = ref<HTMLElement | null>(null);
const controller = createScrollApi(props, wrapper, content);
provide(SmoothScrollKey, controller);
defineExpose(controller);
</script>
<template>
  <div ref="wrapper"><slot v-if="root" /><div v-else ref="content"><slot /></div></div>
</template>
