<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue";
import { motion } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
import { resolveElement, useReducedMotion } from "../../../lib/composables";

const props = withDefaults(defineProps<{
  y?: number; blur?: number; duration?: number; delay?: number; once?: boolean;
  amount?: number | "some" | "all"; root?: HTMLElement | Ref<HTMLElement | null> | null;
}>(), { y: 16, blur: 8, duration: 0.6, delay: 0, once: true, amount: 0.3 });
const element = ref<HTMLElement | null>(null), visible = ref(false);
const reduced = useReducedMotion();
let observer: IntersectionObserver | undefined;
let version = 0, disposed = false, revealed = false;
async function observe() {
  observer?.disconnect();
  const revision = ++version;
  await nextTick();
  const target = element.value;
  if (disposed || revision !== version || !target || (props.once && revealed)) return;
  if (typeof IntersectionObserver === "undefined") { visible.value = true; return; }
  observer = new IntersectionObserver(entries => {
    if (disposed || revision !== version) return;
    visible.value = entries.some(entry => entry.target === target && entry.isIntersecting);
    if (visible.value) { revealed = true; if (props.once) observer?.disconnect(); }
  }, { root: resolveElement<HTMLElement>(props.root), threshold: props.amount === "all" ? 1 : props.amount === "some" ? 0 : props.amount });
  observer.observe(target);
}
watch(() => [resolveElement<HTMLElement>(props.root), props.amount, props.once], observe, { flush: "post" });
onMounted(observe);
onBeforeUnmount(() => { disposed = true; version += 1; observer?.disconnect(); });
const hidden = computed(() => reduced.value ? { opacity: 0 } : { opacity: 0, y: props.y, filter: `blur(${props.blur}px)` });
const shown = computed(() => reduced.value ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" });
</script>
<template>
  <motion.div :ref="node => element = resolveElement<HTMLElement>(node)" :initial="hidden"
    :animate="visible ? shown : hidden" :transition="{ duration, ease: EASE_OUT, delay }"><slot /></motion.div>
</template>
