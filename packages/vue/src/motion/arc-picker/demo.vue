<script setup lang="ts">
import { ref } from "vue";
import { ArcPicker, type ArcPickerSide } from "./index";
import { Button } from "../button";
const directions = ["top", "bottom", "left", "right"] as const;
const times = ["First light", "Dawn", "Daybreak", "Sunrise", "Early morning", "Morning", "Late morning", "Midday", "Noon", "Afternoon", "Golden hour", "Sunset", "Blue hour", "Dusk", "Twilight", "Evening", "Nightfall", "Night", "Late night", "Midnight", "Deep night", "Starlight"];
const options = times.map(label => ({ label, value: label.toLowerCase().replaceAll(" ", "-") }));
const value = ref("golden-hour");
const side = ref<ArcPickerSide>("right");
</script>
<template><div class="w-full max-w-xl py-5"><fieldset class="flex flex-wrap items-center justify-center gap-1 px-4"><legend class="sr-only">Curve side</legend><Button v-for="direction in directions" :key="direction" size="sm" :variant="side === direction ? 'secondary' : 'ghost'" :aria-pressed="side === direction" @click="side = direction" class="capitalize">{{ direction }}</Button></fieldset><div class="my-8 flex min-h-108 items-center sm:my-10"><ArcPicker v-model="value" :options="options" aria-label="Time of day" :side="side" :radius="260" :visible-count="9" :item-height="48" /></div><p class="px-6 text-center text-xs text-muted-foreground">Drag {{ side === 'top' || side === 'bottom' ? 'horizontally' : 'vertically' }}, scroll or use the arrow keys.</p></div></template>
