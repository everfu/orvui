<script setup lang="ts">
import { computed, ref, toRef, useId } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_OUT } from "../../../lib/ease";
import { RenderNode, useControllable, rove, type Content } from "../../shared";
import { useBlockDismiss } from "../../dismiss";
import { useTabMeasurements } from "./use-tab-measurements";
import type { ExpandableTabsClassNames } from "./source-types";
export interface ExpandableTabsItem {
  id: string;
  label: string;
  icon: Content;
  content: Content;
}
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    items: ExpandableTabsItem[];
    modelValue?: string | null;
    defaultValue?: string | null;
    classNames?: ExpandableTabsClassNames;
  }>(),
  { defaultValue: null },
);
const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  valueChange: [value: string | null];
}>();
const selection = useControllable(
  () => props.modelValue,
  props.defaultValue,
  (value) => {
    emit("update:modelValue", value);
    emit("valueChange", value);
  },
);
const active = computed(
  () => props.items.find((item) => item.id === selection.value) ?? null,
);
const reduce = useReducedMotion();
const id = useId();
const root = ref();
const sizer = ref<HTMLDivElement>();
const { size, widths, setLabel } = useTabMeasurements(
  toRef(props, "items"),
  sizer,
);
const closed = computed(() => ({
  width: props.items.length * 32 + Math.max(0, props.items.length - 1) * 4 + 18,
  height: 54,
}));
const dimensions = computed(() => {
  const measured = active.value && size.value ? size.value : null;
  return {
    width: `${measured ? Math.max(measured.width + 2, closed.value.width) : closed.value.width}px`,
    height: `${measured ? Math.max(measured.height + 2, closed.value.height) : closed.value.height}px`,
  };
});
const variants = computed(() =>
  reduce.value
    ? {
        enter: { opacity: 0, filter: "blur(0px)" },
        center: { opacity: 1, filter: "blur(0px)" },
        exit: {
          opacity: 0,
          filter: "blur(0px)",
          transition: { duration: 0.08, ease: EASE_OUT },
        },
      }
    : {
        enter: { y: -8, scale: 0.98, opacity: 0, filter: "blur(4px)" },
        center: { y: 0, scale: 1, opacity: 1, filter: "blur(0px)" },
        exit: {
          y: -6,
          scale: 0.98,
          opacity: 0,
          filter: "blur(4px)",
          transition: { duration: 0.08, ease: EASE_OUT },
        },
      },
);
const isActive = (item: ExpandableTabsItem) => active.value?.id === item.id;
function toggle(item: ExpandableTabsItem) {
  selection.value = isActive(item) ? null : item.id;
}
function labelMotion(item: ExpandableTabsItem) {
  const expanded = isActive(item);
  return {
    width: `${expanded ? (widths.value[item.id] ?? 0) : 0}px`,
    opacity: expanded ? 1 : 0,
    marginLeft: `${expanded ? 7 : 0}px`,
    filter: reduce.value || expanded ? "blur(0px)" : "blur(3px)",
  };
}
useBlockDismiss(
  computed(() => active.value !== null),
  root,
  () => {
    selection.value = null;
  },
);
</script>

