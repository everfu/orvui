<script setup lang="ts">
import { computed, useSlots } from "vue";
import { motion } from "motion-v";
import { ChevronRight } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { SPRING_LAYOUT, SPRING_PRESS, EASE_OUT } from "../../../lib/ease";
import RenderContent from "../../../lib/RenderContent";
import { useSidebar, useSidebarPanel } from "./context";
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    href?: string;
    isActive?: boolean;
    ariaExpanded?: boolean;
    disabled?: boolean;
    closeOnSelect?: boolean;
    icon?: any;
    badge?: any;
    target?: string;
    rel?: string;
  }>(),
  { ariaExpanded: undefined, closeOnSelect: undefined },
);
const emit = defineEmits(["select"]),
  ctx = useSidebar(),
  panel = useSidebarPanel(),
  slots = useSlots();
const textLabel = computed(() =>
  slots
    .default?.()
    .flatMap((node) =>
      typeof node.children === "string" ? [node.children] : [],
    )
    .join(""),
);
const textTransition = computed(() => ({
  duration: ctx.reduce.value ? 0.16 : panel.collapsed.value ? 0.12 : 0.2,
  delay: !ctx.reduce.value && !panel.collapsed.value ? 0.08 : 0,
  ease: EASE_OUT,
}));
function select(event: MouseEvent) {
  const blocked = props.disabled;
  if (blocked) event.preventDefault();
  if (blocked || event.defaultPrevented) return;
  emit("select");
  if (ctx.mobile.value) {
    const closeAfterSelection =
      props.closeOnSelect === undefined
        ? props.ariaExpanded === undefined
        : props.closeOnSelect;
    if (closeAfterSelection) ctx.setOpenMobile(false);
    return;
  }
  if (props.ariaExpanded !== undefined && panel.collapsed.value) {
    ctx.setOpen(true);
  }
}
</script>
<template>
  <component
    :is="href ? motion.a : motion.button"
    v-bind="$attrs"
    :type="href ? undefined : 'button'"
    :href="href"
    :target="target"
    :rel="rel ?? (target === '_blank' ? 'noreferrer noopener' : undefined)"
    :disabled="href ? undefined : disabled"
    :aria-current="isActive ? 'page' : undefined"
    :aria-expanded="ariaExpanded"
    :aria-disabled="disabled || undefined"
    :aria-label="panel.collapsed.value ? textLabel : undefined"
    :title="panel.collapsed.value ? textLabel : undefined"
    :tabindex="href && disabled ? -1 : undefined"
    :while-press="ctx.reduce.value || disabled ? undefined : { scale: 0.98 }"
    :transition="SPRING_PRESS"
    :class="
      cn(
        'relative flex min-h-9 w-full min-w-0 items-center gap-2.5 overflow-hidden rounded-xl px-3 text-left text-sm font-medium outline-none text-muted-foreground transition-colors hover:text-foreground focus-visible:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring',
        isActive && 'text-foreground',
        disabled && 'cursor-not-allowed opacity-40',
        $attrs.class,
      )
    "
    @click="select"
    ><motion.span
      v-if="isActive"
      :layout-id="ctx.id + '-active'"
      :transition="ctx.reduce.value ? { duration: 0 } : SPRING_LAYOUT"
      class="absolute inset-0 rounded-xl bg-muted" /><span
      v-if="icon || slots.icon"
      aria-hidden="true"
      class="relative z-10 grid size-5 shrink-0 place-items-center"
      ><slot name="icon"><RenderContent :node="icon" /></slot></span
    ><motion.span
      :initial="false"
      :animate="{
        opacity: panel.collapsed.value ? 0 : 1,
        x: panel.collapsed.value ? -4 : 0,
      }"
      :transition="textTransition"
      :aria-hidden="panel.collapsed.value"
      :class="
        cn(
          'relative z-10 min-w-0 flex-1 truncate',
          panel.collapsed.value && 'pointer-events-none',
        )
      "
      ><slot /></motion.span
    ><span
      v-if="badge && !panel.collapsed.value"
      class="relative z-10 shrink-0 text-xs text-muted-foreground"
      ><RenderContent :node="badge" /></span
    ><motion.span
      v-if="ariaExpanded !== undefined"
      aria-hidden="true"
      :initial="false"
      :animate="{
        opacity: panel.collapsed.value ? 0 : 1,
        rotate: ariaExpanded ? 90 : 0,
        x: panel.collapsed.value ? 4 : 0,
      }"
      :transition="ctx.reduce.value ? { duration: 0 } : SPRING_LAYOUT"
      class="relative z-10 grid size-4 shrink-0 place-items-center text-muted-foreground"
      ><ChevronRight class="size-3.5" /></motion.span
  ></component>
</template>
