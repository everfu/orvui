<script setup lang="ts">
import { getCurrentInstance } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { X } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { RenderNode, type Content } from "../../shared";
import { EASE_OUT, SPRING_PRESS } from "../../../lib/ease";
import { safeId, SURFACE_INSET, TAB_HEIGHT, TAB_TOP } from "./model";
import { useMorphingTabs } from "./use-morphing-tabs";
import type { MorphingTabsClassNames } from "./source-types";
import SpringTab from "./SpringTab.vue";
export interface MorphingTabsItem {
  id: string;
  label: string;
  icon?: Content;
  content: Content;
  disabled?: boolean;
}
const props = withDefaults(
  defineProps<{
    items: MorphingTabsItem[];
    modelValue?: string | null;
    defaultValue?: string | null;
    ariaLabel?: string;
    closable?: boolean;
    classNames?: MorphingTabsClassNames;
  }>(),
  { ariaLabel: "Tabs" },
);
const emit = defineEmits<{
  "update:modelValue": [id: string | null];
  valueChange: [id: string | null];
  orderChange: [ids: string[]];
  close: [id: string];
}>();
const instance = getCurrentInstance();
const hasClose = () => props.closable || !!instance?.vnode.props?.onClose;
const {
  reduce,
  uid,
  root,
  rail,
  ordered,
  active,
  surfaceWidth,
  draggingId,
  dragLeft,
  surfaceLeft,
  geometry,
  slotLefts,
  tabs,
  visualIndex,
  register,
  startDrag,
  moveDrag,
  finish,
  clickTab,
  key,
} = useMorphingTabs(props, {
  value(id) {
    emit("update:modelValue", id);
    emit("valueChange", id);
  },
  order(ids) {
    emit("orderChange", ids);
  },
});
</script>
<template>
  <div
    v-if="ordered.length"
    ref="root"
    :class="
      cn(
        'relative isolate min-w-0 overflow-hidden rounded-[2rem] bg-[#292929] text-white',
        classNames?.root,
      )
    "
  >
    <div class="relative h-20">
      <div
        ref="rail"
        role="tablist"
        :aria-label="ariaLabel"
        aria-orientation="horizontal"
        :class="
          cn('relative z-30 flex h-full gap-3 md:gap-4', classNames?.rail)
        "
      >
        <SpringTab
          v-for="(item, index) in ordered"
          :id="item.id"
          :key="item.id"
          :target-left="slotLefts[visualIndex(index)] ?? SURFACE_INSET"
          :dragging="item.id === draggingId"
          :drag-left="dragLeft"
          :surface-left="surfaceLeft"
          :reduce="reduce"
          :active="item.id === active?.id"
          :any-dragging="!!draggingId"
          :surface-host="root ?? null"
          :surface-width="surfaceWidth"
          :tab-width="geometry.width"
          :surface-class-name="classNames?.activeTab"
          :z-index="
            item.id === draggingId ? 30 : item.id === active?.id ? 20 : 1
          "
          :class="item.disabled ? 'cursor-not-allowed' : ''"
          @register="register"
          @pointerdown="startDrag(item.id, $event)"
          @pointermove="moveDrag"
          @pointerup="finish"
          @pointercancel="finish"
          @lostpointercapture="
            (event: PointerEvent) => {
              if (event.target === event.currentTarget) finish(event);
            }
          "
        >
          <div
            class="relative flex items-stretch"
            :style="{
              width: geometry.width + 'px',
              height: TAB_HEIGHT + 'px',
              marginTop: TAB_TOP + 'px',
            }"
          >
            <span
              v-if="item.id !== active?.id"
              aria-hidden="true"
              :class="
                cn(
                  'absolute inset-x-0 bottom-2 top-0 rounded-[1.25rem] transition-colors duration-200',
                  item.id === draggingId
                    ? 'bg-[#3a3a3a]'
                    : 'bg-transparent group-hover:bg-white/[.06]',
                )
              "
            />
            <button
              :id="uid + '-tab-' + safeId(item.id)"
              :ref="
                (node) => {
                  if (node) tabs.set(item.id, node as HTMLButtonElement);
                  else tabs.delete(item.id);
                }
              "
              type="button"
              role="tab"
              :aria-selected="item.id === active?.id"
              :aria-controls="uid + '-panel'"
              :aria-disabled="item.disabled || undefined"
              :tabindex="item.id === active?.id ? 0 : -1"
              :disabled="item.disabled"
              :class="
                cn(
                  'group relative z-10 flex h-full w-full min-w-0 items-center gap-2 overflow-hidden rounded-t-[1.5rem] px-3 text-left outline-none transition-colors',
                  item.id === active?.id
                    ? 'text-[#181818]'
                    : 'pb-2 text-white/70 hover:text-white',
                  classNames?.tab,
                )
              "
              @click="clickTab(item.id)"
              @keydown="key($event, item.id)"
            >
              <span
                aria-hidden="true"
                :class="
                  cn(
                    'pointer-events-none absolute inset-x-1 top-1 opacity-0 transition-opacity group-focus-visible:opacity-100',
                    item.id === active?.id
                      ? 'bottom-0 rounded-t-[1.25rem] border-x-2 border-t-2 border-black/30'
                      : 'bottom-2 rounded-[1rem] border-2 border-white/70',
                  )
                "
              /><span
                v-if="item.icon"
                aria-hidden="true"
                :class="
                  cn(
                    'grid size-8 shrink-0 place-items-center [&_svg]:size-5',
                    classNames?.icon,
                  )
                "
                ><RenderNode :node="item.icon" /></span
              ><span
                :class="
                  cn(
                    'min-w-0 truncate whitespace-nowrap text-base font-medium leading-none tracking-[-.025em]',
                    classNames?.label,
                  )
                "
                >{{ item.label }}</span
              >
            </button>
            <button
              v-if="hasClose()"
              type="button"
              :aria-label="'Close ' + item.label"
              :class="
                cn(
                  'absolute right-2 top-1/2 z-20 grid size-6 -translate-y-1/2 place-items-center rounded-full text-[#9aa0a8] transition-colors hover:bg-black/[.06] hover:text-[#4b5563] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
                  item.id !== active?.id
                    ? '!top-[calc(50%-4px)] text-white/45 hover:bg-white/[.08] hover:text-white/80'
                    : '',
                  classNames?.close,
                )
              "
              @pointerdown.stop
              @click.stop="emit('close', item.id)"
            >
              <X class="size-3.5 stroke-[1.5]" />
            </button>
          </div>
        </SpringTab>
      </div>
    </div>
    <div
      :id="uid + '-panel'"
      role="tabpanel"
      :aria-labelledby="uid + '-tab-' + safeId(active?.id ?? 'empty')"
      :class="
        cn(
          'relative z-20 mx-4 min-h-64 overflow-hidden rounded-[1.75rem] bg-[#fafaf8] text-[#181818]',
          classNames?.content,
        )
      "
    >
      <AnimatePresence mode="popLayout" :initial="false"
        ><motion.div
          v-if="active"
          :key="active.id"
          :initial="
            reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: 'blur(6px)' }
          "
          :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
          :exit="
            reduce
              ? { opacity: 0, transition: { duration: 0.08, ease: EASE_OUT } }
              : {
                  opacity: 0,
                  y: -5,
                  filter: 'blur(5px)',
                  transition: { duration: 0.12, ease: EASE_OUT },
                }
          "
          :transition="
            reduce ? { duration: 0.12, ease: EASE_OUT } : SPRING_PRESS
          "
          class="min-h-64"
          ><slot name="content" :item="active"
            ><RenderNode :node="active.content" /></slot></motion.div
      ></AnimatePresence>
    </div>
  </div>
</template>
