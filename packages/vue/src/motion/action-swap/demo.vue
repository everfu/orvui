<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { Check, Copy, Send, Sparkles } from "lucide-vue-next";
import { AnimatePresence, motion } from "motion-v";
import { EASE_OUT } from "../../lib/ease";
import { useReducedMotion } from "../../lib/composables";
import { ActionSwapButton } from "./index";
const reduced = useReducedMotion(), animation = ref<"blur" | "roll">("blur");
const selected = reactive({ blur: "copy", roll: "send" });
const items = {
  blur: [{ id: "copy", label: "Copy link", icon: Copy, ariaLabel: "Copy link" }, { id: "copied", label: "Copied", icon: Check, ariaLabel: "Copied" }],
  roll: [{ id: "send", label: "Send", icon: Send, ariaLabel: "Send" }, { id: "sent", label: "Sent", icon: Sparkles, ariaLabel: "Sent" }],
};
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => { animation.value = animation.value === "blur" ? "roll" : "blur"; }, 2600); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template><div class="relative flex min-h-12 min-w-36 items-center justify-center"><AnimatePresence mode="wait" :initial="false">
  <motion.div :key="animation" :initial="reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', transform: 'translateY(4px)' }"
    :animate="{ opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }" :exit="reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', transform: 'translateY(-4px)' }" :transition="{ duration: 0.22, ease: EASE_OUT }">
    <ActionSwapButton v-if="animation === 'blur'" v-model="selected.blur" :items="items.blur" animation="blur" variant="secondary" />
    <ActionSwapButton v-else v-model="selected.roll" :items="items.roll" animation="roll" variant="primary" />
  </motion.div>
</AnimatePresence></div></template>
