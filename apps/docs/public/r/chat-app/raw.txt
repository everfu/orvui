<script setup lang="ts">
import { AnimatedSidebarProvider } from "../../../motion/animated-sidebar";
import { cn } from "../../../lib/utils";
import ShellFit from "./ShellFit.vue";
defineOptions({ inheritAttrs: false });
withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    openMobile?: boolean;
    defaultOpenMobile?: boolean;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
    sidebarWidth?: string;
    collapseSidebarBelow?: number;
    shortcut?: boolean;
  }>(),
  {
    open: undefined,
    openMobile: undefined,
    mobileOpen: undefined,
    defaultOpen: true,
    defaultOpenMobile: undefined,
    defaultMobileOpen: false,
    sidebarWidth: "17rem",
    collapseSidebarBelow: 600,
    shortcut: true,
  },
);
const emit = defineEmits<{
  "update:open": [open: boolean];
  openChange: [open: boolean];
  "update:openMobile": [open: boolean];
  openMobileChange: [open: boolean];
  "update:mobileOpen": [open: boolean];
}>();
function desktop(value: boolean) {
  emit("update:open", value);
  emit("openChange", value);
}
function mobile(value: boolean) {
  emit("update:openMobile", value);
  emit("openMobileChange", value);
}
</script>
<template>
  <AnimatedSidebarProvider
    v-bind="$attrs"
    :open="open"
    :default-open="defaultOpen"
    :open-mobile="openMobile"
    :default-open-mobile="defaultOpenMobile"
    :mobile-open="mobileOpen"
    :default-mobile-open="defaultMobileOpen"
    :shortcut="shortcut"
    :class="
      cn(
        'min-h-0 w-full overflow-hidden rounded-2xl border border-border bg-background',
        $attrs.class,
      )
    "
    :style="[$attrs.style as any, { '--sidebar-width': sidebarWidth }]"
    @update:open="desktop"
    @update:open-mobile="mobile"
    @update:mobile-open="emit('update:mobileOpen', $event)"
  >
    <ShellFit
      v-if="open === undefined"
      :min-width="collapseSidebarBelow"
    /><slot />
  </AnimatedSidebarProvider>
</template>
