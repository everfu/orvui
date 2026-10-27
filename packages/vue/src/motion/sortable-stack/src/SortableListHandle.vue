<script setup lang="ts">
import { computed, inject, useAttrs } from "vue";
import { sortableContext, type MoveDirection, type SortableItemContext } from "./context";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ disabled?: boolean }>();
const attrs = useAttrs();
const list = sortableContext("SortableListHandle");
const item = inject<SortableItemContext>("orvui-sortable-item");
if (!item) throw new Error("SortableListHandle must be used within SortableListItem");
const unavailable = computed(() => props.disabled || list.props.disabled);
const label = computed(() => { const entry = list.items.value.find(entry => entry.id === item.id); return list.props.getItemLabel?.(entry) ?? entry?.label ?? item.id; });
function pointer(event: PointerEvent) { if (event.defaultPrevented || unavailable.value || event.button !== 0) return; (event.currentTarget as HTMLElement).focus({ preventScroll: true }); item!.controls.start(event); }
const directions: Record<string, MoveDirection> = { ArrowUp: -1, ArrowDown: 1, Home: "first", End: "last" };
function keyboard(event: KeyboardEvent) { if (event.defaultPrevented || unavailable.value || event.ctrlKey || event.altKey || event.metaKey || !(event.key in directions)) return; event.preventDefault(); list.move(item!.id, directions[event.key]); }
</script>
<template><button v-bind="attrs" type="button" :disabled="unavailable" :data-sortable-id="item.id" :aria-label="(attrs['aria-label'] as string | undefined) ?? `Reorder ${label}`" :aria-describedby="[`${list.id}-instructions`, attrs['aria-describedby']].filter(Boolean).join(' ')" @pointerdown="pointer" @keydown="keyboard" class="flex size-9 shrink-0 touch-none items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40" :style="{ cursor: unavailable ? undefined : item.dragging.value ? 'grabbing' : 'grab' }"><slot><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="4" y="3" width="5" height="5" rx="1.5" /><rect x="15" y="3" width="5" height="5" rx="1.5" /><rect x="4" y="9.5" width="5" height="5" rx="1.5" /><rect x="15" y="9.5" width="5" height="5" rx="1.5" /><rect x="4" y="16" width="5" height="5" rx="1.5" /><rect x="15" y="16" width="5" height="5" rx="1.5" /></svg></slot></button></template>
