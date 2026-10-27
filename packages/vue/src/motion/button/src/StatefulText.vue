<script setup lang="ts">
import { computed, isVNode, onBeforeUnmount, onMounted, onUpdated, ref, Text, type Component, type VNodeChild } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { EASE_OUT, SPRING_SWAP } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import RenderContent from "../../../lib/RenderContent";
const props = defineProps<{ value: string; nodes: VNodeChild | Component }>();
const reduced = useReducedMotion(), measureElement = ref<HTMLSpanElement>(), width = ref<number>();
function plainText(node: VNodeChild | Component): string | null {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.length === 1 ? plainText(node[0]) : null;
  return isVNode(node) && node.type === Text && typeof node.children === "string" ? node.children : null;
}
const label = computed(() => plainText(props.nodes));
const cascade = computed(() => label.value !== null && !reduced.value);
const identity = computed(() => label.value === null ? props.value : `${props.value}-${label.value}`);
function delay(custom: unknown) { return typeof custom === "number" ? custom : 0; }
const poses = {
  initial: { opacity: 0, y: "105%", filter: "blur(6px)" },
  animate: (custom: unknown) => ({ opacity: 1, y: "0%", filter: "blur(0px)", transition: { ...SPRING_SWAP, delay: delay(custom) } }),
  exit: (custom: unknown) => ({ opacity: 0, y: "-105%", filter: "blur(6px)", transition: { duration: 0.16, ease: EASE_OUT, delay: delay(custom) / 2 } }),
};
function measure() { const measured = measureElement.value?.offsetWidth; if (measured && measured !== width.value) width.value = measured; }
let observer: ResizeObserver | undefined;
onMounted(() => { measure(); if (measureElement.value && typeof ResizeObserver !== "undefined") { observer = new ResizeObserver(measure); observer.observe(measureElement.value); } });
onUpdated(measure);
onBeforeUnmount(() => observer?.disconnect());
</script>
<template>
  <motion.span :initial="false" :animate="{ width: width === undefined ? undefined : `${width}px` }" :transition="reduced ? { duration: 0 } : SPRING_SWAP" class="relative inline-block overflow-hidden whitespace-nowrap align-bottom">
    <span ref="measureElement" aria-hidden="true" class="invisible inline-block whitespace-nowrap">
      <template v-if="cascade"><span v-for="(character, index) in label!.split('')" :key="index" class="inline-block whitespace-pre">{{ character }}</span></template>
      <RenderContent v-else :node="nodes" />
    </span>
    <template v-if="cascade">
      <span class="sr-only">{{ label }}</span>
      <AnimatePresence :initial="false" as="span" class="contents">
        <motion.span :key="`cascade-${identity}`" aria-hidden="true" initial="initial" animate="animate" exit="exit" class="absolute left-0 top-0 inline-block whitespace-pre">
          <motion.span v-for="(character, index) in label!.split('')" :key="index" :custom="index * 0.025" :variants="poses" initial="initial" animate="animate" exit="exit" class="inline-block whitespace-pre will-change-[opacity,filter,transform]">{{ character }}</motion.span>
        </motion.span>
      </AnimatePresence>
    </template>
    <AnimatePresence v-else :initial="false" as="span" class="contents">
      <motion.span :key="`text-${identity}`" :initial="reduced ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(6px)' }"
        :animate="reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }" :exit="reduced ? { opacity: 0 } : { opacity: 0, y: -14, filter: 'blur(6px)' }"
        :transition="reduced ? { duration: 0.15 } : SPRING_SWAP" class="absolute left-0 top-0 inline-block will-change-[opacity,filter,transform]"><RenderContent :node="nodes" /></motion.span>
    </AnimatePresence>
  </motion.span>
</template>
