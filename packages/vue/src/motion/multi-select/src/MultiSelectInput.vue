<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { Search } from "lucide-vue-next";
import { computed } from "vue";
import { cn } from "../../../lib/utils";
import { useSearchContext } from "../../_combobox/controller";
withDefaults(
  defineProps<{
    placeholder?: string;
    wrapperClassName?: string;
    showIcon?: boolean;
  }>(),
  { placeholder: "Search…", showIcon: false },
);
const state = useSearchContext(true, "MultiSelectInput");
const displayed = computed(() => state.query.value);
let composing = false;
function beginComposition() {
  composing = true;
}
function endComposition() {
  composing = false;
}
function input(event: Event) {
  state.setOpen(true);
  state.setQuery((event.target as HTMLInputElement).value);
}
function key(event: KeyboardEvent) {
  if (!composing && !event.isComposing) state.keydown(event);
}
function pointer(event: PointerEvent) {
  if (event.defaultPrevented || state.disabled.value || state.open.value)
    return;
  state.setOpen(true);
}
</script>
<template>
  <div
    :class="cn('flex min-w-20 flex-1 items-center gap-1.5', wrapperClassName)"
  >
    <Search
      v-if="showIcon"
      aria-hidden="true"
      class="size-3.5 text-muted-foreground"
    />
    <input
      v-bind="$attrs"
      :ref="(el) => (state.inputRef.value = el as HTMLInputElement)"
      :id="state.inputId"
      role="combobox"
      :aria-label="($attrs['aria-label'] as string) ?? 'Search options'"
      aria-autocomplete="list"
      :aria-expanded="state.open.value"
      :aria-controls="state.listId"
      :aria-activedescendant="
        state.open.value ? state.activeItemId.value : undefined
      "
      autocomplete="off"
      :disabled="state.disabled.value"
      :value="displayed"
      :placeholder="state.values.value.length ? '' : placeholder"
      @pointerdown="pointer"
      @focus="state.setOpen(true)"
      @click="state.setOpen(true)"
      @input="input"
      @keydown="key"
      @compositionstart="beginComposition"
      @compositionend="endComposition"
      :class="
        cn(
          'h-7 min-w-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
          $attrs.class as string,
        )
      "
    />
  </div>
</template>
