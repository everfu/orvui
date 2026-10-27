<script setup lang="ts">
import { computed } from "vue";
import { motion, AnimatePresence } from "motion-v";
import { cn } from "../../../lib/utils";
import { useSidebar, useSidebarPanel } from "./context";
import { submenuVariants } from "./transitions";
const props = defineProps<{ open: boolean }>(),
  ctx = useSidebar(),
  panel = useSidebarPanel();
const present = computed(() => props.open && !panel.collapsed.value);
const movement = computed(() =>
  ctx.reduce.value
    ? {
        initial: false as const,
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.12 },
      }
    : {
        variants: submenuVariants,
        initial: "closed",
        animate: "open",
        exit: "closed",
      },
);
</script>
<template>
  <AnimatePresence :initial="false" mode="popLayout"
    ><motion.ul
      v-if="present"
      key="sidebar-submenu"
      v-bind="movement"
      data-slot="sidebar-menu-sub"
      :class="
        cn(
          'relative mt-1 ml-5 flex min-w-0 flex-col gap-0.5 border-border border-l pl-3',
          $attrs.class,
        )
      "
      ><slot /></motion.ul
  ></AnimatePresence>
</template>
