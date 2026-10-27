<script setup lang="ts">
import Scene from "./NotFoundStacked.vue";
import type { NotFoundProps } from "./types";
const options = defineProps<NotFoundProps>();
</script>
<template><Scene v-bind="options" /></template>
