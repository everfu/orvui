<script setup lang="ts">
import { ref } from "vue";
import { TextScramble } from "../index";
const steps = ["Inspecting the repository", "Running the checks", "Preparing the update"];
const selected = ref(0);
function advance() { selected.value = (selected.value + 1) % steps.length; }
</script>
<template><div class="flex w-full flex-col items-center gap-8 text-center"><TextScramble :text="steps[selected]" class="font-mono text-xl font-medium text-foreground" /><button type="button" @click="advance" class="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-medium text-foreground hover:border-border-strong">Next phrase</button></div></template>
