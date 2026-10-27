<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { motion } from "motion-v";
import { ChevronDown } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { EASE_OUT } from "../../../lib/ease";
import { resolveElement } from "../../../lib/composables";
import RenderContent from "../../../lib/RenderContent";
const props = defineProps<{
  item: { id: string; title: any; description?: any; icon?: any; disabled?: boolean }; open: boolean;
  startsGroup: boolean; endsGroup: boolean; separatedFromPrevious: boolean; contentId: string; triggerId: string;
  reduce: boolean; layoutTransition: any; layoutDependency: string | null; classNames?: Record<string, string>;
}>();
const emit = defineEmits<{ toggle: [] }>();
const content = ref<HTMLElement | null>(null), height = ref(0);
let observer: ResizeObserver | undefined;
function measure() { height.value = content.value?.offsetHeight ?? 0; }
onMounted(() => { measure(); if (content.value && typeof ResizeObserver !== "undefined") { observer = new ResizeObserver(measure); observer.observe(content.value); } });
onBeforeUnmount(() => observer?.disconnect());
function toggle(event: MouseEvent) { if (!props.item.disabled && !event.defaultPrevented) emit("toggle"); }
</script>
<template><motion.div :layout="reduce ? false : 'position'" :layout-dependency="layoutDependency" :initial="false" :style="{ marginTop: separatedFromPrevious ? '12px' : '0px' }" :transition="{ layout: layoutTransition }">
  <motion.div :data-state="open ? 'open' : 'closed'" :layout="!reduce" :layout-dependency="layoutDependency" :initial="false"
    :animate="{ borderTopLeftRadius: startsGroup ? '28px' : '0px', borderTopRightRadius: startsGroup ? '28px' : '0px', borderBottomLeftRadius: endsGroup ? '28px' : '0px', borderBottomRightRadius: endsGroup ? '28px' : '0px' }"
    :transition="reduce ? { duration: 0 } : layoutTransition" :style="{ originY: 0 }" :class="cn('overflow-hidden bg-card text-card-foreground', item.disabled && 'opacity-50', classNames?.item)">
    <motion.button :id="triggerId" type="button" :disabled="item.disabled" :aria-expanded="open" :aria-controls="contentId" @click="toggle" :layout="reduce ? false : 'position'" :layout-dependency="layoutDependency" :transition="{ layout: layoutTransition }" :style="{ originY: 0 }"
      :class="cn('flex min-h-[54px] w-full items-center gap-4 px-5 text-left outline-none transition-colors focus-visible:bg-muted/25 disabled:pointer-events-none', classNames?.trigger)">
      <span v-if="item.icon" :class="cn('grid h-7 w-7 shrink-0 place-items-center text-muted-foreground', classNames?.icon)"><RenderContent :node="item.icon" /></span>
      <span :class="cn('min-w-0 flex-1 truncate text-[15px] font-medium text-foreground', classNames?.title)"><slot name="title" :item="item"><RenderContent :node="item.title" /></slot></span>
      <motion.span aria-hidden="true" :animate="{ rotate: open ? 180 : 0 }" :transition="reduce ? { duration: 0 } : { type: 'spring', duration: 0.42, bounce: 0.28 }" :class="cn('grid h-6 w-6 shrink-0 place-items-center', open && !item.disabled ? 'text-primary' : 'text-muted-foreground', classNames?.chevron)"><ChevronDown class="h-4 w-4" /></motion.span>
    </motion.button>
    <section :id="contentId" :aria-labelledby="triggerId" :aria-hidden="!open" :inert="!open" :style="{ height: open && (item.description || $slots.content) ? height ? `${height}px` : 'auto' : '0px' }" :class="classNames?.content">
      <motion.div :ref="node => content = resolveElement<HTMLElement>(node)" :layout="reduce ? false : 'position'" :layout-dependency="layoutDependency" :initial="false" :animate="{ opacity: open ? 1 : 0 }"
        :transition="{ opacity: reduce ? { duration: 0 } : { duration: 0.18, ease: EASE_OUT }, layout: layoutTransition }" :style="{ originY: 0 }" class="px-5 pb-5">
        <div :class="cn('text-[15px] leading-6 text-muted-foreground', classNames?.description)"><slot name="content" :item="item"><RenderContent :node="item.description" /></slot></div>
      </motion.div>
    </section>
  </motion.div>
</motion.div></template>
