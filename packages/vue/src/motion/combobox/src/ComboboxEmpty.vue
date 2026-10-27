<script setup lang="ts">
import { computed } from "vue";
import { useSearchContext } from "../../_combobox/controller";
const state = useSearchContext(false, "ComboboxEmpty");
const empty = computed(() => state.visibleCount.value === 0);
</script>
<template>
  <div
    v-if="empty"
    role="status"
    class="px-3 py-8 text-center text-sm text-muted-foreground"
  >
    <slot>No options found.</slot>
  </div>
</template>
