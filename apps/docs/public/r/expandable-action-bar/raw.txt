<script setup lang="ts">
import { ref, useId } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { RenderNode, useControllable, type Content } from "../../shared";
import { useActionBar } from "./use-action-bar";
import type {
  ExpandableActionBarClassNames,
  ExpandableActionBarSize,
} from "./source-types";
export interface ExpandableActionBarItem {
  id: string;
  label: Content;
  icon: Content;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  badge?: Content;
  shortcut?: Content;
}
const props = withDefaults(
  defineProps<{
    items: ExpandableActionBarItem[];
    expanded?: boolean;
    defaultExpanded?: boolean;
    activeId?: string;
    size?: ExpandableActionBarSize;
    expandOnHover?: boolean;
    expandOnFocus?: boolean;
    collapseDelay?: number;
    classNames?: ExpandableActionBarClassNames;
  }>(),
  {
    expanded: undefined,
    defaultExpanded: false,
    size: "md",
    expandOnHover: true,
    expandOnFocus: true,
    collapseDelay: 90,
  },
);
const emit = defineEmits<{
  "update:expanded": [value: boolean];
  expandedChange: [value: boolean];
  action: [item: ExpandableActionBarItem];
}>();
const expanded = useControllable(
  () => props.expanded,
  props.defaultExpanded,
  (value) => {
    emit("update:expanded", value);
    emit("expandedChange", value);
  },
);
const reduce = useReducedMotion(),
  track = ref<unknown>(),
  id = useId();
const {
  highlightId,
  enter,
  leave,
  itemEnter,
  start,
  resetGesture,
  run,
  keydown,
  blur,
  open,
} = useActionBar(props, expanded, track, (item) => emit("action", item));
const itemTransition = {
  type: "spring",
  stiffness: 460,
  damping: 34,
  mass: 0.62,
} as const;
const labelTransition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.7,
} as const;
</script>
<template>
  <motion.div
    layout="size"
    role="toolbar"
    aria-label="Actions"
    :class="cn('inline-flex max-w-full', classNames?.root)"
    :transition="reduce ? { duration: 0 } : itemTransition"
    @pointerenter="enter"
    @pointerleave="leave"
    @focusin="expandOnFocus && open()"
    @focusout="blur"
    @keydown="keydown"
  >
    <motion.div
      ref="track"
      layout="size"
      :class="
        cn(
          'scrollbar-hide relative inline-flex max-w-full items-center overflow-x-auto overflow-y-hidden rounded-full border border-border bg-card/90 shadow-2xl backdrop-blur-xl',
          size === 'sm'
            ? 'min-h-9 gap-1 p-1 text-xs'
            : 'min-h-11 gap-1.5 p-1.5 text-sm',
          classNames?.track,
        )
      "
      :transition="reduce ? { duration: 0 } : itemTransition"
    >
      <motion.button
        v-for="item in items"
        :key="item.id"
        layout="position"
        type="button"
        :disabled="item.disabled"
        :title="typeof item.label === 'string' ? item.label : undefined"
        :aria-label="typeof item.label === 'string' ? item.label : undefined"
        :class="
          cn(
            'relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium text-muted-foreground outline-none transition-[color,background-color] duration-150 ease-out focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40',
            highlightId === item.id && 'text-foreground',
            size === 'sm' ? 'h-7 min-w-7 px-1.5' : 'h-8 min-w-8 px-2',
            classNames?.item,
            (item.active || props.activeId === item.id) &&
              classNames?.activeItem,
          )
        "
        :while-press="reduce || item.disabled ? undefined : { scale: 0.96 }"
        :transition="reduce ? { duration: 0 } : itemTransition"
        @pointerenter="itemEnter($event, item)"
        @pointerdown="start"
        @pointercancel="resetGesture"
        @keydown="resetGesture"
        @click="run($event, item)"
      >
        <motion.span
          v-if="highlightId === item.id"
          :layout-id="id + '-highlight'"
          class="absolute inset-0 -z-10 rounded-full bg-muted/80"
          :transition="reduce ? { duration: 0 } : itemTransition"
        />
        <slot
          name="item"
          :item="item"
          :expanded="expanded"
          :active="item.active || props.activeId === item.id"
        >
          <span
            :class="
              cn(
                'inline-flex shrink-0 items-center justify-center [&_svg]:size-full',
                size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
                classNames?.icon,
              )
            "
            ><RenderNode :node="item.icon"
          /></span>
          <motion.span
            :aria-hidden="!expanded"
            :animate="{
              width: expanded ? 'auto' : 0,
              opacity: expanded ? 1 : 0,
              marginLeft: expanded ? 8 : 0,
              x: reduce || expanded ? 0 : -4,
              filter: reduce || expanded ? 'blur(0px)' : 'blur(3px)',
            }"
            :transition="reduce ? { duration: 0 } : labelTransition"
            :class="
              cn(
                'inline-block overflow-hidden whitespace-nowrap',
                classNames?.label,
              )
            "
            ><RenderNode :node="item.label"
          /></motion.span>
          <motion.span
            v-if="item.shortcut"
            :aria-hidden="!expanded"
            :animate="{
              width: expanded ? 'auto' : 0,
              opacity: expanded ? 1 : 0,
              marginLeft: expanded ? 4 : 0,
            }"
            :transition="reduce ? { duration: 0 } : labelTransition"
            :class="
              cn(
                'hidden overflow-hidden whitespace-nowrap text-[10px] text-muted-foreground sm:inline-block',
                classNames?.shortcut,
              )
            "
            ><RenderNode :node="item.shortcut"
          /></motion.span>
          <span
            v-if="item.badge"
            :class="
              cn(
                'ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-none text-primary-foreground',
                !expanded && 'absolute right-0.5 top-0.5',
                classNames?.badge,
              )
            "
            ><RenderNode :node="item.badge"
          /></span>
        </slot>
      </motion.button>
    </motion.div>
  </motion.div>
</template>
