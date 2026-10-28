<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useAttrs,
  watch,
} from "vue";
import { animate, motion, motionValue, type MotionValue } from "motion-v";

defineOptions({ inheritAttrs: false });
const props = defineProps<{
  as: "svg" | "path" | "circle";
  target?: Record<string, any>;
  transition?: Record<string, any>;
}>();
const attrs = useAttrs();
const values = shallowReactive<Record<string, MotionValue<any>>>({});
let mounted = false;
let controls: Array<{ stop(): void }> = [];

// SVG attributes must always contain a single frame. Passing an array through
// motion-v's declarative SVG target serializes the entire array on rerenders.
function synchronize() {
  controls.forEach((control) => control.stop());
  controls = [];
  for (const key of Object.keys(values)) {
    if (props.target?.[key] === undefined) {
      values[key].destroy();
      delete values[key];
    }
  }
  for (const [key, target] of Object.entries(props.target ?? {})) {
    const first = Array.isArray(target)
      ? target[0]
      : key === "rotate"
        ? 0
        : target;
    if (!values[key]) values[key] = motionValue(first);
    else values[key].jump(first);
    if (mounted) controls.push(animate(values[key], target, props.transition));
  }
}
watch(() => [props.target, props.transition], synchronize, { immediate: true });
onMounted(() => {
  mounted = true;
  synchronize();
});
onBeforeUnmount(() => {
  mounted = false;
  controls.forEach((control) => control.stop());
  Object.values(values).forEach((value) => value.destroy());
});
</script>

<template>
  <component
    :is="motion[as]"
    v-bind="attrs"
    :style="{ ...(attrs.style as any), ...values }"
  >
    <slot />
  </component>
</template>
