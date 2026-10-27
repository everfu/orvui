<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, useAttrs, useId } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";

const props = withDefaults(defineProps<{
  modelValue?: boolean; defaultValue?: boolean; disabled?: boolean; indeterminate?: boolean;
  label?: string; description?: string; id?: string; ariaLabel?: string; ariaDescribedBy?: string;
}>(), { modelValue: undefined, defaultValue: false });
const emit = defineEmits(["update:modelValue", "change"]);
const checked = useMotionState(props, emit, "modelValue", props.defaultValue);
const generatedId = useId(), attrs = useAttrs(), reduced = useReducedMotion();
const controlId = computed(() => props.id ?? generatedId);
const accessibleName = computed(() => props.ariaLabel ?? attrs["aria-label"] as string | undefined);
const labelId = computed(() => props.description && props.label && !accessibleName.value ? `${controlId.value}-label` : undefined);
const descriptionIds = computed(() => [props.ariaDescribedBy ?? attrs["aria-describedby"], props.description ? `${controlId.value}-description` : undefined].filter(Boolean).join(" ") || undefined);
const hasMark = computed(() => checked.value || props.indeterminate);
const state = computed(() => checked.value ? "checked" : props.indeterminate ? "indeterminate" : "unchecked");
const mark = computed(() => props.indeterminate ? "M6 12h12" : "M5 13l4 4L19 7");
function toggle(event: MouseEvent) { if (!props.disabled && !event.defaultPrevented) checked.value = !checked.value; }
</script>

<template>
  <label :for="controlId" :style="$attrs.style as any"
    :class="cn('inline-flex gap-3', description ? 'items-start' : 'items-center', disabled ? 'cursor-not-allowed' : 'cursor-pointer', $attrs.class as string)">
    <motion.button v-bind="{ ...$attrs, class: undefined, style: undefined }" :id="controlId"
      type="button" role="checkbox" :aria-checked="indeterminate ? 'mixed' : checked"
      :aria-label="accessibleName" :aria-labelledby="labelId" :aria-describedby="descriptionIds"
      :disabled="disabled" :data-state="state" @click="toggle"
      :while-press="reduced || disabled ? undefined : { scale: 0.92 }" :transition="SPRING_PRESS"
      :class="cn('inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60', hasMark ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/65 bg-background hover:border-muted-foreground')">
      <AnimatePresence :initial="false">
        <motion.svg v-if="hasMark" :key="indeterminate ? 'indeterminate' : 'checked'"
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
          :initial="reduced ? { opacity: 1 } : { opacity: 0, scale: 0.5 }"
          :animate="reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }"
          :exit="reduced ? { opacity: 0 } : { opacity: 0, scale: 0.5, filter: 'blur(4px)' }"
          :transition="reduced ? { duration: 0 } : { duration: 0.16, ease: EASE_OUT }">
          <title>{{ indeterminate ? 'Partially selected' : 'Selected' }}</title>
          <motion.path :d="mark" :initial="{ pathLength: reduced ? 1 : 0 }" :animate="{ pathLength: 1 }"
            :transition="reduced ? { duration: 0 } : { duration: indeterminate ? 0.2 : 0.3, ease: EASE_OUT, delay: 0.04 }" />
        </motion.svg>
      </AnimatePresence>
    </motion.button>
    <span v-if="label || description" :class="cn('flex min-w-0 flex-col gap-0.5 select-none', disabled && 'opacity-60')">
      <span v-if="label" :id="labelId" :class="cn('text-sm text-foreground', description && 'leading-4')">{{ label }}</span>
      <span v-if="description" :id="controlId + '-description'" class="text-xs text-muted-foreground">{{ description }}</span>
    </span>
  </label>
</template>
