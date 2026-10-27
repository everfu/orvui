<script setup lang="ts">
import { createCardPart } from "./parts";
const Surface = createCardPart("CardDescription", "p", "card-description", "text-sm leading-relaxed text-muted-foreground");
defineSlots<{ default?: () => any }>();
</script>
<template><Surface><slot /></Surface></template>
