<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { motion } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { createDitherField } from "./dither";
import type { ImageGenerationStatus } from "./ImageGeneration.vue";
const props = defineProps<{
  status: ImageGenerationStatus;
  interactive: boolean;
  reduce: boolean;
}>();
const canvas = ref<HTMLCanvasElement>();
const opacity = computed(() =>
  props.status === "refining"
    ? 0.48
    : props.status === "queued" || props.status === "generating"
      ? 1
      : 0,
);
let release: (() => void) | undefined;
let capabilities: MediaQueryList | undefined;
let ready = false;
function refresh() {
  release?.();
  release = undefined;
  if (ready && canvas.value)
    release = createDitherField(
      canvas.value,
      props.interactive,
      props.reduce,
      capabilities?.matches ?? false,
    );
}
watch([() => props.interactive, () => props.reduce], refresh);
onMounted(() => {
  ready = true;
  capabilities = matchMedia("(hover: hover) and (pointer: fine)");
  capabilities.addEventListener("change", refresh);
  refresh();
});
onBeforeUnmount(() => {
  ready = false;
  release?.();
  capabilities?.removeEventListener("change", refresh);
});
</script>
<template>
  <motion.div
    aria-hidden="true"
    class="absolute inset-0 overflow-hidden bg-muted"
    :initial="false"
    :animate="{ opacity }"
    :transition="{ duration: reduce ? 0 : 0.4, ease: EASE_OUT }"
  >
    <canvas ref="canvas" class="absolute inset-0 size-full text-foreground" />
  </motion.div>
</template>
