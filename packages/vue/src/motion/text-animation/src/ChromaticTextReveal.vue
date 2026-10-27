<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from "vue";
import { motion } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_IN_OUT, EASE_OUT } from "../../../lib/ease";
import { chromaticGradient } from "./reveal-sequence";
const props = withDefaults(defineProps<{ prefix: string; words: string[]; colors?: string[]; foregroundColor?: string; duration?: number; delay?: number; pauseDuration?: number; loop?: boolean; startOnView?: boolean; once?: boolean; inViewMargin?: string }>(), { colors: () => ["#60a5fa", "#818cf8", "#c084fc", "#fb7185", "#fbbf24"], foregroundColor: "var(--foreground)", duration: 1.2, delay: 0, pauseDuration: .8, loop: true, startOnView: true, once: true });
const root = ref<HTMLElement | null>(null);
const cycle = ref(0);
const intersecting = ref(false);
const reduced = useReducedMotion();
const index = computed(() => props.words.length ? cycle.value % props.words.length : 0);
const word = computed(() => props.words[index.value] ?? "");
const widths = computed(() => Array.from(new Set(props.words)));
const visible = computed(() => !props.startOnView || intersecting.value || reduced.value);
const gradient = computed(() => chromaticGradient(props.colors, props.foregroundColor));
const timing = computed(() => ({ "--chromatic-sweep": reduced.value ? { duration: 0 } : { duration: props.duration, delay: props.delay, ease: EASE_IN_OUT }, opacity: { duration: reduced.value ? 0 : .28, ease: EASE_OUT }, filter: { duration: reduced.value ? 0 : .36, ease: EASE_OUT }, transform: { duration: reduced.value ? 0 : .36, ease: EASE_OUT } }));
let mounted = false;
let timer: ReturnType<typeof setTimeout> | undefined;
let observer: IntersectionObserver | undefined;
function clear() { clearTimeout(timer); timer = undefined; }
function next() { clear(); if (!mounted || reduced.value || !visible.value || props.words.length < 2 || !props.loop && index.value === props.words.length - 1) return; timer = setTimeout(() => { cycle.value = (cycle.value + 1) % props.words.length; }, props.pauseDuration * 1000); }
function observe() { observer?.disconnect(); if (!mounted || !root.value || !props.startOnView) return; if (typeof IntersectionObserver === "undefined") { intersecting.value = true; return; } observer = new IntersectionObserver(entries => { intersecting.value = !!entries[0]?.isIntersecting; if (intersecting.value && props.once) observer?.disconnect(); }, { threshold: .4, rootMargin: props.inViewMargin }); observer.observe(root.value); }
watch([() => props.words, () => props.loop, () => props.pauseDuration, reduced], clear);
watch([() => props.startOnView, () => props.once, () => props.inViewMargin], observe);
onMounted(() => { mounted = true; observe(); });
onBeforeUnmount(() => { mounted = false; clear(); observer?.disconnect(); });
</script>
<template>
  <span ref="root" class="inline-flex items-baseline"><span class="whitespace-nowrap">{{ prefix }}{{ words.length ? '\u00a0' : '' }}</span><span v-if="words.length" class="relative inline-grid"><span v-for="sizing in widths" :key="sizing" aria-hidden="true" class="invisible col-start-1 row-start-1 whitespace-nowrap">{{ sizing }}</span><motion.span :key="`${word}-${index}`" aria-hidden="true" :initial="reduced ? false : { opacity: .56, filter: 'blur(6px)', transform: 'translateY(5px)' }" :animate="{ '--chromatic-sweep': visible ? '114%' : '-14%', opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }" :transition="timing" @animation-complete="next" class="absolute start-0 top-0 whitespace-nowrap bg-clip-text text-transparent [background-image:var(--chromatic-gradient)] [contain:paint]" :style="{ '--chromatic-sweep': reduced ? '114%' : '-14%', '--chromatic-gradient': gradient, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' } as CSSProperties">{{ word }}</motion.span><span class="sr-only">{{ word }}</span></span></span>
</template>
