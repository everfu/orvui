<script setup lang="ts">
import { AgentProgress, ReasoningText, ThinkingShimmer } from "./index";
const variants = ["cascade", "swap", "scramble"] as const;
</script>
<template>
  <div class="flex min-h-72 flex-col items-start justify-center gap-7">
    <ReasoningText
      v-for="variant in variants"
      :key="variant"
      :variant="variant"
    /><ThinkingShimmer>Searching for the right words…</ThinkingShimmer
    ><AgentProgress label="Churning" />
  </div>
</template>
