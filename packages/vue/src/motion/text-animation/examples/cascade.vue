<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { TextCascade } from "../index";
const actions = ["Install skills", "Open settings", "Ship updates"];
const selected = ref(0);
let interval: ReturnType<typeof setInterval> | undefined;
onMounted(() => { interval = setInterval(() => selected.value = (selected.value + 1) % actions.length, 2400); });
onBeforeUnmount(() => clearInterval(interval));
</script>
<template><div class="flex w-full justify-center"><p class="text-lg font-medium text-foreground"><TextCascade :text="actions[selected]" /></p></div></template>
