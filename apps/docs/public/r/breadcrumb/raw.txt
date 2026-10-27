<script setup lang="ts">
import { useId } from "vue";
import { LayoutGroup } from "motion-v";
withDefaults(defineProps<{ ariaLabel?: string }>(), { ariaLabel: "Breadcrumb" });
const groupId = useId();
</script>
<template><nav :aria-label="ariaLabel" class="min-w-0"><LayoutGroup :id="groupId"><slot /></LayoutGroup></nav></template>
