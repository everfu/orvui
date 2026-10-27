<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { RenderNode } from "../../shared";
import type { OverflowActionItem } from "./OverflowActions.vue";
import type { OverflowActionsClassNames } from "./source-types";
const props = defineProps<{
  item: OverflowActionItem;
  size: "sm" | "md";
  reduce: boolean;
  canHover: boolean;
  overflow?: boolean;
  visible?: boolean;
  classNames?: OverflowActionsClassNames;
}>();
const emit = defineEmits<{ action: [item: OverflowActionItem] }>();
const variants = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
};
const animation = computed(() =>
  props.overflow
    ? {
        initial: props.reduce ? { opacity: 0 } : "hidden",
        animate: props.reduce ? { opacity: 1 } : "visible",
        exit: props.reduce ? { opacity: 0 } : "exit",
      }
    : {},
);
</script>
<template>
  <motion.span
    layout="position"
    :variants="overflow ? variants : undefined"
    v-bind="animation"
    :while-press="reduce || item.disabled ? undefined : { scale: 0.97 }"
    :while-hover="
      reduce || !canHover || item.disabled ? undefined : { scale: 1.008 }
    "
    :transition="
      reduce
        ? { duration: 0 }
        : { type: 'spring', stiffness: 220, damping: 17, mass: 0.85 }
    "
    class="inline-flex shrink-0"
    ><button
      type="button"
      :disabled="item.disabled"
      :aria-label="item.ariaLabel"
      :tabindex="overflow && !visible ? -1 : undefined"
      :title="typeof item.label === 'string' ? item.label : undefined"
      @click="emit('action', item)"
      :class="
        cn(
          'inline-flex shrink-0 items-center justify-center rounded-full bg-background font-medium text-foreground outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          size === 'sm'
            ? 'h-8 min-w-8 gap-1.5 px-3'
            : 'h-9 min-w-9 gap-2 px-3.5',
          classNames?.action,
          overflow ? classNames?.overflowAction : classNames?.primaryAction,
        )
      "
    >
      <span
        v-if="item.icon"
        :class="
          cn(
            'inline-flex shrink-0 items-center justify-center [&>svg]:size-full',
            size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
            classNames?.icon,
          )
        "
        ><RenderNode :node="item.icon" /></span
      ><span :class="cn('whitespace-nowrap', classNames?.label)"
        ><RenderNode :node="item.label"
      /></span></button
  ></motion.span>
</template>
