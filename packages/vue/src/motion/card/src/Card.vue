<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, onBeforeUnmount, provide, watch } from "vue";
import { animate, isDragActive, motion, useMotionValue } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_PRESS } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";

const props = withDefaults(defineProps<{ variant?: "outlined" | "muted"; size?: "default" | "compact"; interactive?: boolean; selected?: boolean }>(), { variant: "outlined", size: "default" });
const reduced = useReducedMotion();
const scale = useMotionValue(1);
provide("orvui-card-size", computed(() => props.size));
let animation: ReturnType<typeof animate> | undefined;
let pointer: number | undefined;
let listening = false;
function animateScale(target: number) {
  animation?.stop();
  animation = animate(scale, target, SPRING_PRESS);
}
function detach() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("pointerup", release, true);
  window.removeEventListener("pointercancel", release, true);
  window.removeEventListener("pointermove", checkDrag);
}
function release(event?: PointerEvent) {
  if (event && event.pointerId !== pointer) return;
  pointer = undefined;
  detach();
  animateScale(1);
}
function checkDrag() { if (isDragActive()) release(); }
function press(event: PointerEvent) {
  if (!props.interactive || reduced.value || event.defaultPrevented || listening
      || event.isPrimary === false || event.button !== 0 || isDragActive()) return;
  pointer = event.pointerId;
  listening = true;
  window.addEventListener("pointerup", release, true);
  window.addEventListener("pointercancel", release, true);
  window.addEventListener("pointermove", checkDrag);
  animateScale(0.985);
}
watch([() => props.interactive, reduced], ([interactive, quiet]) => { if (listening && (!interactive || quiet)) release(); });
onBeforeUnmount(() => { detach(); animation?.stop(); });
</script>

<template>
  <motion.div v-bind="$attrs" data-slot="card" :data-selected="selected || undefined" @pointerdown="press"
    :style="interactive ? { scale } : undefined"
    :class="cn('relative flex flex-col rounded-2xl border text-card-foreground transition-[border-color,box-shadow,background-color] duration-200',
      variant === 'outlined' ? 'border-border bg-background' : 'border-transparent bg-muted',
      size === 'default' ? 'gap-6 py-6' : 'gap-4 py-4',
      interactive && 'cursor-pointer hover:border-border-strong has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-foreground',
      selected && 'border-primary hover:border-primary', $attrs.class as string)">
    <slot />
  </motion.div>
</template>
