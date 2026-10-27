<script setup lang="ts">
import { useId } from "vue";
import { motion } from "motion-v";
import { Ellipsis } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { RenderNode } from "../../shared";
import { useSwipeRow } from "./use-swipe-row";
import type {
  SwipeAction,
  SwipeableListItem,
  SwipeableListValue,
  SwipeSide,
} from "./SwipeableList.vue";
import type { SwipeableListClassNames } from "./source-types";
const props = defineProps<{
  item: SwipeableListItem;
  actionWidth: number;
  revealThreshold: number;
  openValue: SwipeableListValue | null;
  closeOnAction: boolean;
  classNames?: SwipeableListClassNames;
}>();
const emit = defineEmits<{
  change: [value: SwipeableListValue | null];
  action: [
    payload: { item: SwipeableListItem; action: SwipeAction; side: SwipeSide },
  ];
}>();
const railId = useId();
const {
  rail,
  toggle,
  left,
  right,
  leftWidth,
  rightWidth,
  openSide,
  x,
  dragStart,
  dragEnd,
  run,
  snap,
  keyboardOpen,
  keydown,
  railKey,
} = useSwipeRow(
  props,
  (value) => emit("change", value),
  (payload) => emit("action", payload),
);
const tones = {
  neutral: "text-muted-foreground group-hover:text-foreground",
  primary: "text-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-destructive",
};
const sides = ["left", "right"] as const;
</script>
<template>
  <div
    :class="
      cn(
        'relative isolate overflow-hidden rounded-2xl bg-muted',
        item.disabled && 'opacity-60',
        classNames?.item,
      )
    "
  >
    <div
      ref="rail"
      :id="railId"
      :aria-hidden="!openSide"
      :inert="!openSide"
      :class="
        cn(
          'absolute inset-0 z-0 flex overflow-hidden rounded-2xl',
          classNames?.rail,
        )
      "
      @keydown="railKey"
    >
      <div
        v-for="side in sides"
        :key="side"
        :data-side="side"
        :class="
          cn(
            'flex h-full overflow-hidden',
            side === 'left' ? 'rounded-l-2xl' : 'ml-auto rounded-r-2xl',
          )
        "
      >
        <button
          v-for="action in side === 'left' ? left : right"
          :key="action.id"
          type="button"
          :disabled="action.disabled || item.disabled"
          :tabindex="openSide === side ? 0 : -1"
          :aria-label="
            typeof action.label === 'string' ? action.label : undefined
          "
          :class="
            cn(
              'group flex h-full shrink-0 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
              classNames?.action,
            )
          "
          :style="{ width: actionWidth + 'px' }"
          @click="run(action, side)"
        >
          <span
            :class="
              cn(
                'grid h-9 w-9 place-items-center rounded-full transition-[background-color,color,transform] duration-150 group-hover:bg-background group-active:scale-95 [&_svg]:size-4',
                tones[action.tone ?? 'neutral'],
              )
            "
            ><RenderNode :node="action.icon" /></span
          ><span class="sr-only"><RenderNode :node="action.label" /></span>
        </button>
      </div>
    </div>
    <motion.div
      :drag="item.disabled ? false : 'x'"
      :drag-constraints="{ left: -rightWidth, right: leftWidth }"
      :drag-elastic="0.04"
      :drag-momentum="false"
      :style="{ x }"
      :class="
        cn(
          'relative z-10 min-h-[72px] cursor-grab touch-pan-y rounded-2xl border border-border bg-card px-4 py-3 shadow-sm active:cursor-grabbing [-webkit-touch-callout:none] pointer-coarse:select-none',
          classNames?.surface,
        )
      "
      @drag-start="dragStart"
      @drag-end="dragEnd"
    >
      <slot :item="item"
        ><RenderNode v-if="item.content" :node="item.content" />
        <div v-else class="flex min-w-0 items-center gap-3">
          <div
            v-if="item.leading"
            :class="cn('shrink-0 [&_svg]:size-5', classNames?.leading)"
          >
            <RenderNode :node="item.leading" />
          </div>
          <div :class="cn('min-w-0 flex-1', classNames?.content)">
            <div
              v-if="item.title"
              :class="
                cn(
                  'truncate text-sm font-medium text-foreground',
                  classNames?.title,
                )
              "
            >
              <RenderNode :node="item.title" />
            </div>
            <div
              v-if="item.description"
              :class="
                cn(
                  'mt-0.5 truncate text-xs text-muted-foreground',
                  classNames?.description,
                )
              "
            >
              <RenderNode :node="item.description" />
            </div>
          </div>
          <div
            v-if="item.meta"
            :class="
              cn(
                'shrink-0 text-xs font-medium text-muted-foreground',
                classNames?.meta,
              )
            "
          >
            <RenderNode :node="item.meta" />
          </div></div
      ></slot>
      <button
        v-if="(left.length || right.length) && !item.disabled"
        ref="toggle"
        type="button"
        :aria-label="
          typeof item.title === 'string'
            ? `Actions for ${item.title}`
            : 'Show actions'
        "
        :aria-expanded="!!openSide"
        :aria-controls="railId"
        class="sr-only grid place-items-center rounded-full bg-muted text-muted-foreground outline-none focus-visible:not-sr-only focus-visible:absolute focus-visible:right-3 focus-visible:top-1/2 focus-visible:h-8 focus-visible:w-8 focus-visible:-translate-y-1/2 focus-visible:ring-2 focus-visible:ring-ring"
        @click="
          openSide
            ? snap(null)
            : keyboardOpen(rightWidth > 0 ? 'right' : 'left')
        "
        @keydown="keydown"
      >
        <Ellipsis aria-hidden="true" class="h-4 w-4" />
      </button>
    </motion.div>
  </div>
</template>
