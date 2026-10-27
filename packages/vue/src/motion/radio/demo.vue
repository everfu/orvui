<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "./index";
const selected = ref("studio");
const options = [
  { value: "personal", label: "Personal, free" },
  { value: "studio", label: "Studio, $12/mo" },
  { value: "workspace", label: "Workspace, $29/mo" },
  { value: "archived", label: "Archived plan", disabled: true },
];
</script>
<template>
  <RadioGroup v-model="selected" class="min-w-48">
    <RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" />
  </RadioGroup>
</template>
