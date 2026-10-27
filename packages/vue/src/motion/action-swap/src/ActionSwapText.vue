<script setup lang="ts">
import { Comment, computed, Fragment, isVNode, Text, useSlots, type VNode } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { cascadePoses, swapPose } from "./poses";
const props = withDefaults(defineProps<{ value: string | number; animation?: "cascade" | "blur" | "roll" }>(), { animation: "blur" });
const slots = useSlots(), reduced = useReducedMotion();
function textContent(nodes: VNode[]): string | null {
  let result = "";
  for (const node of nodes) {
    if (node.type === Comment) continue;
    if (node.type === Text && typeof node.children === "string") result += node.children;
    else if (node.type === Fragment && Array.isArray(node.children)) {
      if (!node.children.every(isVNode)) return null;
      const nested = textContent(node.children as VNode[]);
      if (nested === null) return null;
      result += nested;
    } else return null;
  }
  return result;
}
const label = computed(() => { void props.value; return textContent(slots.default?.() ?? []); });
const cascade = computed(() => props.animation === "cascade" && label.value !== null && !reduced.value);
const pose = computed(() => swapPose(props.animation, "text", reduced.value));
</script>
<template>
  <span class="relative -my-[0.08em] inline-block max-w-full whitespace-nowrap py-[0.08em] align-bottom" style="clip-path: inset(0 -999px); -webkit-clip-path: inset(0 -999px)">
    <span aria-hidden="true" class="invisible inline-block whitespace-nowrap"><template v-if="cascade"><span v-for="(character, index) in label?.split('')" :key="index" class="inline-block whitespace-pre">{{ character }}</span></template><slot v-else /></span>
    <template v-if="cascade"><span class="sr-only">{{ label }}</span><AnimatePresence :initial="false">
      <motion.span :key="`cascade-${value}`" aria-hidden="true" initial="initial" animate="animate" exit="exit" class="absolute left-0 top-[0.08em] inline-block whitespace-pre">
        <motion.span v-for="(character, index) in label?.split('')" :key="index" :custom="index * 0.025" :variants="cascadePoses" initial="initial" animate="animate" exit="exit" class="inline-block whitespace-pre will-change-[opacity,filter,transform]">{{ character }}</motion.span>
      </motion.span>
    </AnimatePresence></template>
    <AnimatePresence v-else :initial="false"><motion.span :key="`${animation}-${value}`" v-bind="pose" class="absolute left-0 top-[0.08em] inline-block max-w-full truncate will-change-[opacity,filter,transform]"><slot /></motion.span></AnimatePresence>
  </span>
</template>
