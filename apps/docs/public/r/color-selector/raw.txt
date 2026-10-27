<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, useId, watch } from "vue";
import { animate } from "motion-v";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";
import type { ColorSelectorContext } from "./context";
const props = withDefaults(defineProps<{ modelValue?: string; defaultValue?: string; name?: string; form?: string; disabled?: boolean; required?: boolean }>(), { defaultValue: "" });
const emit = defineEmits(["update:modelValue", "change"]);
const selected = useMotionState(props, emit, "modelValue", props.defaultValue);
const instanceId = useId(), reduced = useReducedMotion();
const root = ref<HTMLElement | null>(null), origin = ref<HTMLElement | null>(null), placed = ref(false);
const ring = ref({ x: 0, y: 0, width: 52, height: 52, color: "transparent" });
const options = new Map<string, { element: HTMLElement; color: string }>();
let observer: ResizeObserver | undefined;
let animation: ReturnType<typeof animate> | undefined;
let disposed = false;
function measure(immediate = false) {
  if (disposed) return;
  const option = options.get(selected.value), anchor = origin.value ?? root.value;
  if (!option || !anchor) { placed.value = false; return; }
  const bounds = anchor.getBoundingClientRect(), target = option.element.getBoundingClientRect();
  const to = { x: target.left - bounds.left - 4, y: target.top - bounds.top - 4, width: target.width + 8, height: target.height + 8, color: option.color };
  const from = ring.value;
  animation?.stop();
  if (!placed.value || immediate || reduced.value) { ring.value = to; placed.value = true; return; }
  const lift = Math.hypot(to.x - from.x, to.y - from.y) * 0.4;
  animation = animate(0, 1, { ...SPRING_LAYOUT, onUpdate(progress) {
    if (disposed) return;
    const bounded = Math.max(0, Math.min(1, progress));
    const interpolate = (key: "x" | "y" | "width" | "height") => from[key] + progress * (to[key] - from[key]);
    ring.value = { x: interpolate("x"), y: interpolate("y") - lift * bounded * (1 - bounded), width: interpolate("width"), height: interpolate("height"), color: to.color };
  } });
}
const context: ColorSelectorContext = {
  value: selected, name: computed(() => props.name ?? instanceId), form: computed(() => props.form),
  disabled: computed(() => props.disabled), required: computed(() => props.required), placed,
  register(key, option) {
    const previous = options.get(key);
    if (previous?.element !== option.element && previous) observer?.unobserve(previous.element);
    options.set(key, option);
    observer?.observe(option.element);
    void nextTick(() => measure(true));
  },
  unregister(key) {
    const option = options.get(key);
    if (option) observer?.unobserve(option.element);
    options.delete(key);
    void nextTick(() => measure(true));
  },
  select(key) {
    if (!props.disabled && key !== selected.value) selected.value = key;
    void nextTick(() => {
      if (disposed) return;
      root.value?.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach(input => { input.checked = input.value === selected.value; });
    });
  },
};
provide("orvui-color-selector", context);
watch(selected, () => void nextTick(() => measure()));
watch(reduced, () => measure(true));
onMounted(() => {
  if (typeof ResizeObserver !== "undefined") {
    observer = new ResizeObserver(() => measure(true));
    if (root.value) observer.observe(root.value);
    options.forEach(option => observer!.observe(option.element));
  }
  measure(true);
});
onBeforeUnmount(() => { disposed = true; animation?.stop(); observer?.disconnect(); options.clear(); });
</script>
<template>
  <fieldset ref="root" :disabled="disabled" :form="form" class="relative min-w-0 border-0 p-0">
    <slot /><span ref="origin" aria-hidden="true" class="pointer-events-none absolute left-0 top-0 size-0" />
    <span v-if="placed" aria-hidden="true" data-color-selection="" class="pointer-events-none absolute rounded-full border-2"
      :style="{ left: 0, top: 0, width: `${ring.width}px`, height: `${ring.height}px`, transform: `translate(${ring.x}px,${ring.y}px)`, borderColor: `color-mix(in srgb, ${ring.color} 85%, transparent)` }" />
  </fieldset>
</template>
