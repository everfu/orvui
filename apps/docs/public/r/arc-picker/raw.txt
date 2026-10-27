<script setup lang="ts">
import { ref, useId } from "vue";
import { useReducedMotion } from "../../../lib/composables";
import { cn } from "../../../lib/utils";
import { useMotionState } from "../../state";
import { useArcControl } from "./arc-control";
export type ArcPickerOption = { value: string; label: string; disabled?: boolean };
export type ArcPickerSide = "top" | "bottom" | "left" | "right";
const props = withDefaults(defineProps<{ options: readonly ArcPickerOption[]; modelValue?: string; defaultValue?: string; side?: ArcPickerSide; radius?: number; itemHeight?: number; visibleCount?: number; disabled?: boolean; name?: string; ariaLabel?: string; ariaDescribedby?: string }>(), { side: "right", radius: 280, itemHeight: 48, visibleCount: 7, ariaLabel: "Choose an option" });
const emit = defineEmits(["update:modelValue", "change"]);
const candidate = useMotionState(props, emit, "modelValue", props.defaultValue ?? props.options.find(option => !option.disabled)?.value ?? "");
const root = ref<HTMLElement | null>(null);
const instructionsId = useId();
const reduced = useReducedMotion();
const { horizontal, height, selected, buttons, focusWithin, frameStyle, styleFor, bracket, keyboard, down, move, release, click, select } = useArcControl(props, candidate, reduced, root);
function register(value: string, node: unknown) { if (node) buttons.set(value, node as HTMLButtonElement); else buttons.delete(value); }
function blur(event: FocusEvent) { if (event.relatedTarget && !root.value?.contains(event.relatedTarget as Node)) focusWithin.value = false; }
</script>
<style scoped>
[data-slot="arc-picker-bracket"] {
  color: transparent;
}
[data-slot="arc-picker-bracket"]::after {
  content: "";
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 0;
  right: 0;
  border-top: 1.5px solid var(--primary);
  border-bottom: 1.5px solid var(--primary);
  pointer-events: none;
}
[data-slot="arc-picker-bracket"][data-edge="leading"]::after {
  border-left: 1.5px solid var(--primary);
  border-radius: 3px 0 0 3px;
}
[data-slot="arc-picker-bracket"][data-edge="trailing"]::after {
  border-right: 1.5px solid var(--primary);
  border-radius: 0 3px 3px 0;
}
</style>
<template><div ref="root" role="radiogroup" :aria-label="ariaLabel" :aria-describedby="[ariaDescribedby, instructionsId].filter(Boolean).join(' ')" :aria-disabled="disabled || undefined" :aria-orientation="horizontal ? 'horizontal' : 'vertical'" data-slot="arc-picker" :data-side="side" :class="cn('relative w-full min-w-0 cursor-grab select-none overflow-hidden active:cursor-grabbing', disabled && 'cursor-default opacity-50')" :style="{ touchAction: horizontal ? 'pan-y pinch-zoom' : 'pan-x pinch-zoom', height: `${height}px`, maskImage: `linear-gradient(to ${horizontal ? 'right' : 'bottom'},transparent,black 12%,black 88%,transparent)` }" @keydown="keyboard" @focusin="focusWithin = true" @focusout="blur" @pointerdown="down" @pointermove="move" @pointerup="release($event, false)" @pointercancel="release($event, true)" @lostpointercapture="release($event, true)" @click.capture="click"><span :id="instructionsId" class="sr-only">Drag {{ horizontal ? 'horizontally' : 'vertically' }} or scroll to choose. Use arrow keys to move, Home and End to jump.</span><input v-if="name" type="hidden" :name="name" :value="selected ?? ''" :disabled="disabled" /><button v-for="(option, index) in options" :key="option.value" :ref="node => register(option.value, node)" type="button" role="radio" :aria-checked="option.value === selected" :disabled="disabled || option.disabled" :tabindex="option.value === selected && !disabled && !option.disabled ? 0 : -1" data-slot="arc-picker-option" :data-value="option.value" :data-selected="option.value === selected || undefined" @click="!$event.defaultPrevented && select(index)" :class="cn('absolute rounded-md px-2 py-1 text-2xl font-light whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35', horizontal ? 'text-center' : side === 'left' ? 'text-right' : 'text-left', option.value === selected ? 'text-primary' : 'text-muted-foreground')" :style="styleFor(index, option)"><span data-slot="arc-picker-label" class="block overflow-hidden text-ellipsis">{{ option.label }}</span></button><div aria-hidden="true" data-slot="arc-picker-selection-frame" class="pointer-events-none absolute h-0 w-0 text-2xl font-light text-primary" :style="frameStyle"><span v-for="leading in [true, false]" :key="String(leading)" data-slot="arc-picker-bracket" :data-edge="leading ? 'leading' : 'trailing'" :class="leading ? 'absolute right-0' : 'absolute left-0'" :style="bracket(leading)">{{ leading ? '[' : ']' }}</span></div></div></template>
