<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, inject } from "vue";
import { motion } from "motion-v";
import { Minus, Plus } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
import { resolveElement } from "../../../lib/composables";
import LiquidItem from "./LiquidItem.vue";
import type { StepperContext } from "./context";
const props = defineProps<{ direction: -1 | 1 }>();
const state = inject<StepperContext>("orvui-stepper");
if (!state) throw new Error("AdaptiveStepper action must be inside AdaptiveStepper");
const hidden = computed(() => props.direction < 0 ? state.atMin.value : state.atMax.value);
const position = computed(() => props.direction < 0 ? hidden.value ? 32 : 0 : hidden.value ? 136 : 168);
function activate(event: MouseEvent) {
  if (event.defaultPrevented || hidden.value || state!.disabled.value) return;
  (props.direction < 0 ? state!.decrement : state!.increment)(event.detail === 0);
}
function setRef(node: unknown) { (props.direction < 0 ? state!.decrementRef : state!.incrementRef).value = resolveElement<HTMLButtonElement>(node); }
</script>
<template><LiquidItem :x="position" :width="48">
  <motion.button v-bind="$attrs" :ref="setRef" type="button" :aria-label="($attrs['aria-label'] as string) ?? (direction < 0 ? 'Decrease value' : 'Increase value')"
    :aria-hidden="hidden || undefined" :tabindex="hidden ? -1 : ($attrs.tabindex as number)" :disabled="state.disabled.value || hidden"
    :while-press="state.reduce.value || state.disabled.value || hidden ? undefined : { scale: 0.94 }" :transition="state.reduce.value ? { duration: 0 } : SPRING_PRESS"
    @click="activate" :class="cn('grid size-full place-items-center rounded-full border border-transparent bg-transparent bg-clip-padding text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none', hidden && 'hover:bg-transparent', state.disabled.value && 'opacity-50', $attrs.class as string)">
    <motion.span aria-hidden="true" :initial="{ opacity: hidden ? 0 : 1, filter: hidden ? 'blur(2px)' : 'blur(0px)' }" :animate="{ opacity: hidden ? 0 : 1, filter: hidden ? 'blur(2px)' : 'blur(0px)' }"
      :transition="{ duration: state.reduce.value ? 0 : 0.15, ease: EASE_OUT }"><slot><component :is="direction < 0 ? Minus : Plus" class="size-5" :stroke-width="2.5" /></slot></motion.span>
  </motion.button>
</LiquidItem></template>
