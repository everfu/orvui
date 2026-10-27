<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, ref } from "vue";
import { motion } from "motion-v";
import { X } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";
import { EXPAND_TRANSITION } from "./transition";
const props = withDefaults(defineProps<{
  expanded?: boolean; defaultExpanded?: boolean; label: string; actionIcon?: any; actionLabel?: string;
  collapseOnAction?: boolean; disabled?: boolean; labelClassName?: string; actionClassName?: string;
}>(), { expanded: undefined, defaultExpanded: false, actionLabel: "Remove", collapseOnAction: true });
const emit = defineEmits(["update:expanded", "action"]);
const expanded = useMotionState(props, emit, "expanded", props.defaultExpanded), reduced = useReducedMotion();
const trigger = ref<HTMLButtonElement | null>(null);
const transition = computed(() => reduced.value ? { duration: 0 } : EXPAND_TRANSITION);
function toggle(event: MouseEvent) { if (!props.disabled && !event.defaultPrevented) expanded.value = !expanded.value; }
function act(event: MouseEvent) {
  if (props.disabled || !expanded.value || event.defaultPrevented) return;
  emit("action");
  if (props.collapseOnAction) { expanded.value = false; trigger.value?.focus(); }
}
</script>
<template>
  <motion.span layout :transition="transition" class="inline-flex">
    <motion.div v-bind="$attrs" layout :transition="transition" :style="{ borderRadius: '9999px' }"
      :class="cn('inline-flex h-10 items-center overflow-hidden rounded-full border border-border bg-transparent text-sm text-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-ring', expanded && !disabled && 'border-primary/40', $attrs.class as string)">
      <motion.button layout="position" :ref="node => trigger = resolveElement<HTMLButtonElement>(node)" type="button" :aria-expanded="expanded" :disabled="disabled"
        :class="cn('h-full whitespace-nowrap py-0 pl-3 font-medium outline-none disabled:pointer-events-none disabled:opacity-50', expanded ? 'pr-1' : 'pr-3', labelClassName)" @click="toggle" :transition="transition">{{ label }}</motion.button>
      <motion.span :class="cn('relative inline-flex h-10 shrink-0 items-center overflow-hidden', expanded ? 'w-8' : 'w-0')" :aria-hidden="!expanded" :initial="false"
        :animate="reduced ? { opacity: expanded ? 1 : 0 } : { opacity: expanded ? 1 : 0, filter: expanded ? 'blur(0px)' : 'blur(4px)' }" :transition="transition">
        <motion.button type="button" :aria-label="actionLabel" :disabled="disabled || !expanded"
          :class="cn('flex h-10 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:text-foreground disabled:pointer-events-none', disabled && 'opacity-50', actionClassName)"
          @click="act" :while-press="reduced || disabled ? undefined : { scale: 0.97 }" :transition="transition">
          <span aria-hidden="true"><slot name="actionIcon"><component :is="actionIcon ?? X" class="size-3.5" /></slot></span>
        </motion.button>
      </motion.span>
    </motion.div>
  </motion.span>
</template>
