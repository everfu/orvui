<script setup lang="ts">
import { computed, provide } from "vue";
import { motion } from "motion-v";
import { EASE_DRAWER } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useSidebar } from "./context";
import MobileSidebar from "./MobileSidebar.vue";
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "icon" | "offcanvas" | "none";
    ariaLabel?: string;
    panelClassName?: string;
  }>(),
  {
    side: "left",
    variant: "sidebar",
    collapsible: "icon",
    ariaLabel: "Sidebar",
  },
);
const ctx = useSidebar(),
  collapsed = computed(
    () => !ctx.mobile.value && props.collapsible !== "none" && !ctx.open.value,
  ),
  offcanvas = computed(
    () => collapsed.value && props.collapsible === "offcanvas",
  );
provide("orvui-sidebar-panel", {
  collapsed,
  side: computed(() => props.side),
  collapsible: computed(() => props.collapsible),
});
const width = computed(() =>
  offcanvas.value
    ? "0px"
    : collapsed.value
      ? "var(--sidebar-width-icon)"
      : "var(--sidebar-width)",
);
</script>
<template>
  <MobileSidebar
    v-if="ctx.mobile.value"
    v-bind="$attrs"
    :side="side"
    :aria-label="ariaLabel"
    ><slot /></MobileSidebar
  ><motion.aside
    v-else
    v-bind="$attrs"
    :initial="false"
    :aria-label="ariaLabel"
    data-slot="sidebar"
    :data-state="collapsed ? 'collapsed' : 'expanded'"
    :data-collapsible="collapsible"
    :data-variant="variant"
    :data-side="side"
    :animate="{ width }"
    :transition="
      ctx.reduce.value
        ? { duration: 0 }
        : { type: 'spring', stiffness: 380, damping: 35, mass: 0.75 }
    "
    :class="
      cn(
        'group/sidebar peer relative hidden h-auto shrink-0 md:block will-change-[width]',
        side === 'right' && 'order-last',
        $attrs.class,
      )
    "
    ><motion.div
      :initial="false"
      :animate="{
        opacity: offcanvas ? 0 : 1,
        x: offcanvas ? (side === 'left' ? '-100%' : '100%') : '0%',
      }"
      :transition="{
        duration: ctx.reduce.value ? 0.16 : 0.36,
        ease: EASE_DRAWER,
      }"
      :inert="offcanvas || undefined"
      :class="
        cn(
          'sticky top-0 flex h-svh w-full flex-col overflow-hidden bg-background',
          collapsible === 'offcanvas' && 'w-[var(--sidebar-width)]',
          variant === 'sidebar' &&
            (side === 'left'
              ? 'border-border border-r'
              : 'border-border border-l'),
          variant === 'floating' &&
            'm-2 h-[calc(100svh-1rem)] rounded-2xl border border-border shadow-sm',
          variant === 'inset' && 'm-2 h-[calc(100svh-1rem)] rounded-2xl',
          panelClassName,
        )
      "
      ><slot /></motion.div
  ></motion.aside>
</template>
