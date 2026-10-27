<script setup lang="ts">
import { ref } from "vue";
import { WaveSlider } from "../index";
const gain = ref(45);
</script>
<template><div class="flex w-full max-w-md flex-col gap-2"><div class="flex items-center justify-between text-sm text-muted-foreground"><span>Gain</span><span class="tabular-nums text-foreground">{{ gain }}</span></div><WaveSlider v-model="gain" aria-label="Gain" /></div></template>
