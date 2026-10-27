<script setup lang="ts">
import { createCardPart } from "./parts";
const Surface = createCardPart("CardAction", "div", "card-action", "col-start-2 row-span-2 row-start-1 flex items-center self-start justify-self-end");
defineSlots<{ default?: () => any }>();
</script>
<template><Surface><slot /></Surface></template>
