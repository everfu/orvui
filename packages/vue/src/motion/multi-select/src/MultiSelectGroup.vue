<script setup lang="ts">
import { computed, provide, useId } from "vue";
import {
  useSearchContext,
  MultiSelectGroupContext,
} from "../../_combobox/controller";
const id = useId();
const state = useSearchContext(true, "MultiSelectGroup");
provide(MultiSelectGroupContext, id);
const hidden = computed(() => !state.hasVisibleItems(id));
</script>
<template>
  <fieldset :hidden="hidden" class="m-0 min-w-0 border-0 p-0 py-0.5">
    <slot />
  </fieldset>
</template>
