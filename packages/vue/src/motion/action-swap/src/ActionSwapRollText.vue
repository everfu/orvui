<script setup lang="ts">
import ActionSwapText from "./ActionSwapText.vue";
const props = defineProps<{ value: string | number }>();
defineSlots<{ default?: () => any }>();
</script>
<template><ActionSwapText :value="props.value" animation="roll"><slot /></ActionSwapText></template>
