<script setup lang="ts">
import { AgentProgress } from "../index";
const initial = 151.6;
</script>
<template>
  <AgentProgress
    label="Churning"
    :initial-seconds="initial"
    class="text-base"
  />
</template>
