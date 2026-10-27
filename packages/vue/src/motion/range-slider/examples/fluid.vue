<script setup lang="ts">
import { ref } from "vue";
import { FluidSlider } from "../index";
const brightness = ref(35);
</script>
<template><div class="w-full max-w-sm"><FluidSlider v-model="brightness" label="Brightness" aria-label="Brightness" /></div></template>
