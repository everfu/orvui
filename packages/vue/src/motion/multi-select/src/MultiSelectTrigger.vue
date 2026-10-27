<script setup lang="ts">
import { ChevronsUpDown } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { useSearchContext } from "../../_combobox/controller";
const state = useSearchContext(true, "MultiSelectTrigger");
function activate(event: PointerEvent) {
  const target = event.target instanceof Element ? event.target : null;
  if (
    event.defaultPrevented ||
    state.disabled.value ||
    target === state.inputRef.value ||
    target?.closest("[data-multi-select-remove]")
  )
    return;
  event.preventDefault();
  state.setOpen(true);
  state.focusInput();
}
</script>
<template>
  <div
    :ref="(el) => (state.triggerRef.value = el as HTMLElement)"
    :id="state.triggerId"
    :data-state="state.open.value ? 'open' : 'closed'"
    @pointerdown="activate"
    :class="
      cn(
        'relative z-20 flex min-h-11 w-full min-w-52 cursor-text items-center gap-2 px-2.5 py-1.5 rounded-xl border border-border bg-transparent text-sm text-foreground transition-[border-color] hover:border-(--color-border-strong) focus-within:ring-2 focus-within:ring-foreground/20',
        state.disabled.value && 'pointer-events-none opacity-50',
      )
    "
  >
    <div class="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
      <slot />
    </div>
    <ChevronsUpDown
      aria-hidden="true"
      class="size-4 shrink-0 text-muted-foreground"
    />
  </div>
</template>
