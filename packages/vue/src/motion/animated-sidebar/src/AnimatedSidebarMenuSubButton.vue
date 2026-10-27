<script setup lang="ts">
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_PRESS } from "../../../lib/ease";
import RenderContent from "../../../lib/RenderContent";
import { useSidebar } from "./context";
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    href?: string;
    isActive?: boolean;
    disabled?: boolean;
    closeOnSelect?: boolean;
    icon?: any;
    target?: string;
    rel?: string;
  }>(),
  { closeOnSelect: true },
);
const emit = defineEmits(["select"]),
  ctx = useSidebar();
function select(event: MouseEvent) {
  const blocked = props.disabled;
  if (blocked) event.preventDefault();
  const accepted = !blocked && !event.defaultPrevented;
  if (accepted) {
    emit("select");
    const dismissMobile = ctx.mobile.value && props.closeOnSelect;
    if (dismissMobile) ctx.setOpenMobile(false);
  }
}
</script>
<template>
  <component
    :is="href ? motion.a : motion.button"
    v-bind="$attrs"
    :href="href"
    :type="href ? undefined : 'button'"
    :target="target"
    :rel="rel ?? (target === '_blank' ? 'noreferrer noopener' : undefined)"
    :disabled="href ? undefined : disabled"
    :aria-current="isActive ? 'page' : undefined"
    :aria-disabled="disabled || undefined"
    :tabindex="href && disabled ? -1 : undefined"
    :while-press="ctx.reduce.value || disabled ? undefined : { scale: 0.98 }"
    :transition="SPRING_PRESS"
    :class="
      cn(
        'flex min-h-8 w-full min-w-0 items-center gap-2 rounded-lg px-2 text-left text-xs outline-none text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring',
        isActive && 'bg-muted/70 text-foreground',
        disabled && 'cursor-not-allowed opacity-40',
        $attrs.class,
      )
    "
    @click="select"
    ><span aria-hidden="true" class="grid size-4 shrink-0 place-items-center"
      ><slot name="icon"
        ><RenderContent v-if="icon" :node="icon" /><span
          v-else
          class="size-1 rounded-full bg-current" /></slot></span
    ><span class="min-w-0 flex-1 truncate"><slot /></span
  ></component>
</template>
