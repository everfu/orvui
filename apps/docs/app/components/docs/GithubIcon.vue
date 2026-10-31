<script setup lang="ts">
// GitHub brand mark: @iconify-json/simple-icons@1.2.100, CC0-1.0.
import { iconBodies } from "../../utils/docs/sourced-icons";
withDefaults(defineProps<{ size?: number }>(), { size: 14 });
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    aria-hidden="true"
    v-html="iconBodies.GithubIcon"
  />
</template>
