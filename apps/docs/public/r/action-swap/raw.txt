<script setup lang="ts">
import { computed, type Component, type VNodeChild } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_LAYOUT, SPRING_PRESS } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import RenderContent from "../../../lib/RenderContent";
import { useMotionState } from "../../state";
import ActionSwapIcon from "./ActionSwapIcon.vue";
import ActionSwapText from "./ActionSwapText.vue";
const props = withDefaults(defineProps<{
  items: { id: string; label: VNodeChild | Component; icon?: VNodeChild | Component; ariaLabel?: string }[];
  modelValue?: string; value?: string; defaultValue?: string; animation?: "cascade" | "blur" | "roll";
  variant?: "primary" | "secondary" | "outline" | "ghost"; size?: "sm" | "md" | "lg" | "icon";
  iconOnly?: boolean; cycle?: boolean; disabled?: boolean;
}>(), { animation: "blur", variant: "secondary", size: "md", cycle: true, iconOnly: undefined });
const emit = defineEmits(["update:modelValue", "change", "update:value", "valueChange", "click"]);
const value = useMotionState(props, emit, "modelValue", props.defaultValue ?? props.items[0]?.id ?? "");
const index = computed(() => Math.max(0, props.items.findIndex(item => item.id === (props.value ?? value.value))));
const selected = computed(() => props.items[index.value] ?? props.items[0]);
const iconOnly = computed(() => props.iconOnly ?? props.size === "icon");
const hasIcons = computed(() => props.items.some(item => !!item.icon));
const reduced = useReducedMotion();
const color = computed(() => ({ primary: "bg-primary text-primary-foreground hover:bg-primary/90", secondary: "border border-border bg-card text-foreground hover:border-border", outline: "border border-border bg-transparent text-foreground hover:bg-muted/60", ghost: "text-muted-foreground hover:bg-muted/60 hover:text-foreground" })[props.variant]);
const geometry = computed(() => ({ sm: "h-8 gap-1.5 rounded-full px-3 text-xs", md: "h-10 gap-2 rounded-full px-4 text-sm", lg: "h-12 gap-2.5 rounded-full px-5 text-base", icon: "h-10 w-10 rounded-full" })[props.size]);
const accessibleName = computed(() => selected.value?.ariaLabel ?? (iconOnly.value && ["string", "number"].includes(typeof selected.value?.label) ? String(selected.value!.label) : undefined));
function advance(event: MouseEvent) {
  emit("click", event);
  if (event.defaultPrevented || props.disabled || !props.cycle || !props.items.length) return;
  const next = props.items[(index.value + 1) % props.items.length]!;
  value.value = next.id;
  emit("update:value", next.id);
  emit("valueChange", next.id, next);
}
</script>
<template>
  <motion.button v-if="selected" type="button" :disabled="disabled" layout :layout-dependency="selected.id" :aria-label="accessibleName"
    :while-press="reduced || disabled ? undefined : { scale: 0.97 }" :transition="{ ...SPRING_PRESS, layout: reduced ? { duration: 0 } : SPRING_LAYOUT }"
    :style="{ borderRadius: '9999px' }" :class="cn('inline-flex items-center justify-center overflow-hidden font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50', color, geometry, $attrs.class)" @click="advance">
    <motion.span v-if="hasIcons || $slots.icon" layout="position" :layout-dependency="selected.id" :transition="reduced ? { duration: 0 } : SPRING_LAYOUT" class="inline-flex shrink-0">
      <ActionSwapIcon :value="selected.id" :animation="animation" class="h-4 w-4"><slot name="icon" :item="selected"><RenderContent v-if="selected.icon" :node="selected.icon" class="size-4" /></slot></ActionSwapIcon>
    </motion.span>
    <motion.span v-if="!iconOnly" layout="position" :layout-dependency="selected.id" :transition="reduced ? { duration: 0 } : SPRING_LAYOUT" class="inline-flex min-w-0 max-w-full">
      <ActionSwapText :value="selected.id" :animation="animation"><slot :item="selected"><template v-if="typeof selected.label === 'string' || typeof selected.label === 'number'">{{ selected.label }}</template><RenderContent v-else :node="selected.label" /></slot></ActionSwapText>
    </motion.span>
  </motion.button>
</template>
