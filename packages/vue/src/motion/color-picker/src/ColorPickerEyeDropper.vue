<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { motion } from "motion-v";
import { Pipette } from "lucide-vue-next";
import { SPRING_PRESS } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { parseHex, rgbaToHsva } from "./color";
import { usePicker } from "./context";
const state = usePicker();
const reduced = useReducedMotion();
const supported = ref(false);
let request: AbortController | undefined;
let disposed = false;
onMounted(() => {
  supported.value = "EyeDropper" in window;
});
async function pick(event: MouseEvent) {
  if (event.defaultPrevented || state.disabled.value || !supported.value)
    return;
  request?.abort();
  const controller = new AbortController();
  request = controller;
  try {
    const result = await new (window as any).EyeDropper().open({
      signal: controller.signal,
    });
    if (disposed || controller.signal.aborted) return;
    const parsed = parseHex(result.sRGBHex);
    if (parsed) {
      state.update(
        rgbaToHsva({ ...parsed, a: state.hsva.value.a }, state.hsva.value),
      );
      state.commit();
    }
  } catch {
    /* Escape/cancellation keeps the editing value. */
  }
}
onBeforeUnmount(() => {
  disposed = true;
  request?.abort();
});
</script>
<template>
  <motion.button
    v-if="supported"
    type="button"
    aria-label="Pick a color from your screen"
    :disabled="state.disabled.value"
    :while-press="reduced || state.disabled.value ? undefined : { scale: 0.92 }"
    :transition="SPRING_PRESS"
    @click="pick"
    class="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
    ><slot><Pipette aria-hidden="true" class="size-4" /></slot
  ></motion.button>
</template>
