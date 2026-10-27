<script setup lang="ts">
import { provide } from "vue";
import {
  createPopover,
  popoverKey,
  hoverGesture,
  type PopoverProps,
} from "./context";
const props = withDefaults(
  defineProps<{ open?: boolean; defaultOpen?: boolean; className?: string }>(),
  { open: undefined },
);
const emit = defineEmits(["update:open", "openChange"]);
const state = createPopover(props, emit, "morph");
const root = state.root;
const hover = hoverGesture();
provide(popoverKey, state);
function enter(event: PointerEvent) {
  if (false && hover.enter(event)) state.openHover();
}
function leave(event: PointerEvent) {
  if (false && hover.leave(event)) state.scheduleClose();
}
</script>
<template>
  <div
    ref="root"
    :class="['relative inline-flex', className]"
    @pointerenter="enter"
    @pointerleave="leave"
  >
    <slot :open="state.open.value" />
  </div>
</template>
