<script setup lang="ts">
import { useCodeScramble } from "./use-not-found-scene";
const props = defineProps<{ text: string }>();
const label = useCodeScramble(() => props.text);
</script>
<template><span class="tabular-nums">{{ label }}</span></template>
