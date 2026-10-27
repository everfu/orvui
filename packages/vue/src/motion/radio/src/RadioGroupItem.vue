<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, inject, onBeforeUnmount, onMounted, useId, watch } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_LAYOUT, SPRING_PRESS } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import type { RadioContext } from "./context";

const props = defineProps<{ value: string; label?: string; description?: string; disabled?: boolean; id?: string }>();
const group = inject<RadioContext>("orvui-radio");
if (!group) throw new Error("RadioGroupItem must be inside RadioGroup");
const generatedId = useId(), reduced = useReducedMotion();
const controlId = computed(() => props.id ?? generatedId);
const selected = computed(() => props.value === group.value.value);
const labelId = computed(() => props.description && props.label ? `${controlId.value}-label` : undefined);
const isTabStop = computed(() => !props.disabled && (group.tabStop.value === null || group.tabStop.value === props.value));
function select(event: MouseEvent) { if (!props.disabled && !event.defaultPrevented) group!.setValue(props.value); }
onMounted(() => group.register(props.value, !!props.disabled));
watch(() => [props.value, props.disabled] as const, ([value, disabled], [previous]) => {
  if (value !== previous) group.unregister(previous);
  group.register(value, !!disabled);
});
onBeforeUnmount(() => group.unregister(props.value));
</script>

<template>
  <label :for="controlId" :style="$attrs.style as any"
    :class="cn('inline-flex gap-3', description ? 'items-start' : 'items-center', disabled ? 'cursor-not-allowed' : 'cursor-pointer', $attrs.class as string)">
    <motion.button v-bind="{ ...$attrs, class: undefined, style: undefined }" :id="controlId"
      type="button" role="radio" :aria-checked="selected" :aria-labelledby="labelId"
      :aria-describedby="[$attrs['aria-describedby'] as string, description ? `${controlId}-description` : undefined].filter(Boolean).join(' ') || undefined"
      :disabled="disabled" :tabindex="isTabStop ? 0 : -1" :data-state="selected ? 'checked' : 'unchecked'" @click="select"
      :while-press="reduced || disabled ? undefined : { scale: 0.92 }" :transition="SPRING_PRESS"
      :class="cn('relative inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60', selected ? 'border-primary' : 'border-muted-foreground/65 hover:border-muted-foreground')">
      <motion.span v-if="selected" :layout-id="group.id" :transition="reduced ? { duration: 0 } : SPRING_LAYOUT"
        class="absolute inset-1 rounded-full bg-primary" />
    </motion.button>
    <input type="radio" :name="group.name.value" :value="value" :checked="selected" :disabled="disabled" hidden />
    <span v-if="label || description" :class="cn('flex min-w-0 flex-col gap-0.5 select-none', disabled && 'opacity-60')">
      <span v-if="label" :id="labelId" :class="cn('text-sm text-foreground', description && 'leading-4')">{{ label }}</span>
      <span v-if="description" :id="controlId + '-description'" class="text-xs text-muted-foreground">{{ description }}</span>
    </span>
  </label>
</template>
