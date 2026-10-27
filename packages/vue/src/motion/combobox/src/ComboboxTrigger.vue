<script setup lang="ts">
import { ChevronsUpDown } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { useSearchContext } from "../../_combobox/controller";
const state = useSearchContext(false, "ComboboxTrigger");
function activate(event: PointerEvent) {
  const target = event.target instanceof Element ? event.target : null;
  if (
    event.defaultPrevented ||
    state.disabled.value ||
    target === state.inputRef.value
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
        'relative z-20 flex h-10 w-full min-w-52 cursor-text items-center justify-between gap-3 px-3 rounded-xl border border-border bg-transparent text-sm text-foreground transition-[border-color] hover:border-(--color-border-strong) focus-within:ring-2 focus-within:ring-foreground/20',
        state.disabled.value && 'pointer-events-none opacity-50',
      )
    "
  >
    <span class="min-w-0 flex-1 text-left"><slot /></span
    ><ChevronsUpDown
      :stroke-width="2.5"
      aria-hidden="true"
      class="size-4 shrink-0 text-muted-foreground"
    />
  </div>
</template>
