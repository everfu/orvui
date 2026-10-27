<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Ellipsis } from "lucide-vue-next";
import { MorphPopover, MorphPopoverContent, MorphPopoverTrigger } from "../../popover";
import { useMediaQuery } from "../../../lib/composables";
withDefaults(defineProps<{ label?: string }>(), { label: "Show hidden paths" });
const open = ref(false), trigger = ref<HTMLButtonElement | null>(null), panel = ref<HTMLOListElement | null>(null);
const placement = ref<{ align: "start" | "end"; side: "top" | "bottom"; width: number }>({ align: "start", side: "bottom", width: 224 });
const hover = useMediaQuery("(hover: hover) and (pointer: fine)");
let closing: ReturnType<typeof setTimeout> | undefined, focusFrame = 0;
let focusRequested = false, disposed = false;
function position() {
  const bounds = trigger.value?.getBoundingClientRect();
  if (!bounds) return;
  const after = window.innerWidth - bounds.left - 8, before = bounds.right - 8;
  const align = after < 224 && before > after ? "end" : "start";
  const below = window.innerHeight - bounds.bottom;
  placement.value = { align, side: below < 280 && bounds.top > below ? "top" : "bottom", width: Math.max(32, Math.min(224, align === "start" ? after : before)) };
}
function cancelClose() { clearTimeout(closing); closing = undefined; }
function leave() {
  cancelClose();
  closing = setTimeout(() => {
    if (!panel.value?.contains(document.activeElement) && document.activeElement !== trigger.value) open.value = false;
  }, 160);
}
function enter(event: PointerEvent) {
  cancelClose();
  if (hover.value && event.pointerType === "mouse") { focusRequested = false; open.value = true; }
}
function focusPaths() {
  if (!focusRequested) return;
  const focus = () => { if (!disposed && open.value) panel.value?.querySelector<HTMLElement>("a[href],button")?.focus(); };
  void nextTick(() => {
    if (disposed) return;
    focus();
    cancelAnimationFrame(focusFrame);
    focusFrame = requestAnimationFrame(() => { focus(); focusRequested = false; });
  });
}
function arrow(event: KeyboardEvent) {
  if (event.key !== "ArrowDown") return;
  event.preventDefault();
  focusRequested = true;
  open.value = true;
  focusPaths();
}
function focusOutside(event: FocusEvent) {
  const target = event.target as Node | null;
  if (open.value && target && target !== trigger.value && !panel.value?.contains(target)) open.value = false;
}
function followLink(event: MouseEvent) { if ((event.target as Element).closest("a[href]")) open.value = false; }
watch(open, active => { if (active) { position(); focusPaths(); } });
watch(panel, focusPaths);
onMounted(() => { window.addEventListener("resize", position); document.addEventListener("focusin", focusOutside); });
onBeforeUnmount(() => {
  disposed = true; cancelClose(); cancelAnimationFrame(focusFrame);
  window.removeEventListener("resize", position); document.removeEventListener("focusin", focusOutside);
});
</script>
<template>
  <MorphPopover v-model:open="open"><span @pointerenter="enter" @pointerleave="leave">
    <MorphPopoverTrigger><button ref="trigger" type="button" :aria-label="label" @keydown="arrow"
      class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Ellipsis aria-hidden="true" class="size-4" /></button></MorphPopoverTrigger>
    <MorphPopoverContent :align="placement.align" :side="placement.side" :radius="10" :side-offset="6" class="p-1.5">
      <ol ref="panel" :style="{ width: `${placement.width - 14}px` }" @pointerenter="cancelClose(); open = true" @pointerleave="leave" @click="followLink"
        class="flex max-h-64 flex-col gap-0.5 overflow-y-auto [&>li]:w-full [&_a]:w-full [&_a]:py-1 [&_a]:[overflow-wrap:anywhere] [&_[data-breadcrumb-separator]]:hidden"><slot /></ol>
    </MorphPopoverContent>
  </span></MorphPopover>
</template>
