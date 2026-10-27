<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "../index";
const selected = ref("once");
const options = [
  { value: "once", label: "Run once", description: "Start one run immediately." },
  { value: "schedule", label: "Run on a schedule", description: "Use a recurring interval until you stop it." },
  { value: "trigger", label: "Run on a trigger", description: "Start after the selected event arrives." },
  { value: "manual", label: "Manual approval", description: "Choose another plan to use this option.", disabled: true },
];
</script>
<template><RadioGroup v-model="selected" class="w-full max-w-64"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
