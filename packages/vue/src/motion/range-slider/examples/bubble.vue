<script setup lang="ts">
import { ref } from "vue";
import { BubbleSlider } from "../index";
const amount = ref(28);
</script>
<template><div class="flex w-full max-w-sm flex-col gap-1"><span class="text-sm text-muted-foreground">Drag fast and the bubble leans</span><BubbleSlider v-model="amount" aria-label="Value" /></div></template>
