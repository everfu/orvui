<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { inject, nextTick, onBeforeUnmount, watch } from "vue";
import { MorphPopoverContent } from "../../popover";
import type { createDateRangePicker } from "./controller";
const props = withDefaults(
  defineProps<{
    autoFocus?: boolean;
    onOpenAutoFocus?: (content: HTMLDivElement) => void;
  }>(),
  { autoFocus: true },
);
const state =
  inject<ReturnType<typeof createDateRangePicker>>("orvui-date-range")!;
let revision = 0,
  disposed = false;
async function focus(panel: HTMLDivElement) {
  state.content.value = panel;
  const version = ++revision;
  await nextTick();
  if (disposed || version !== revision || !state.open.value) return;
  if (props.autoFocus) {
    const grid = [...panel.querySelectorAll<HTMLElement>('[role="grid"]')].find(
      (node) => !node.closest("[inert]"),
    );
    (grid?.querySelector<HTMLElement>('button[tabindex="0"]') ?? grid)?.focus({
      preventScroll: true,
    });
  }
  props.onOpenAutoFocus?.(panel);
}
watch(state.open, async (opened) => {
  ++revision;
  if (!opened || !props.autoFocus) return;
  await nextTick();
  if (state.content.value && !disposed)
    void focus(state.content.value as HTMLDivElement);
});
onBeforeUnmount(() => {
  disposed = true;
  ++revision;
});
</script>
<template>
  <MorphPopoverContent
    v-bind="$attrs"
    align="start"
    :radius="16"
    :shadow="false"
    class="w-80 max-w-[calc(100vw-1.5rem)]"
    :on-open-auto-focus="focus"
    ><slot
  /></MorphPopoverContent>
</template>
