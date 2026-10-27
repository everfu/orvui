<script setup lang="ts">
import { usePicker, CHECKERBOARD } from "./context";
const state = usePicker();
</script>
<template>
  <span
    aria-hidden="true"
    class="relative block size-9 shrink-0 overflow-hidden rounded-lg"
    :style="{ background: CHECKERBOARD }"
    ><span
      class="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)] transition-colors duration-150"
      :style="{ backgroundColor: state.hex.value }"
  /></span>
</template>
