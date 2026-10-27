<script setup lang="ts">
import { ref } from "vue";
import { useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";
import { cn } from "../../../lib/utils";
import { useDrumState } from "./drum-state";
export type WheelPickerOption = string | { label: string; value: string };
const props = withDefaults(defineProps<{ options: WheelPickerOption[]; modelValue?: string; defaultValue?: string; visibleCount?: number; itemHeight?: number; disabled?: boolean; sound?: boolean; ariaLabel?: string }>(), { visibleCount: 5, itemHeight: 36 });
const emit = defineEmits(["update:modelValue", "change"]);
const reduce = useReducedMotion();
const container = ref<HTMLElement | null>(null);
const drum = ref<HTMLElement | null>(null);
const band = ref<HTMLElement | null>(null);
const candidate = useMotionState(props, emit, "modelValue", props.defaultValue);
const { options, geometry, grabbing, publish, pointerDown, pointerMove, pointerEnd, keyboard, rowStyle } = useDrumState(props, candidate, reduce, container, drum, band);
</script>
<template>
  <div v-if="reduce" :class="cn('relative overflow-hidden rounded-2xl border border-border bg-card', disabled && 'pointer-events-none opacity-50')" :style="{ height: `${geometry.height}px` }"><div class="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 border-border border-y bg-foreground/[0.04]" :style="{ height: `${itemHeight}px` }" /><ul class="h-full snap-y snap-mandatory overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_bottom,transparent,#000_22%,#000_78%,transparent)]" :style="{ paddingTop: `${(geometry.height - itemHeight) / 2}px`, paddingBottom: `${(geometry.height - itemHeight) / 2}px` }"><li v-for="(option, index) in options" :key="option.value" class="snap-center"><button type="button" :disabled="disabled" @click="publish(index)" :class="cn('flex w-full items-center justify-center font-medium', option.value === candidate ? 'text-foreground' : 'text-muted-foreground')" :style="{ height: `${itemHeight}px` }">{{ option.label }}</button></li></ul></div>
  <div v-else ref="container" role="listbox" :aria-label="ariaLabel" :aria-disabled="disabled || undefined" :tabindex="disabled ? -1 : 0" @keydown="keyboard" @pointerdown="pointerDown" @pointermove="pointerMove" @pointerup="pointerEnd" @pointercancel="pointerEnd" :class="cn('relative touch-none overflow-hidden rounded-2xl border border-border bg-card outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 select-none [-webkit-touch-callout:none] [mask-image:linear-gradient(to_bottom,transparent,#000_22%,#000_78%,transparent)]', grabbing ? 'cursor-grabbing' : 'cursor-grab', disabled && 'pointer-events-none opacity-50')" :style="{ height: `${geometry.height}px`, perspective: '1000px' }">
    <ul ref="drum" aria-hidden="true" class="absolute inset-x-0 top-1/2 m-0 h-0 list-none p-0 [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform]"><li v-for="(option, index) in options" :key="option.value" :data-index="index" class="absolute inset-x-0 flex items-center justify-center font-medium text-muted-foreground" :style="rowStyle(index)">{{ option.label }}</li></ul>
    <div class="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 overflow-hidden rounded-md bg-foreground/[0.04]" :style="{ height: `${itemHeight}px`, perspective: '1000px' }"><ul ref="band" aria-hidden="true" class="absolute inset-x-0 top-1/2 m-0 h-0 list-none p-0 [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform]"><li v-for="(option, index) in options" :key="option.value" :data-index="index" class="absolute inset-x-0 flex items-center justify-center font-medium text-foreground" :style="rowStyle(index)">{{ option.label }}</li></ul></div>
    <div class="sr-only"><div v-for="option in options" :key="option.value" role="option" :aria-selected="candidate === option.value">{{ option.label }}</div></div>
  </div>
</template>
