<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { motion } from "motion-v";
import { SPRING_PRESS } from "../../../lib/ease";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
import { parseHex, formatHex } from "./color";
import { usePicker, CHECKERBOARD } from "./context";
const props = defineProps<{ value: string; label?: string }>();
const state = usePicker();
const reduced = useReducedMotion();
const root = ref<unknown>(null);
const parsed = computed(() => parseHex(props.value));
const normalized = computed(() =>
  parsed.value ? formatHex(parsed.value) : props.value,
);
const selected = computed(() => state.hex.value === normalized.value);
const group = inject<{
  register(node: HTMLElement, value: string): () => void;
} | null>("orvui-color-presets", null);
let detach: (() => void) | undefined;
function synchronize() {
  detach?.();
  detach = undefined;
  const element = resolveElement<HTMLElement>(root.value);
  if (group && element) detach = group.register(element, normalized.value);
}
onMounted(synchronize);
watch(normalized, synchronize);
onBeforeUnmount(() => detach?.());
function choose() {
  if (parsed.value && !state.disabled.value) state.setColor(props.value);
}
</script>
<template>
  <motion.button
    ref="root"
    type="button"
    :disabled="state.disabled.value"
    :aria-label="label ?? normalized"
    :aria-pressed="selected"
    :while-press="reduced || state.disabled.value ? undefined : { scale: 0.88 }"
    :transition="SPRING_PRESS"
    @click="choose"
    class="relative size-6 shrink-0 rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground disabled:cursor-not-allowed"
    ><span
      v-if="selected && !group"
      aria-hidden="true"
      class="pointer-events-none absolute -inset-[3px] rounded-full border-2 border-foreground/70" /><span
      aria-hidden="true"
      class="absolute inset-0 overflow-hidden rounded-full"
      :style="{ background: CHECKERBOARD }"
      ><span
        class="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]"
        :style="{ backgroundColor: normalized }" /></span
  ></motion.button>
</template>
