<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, useId, watch } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { MoreHorizontal, X } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import {
  resolveElement,
  useMediaQuery,
  useReducedMotion,
} from "../../../lib/composables";
import { EASE_OUT } from "../../../lib/ease";
import { useControllable, rove, type Content } from "../../shared";
import type { OverflowActionsClassNames } from "./source-types";
import ActionButton from "./ActionButton.vue";
export interface OverflowActionItem {
  id: string;
  label: Content;
  icon?: Content;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}
const props = withDefaults(
  defineProps<{
    primaryActions: OverflowActionItem[];
    overflowActions: OverflowActionItem[];
    expanded?: boolean;
    defaultExpanded?: boolean;
    collapseOnAction?: boolean;
    size?: "sm" | "md";
    openLabel?: string;
    closeLabel?: string;
    classNames?: OverflowActionsClassNames;
  }>(),
  {
    expanded: undefined,
    defaultExpanded: false,
    collapseOnAction: false,
    size: "md",
    openLabel: "Show extra actions",
    closeLabel: "Hide extra actions",
  },
);
const emit = defineEmits<{
  "update:expanded": [value: boolean];
  expandedChange: [value: boolean];
  action: [item: OverflowActionItem];
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
  canHover = useMediaQuery("(hover:hover) and (pointer:fine)");
const id = useId(),
  wrapper = ref<unknown>();
const transition = computed(() =>
  reduce.value
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 220, damping: 17, mass: 0.85 },
);
const iconVariants = {
  hidden: { opacity: 0, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.18, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    filter: "blur(3px)",
    transition: { duration: 0.18, ease: EASE_OUT },
  },
};
let anchorLeft = 0;
function align() {
  const element = resolveElement<HTMLElement>(wrapper.value);
  if (!element) return;
  if (expanded.value) {
    element.style.left = "";
    anchorLeft = element.getBoundingClientRect().left;
  } else
    element.style.left = `${anchorLeft - element.getBoundingClientRect().left}px`;
}
watch(expanded, align, { flush: "post" });
onMounted(align);
onUpdated(align);
function run(item: OverflowActionItem) {
  if (item.disabled) return;
  item.onClick?.();
  emit("action", item);
  if (props.collapseOnAction) expanded.value = false;
}
</script>
<template>
  <motion.div
    layout
    :transition="transition"
    :class="cn('inline-flex', classNames?.root)"
    role="toolbar"
    @keydown="rove($event, $event.currentTarget as HTMLElement)"
  >
    <motion.div
      layout
      :transition="transition"
      :class="
        cn(
          'relative inline-flex items-center overflow-hidden rounded-full border border-border bg-card',
          size === 'sm' ? 'gap-1 p-1 text-xs' : 'gap-1.5 p-1.5 text-sm',
          classNames?.track,
        )
      "
    >
      <motion.div
        layout
        :transition="transition"
        :class="
          cn('inline-flex items-center', size === 'sm' ? 'gap-1' : 'gap-1.5')
        "
        ><ActionButton
          v-for="item in primaryActions"
          :key="item.id"
          :item="item"
          :size="size"
          :reduce="reduce"
          :can-hover="canHover"
          :class-names="classNames"
          @action="run"
      /></motion.div>
      <AnimatePresence
        mode="popLayout"
        :initial="false"
        as="div"
        class="contents"
        ><motion.div
          v-if="expanded"
          key="overflow-actions"
          ref="wrapper"
          :id="id"
          layout
          :aria-hidden="!expanded"
          :transition="transition"
          :class="
            cn(
              'relative inline-flex w-max items-center',
              size === 'sm' ? 'gap-1' : 'gap-1.5',
            )
          "
          ><ActionButton
            v-for="item in overflowActions"
            :key="item.id"
            :item="item"
            :size="size"
            :reduce="reduce"
            :can-hover="canHover"
            overflow
            :visible="expanded"
            :class-names="classNames"
            @action="run" /></motion.div
      ></AnimatePresence>
      <motion.button
        type="button"
        layout
        :aria-expanded="expanded"
        :aria-controls="expanded ? id : undefined"
        :aria-label="expanded ? closeLabel : openLabel"
        :title="expanded ? closeLabel : openLabel"
        @click="expanded = !expanded"
        :while-press="reduce ? undefined : { scale: 0.96 }"
        :while-hover="reduce || !canHover ? undefined : { scale: 1.03 }"
        :transition="transition"
        :class="
          cn(
            'relative inline-grid shrink-0 place-items-center rounded-full bg-primary text-primary-foreground outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            size === 'sm' ? 'h-8 w-8' : 'h-9 w-9',
            classNames?.toggle,
          )
        "
        ><AnimatePresence mode="popLayout" :initial="false"
          ><motion.span
            :key="expanded ? 'close' : 'open'"
            :variants="iconVariants"
            :initial="reduce ? { opacity: 0 } : 'hidden'"
            :animate="reduce ? { opacity: 1 } : 'visible'"
            :exit="reduce ? { opacity: 0 } : 'exit'"
            class="inline-grid place-items-center"
            ><X
              v-if="expanded"
              :class="
                size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
              " /><MoreHorizontal
              v-else
              :class="
                size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'
              " /></motion.span></AnimatePresence
      ></motion.button>
    </motion.div>
  </motion.div>
</template>
