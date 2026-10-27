<script setup lang="ts">
import { computed, inject, provide } from "vue";
import { motion } from "motion-v";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { messageKey } from "../../message/src/context";
import {
  bubbleKey,
  type MessageBubbleAlign,
  type MessageBubbleVariant,
} from "./context";
const props = withDefaults(
  defineProps<{
    variant?: MessageBubbleVariant;
    align?: MessageBubbleAlign;
    animateIn?: boolean;
  }>(),
  { variant: "soft", animateIn: false },
);
const parent = inject(
  messageKey,
  computed(() => "assistant" as const),
);
const alignment = computed(
  () => props.align ?? (parent.value === "user" ? "end" : "start"),
);
const context = computed(() => ({
  align: alignment.value,
  variant: props.variant,
  animateIn: props.animateIn,
}));
provide(bubbleKey, context);
const reduced = useReducedMotion();
</script>
<template>
  <motion.div
    data-slot="message-bubble"
    :data-align="alignment"
    :data-variant="variant"
    :class="
      cn(
        'group/bubble flex w-full flex-col',
        alignment === 'end' ? 'items-end' : 'items-start',
      )
    "
    :exit="{ opacity: 0, y: -3, scale: 0.99 }"
    :transition="reduced ? { duration: 0 } : SPRING_LAYOUT"
    ><slot
  /></motion.div>
</template>
