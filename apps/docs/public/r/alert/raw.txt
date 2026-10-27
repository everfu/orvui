<script setup lang="ts">
import { computed, provide, ref, watch, type Ref } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { EASE_OUT, EASE_OUT_CSS, SPRING_LAYOUT } from "../../../lib/ease";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";
import type { AlertContext } from "./context";

const props = withDefaults(defineProps<{
  variant?: "default" | "info" | "success" | "warning" | "destructive";
  open?: boolean; defaultOpen?: boolean; contentClassName?: string;
  role?: "alert" | "status"; returnFocusRef?: HTMLElement | Ref<HTMLElement | null>;
}>(), { open: undefined, variant: "default", defaultOpen: true });
const emit = defineEmits(["update:open"]);
const opened = useMotionState(props, emit, "open", props.defaultOpen);
const reduced = useReducedMotion();
const surface = ref<HTMLElement | null>(null);
const color = computed(() => ({
  default: "bg-background text-foreground", info: "bg-primary/5 text-primary",
  success: "bg-emerald-500/5 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/5 text-amber-800 dark:text-amber-300", destructive: "bg-destructive/5 text-destructive",
})[props.variant]);
function setOpen(request: boolean) { if (opened.value !== request) opened.value = request; }
function dismiss() { setOpen(false); }
const context: AlertContext = { open: opened, variant: computed(() => props.variant), reduce: reduced, setOpen, dismiss };
provide("orvui-alert", context);
watch(opened, active => {
  const element = surface.value;
  if (!element) return;
  if (active) {
    element.inert = false;
    element.style.pointerEvents = "";
    element.removeAttribute("aria-hidden");
    element.dataset.state = "open";
    return;
  }
  if (element.contains(element.ownerDocument.activeElement)) resolveElement<HTMLElement>(props.returnFocusRef)?.focus({ preventScroll: true });
  element.inert = true;
  element.style.pointerEvents = "none";
  element.setAttribute("aria-hidden", "true");
  element.dataset.state = "closed";
}, { flush: "sync" });
</script>
<template>
  <AnimatePresence :initial="false">
    <motion.div v-if="opened" :ref="node => surface = resolveElement<HTMLElement>(node)"
      :role="role ?? (variant === 'warning' || variant === 'destructive' ? 'alert' : 'status')"
      data-slot="alert" :data-variant="variant" data-state="open" :layout="!reduced"
      :initial="{ opacity: 0, transform: reduced ? 'none' : 'translateY(-6px)' }"
      :animate="{ opacity: 1, transform: 'none' }"
      :exit="{ opacity: 0, transform: reduced ? 'none' : 'translateY(-6px)', transition: { duration: 0.12, ease: EASE_OUT } }"
      :transition="{ opacity: { duration: 0.18, ease: EASE_OUT }, transform: { duration: 0.2, ease: EASE_OUT }, layout: SPRING_LAYOUT }"
      :style="{ originY: 0, transitionTimingFunction: EASE_OUT_CSS }" :class="cn('relative w-full rounded-xl p-4 text-sm transition-colors duration-200', color)">
      <motion.div :layout="reduced ? false : 'position'" :transition="{ layout: SPRING_LAYOUT }" :style="{ originY: 0 }"
        :class="cn('flex min-w-0 items-start gap-3', contentClassName)"><slot :dismiss="dismiss" /></motion.div>
    </motion.div>
  </AnimatePresence>
</template>
<style scoped>
[data-slot="alert"] {
  outline: 1px solid color-mix(in oklab, currentColor 24%, transparent);
  outline-offset: -1px;
}
[data-slot="alert"][data-variant="default"] {
  outline-color: var(--border);
}
</style>
