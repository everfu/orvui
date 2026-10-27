<script setup lang="ts">
import SearchSurface from "../../_combobox/SearchSurface.vue";
import { useSearchContext } from "../../_combobox/controller";
const props = withDefaults(
  defineProps<{
    side?: "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    avoidCollisions?: boolean;
  }>(),
  { side: "bottom", align: "start", sideOffset: 6, avoidCollisions: true },
);
const surface = useSearchContext(true, "MultiSelectContent");
</script>
<template>
  <SearchSurface :context="surface" v-bind="props" data-multi-select-content=""
    ><slot
  /></SearchSurface>
</template>
