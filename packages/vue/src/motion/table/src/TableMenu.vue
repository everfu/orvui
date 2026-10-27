<script setup lang="ts">
import { motion } from "motion-v";
import { SPRING_PANEL } from "../../../lib/ease";
import RenderContent from "../../../lib/RenderContent";
import { cn } from "../../../lib/utils";
import { useTableMenu } from "./use-table-menu";
export interface TableMenuItem {
  label: string;
  icon?: any;
  onSelect: () => void;
  destructive?: boolean;
}
defineProps<{
  items: TableMenuItem[];
  ariaLabel: string;
  triggerClassName?: string;
}>();
const emit = defineEmits<{ openChange: [open: boolean] }>();
const { trigger, panel, coords, reduce, id, close, toggle, navigate } =
  useTableMenu((open) => emit("openChange", open));
</script>
<template>
  <button
    ref="trigger"
    type="button"
    :aria-label="ariaLabel"
    aria-haspopup="menu"
    :aria-controls="coords ? id : undefined"
    :aria-expanded="!!coords"
    :class="triggerClassName"
    @click.stop="toggle"
  >
    <slot /></button
  ><Teleport v-if="coords" to="body"
    ><div class="fixed inset-0 z-40" @pointerdown="close()" />
    <motion.div
      ref="panel"
      :id="id"
      role="menu"
      :aria-label="ariaLabel"
      class="fixed z-50 overflow-hidden rounded-xl border border-border bg-background p-1 shadow-xl"
      :style="{
        top: coords.top + 'px',
        left: coords.left + 'px',
        width: '188px',
      }"
      :initial="reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }"
      :animate="reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }"
      :transition="reduce ? { duration: 0 } : SPRING_PANEL"
      @keydown="navigate"
      ><button
        v-for="item in items"
        :key="item.label"
        type="button"
        role="menuitem"
        :class="
          cn(
            'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors outline-none [&_svg]:h-4 [&_svg]:w-4',
            item.destructive
              ? 'text-rose-500 hover:bg-rose-500/10 focus:bg-rose-500/10'
              : 'text-foreground hover:bg-muted focus:bg-muted',
          )
        "
        @click="
          close(true);
          item.onSelect();
        "
      >
        <RenderContent v-if="item.icon" :node="item.icon" />{{ item.label }}
      </button></motion.div
    ></Teleport
  >
</template>
