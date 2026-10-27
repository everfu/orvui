<script setup lang="ts">
import { createCardPart } from "./parts";
const Surface = createCardPart("CardHeader", "div", "card-header", "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto]", true);
defineSlots<{ default?: () => any }>();
</script>
<template><Surface><slot /></Surface></template>
