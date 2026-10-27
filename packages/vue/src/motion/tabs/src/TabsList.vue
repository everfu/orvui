<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { motion } from "motion-v";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
import { useTabs } from "./context";
import { useTabsList } from "./list-state";
defineOptions({ inheritAttrs: false });
defineProps<{ wrapperClassName?: string }>();
const state = useTabs();
const reduced = useReducedMotion();
const root = ref<HTMLElement | null>(null);
const viewport = ref<HTMLElement | null>(null);
const list = ref<HTMLElement | null>(null);
const viewportId = useId();
const { edges, tracked, keyboard, scroll, focus } = useTabsList(state, reduced, root, viewport, list);
const classes = { pill: "inline-flex items-center gap-1 rounded-full bg-card p-1", underline: "inline-flex items-center gap-1 border-b border-border", segment: "inline-flex items-center gap-0 rounded-lg bg-card p-0.5" };
const surface = computed(() => state.variant.value === "pill" ? "rounded-full bg-card" : state.variant.value === "segment" ? "rounded-lg bg-card" : "");
const control = "absolute inset-y-0 z-20 inline-flex w-9 items-center justify-center text-foreground transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-0";
const mask = computed(() => edges.value.overflow ? { maskImage: `linear-gradient(to right, ${edges.value.left ? 'transparent, black 40px' : 'black, black 0px'}, ${edges.value.right ? 'black calc(100% - 40px), transparent' : 'black 100%'})` } : undefined);
</script>
<template><div ref="root" :class="cn('relative isolate flex w-full max-w-full min-w-0 items-center', edges.overflow && surface, wrapperClassName)"><button v-if="edges.overflow" type="button" aria-label="Scroll tabs left" :aria-controls="viewportId" :disabled="!edges.left" @click="scroll(-1)" :class="cn(control, 'left-0 rounded-l-full')"><ChevronLeft :size="20" aria-hidden="true" /></button><motion.div :ref="element => viewport = resolveElement<HTMLElement>(element)" :id="viewportId" layout-scroll :class="cn('w-full min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', edges.overflow && '[border-radius:inherit]')" :style="mask" @focus.capture="focus"><div ref="list" v-bind="$attrs" role="tablist" @keydown="keyboard" :class="cn(classes[state.variant.value], 'w-max', tracked && 'relative', $attrs.class as string)"><slot /></div></motion.div><span v-if="edges.overflow && edges.left" aria-hidden="true" class="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 rounded-l-[inherit] backdrop-blur-[2px] [mask-image:linear-gradient(to_right,black,transparent)]" /><span v-if="edges.overflow && edges.right" aria-hidden="true" class="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 rounded-r-[inherit] backdrop-blur-[2px] [mask-image:linear-gradient(to_left,black,transparent)]" /><button v-if="edges.overflow" type="button" aria-label="Scroll tabs right" :aria-controls="viewportId" :disabled="!edges.right" @click="scroll(1)" :class="cn(control, 'right-0 rounded-r-full')"><ChevronRight :size="20" aria-hidden="true" /></button></div></template>
