<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { cn } from "../../../lib/utils";
import { useViewer } from "./context";
defineOptions({ inheritAttrs: false });
const viewer = useViewer();
const attrs = useAttrs();
const label = computed(() => String(attrs['aria-label'] ?? viewer.label.value));
</script>
<template><section v-bind="attrs" :aria-label="label" :class="cn('grid w-full grid-cols-2 gap-3 sm:grid-cols-3', attrs.class as string)"><slot /></section></template>
