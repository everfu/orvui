<script setup lang="ts">
import { computed, getCurrentInstance, inject, ref, useId } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import type { DockContext } from "./context";
const props = defineProps<{ active?: boolean; as?: "button" | "div"; ariaLabel?: string }>();
const emit = defineEmits(["click"]);
const instance = getCurrentInstance(), reduced = useReducedMotion();
const context = inject<DockContext>("orvui-dock", { size: ref(44), id: useId() });
function interactive() { return props.as === "button" || (props.as !== "div" && !!instance?.vnode.props?.onClick); }
</script>
<template>
  <component :is="interactive() ? 'button' : 'div'" :type="interactive() ? 'button' : undefined" :aria-label="ariaLabel"
    :aria-pressed="interactive() ? active : undefined" @click="emit('click', $event)"
    :class="cn('relative isolate flex shrink-0 items-center justify-center rounded-full text-foreground', interactive() && 'cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-offset-background')"
    :style="{ width: `${context.size.value}px`, height: `${context.size.value}px` }">
    <motion.span v-if="active" :layout-id="context.id" :transition="reduced ? { duration: 0 } : SPRING_LAYOUT" class="absolute inset-0.5 -z-10 rounded-xl bg-muted/60 ring-1 ring-inset ring-primary/20" /><slot />
  </component>
</template>
