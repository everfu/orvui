<script setup lang="ts">
import { computed } from "vue";
import { usePicker, useGlide, useColorDrag, keyStep } from "./context";
import ColorThumb from "./ColorThumb.vue";
const props = defineProps<{
  value: number;
  max: number;
  label: string;
  valueText: string;
  background: string;
  thumbColor: string;
}>();
const emit = defineEmits<{ value: [value: number] }>();
const state = usePicker();
const drag = useColorDrag(
  (fraction) => emit("value", fraction * props.max),
  state.commit,
  state.disabled,
);
const rail = drag.rail;
const glide = useGlide(computed(() => (props.value / props.max) * 100));
function key(event: KeyboardEvent) {
  const step = keyStep(event);
  if (state.disabled.value || !step) return;
  event.preventDefault();
  emit(
    "value",
    step === "min"
      ? 0
      : step === "max"
        ? props.max
        : Math.round(props.value) + step.delta,
  );
  state.commit();
}
</script>
<template>
  <div
    :class="[
      'relative h-3.5 w-full touch-none select-none rounded-full',
      state.disabled.value ? 'cursor-not-allowed' : 'cursor-pointer',
    ]"
    :style="{ background }"
    @pointerdown="drag.down"
    @pointermove="drag.move"
    @pointerup="drag.end"
    @pointercancel="drag.end"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/10 ring-inset"
    />
    <div ref="rail" class="absolute inset-y-0 right-[9px] left-[9px]">
      <ColorThumb
        :dragging="drag.dragging.value"
        :color="thumbColor"
        :glide="glide.spring"
        :x="glide.offset"
        :set-thumb="(node) => (drag.thumb.value = node)"
        role="slider"
        :tabindex="state.disabled.value ? -1 : 0"
        :aria-label="label"
        aria-orientation="horizontal"
        :aria-valuemin="0"
        :aria-valuemax="max"
        :aria-valuenow="Math.round(value)"
        :aria-valuetext="valueText"
        :aria-disabled="state.disabled.value || undefined"
        @keydown="key"
      />
    </div>
  </div>
</template>
