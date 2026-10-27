<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, onBeforeUnmount, ref, useId, watch } from "vue";
import { animate, motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";

const props = withDefaults(defineProps<{
  modelValue?: boolean; defaultValue?: boolean; disabled?: boolean; label?: string; ariaLabel?: string;
}>(), { modelValue: undefined, defaultValue: false });
const emit = defineEmits(["update:modelValue", "change"]);
const checked = useMotionState(props, emit, "modelValue", props.defaultValue);
const controlId = useId();
const reduced = useReducedMotion();
const thumb = ref<HTMLElement | null>(null), pressing = ref(false);
const squashed = computed(() => pressing.value && !props.disabled && !reduced.value);
let feedback: ReturnType<typeof animate> | undefined;
function toggle(event: MouseEvent) {
  if (!props.disabled && !event.defaultPrevented) checked.value = !checked.value;
}
function release() { pressing.value = false; }
watch([pressing, () => props.disabled, reduced], ([down, disabled, quiet]) => {
  feedback?.stop();
  feedback = undefined;
  if (down && disabled && !quiet && thumb.value)
    feedback = animate(thumb.value, { x: [0, -2, 2, -1, 0] }, { delay: 0.2, duration: 0.6 });
});
onBeforeUnmount(() => { feedback?.stop(); });
</script>

<template>
  <span :class="cn('inline-flex items-center gap-3', $attrs.class as string)" :style="$attrs.style as any">
    <motion.button v-bind="{ ...$attrs, class: undefined, style: undefined }" :id="controlId"
      type="button" role="switch" :aria-checked="checked" :disabled="disabled"
      :aria-label="ariaLabel ?? ($attrs['aria-label'] as string)" :data-state="checked ? 'checked' : 'unchecked'"
      :initial="false" @click="toggle" @pointerdown="pressing = true" @pointerup="release" @pointerleave="release" @pointercancel="release"
      :class="cn('group peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center px-1 rounded-full outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60', checked ? 'justify-end bg-primary' : 'justify-start bg-muted-foreground/60')">
      <motion.div :ref="element => thumb = resolveElement<HTMLElement>(element)" layout
        :animate="{ scale: squashed ? 0.9 : 1 }"
        :transition="reduced ? { duration: 0 } : { type: 'spring', stiffness: 800, damping: 80, mass: 4 }"
        class="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-sm">
        <div :class="cn('size-5', squashed && (checked ? 'ml-1' : 'mr-1'))" />
      </motion.div>
    </motion.button>
    <label v-if="label" :for="controlId" class="cursor-pointer text-sm text-foreground">{{ label }}</label>
  </span>
</template>
