<script setup lang="ts">
import { useId } from "vue";
import { motion } from "motion-v";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { useMenu } from "./menu-state";
const props = withDefaults(defineProps<{
  disabled?: boolean; closeOnSelect?: boolean; tone?: "default" | "destructive";
  inset?: boolean; textValue?: string; role?: "menuitem" | "menuitemcheckbox" | "menuitemradio"; ariaChecked?: boolean;
}>(), { closeOnSelect: true, tone: "default", role: "menuitem" });
const emit = defineEmits(["select"]);
defineSlots<{ default(): unknown }>();
const ctx = useMenu(), id = useId();
function click() {
  if (props.disabled) return;
  emit("select");
  if (props.closeOnSelect) ctx.setOpen(false);
}
</script>
<template>
  <button
    :id="id"
    type="button"
    :role="role"
    :aria-checked="role === 'menuitem' ? undefined : ariaChecked"
    :disabled="disabled"
    data-context-menu-item="true"
    :data-disabled="disabled ? 'true' : undefined"
    :data-label="textValue"
    tabindex="-1"
    @focus="ctx.activeId.value = id"
    @pointermove="
      (e) => {
        if (!disabled && e.pointerType !== 'touch')
          (e.currentTarget as HTMLElement).focus();
      }
    "
    @click="click"
    :class="
      cn(
        'relative isolate flex w-full select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40',
        inset && 'pl-8',
        tone === 'destructive' ? 'text-destructive' : 'text-foreground',
      )
    "
  >
    <motion.span
      v-if="ctx.activeId.value === id"
      :layout-id="ctx.id + '-active'"
      :class="
        cn(
          'absolute inset-0 -z-10 rounded-lg',
          tone === 'destructive'
            ? 'bg-destructive/10'
            : 'bg-foreground/[0.065]',
        )
      "
      :transition="ctx.reduce.value ? { duration: 0 } : SPRING_LAYOUT"
    /><slot />
  </button>
</template>
