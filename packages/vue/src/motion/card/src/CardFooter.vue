<script setup lang="ts">
import { createCardPart } from "./parts";
const Surface = createCardPart("CardFooter", "div", "card-footer", "flex items-center gap-2", true);
defineSlots<{ default?: () => any }>();
</script>
<template><Surface><slot /></Surface></template>
