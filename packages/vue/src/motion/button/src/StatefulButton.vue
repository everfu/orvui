<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, useSlots, type Component, type VNodeChild } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { Check, Loader2, X } from "lucide-vue-next";
import { EASE_OUT, SPRING_SWAP } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import RenderContent from "../../../lib/RenderContent";
import Button, { type ButtonProps } from "./Button.vue";
import StatefulText from "./StatefulText.vue";
export type ButtonState = "idle" | "loading" | "success" | "error";
interface Props extends ButtonProps {
  state?: ButtonState; loadingText?: VNodeChild | Component; successText?: VNodeChild | Component;
  errorText?: VNodeChild | Component; icon?: VNodeChild | Component;
}
const props = withDefaults(defineProps<Props>(), { state: "idle", loadingText: "Loading", successText: "Done", errorText: "Try again" });
const slots = useSlots(), reduced = useReducedMotion();
const statusIcon = computed(() => ({ loading: Loader2, success: Check, error: X })[props.state === "idle" ? "loading" : props.state]);
function content(): VNodeChild | Component {
  if (props.state === "idle") return slots.default?.();
  const overrides = { loading: props.loadingText, success: props.successText, error: props.errorText };
  return slots[props.state]?.() ?? overrides[props.state];
}
const iconPoses = {
  initial: { opacity: 0, width: 0, scale: 0.7, filter: "blur(6px)" },
  animate: { opacity: 1, width: "1.5rem", scale: 1, filter: "blur(0px)", transition: SPRING_SWAP },
  exit: { opacity: 0, width: 0, scale: 0.7, filter: "blur(6px)", transition: { duration: 0.16, ease: EASE_OUT } },
};
</script>
<template>
  <Button v-bind="$attrs" :variant="variant" :size="size" :press-scale="pressScale" :ripple="ripple" :type="type"
    :disabled="disabled || state === 'loading'" :aria-busy="state === 'loading'" :while-hover="undefined">
    <span aria-live="polite" class="relative inline-flex items-center justify-center overflow-hidden">
      <AnimatePresence :initial="false" as="span" class="contents">
        <motion.span v-if="state !== 'idle'" :key="`${state}-icon`" :variants="iconPoses"
          :initial="reduced ? { opacity: 0 } : 'initial'" :animate="reduced ? { opacity: 1 } : 'animate'" :exit="reduced ? { opacity: 0 } : 'exit'"
          :transition="reduced ? { duration: 0.15 } : undefined" class="inline-grid shrink-0 place-items-center overflow-hidden">
          <component :is="statusIcon" :class="['h-4 w-4', state === 'loading' && !reduced && 'animate-spin']" />
        </motion.span>
      </AnimatePresence>
      <StatefulText :value="state" :nodes="content()" />
      <AnimatePresence :initial="false" as="span" class="contents">
        <motion.span v-if="state === 'idle' && (icon || slots.icon)" key="idle-icon" :variants="iconPoses"
          :initial="reduced ? { opacity: 0 } : 'initial'" :animate="reduced ? { opacity: 1 } : 'animate'" :exit="reduced ? { opacity: 0 } : 'exit'"
          :transition="reduced ? { duration: 0.15 } : undefined" class="inline-grid shrink-0 place-items-center overflow-hidden"><slot name="icon"><RenderContent :node="icon" /></slot></motion.span>
      </AnimatePresence>
    </span>
  </Button>
</template>
