<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, provide, ref, useId, watch } from "vue";
import { useMotionState } from "../../state";
import SortableListGroup from "./SortableListGroup.vue";
import SortableListItem from "./SortableListItem.vue";
import SortableListHandle from "./SortableListHandle.vue";
import SortableListItemContent from "./SortableListItemContent.vue";
import SortableListUndo from "./SortableListUndo.vue";
import type { MoveDirection, SortableContext } from "./context";
const props = withDefaults(defineProps<{ modelValue?: any[]; items?: any[]; defaultItems?: any[]; getItemLabel?: (item: any) => string; label?: string; disabled?: boolean; showUndo?: boolean; itemClassName?: string }>(), { defaultItems: () => [], label: "Sortable items", showUndo: true });
const emit = defineEmits(["update:modelValue", "update:items", "itemsChange", "change"]);
const model = useMotionState<any[]>(props, emit, "modelValue", props.defaultItems);
const items = computed({ get: () => props.items ?? model.value, set: (value: any[]) => { model.value = value; emit("update:items", value); emit("itemsChange", value); } });
const ids = computed<string[]>(() => items.value.map(item => item.id));
const history = ref<string[] | null>(null);
const announcement = ref("");
const root = ref<HTMLElement | null>(null);
const id = useId();
let draggingFrom: string[] | undefined;
let disposed = false;
let focusRevision = 0;
function sameMembers(order: string[], current = ids.value) { return order.length === current.length && new Set(order).size === order.length && order.every(id => current.includes(id)); }
watch([ids, history], ([current, previous]) => { if (new Set(current).size !== current.length) throw new Error("SortableList requires unique item ids."); if (previous && !sameMembers(previous, current)) history.value = null; }, { immediate: true, flush: "sync" });
const canUndo = computed(() => !!history.value && sameMembers(history.value) && history.value.some((id, index) => id !== ids.value[index]));
function reorder(order: string[]) { if (props.disabled || !sameMembers(order)) return; const lookup = new Map(items.value.map(item => [item.id, item])); items.value = order.map(id => lookup.get(id)); }
function describe(itemId: string, position: number) { const item = items.value.find(item => item.id === itemId); return `${props.getItemLabel?.(item) ?? item?.label ?? itemId} moved to position ${position + 1} of ${ids.value.length}.`; }
function move(itemId: string, direction: MoveDirection) { const from = ids.value.indexOf(itemId); const to = direction === "first" ? 0 : direction === "last" ? ids.value.length - 1 : from + direction; if (props.disabled || from < 0 || to < 0 || to >= ids.value.length || from === to) return; const before = ids.value.slice(); const after = before.slice(); after.splice(to, 0, after.splice(from, 1)[0]); history.value = before; reorder(after); announcement.value = describe(itemId, to); }
function undo() { if (props.disabled || !canUndo.value || !history.value) return; const order = history.value; const focusId = order.find((id, index) => id !== ids.value[index]) ?? order[0]; reorder(order); history.value = null; announcement.value = "Previous order restored."; const revision = ++focusRevision; void nextTick(() => { if (disposed || revision !== focusRevision) return; const buttons = root.value?.querySelectorAll<HTMLButtonElement>("button[data-sortable-id]"); Array.from(buttons ?? []).find(button => button.dataset.sortableId === focusId)?.focus({ preventScroll: true }); }); }
function begin() { draggingFrom = ids.value.slice(); }
function finish(itemId: string) { const order = draggingFrom; draggingFrom = undefined; if (!order || !items.value.some(item => item.id === itemId) || !order.some((id, index) => id !== ids.value[index])) return; history.value = order; announcement.value = describe(itemId, ids.value.indexOf(itemId)); }
provide<SortableContext>("orvui-sortable", { items, ids, canUndo, props, id, reorder, move, undo, begin, finish });
onBeforeUnmount(() => { disposed = true; ++focusRevision; draggingFrom = undefined; });
</script>
<template>
  <div ref="root" class="w-full max-w-md">
    <p :id="`${id}-instructions`" class="sr-only">Drag a handle to reorder. Use Up and Down to move, Home and End to move to the edges.</p>
    <slot :items="items" :move-item="move" :undo="undo"><SortableListGroup><SortableListItem v-for="(item, index) in items" :key="item.id" :id="item.id"><SortableListHandle /><SortableListItemContent><slot name="item" :item="item" :index="index">{{ getItemLabel?.(item) ?? item.label ?? item.id }}</slot></SortableListItemContent></SortableListItem></SortableListGroup><SortableListUndo v-if="showUndo" /></slot>
    <p role="status" aria-live="polite" class="sr-only">{{ announcement }}</p>
  </div>
</template>
