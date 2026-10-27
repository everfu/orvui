<script setup lang="ts">
import { ref } from "vue";
import { Switch } from "./index";
const notifications = ref(true);
</script>
<template>
  <div class="flex flex-col gap-3">
    <Switch v-model="notifications" label="Activity notifications" />
    <Switch :model-value="false" label="Inactive" />
    <Switch :model-value="true" disabled label="Unavailable" />
  </div>
</template>
