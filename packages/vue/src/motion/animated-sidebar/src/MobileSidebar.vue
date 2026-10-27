<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { motion } from "motion-v";
import { useOverlay } from "../../../lib/composables";
import { EASE_DRAWER } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useSidebar } from "./context";
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{ side?: "left" | "right"; ariaLabel?: string }>(),
  { side: "left", ariaLabel: "Sidebar" },
);
const ctx = useSidebar(),
  panel = ref<HTMLElement | null>(null),
  hidden = ref(!ctx.mobileOpen.value);
watch(
  ctx.mobileOpen,
  (value) => {
    if (value) hidden.value = false;
  },
  { flush: "sync" },
);
useOverlay(ctx.mobileOpen, panel, () => {
  ctx.mobileOpen.value = false;
});
const destination = computed(() => ({
  opacity: ctx.reduce.value ? (ctx.mobileOpen.value ? 1 : 0) : 1,
  x: ctx.reduce.value
    ? 0
    : ctx.mobileOpen.value
      ? "0%"
      : props.side === "left"
        ? "-100%"
        : "100%",
}));
const transition = computed(() => ({
  duration: ctx.reduce.value ? 0.16 : 0.36,
  ease: EASE_DRAWER,
}));
function complete() {
  if (!ctx.mobileOpen.value) hidden.value = true;
}
</script>
<template>
  <Teleport to="body"
    ><div
      :class="[
        'pointer-events-none fixed left-0 top-0 z-50 size-0 md:hidden',
        hidden && !ctx.mobileOpen.value ? 'invisible' : 'visible',
      ]"
    >
      <motion.button
        type="button"
        aria-label="Close sidebar"
        :tabindex="ctx.mobileOpen.value ? 0 : -1"
        :initial="false"
        :animate="{ opacity: ctx.mobileOpen.value ? 1 : 0 }"
        :transition="transition"
        :class="[
          'fixed inset-0 bg-black/40',
          ctx.mobileOpen.value ? 'pointer-events-auto' : 'pointer-events-none',
        ]"
        @click="ctx.mobileOpen.value = false"
      /><motion.div
        ref="panel"
        v-bind="$attrs"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        :aria-hidden="!ctx.mobileOpen.value"
        :inert="!ctx.mobileOpen.value || undefined"
        tabindex="-1"
        data-mobile="true"
        :data-state="ctx.mobileOpen.value ? 'expanded' : 'collapsed'"
        :data-side="side"
        :initial="false"
        :animate="destination"
        :transition="transition"
        :class="
          cn(
            'pointer-events-auto fixed inset-y-0 flex h-dvh w-(--sidebar-width-mobile) max-w-[88vw] flex-col overflow-hidden border-border bg-background shadow-2xl will-change-transform',
            side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
            !ctx.mobileOpen.value && 'pointer-events-none',
            $attrs.class,
          )
        "
        @animation-complete="complete"
        ><slot
      /></motion.div></div
  ></Teleport>
</template>
