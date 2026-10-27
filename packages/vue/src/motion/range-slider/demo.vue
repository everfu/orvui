<script setup lang="ts">
import { ref } from "vue";
import { RangeSlider } from "./index";
const amount = ref(40);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-3"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Drag the handle</span><span class="tabular-nums text-foreground">{{ amount }}</span></div><RangeSlider v-model="amount" :step="5" aria-label="Value" /></div></template>
