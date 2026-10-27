<script setup lang="ts">
import ActionSwapIcon from "./ActionSwapIcon.vue";
const props = defineProps<{ value: string | number }>();
defineSlots<{ default?: () => any }>();
</script>
<template><ActionSwapIcon :value="props.value" animation="blur"><slot /></ActionSwapIcon></template>
