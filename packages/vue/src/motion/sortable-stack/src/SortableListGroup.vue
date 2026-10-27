<script setup lang="ts">
import { ReorderGroup } from "motion-v";
import { sortableContext } from "./context";
const list = sortableContext("SortableListGroup");
</script>
<template><ReorderGroup axis="y" :values="list.ids.value" :aria-label="list.props.label" class="space-y-2" @update:values="list.reorder"><slot /></ReorderGroup></template>
