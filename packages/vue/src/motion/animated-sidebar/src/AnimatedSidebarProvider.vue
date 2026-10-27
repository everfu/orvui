<script setup lang="ts">
import { cn } from "../../../lib/utils";
import { provideSidebar } from "./use-sidebar-state";
const props = withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    openMobile?: boolean;
    defaultOpenMobile?: boolean;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
    shortcut?: boolean;
    expandedWidth?: number;
    collapsedWidth?: number;
  }>(),
  {
    open: undefined,
    openMobile: undefined,
    mobileOpen: undefined,
    defaultOpen: true,
    defaultOpenMobile: undefined,
    defaultMobileOpen: false,
    shortcut: true,
    expandedWidth: 256,
    collapsedWidth: 68,
  },
);
const emit = defineEmits([
  "update:open",
  "openChange",
  "update:openMobile",
  "openMobileChange",
  "update:mobileOpen",
]);
const { open, toggle } = provideSidebar(props, (event, value) =>
  emit(event as "update:open", value),
);
</script>
<template>
  <div
    data-slot="sidebar-wrapper"
    :data-state="open ? 'expanded' : 'collapsed'"
    :style="{
      '--sidebar-width': expandedWidth + 'px',
      '--sidebar-width-icon': collapsedWidth + 'px',
      '--sidebar-width-mobile': '18rem',
    }"
    :class="
      cn('group/sidebar-wrapper flex min-h-svh w-full min-w-0', $attrs.class)
    "
  >
    <slot :open="open" :toggle="toggle" />
  </div>
</template>
