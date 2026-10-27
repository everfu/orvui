<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref, useId, watch } from "vue";
import { useMotionState } from "../../state";
import { useReducedMotion } from "../../../lib/composables";
import Liquid from "./Liquid.vue";
import type { StepperContext } from "./context";
const props = withDefaults(defineProps<{
  modelValue?: number; defaultValue?: number; min?: number; max?: number; step?: number; disabled?: boolean;
  name?: string; formatValueText?: (value: number) => string; ariaLabel?: string;
}>(), { defaultValue: 0, min: 0, max: 10, step: 1, ariaLabel: "Quantity" });
const emit = defineEmits(["update:modelValue", "change"]);
const candidate = useMotionState(props, emit, "modelValue", props.defaultValue);
const minimum = computed(() => Number.isFinite(props.min) ? props.min : 0);
const maximum = computed(() => Number.isFinite(props.max) ? Math.max(minimum.value, props.max) : minimum.value);
const stride = computed(() => Number.isFinite(props.step) && props.step > 0 ? props.step : 1);
const current = computed(() => Math.min(maximum.value, Math.max(minimum.value, Number.isFinite(candidate.value) ? candidate.value : minimum.value)));
const atMin = computed(() => current.value <= minimum.value), atMax = computed(() => current.value >= maximum.value);
const valueText = computed(() => props.formatValueText?.(current.value) ?? String(current.value));
const direction = ref(0), decrementRef = ref<HTMLButtonElement | null>(null), incrementRef = ref<HTMLButtonElement | null>(null);
const reduced = useReducedMotion(), labelId = useId();
let focusFrame = 0;
watch(current, (next, before) => { direction.value = Math.sign(next - before); }, { flush: "sync" });
function adjust(by: -1 | 1, restoreFocus: boolean) {
  if (props.disabled || (by < 0 ? atMin.value : atMax.value)) return;
  const offset = (current.value - minimum.value) / stride.value;
  const gridIndex = by > 0 ? Math.floor(offset + 1e-10) + 1 : Math.ceil(offset - 1e-10) - 1;
  const requested = Number(Math.min(maximum.value, Math.max(minimum.value, minimum.value + stride.value * gridIndex)).toFixed(10));
  if (requested === current.value) return;
  candidate.value = requested;
  if (!restoreFocus) return;
  cancelAnimationFrame(focusFrame);
  focusFrame = requestAnimationFrame(() => {
    if (requested === maximum.value && current.value === requested) decrementRef.value?.focus();
    else if (requested === minimum.value && current.value === requested) incrementRef.value?.focus();
  });
}
const state: StepperContext = {
  value: current, valueText, direction, atMin, atMax, disabled: computed(() => !!props.disabled), reduce: reduced,
  decrementRef, incrementRef, decrement: keyboard => adjust(-1, keyboard), increment: keyboard => adjust(1, keyboard),
};
provide("orvui-stepper", state);
onBeforeUnmount(() => cancelAnimationFrame(focusFrame));
</script>
<template>
  <fieldset :disabled="disabled" class="relative isolate m-0 inline-block h-12 w-[13.5rem] border-0 p-0">
    <legend :id="labelId" class="sr-only">{{ ariaLabel }}. Current value: {{ valueText }}</legend>
    <Liquid><slot /></Liquid><input v-if="name" type="hidden" :name="name" :value="current" />
  </fieldset>
</template>
