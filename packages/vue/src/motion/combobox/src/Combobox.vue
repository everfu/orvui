<script setup lang="ts">
import { provide } from "vue";
import {
  createSearchController,
  ComboboxContext,
} from "../../_combobox/controller";
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    defaultValue?: string;
    open?: boolean;
    defaultOpen?: boolean;
    query?: string;
    defaultQuery?: string;
    disabled?: boolean;
    filter?: (value: string, query: string, keywords: string[]) => boolean;
  }>(),
  { open: undefined, defaultOpen: false, defaultQuery: "" },
);
const emit = defineEmits([
  "update:modelValue",
  "change",
  "update:open",
  "update:query",
]);
const state = createSearchController(props, emit, false);
provide(ComboboxContext, state);
</script>
<template>
  <div class="relative">
    <slot
      :value="state.value.value"
      :open="state.open.value"
      :query="state.query.value"
    />
  </div>
</template>
