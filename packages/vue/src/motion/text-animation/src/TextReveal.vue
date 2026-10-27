<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { EASE_OUT } from "../../../lib/ease";
import { revealSequence } from "./reveal-sequence";
const props = withDefaults(defineProps<{ text: string | string[]; as?: string; split?: "word" | "char"; stagger?: number; delay?: number; blur?: number; yOffset?: string | number; spring?: { stiffness?: number; damping?: number; mass?: number }; once?: boolean; whileInView?: boolean }>(), { as: "span", split: "word", stagger: .09, delay: 0, blur: 12, yOffset: "40%", once: true, whileInView: false });
const reduced = useReducedMotion();
const sequence = computed(() => revealSequence(props.text, props.split));
const concealed = computed(() => reduced.value ? { opacity: 0 } : { y: props.yOffset, opacity: 0, filter: `blur(${props.blur}px)` });
const revealed = computed(() => reduced.value ? { opacity: 1 } : { y: 0, opacity: 1, filter: "blur(0px)" });
function timing(index: number) { const delay = props.delay + index * props.stagger; return reduced.value ? { opacity: { duration: .25, ease: EASE_OUT, delay: delay * .3 } } : { y: { type: "spring" as const, stiffness: props.spring?.stiffness ?? 140, damping: props.spring?.damping ?? 26, mass: props.spring?.mass ?? 1.2, delay }, opacity: { duration: .7, ease: EASE_OUT, delay }, filter: { duration: .9, ease: EASE_OUT, delay } }; }
function animation(index: number) { return { initial: concealed.value, animate: props.whileInView ? undefined : revealed.value, whileInView: props.whileInView ? revealed.value : undefined, inViewOptions: { once: props.once, amount: .4 }, transition: timing(index) }; }
</script>
<template><component :is="as" class="block"><span v-for="(line, lineIndex) in sequence" :key="lineIndex" class="block"><template v-for="(word, wordIndex) in line" :key="wordIndex"><span v-if="split === 'char'" class="inline-block whitespace-pre"><motion.span v-for="unit in word" :key="unit.index" v-bind="animation(unit.index)" class="inline-block whitespace-pre will-change-transform">{{ unit.text }}</motion.span></span><motion.span v-else v-bind="animation(word[0].index)" class="inline-block whitespace-pre will-change-transform">{{ word[0].text }}</motion.span></template></span><slot /></component></template>
