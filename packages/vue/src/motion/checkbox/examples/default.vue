<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "../index";
const settings = reactive({ terms: true, announcements: false });
</script>
<template><div class="flex flex-col gap-3">
  <Checkbox v-model="settings.terms" label="Accept terms and conditions" /><Checkbox v-model="settings.announcements" label="Email me product updates" />
  <Checkbox :model-value="true" indeterminate label="Select all (partial)" /><Checkbox :model-value="true" disabled label="Disabled" />
</div></template>
