<script setup lang="ts">
import { Github } from "lucide-vue-next";
withDefaults(defineProps<{ size?: number }>(), { size: 14 });
</script>
<template><Github :size="size" aria-hidden="true" /></template>
