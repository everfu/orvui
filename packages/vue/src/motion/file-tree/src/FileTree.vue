<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useSlots } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { ChevronRight, File, Folder, FolderOpen } from "lucide-vue-next";
import { SharedLayoutBg } from "../../shared-layout-bg";
import RenderContent from "../../../lib/RenderContent";
import { cn } from "../../../lib/utils";
import { EASE_OUT, SPRING_LAYOUT, SPRING_SWAP } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
import { useMotionState } from "../../state";
import { readTree, visibleTree, type TreeRow } from "./tree-model";
export interface FileTreeClassNames { tree?: string; item?: string; icon?: string; label?: string }
const props = withDefaults(defineProps<{ modelValue?: string | null; defaultValue?: string | null; expandedIds?: string[]; defaultExpandedIds?: string[]; ariaLabel?: string; indent?: number; classNames?: FileTreeClassNames }>(), { defaultValue: null, defaultExpandedIds: () => [], ariaLabel: "Files", indent: 18 });
const emit = defineEmits(["update:modelValue", "change", "update:expandedIds", "expandedChange"]);
const selected = useMotionState<string | null>(props, emit, "modelValue", props.defaultValue);
const expanded = useMotionState<string[]>(props, emit, "expandedIds", props.defaultExpandedIds);
const reduced = useReducedMotion();
const slots = useSlots();
const focused = ref<string | null>(null);
const elements = new Map<string, HTMLButtonElement>();
let disposed = false;
let focusVersion = 0;
let prefix = "";
let typedAt = 0;
function rows() { return visibleTree(readTree(slots.default?.() ?? []), expanded.value); }
function isOpen(row: TreeRow) { return expanded.value.includes(row.item.value); }
function tabIndex(row: TreeRow) { const all = rows(); const candidates = [focused.value, selected.value, all[0]?.item.value]; return row.item.value === candidates.find(id => all.some(other => other.item.value === id)) ? 0 : -1; }
function toggle(row: TreeRow) { const id = row.item.value; expanded.value = isOpen(row) ? expanded.value.filter(item => item !== id) : [...expanded.value, id]; emit("expandedChange", expanded.value); }
function select(row: TreeRow) { if (row.item.disabled) return; selected.value = row.item.value; if (row.item.type === "folder") toggle(row); }
async function focus(id: string | undefined) { if (!id) return; focused.value = id; const version = ++focusVersion; await nextTick(); if (!disposed && version === focusVersion) elements.get(id)?.focus(); }
function key(event: KeyboardEvent, row: TreeRow) {
  const all = rows(); const index = all.findIndex(item => item.item.value === row.item.value);
  let destination: string | undefined; let handled = true;
  switch (event.key) {
    case "ArrowDown": destination = all[index + 1]?.item.value; handled = !!destination; break;
    case "ArrowUp": destination = all[index - 1]?.item.value; handled = !!destination; break;
    case "Home": destination = all[0]?.item.value; break;
    case "End": destination = all.at(-1)?.item.value; break;
    case "ArrowLeft": if (row.item.type === "folder" && isOpen(row) && !row.item.disabled) toggle(row); else destination = row.parentId ?? undefined; break;
    case "ArrowRight": if (row.item.type !== "folder") { handled = false; break; } if (!isOpen(row) && !row.item.disabled) toggle(row); else if (all[index + 1]?.parentId === row.item.value) destination = all[index + 1].item.value; break;
    case "Enter": case " ": select(row); break;
    default: {
      handled = false;
      if (event.key.length !== 1 || event.ctrlKey || event.altKey || event.metaKey) break;
      const time = performance.now(); prefix = time - typedAt < 500 ? prefix + event.key : event.key; typedAt = time;
      const searchOrder = all.slice(index + 1).concat(all.slice(0, index + 1));
      destination = searchOrder.find(item => item.item.name.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase()))?.item.value; handled = !!destination;
    }
  }
  if (handled) event.preventDefault(); if (destination) void focus(destination);
}
function register(id: string, node: unknown) { if (node) elements.set(id, node as HTMLButtonElement); else elements.delete(id); }
onBeforeUnmount(() => { disposed = true; ++focusVersion; elements.clear(); });
</script>
<template>
  <SharedLayoutBg role="tree" :aria-label="ariaLabel" aria-multiselectable="false" :inset="0" pill-class-name="rounded-xl bg-muted" pill-container-class-name="inset-y-auto top-0 h-9" :class="cn('min-w-0', classNames?.tree)">
    <motion.div v-for="row in rows()" :key="row.item.value" :layout="reduced ? false : 'position'" :initial="reduced ? false : { opacity: 0, y: -6 }" :animate="{ opacity: row.item.disabled ? .42 : 1, y: 0, transition: reduced ? { duration: 0 } : { duration: .22, ease: EASE_OUT, delay: Math.min(row.position * .025, .1) } }" :transition="reduced ? { duration: 0 } : SPRING_LAYOUT">
      <button :ref="node => register(row.item.value, node)" type="button" role="treeitem" :aria-level="row.depth + 1" :aria-posinset="row.position" :aria-setsize="row.setSize" :aria-selected="selected === row.item.value" :aria-expanded="row.item.type === 'folder' ? isOpen(row) : undefined" :aria-disabled="row.item.disabled || undefined" :tabindex="tabIndex(row)" :class="cn('group/file-tree relative flex h-9 w-full items-center gap-2 overflow-hidden rounded-lg pr-2 text-left text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset aria-disabled:cursor-not-allowed', selected === row.item.value && 'bg-muted font-medium text-foreground', classNames?.item, row.item.class)" :style="{ paddingLeft: `${8 + row.depth * indent}px` }" @focus="focused = row.item.value" @keydown="key($event, row)" @click="select(row)">
        <motion.span v-if="row.depth > 0" aria-hidden="true" class="absolute bottom-0 top-0 w-px origin-top bg-border" :style="{ left: `${16 + (row.depth - 1) * indent}px` }" :initial="reduced ? false : { opacity: 0, scaleY: 0 }" :animate="{ opacity: 1, scaleY: 1 }" :exit="{ opacity: 0, scaleY: 0 }" :transition="{ duration: reduced ? 0 : .3, ease: EASE_OUT }" />
        <motion.span aria-hidden="true" class="relative z-10 grid size-4 shrink-0 place-items-center" :class="row.item.type === 'file' ? 'opacity-0' : ''" :animate="{ rotate: row.item.type === 'folder' && isOpen(row) ? 90 : 0 }" :transition="reduced ? { duration: 0 } : SPRING_SWAP"><ChevronRight class="size-3.5" /></motion.span>
        <span aria-hidden="true" :class="cn('relative z-10 grid size-4 shrink-0 place-items-center text-muted-foreground transition-colors group-hover/file-tree:text-foreground', row.item.type === 'folder' && isOpen(row) && 'text-foreground', classNames?.icon)">
          <RenderContent v-if="row.item.icon" :node="row.item.icon" /><File v-else-if="row.item.type === 'file'" class="size-4" />
          <AnimatePresence v-else :initial="false" mode="popLayout"><motion.span :key="isOpen(row) ? 'open' : 'closed'" class="absolute inset-0 grid place-items-center" :initial="reduced ? false : { opacity: 0, scale: .75, rotate: isOpen(row) ? -8 : 8 }" :animate="{ opacity: 1, scale: 1, rotate: 0 }" :exit="reduced ? undefined : { opacity: 0, scale: .75, rotate: isOpen(row) ? 8 : -8 }" :transition="reduced ? { duration: 0 } : SPRING_SWAP"><FolderOpen v-if="isOpen(row)" class="size-4" /><Folder v-else class="size-4" /></motion.span></AnimatePresence>
        </span>
        <span :class="cn('relative z-10 min-w-0 flex-1 truncate', classNames?.label)">{{ row.item.name }}</span>
      </button>
    </motion.div>
  </SharedLayoutBg>
</template>
