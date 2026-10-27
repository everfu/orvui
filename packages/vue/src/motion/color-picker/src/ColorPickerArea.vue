<script setup lang="ts">
import { computed, inject } from "vue";
import { motion } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import {
  usePicker,
  useGlide,
  useColorDrag,
  keyStep,
  COLOR_MORPH,
} from "./context";
import ColorThumb from "./ColorThumb.vue";
withDefaults(defineProps<{ label?: string }>(), {
  label: "Saturation and brightness",
});
const state = usePicker();
const morph = inject("orvui-color-morph", false);
const reduced = useReducedMotion();
const morphing = computed(() => morph && !reduced.value);
const drag = useColorDrag(
  (saturation, darkness) =>
    state.update({ s: saturation * 100, v: 100 - darkness * 100 }),
  state.commit,
  state.disabled,
);
const rail = drag.rail;
const horizontal = useGlide(computed(() => state.hsva.value.s));
const vertical = useGlide(computed(() => 100 - state.hsva.value.v));
const rgb = computed(
  () =>
    `rgb(${state.rgba.value.r} ${state.rgba.value.g} ${state.rgba.value.b})`,
);
function key(event: KeyboardEvent) {
  const step = keyStep(event);
  if (!step || state.disabled.value) return;
  event.preventDefault();
  state.update(
    step === "min"
      ? { s: 0 }
      : step === "max"
        ? { s: 100 }
        : step.axis === "x"
          ? { s: state.hsva.value.s + step.delta }
          : { v: state.hsva.value.v + step.delta },
  );
  state.commit();
}
</script>
<template>
  <motion.div
    ref="rail"
    :layout-id="morphing ? `${state.id}-chip` : undefined"
    :layout-dependency="state.open.value"
    :transition="COLOR_MORPH"
    :class="[
      'relative h-40 w-full touch-none select-none',
      state.disabled.value ? 'cursor-not-allowed' : 'cursor-crosshair',
    ]"
    :style="{
      borderRadius: '12px',
      background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${state.hsva.value.h} 100% 50%))`,
    }"
    @pointerdown="drag.down"
    @pointermove="drag.move"
    @pointerup="drag.end"
    @pointercancel="drag.end"
    ><motion.div
      v-if="morphing"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 rounded-[inherit]"
      :style="{ backgroundColor: state.hex.value }"
      :initial="{ opacity: 1 }"
      :animate="{ opacity: 0 }"
      :transition="{ duration: 0.4, ease: EASE_OUT, delay: 0.06 }" />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-black/10 ring-inset" />
    <motion.div
      class="absolute inset-0"
      :initial="morphing ? { opacity: 0 } : false"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 0.2, delay: 0.22 }"
      ><ColorThumb
        :dragging="drag.dragging.value"
        :color="rgb"
        :glide="horizontal.spring"
        :x="horizontal.offset"
        :y="vertical.offset"
        :set-thumb="(node) => (drag.thumb.value = node)"
        role="slider"
        :tabindex="state.disabled.value ? -1 : 0"
        :aria-label="label"
        aria-roledescription="2D slider"
        :aria-valuemin="0"
        :aria-valuemax="100"
        :aria-valuenow="Math.round(state.hsva.value.s)"
        :aria-valuetext="`Saturation ${Math.round(state.hsva.value.s)}%, brightness ${Math.round(state.hsva.value.v)}%`"
        :aria-disabled="state.disabled.value || undefined"
        @keydown="key" /></motion.div
  ></motion.div>
</template>
