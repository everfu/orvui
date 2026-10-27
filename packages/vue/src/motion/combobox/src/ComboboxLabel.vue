<script setup lang="ts">
import { inject } from "vue";
import { ComboboxGroupContext } from "../../_combobox/controller";
const group = inject(ComboboxGroupContext, undefined);
</script>
<template>
  <legend
    v-if="group"
    class="w-full px-2 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground"
  >
    <slot />
  </legend>
  <div
    v-else
    class="w-full px-2 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted-foreground"
  >
    <slot />
  </div>
</template>
