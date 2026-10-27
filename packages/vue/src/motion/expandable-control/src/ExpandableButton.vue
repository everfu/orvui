<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { Plus } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";
import { EXPAND_TRANSITION } from "./transition";
const props = withDefaults(defineProps<{
  expanded?: boolean; defaultExpanded?: boolean; icon?: any; label?: string; disabled?: boolean; type?: "button" | "submit" | "reset";
}>(), { expanded: undefined, defaultExpanded: false, label: "Create new", type: "button" });
const emit = defineEmits(["update:expanded"]);
const expanded = useMotionState(props, emit, "expanded", props.defaultExpanded), reduced = useReducedMotion();
const transition = computed(() => reduced.value ? { duration: 0 } : EXPAND_TRANSITION);
function toggle(event: MouseEvent) { if (!props.disabled && !event.defaultPrevented) expanded.value = !expanded.value; }
</script>
<template>
  <motion.span layout :transition="transition" class="inline-flex">
    <motion.button v-bind="$attrs" layout :type="type" :aria-label="($attrs['aria-label'] as string) ?? label" :aria-expanded="expanded" :disabled="disabled"
      :class="cn('relative inline-flex h-11 min-w-11 items-center overflow-hidden rounded-full border border-border bg-transparent p-1 pr-1 text-sm font-medium text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50', expanded && !disabled && 'border-primary/40', $attrs.class as string)"
      :style="{ borderRadius: '9999px' }" @click="toggle" :while-press="reduced || disabled ? undefined : { scale: 0.97 }" :transition="transition">
      <motion.span layout="position" class="grid size-9 shrink-0 place-items-center" aria-hidden="true" :transition="transition"><slot name="icon"><component :is="icon ?? Plus" class="size-5" /></slot></motion.span>
      <AnimatePresence mode="popLayout" :initial="false">
        <motion.span v-if="expanded" key="label" layout :initial="reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(4px)' }"
          :animate="reduced ? { opacity: 1 } : { opacity: 1, filter: 'blur(0px)' }" :exit="reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(4px)' }"
          :transition="transition" class="relative inline-flex w-max items-center whitespace-nowrap pr-3" aria-hidden="true"><slot>{{ label }}</slot></motion.span>
      </AnimatePresence>
    </motion.button>
  </motion.span>
</template>
