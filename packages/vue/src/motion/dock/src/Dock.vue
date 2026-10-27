<script setup lang="ts">
import { computed, provide, useId } from "vue";
import type { DockContext } from "./context";
const props = withDefaults(defineProps<{ size?: number }>(), { size: 44 });
const context: DockContext = { size: computed(() => props.size), id: useId() };
provide("orvui-dock", context);
</script>
<template><div class="inline-flex items-end gap-1.5 rounded-2xl border border-border bg-card/80 px-2 py-1 shadow-2xl backdrop-blur-xl"><slot /></div></template>
