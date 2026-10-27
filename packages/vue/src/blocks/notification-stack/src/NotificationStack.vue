<script setup lang="ts">
import { computed, ref } from "vue";
import { motion } from "motion-v";
import { ArrowUpRight, BellOff } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { ActionSwapText } from "../../../motion/action-swap";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { useControllable, type Content } from "../../shared";
import { useStackInteraction } from "./use-stack-interaction";
import NotificationContent from "./NotificationContent.vue";
import type { NotificationStackClassNames } from "./source-types";
export interface NotificationStackItem {
  id: string;
  title: Content;
  description?: Content;
  trailing?: Content;
}
const props = withDefaults(
  defineProps<{
    items: NotificationStackItem[];
    expanded?: boolean;
    defaultExpanded?: boolean;
    maxVisible?: number;
    collapsedLabel?: string;
    expandedLabel?: string;
    emptyLabel?: string;
    classNames?: NotificationStackClassNames;
  }>(),
  {
    expanded: undefined,
    defaultExpanded: false,
    maxVisible: 3,
    collapsedLabel: "Notifications",
    expandedLabel: "View all",
    emptyLabel: "All caught up",
  },
);
const emit = defineEmits<{
  "update:expanded": [expanded: boolean];
  expandedChange: [expanded: boolean];
  viewAll: [];
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
  root = ref<unknown>();
const visible = computed(() =>
  props.items.slice(0, Math.max(1, props.maxVisible)),
);
const { enter, leave, start, cancel, activate, focus, blur, keydown } =
  useStackInteraction(expanded, root, () => emit("viewAll"));
</script>
<template>
  <div
    v-if="!visible.length"
    class="flex w-full max-w-[22rem] items-center justify-center gap-2 rounded-3xl bg-muted/70 px-5 py-8 text-sm font-medium text-muted-foreground"
  >
    <BellOff class="h-4 w-4" aria-hidden="true" />{{ emptyLabel }}
  </div>
  <motion.button
    v-else
    ref="root"
    type="button"
    :initial="false"
    :aria-expanded="expanded"
    :aria-label="
      expanded
        ? `${items.length} notifications. ${expandedLabel}.`
        : `${items.length} notifications. Expand notifications.`
    "
    class="relative z-10 block w-full max-w-[22rem] cursor-pointer rounded-3xl text-left text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    @pointerenter="enter"
    @pointerleave="leave"
    @pointerdown="start"
    @pointercancel="cancel"
    @focus="focus"
    @blur="blur"
    @keydown="keydown"
    @click="activate"
  >
    <span aria-hidden="true" class="invisible block p-3"
      ><span class="block"
        ><span
          :class="
            cn(
              'block rounded-2xl border border-transparent px-4',
              classNames?.card,
            )
          "
          ><NotificationContent
            :item="visible[0]"
            :class-names="classNames" /></span></span
      ><span class="mt-2 block h-9"
    /></span>
    <span class="absolute inset-x-0 bottom-0 block p-3">
      <motion.span
        aria-hidden="true"
        layout
        :initial="false"
        :transition="
          reduce ? { duration: 0 } : { duration: 0.26, ease: EASE_OUT }
        "
        class="absolute inset-0 rounded-3xl bg-muted"
      />
      <span
        :class="
          cn('relative z-10 grid gap-1', !expanded && 'pb-2', classNames?.stack)
        "
        ><motion.span
          v-for="(item, index) in visible"
          :key="item.id"
          layout="position"
          :initial="false"
          :animate="{
            y: expanded ? 0 : index * 8,
            clipPath: expanded
              ? 'inset(0px 0px round 16px)'
              : `inset(0px ${index * 12}px round 16px)`,
          }"
          :transition="
            reduce ? { duration: 0 } : { duration: 0.32, ease: EASE_OUT }
          "
          :class="
            cn(
              'block rounded-2xl border border-border/70 bg-background px-4',
              classNames?.card,
            )
          "
          :style="{
            zIndex: visible.length - index,
            gridColumn: 1,
            gridRow: expanded ? index + 1 : 1,
          }"
          ><span
            :class="cn('block', index !== 0 && !expanded ? 'invisible' : '')"
            ><NotificationContent
              :item="item"
              :class-names="classNames" /></span></motion.span
      ></span>
      <motion.span
        layout="position"
        :transition="reduce ? { duration: 0 } : SPRING_LAYOUT"
        :class="
          cn(
            'relative z-10 mt-2 flex min-h-9 items-center gap-2 px-1',
            classNames?.footer,
          )
        "
        ><span
          :class="
            cn(
              'grid size-7 shrink-0 place-items-center rounded-full bg-orange-600 text-xs font-medium text-white shadow-[inset_0_1px_2px_rgb(0_0_0/0.2),inset_0_-1px_0_rgb(255_255_255/0.16)] dark:bg-orange-500',
              classNames?.count,
            )
          "
          >{{ items.length }}</span
        ><span class="flex items-center text-sm font-medium"
          ><ActionSwapText
            :value="expanded ? 'expanded' : 'collapsed'"
            animation="roll"
            ><span v-if="expanded" class="inline-flex items-center gap-1"
              >{{ expandedLabel
              }}<ArrowUpRight class="size-4" aria-hidden="true" /></span
            ><template v-else>{{ collapsedLabel }}</template></ActionSwapText
          ></span
        ></motion.span
      >
    </span>
  </motion.button>
</template>
