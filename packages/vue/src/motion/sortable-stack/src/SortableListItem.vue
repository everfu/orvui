<script setup lang="ts">
import { provide, ref } from "vue";
import { ReorderItem, useDragControls } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { sortableContext, type SortableItemContext } from "./context";
const props = defineProps<{ id: string; label?: string }>();
const list = sortableContext("SortableListItem");
if (!list.ids.value.includes(props.id)) throw new Error(`SortableListItem ${props.id} is not present in the root items`);
const controls = useDragControls();
const dragging = ref(false);
const reduced = useReducedMotion();
provide<SortableItemContext>("orvui-sortable-item", { get id() { return props.id; }, controls, dragging });
function start() { dragging.value = true; list.begin(); }
function end() { dragging.value = false; list.finish(props.id); }
</script>
<template><ReorderItem :value="id" layout="position" :drag-listener="false" :drag-controls="controls" :drag="list.props.disabled ? false : 'y'" :while-drag="reduced ? undefined : { scale: 1.025 }" :transition="reduced ? { duration: 0 } : SPRING_LAYOUT" :aria-posinset="list.ids.value.indexOf(id) + 1" :aria-setsize="list.ids.value.length" @drag-start="start" @drag-end="end" :class="cn('relative flex items-center gap-3 rounded-2xl border border-border bg-background p-3', dragging && 'shadow-lg', list.props.itemClassName)"><slot /></ReorderItem></template>
