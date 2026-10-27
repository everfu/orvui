<script setup lang="ts">
import { useSearchContext } from "../../_combobox/controller";
const props = withDefaults(defineProps<{ ariaLabel?: string }>(), {
  ariaLabel: "Options",
});
const state = useSearchContext(false, "ComboboxList");
</script>
<template>
  <div
    :id="state.listId"
    role="listbox"
    :aria-label="props.ariaLabel"
    class="relative isolate max-h-64 overflow-y-auto overscroll-contain p-1.5 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
  >
    <slot />
  </div>
</template>
