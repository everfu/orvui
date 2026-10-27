<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_LAYOUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";
import { useRailState, type RailEntry } from "./rail-state";
interface RailItem extends RailEntry {}
const props = withDefaults(defineProps<{ items: RailItem[]; label?: string; orientation?: "vertical" | "horizontal"; activeId?: string; defaultActiveId?: string; showPreview?: boolean; previewSide?: "before" | "after"; highlightActive?: boolean; itemSize?: number; railClassName?: string; previewContainerClassName?: string; previewClassName?: string }>(), { label: "Section navigation", orientation: "vertical", showPreview: true, previewSide: "after", highlightActive: false, itemSize: 24 });
const emit = defineEmits<{ "update:activeId": [id: string]; activeChange: [id: string]; itemSelect: [item: RailItem] }>();
const root = ref<HTMLElement | null>(null);
const active = useMotionState(props, emit, "activeId", props.defaultActiveId ?? props.items[0]?.id ?? "");
const state = useRailState(root, props, active, emit);
const reduced = useReducedMotion();
const id = useId();
const horizontal = computed(() => props.orientation === "horizontal");
const grid = computed(() => { const tracks = props.items.length ? `repeat(${props.items.length}, ${props.itemSize}px)` : undefined; return horizontal.value ? { gridTemplateColumns: tracks } : { gridTemplateRows: tracks }; });
const dimension = computed(() => horizontal.value ? { width: `${props.itemSize}px` } : { height: `${props.itemSize}px` });
</script>
<template>
  <div ref="root" @focusout="state.blur" :class="cn('isolate relative flex w-full overflow-visible', horizontal ? 'min-h-64 flex-col items-center justify-center' : 'min-h-80')">
    <nav :aria-label="label" @pointerleave="state.leave" :style="grid" :class="cn('relative z-10 grid shrink-0', horizontal ? 'h-12 w-fit max-w-full self-center justify-center' : 'w-12 content-center', railClassName)">
      <component :is="item.href ? 'a' : 'button'" v-for="(item, index) in items" :key="item.id" data-slot="preview-rail-item" :type="item.href ? undefined : 'button'" :href="item.href" :target="item.target" :rel="item.rel ?? (item.target === '_blank' ? 'noreferrer noopener' : undefined)" :aria-label="item.ariaLabel ?? item.label" :aria-current="state.selected.value === item.id ? item.href ? 'page' : 'location' : undefined" @pointerenter="state.enter($event, item)" @pointerdown="state.down($event, item)" @pointermove="state.move" @pointercancel="state.cancel" @keydown="state.cancel" @focus="state.focus($event, item)" @click="state.select($event, item)" :style="dimension" :class="cn('relative flex text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background', horizontal ? 'h-12 w-6 items-end justify-center' : 'h-6 w-12 items-center')">
        <motion.span data-slot="preview-rail-tick" aria-hidden="true" :animate="horizontal ? { scaleY: state.scale(index) } : { scaleX: state.scale(index) }" :transition="reduced ? { duration: 0 } : SPRING_LAYOUT" :class="cn('block bg-current', horizontal ? 'h-12 w-0.5 origin-bottom' : 'h-0.5 w-12 origin-left', state.highlighted.value === item.id && 'text-foreground')" />
      </component>
    </nav>
    <div v-if="showPreview" aria-hidden="true" :style="grid" :class="cn('pointer-events-none absolute z-50 grid', horizontal ? 'top-1/2 left-1/2 h-5 w-fit max-w-full -translate-x-1/2 -translate-y-1/2 justify-center' : previewSide === 'before' ? 'inset-y-0 right-16 left-4 content-center' : 'inset-y-0 right-4 left-16 content-center', previewContainerClassName)">
      <div v-for="item in items" :key="item.id" :style="dimension" :class="cn('relative flex items-center', horizontal && 'justify-center')"><div v-if="item.id === state.preview.value" :class="cn(horizontal ? 'absolute bottom-12 left-1/2 w-72 -translate-x-1/2' : cn('w-full max-w-sm', previewSide === 'before' && 'ml-auto'), previewClassName)">
        <motion.div :layout-id="`preview-rail-card-${id}`" :transition="reduced ? { duration: 0 } : SPRING_LAYOUT"><AnimatePresence mode="wait" :initial="false"><motion.div :key="item.id" :initial="reduced ? { opacity: 0 } : { opacity: 0, y: 4, filter: 'blur(6px)' }" :animate="reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }" :exit="reduced ? { opacity: 0 } : { opacity: 0, y: -2, filter: 'blur(4px)', transition: { duration: .12, ease: EASE_OUT } }" :transition="{ duration: reduced ? 0 : .18, ease: EASE_OUT }"><slot name="preview" :item="item"><div data-slot="preview-rail-card" class="rounded-2xl border border-border bg-card p-4 shadow-sm"><p data-slot="preview-rail-title" class="font-medium text-card-foreground">{{ item.label }}</p><div v-if="item.description" data-slot="preview-rail-description" class="mt-1 text-sm leading-6 text-muted-foreground">{{ item.description }}</div></div></slot></motion.div></AnimatePresence></motion.div>
      </div></div>
    </div>
    <div v-if="$slots.default" class="min-h-0 min-w-0 flex-1"><slot /></div>
  </div>
</template>
