<script setup lang="ts">
import { useAttrs } from "vue";
import { Undo2 } from "lucide-vue-next";
import { cn } from "../../../lib/utils";
import { sortableContext } from "./context";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ disabled?: boolean }>();
const attrs = useAttrs();
const list = sortableContext("SortableListUndo");
function click(event: MouseEvent) { if (!event.defaultPrevented) list.undo(); }
</script>
<template><button v-bind="{ ...attrs, class: undefined }" type="button" :disabled="props.disabled || list.props.disabled || !list.canUndo.value" @click="click" :class="cn('mt-4 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40', attrs.class)"><slot><Undo2 class="size-[13px]" />Undo reorder</slot></button></template>
