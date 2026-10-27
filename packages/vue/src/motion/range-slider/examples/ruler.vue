<script setup lang="ts">
import { ref } from "vue";
import { RulerSlider } from "../index";
const weight = ref(72.5);
</script>
<template><div class="w-full max-w-sm"><RulerSlider v-model="weight" :min="40" :max="120" :step=".5" :gap="12" :major-every="10" unit="kg" aria-label="Weight" /></div></template>
