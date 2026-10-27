<script setup lang="ts">
import { provide } from "vue";
import {
  createPopover,
  popoverKey,
  hoverGesture,
  type PopoverProps,
} from "./context";
const props = withDefaults(defineProps<PopoverProps>(), {
  open: undefined,
  defaultOpen: false,
  trigger: "click",
  side: "bottom",
  align: "center",
  sideOffset: 14,
  panelRadius: 16,
  gooStrength: 8,
});
const emit = defineEmits(["update:open", "openChange"]);
const state = createPopover(props, emit, "goo");
const root = state.root;
const hover = hoverGesture();
provide(popoverKey, state);
function enter(event: PointerEvent) {
  if (props.trigger === "hover" && hover.enter(event)) state.openHover();
}
function leave(event: PointerEvent) {
  if (props.trigger === "hover" && hover.leave(event)) state.scheduleClose();
}
</script>
<template>
  <div
    ref="root"
    :class="['relative inline-flex isolate', className]"
    @pointerenter="enter"
    @pointerleave="leave"
  >
    <slot :open="state.open.value" />
  </div>
</template>
