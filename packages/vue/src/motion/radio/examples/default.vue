<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, RadioGroupItem } from "../index";
const selected = ref("pro");
const options = [{ value: "starter", label: "Starter, free" }, { value: "pro", label: "Pro, $12/mo" }, { value: "team", label: "Team, $29/mo" }, { value: "legacy", label: "Legacy plan", disabled: true }];
</script>
<template><RadioGroup v-model="selected" class="min-w-48"><RadioGroupItem v-for="option in options" :key="option.value" v-bind="option" /></RadioGroup></template>