<template>
  <motion.div
    ref="root"
    v-bind="$attrs"
    :initial="dimensions"
    :animate="dimensions"
    :transition="
      reduce
        ? { duration: 0 }
        : { type: 'spring', duration: 0.58, bounce: 0.06 }
    "
    :style="{
      transformOrigin: 'bottom center',
      width: closed.width + 'px',
      height: closed.height + 'px',
    }"
    :class="
      cn(
        'relative overflow-hidden rounded-[26px] border border-border bg-card',
        classNames?.root,
      )
    "
  >
    <div
      ref="sizer"
      aria-hidden="true"
      :class="
        cn(
          'pointer-events-none invisible absolute left-0 top-0 grid w-max px-2 pt-2',
          classNames?.panel,
        )
      "
      :style="{ paddingBottom: '56px' }"
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="col-start-1 row-start-1 w-max"
      >
        <slot name="content" :item="item"
          ><RenderNode :node="item.content"
        /></slot>
      </div>
    </div>
    <div
      :class="
        cn(
          'absolute left-0 right-0 top-0 z-10 overflow-hidden px-2 pt-2',
          classNames?.panel,
        )
      "
      :style="{ bottom: '56px' }"
    >
      <AnimatePresence
        :initial="false"
        mode="popLayout"
        as="div"
        class="contents"
      >
        <motion.div
          v-if="active"
          :key="active.id"
          :id="id + '-panel'"
          role="tabpanel"
          :aria-labelledby="id + '-' + active.id"
          :variants="variants"
          initial="enter"
          animate="center"
          exit="exit"
          :transition="
            reduce
              ? { duration: 0.15, ease: EASE_OUT }
              : { type: 'spring', duration: 0.46, bounce: 0.08 }
          "
          class="w-max"
          :style="{
            transformOrigin: 'top center',
            willChange: 'transform, opacity, filter',
          }"
          ><slot name="content" :item="active"
            ><RenderNode :node="active.content" /></slot
        ></motion.div>
      </AnimatePresence>
    </div>
    <div
      role="tablist"
      aria-label="Navigation tabs"
      aria-orientation="horizontal"
      :style="{ height: '52px' }"
      :class="
        cn(
          'absolute bottom-0 left-0 z-20 flex w-full items-center justify-between gap-1 p-2',
          classNames?.bar,
        )
      "
      @keydown="rove($event, $event.currentTarget as HTMLElement)"
    >
      <motion.button
        v-for="item in items"
        :key="item.id"
        :id="id + '-' + item.id"
        type="button"
        role="tab"
        :aria-selected="isActive(item)"
        :aria-label="item.label"
        :aria-controls="id + '-panel'"
        :layout="reduce ? false : 'position'"
        :animate="{
          width:
            (isActive(item) ? Math.max(32, 49 + (widths[item.id] ?? 0)) : 32) +
            'px',
        }"
        :transition="
          reduce
            ? { duration: 0 }
            : { type: 'spring', duration: 0.46, bounce: 0.04 }
        "
        :class="
          cn(
            'relative isolate flex h-9 min-w-8 shrink-0 items-center justify-center overflow-hidden rounded-[18px] px-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            isActive(item) && 'min-w-0 justify-start pl-2.5 pr-4',
            isActive(item)
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground',
            classNames?.tab,
            isActive(item) && classNames?.activeTab,
          )
        "
        @click="toggle(item)"
      >
        <span
          v-if="isActive(item)"
          :class="
            cn(
              'absolute inset-0 -z-10 rounded-[18px] bg-foreground/10',
              classNames?.pill,
            )
          "
        />
        <span
          :class="
            cn(
              'grid shrink-0 place-items-center [&_svg]:size-4',
              classNames?.icon,
            )
          "
          ><RenderNode :node="item.icon"
        /></span>
        <motion.span
          aria-hidden="true"
          :initial="false"
          :animate="labelMotion(item)"
          :transition="
            reduce
              ? { duration: 0 }
              : isActive(item)
                ? { type: 'spring', duration: 0.38, bounce: 0.03 }
                : { duration: 0.16, ease: EASE_OUT }
          "
          :class="
            cn(
              'inline-block overflow-hidden whitespace-nowrap',
              classNames?.label,
            )
          "
          >{{ item.label }}</motion.span
        >
      </motion.button>
    </div>
  </motion.div>
  <div
    aria-hidden="true"
    class="pointer-events-none fixed left-0 top-0 -z-10 flex opacity-0"
  >
    <span
      v-for="item in items"
      :key="item.id"
      :ref="(node) => setLabel(item.id, node)"
      :class="
        cn(
          'whitespace-nowrap text-sm font-medium leading-none',
          classNames?.label,
        )
      "
      >{{ item.label }}</span
    >
  </div>
</template>
