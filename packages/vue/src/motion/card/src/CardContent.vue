<script setup lang="ts">
import { createCardPart } from "./parts";
const Surface = createCardPart("CardContent", "div", "card-content", "text-sm", true);
defineSlots<{ default?: () => any }>();
</script>
<template><Surface><slot /></Surface></template>
