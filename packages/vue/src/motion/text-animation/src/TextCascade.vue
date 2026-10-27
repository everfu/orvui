<script setup lang="ts">
import { computed } from "vue";
import ActionSwapText from "../../action-swap/src/ActionSwapText.vue";
const props = defineProps<{ text: string }>();
const current = computed(() => props.text);
</script>
<template><ActionSwapText :value="current" animation="cascade">{{ current }}</ActionSwapText></template>
