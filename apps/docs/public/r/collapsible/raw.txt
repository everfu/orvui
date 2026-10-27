<script setup lang="ts">
import { computed, provide, ref, useId } from "vue";
import { motion } from "motion-v";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";
import type { CollapsibleContext } from "./context";
const props = withDefaults(defineProps<{ open?: boolean; defaultOpen?: boolean; disabled?: boolean; contentClassName?: string }>(), { open: undefined, defaultOpen: false });
const emit = defineEmits(["update:open"]);
const opened = useMotionState(props, emit, "open", props.defaultOpen);
const reduced = useReducedMotion();
function setOpen(requested: boolean) { if (!props.disabled && opened.value !== requested) opened.value = requested; }
function toggle() { setOpen(!opened.value); }
const state: CollapsibleContext = { open: opened, id: useId(), triggerRef: ref(null), reduce: reduced, disabled: computed(() => props.disabled), setOpen, toggle };
provide("orvui-collapsible", state);
</script>
<template>
  <motion.div data-slot="collapsible" :data-state="opened ? 'open' : 'closed'" :data-disabled="disabled || undefined"
    class="relative w-full" :layout="!reduced" :transition="{ layout: SPRING_LAYOUT }" :style="{ originY: 0 }">
    <motion.div :layout="reduced ? false : 'position'" :transition="{ layout: SPRING_LAYOUT }"
      :style="{ originY: 0 }" :class="cn('min-w-0', contentClassName)"><slot :open="opened" :toggle="toggle" /></motion.div>
  </motion.div>
</template>
