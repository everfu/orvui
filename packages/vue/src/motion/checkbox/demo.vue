<script setup lang="ts">
import { reactive } from "vue";
import { Checkbox } from "./index";
const settings = reactive({ terms: true, announcements: false });
</script>
<template>
  <div class="flex flex-col gap-3">
    <Checkbox v-model="settings.terms" label="Agree to the service terms" />
    <Checkbox v-model="settings.announcements" label="Receive product announcements" />
    <Checkbox :model-value="true" indeterminate label="Some options selected" />
    <Checkbox :model-value="true" disabled label="Unavailable" />
  </div>
</template>
