<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  type VNodeChild,
} from "vue";
import { AnimatePresence } from "motion-v";
import { cn } from "../../../lib/utils";
import { RenderNode } from "../../shared";
import {
  canContain,
  containsResource,
  findResource,
  flattenResources,
  moveResource,
  renameResource,
  type FlatResource,
  type SidebarResource,
  type SidebarResourceDropPosition,
  type SidebarResourceMenuControls,
  type SidebarResourceMove,
  type SidebarResourceMoveCommands,
} from "./tree";
import ResourceRow from "./ResourceRow.vue";
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    items?: SidebarResource[];
    defaultItems?: SidebarResource[];
    activeId?: string | null;
    defaultActiveId?: string | null;
    defaultExpandedIds?: string[];
    ariaLabel?: string;
    className?: string;
    onMove?: (move: SidebarResourceMove) => void | Promise<void>;
    onRename?: (item: SidebarResource, label: string) => void | Promise<void>;
    renderIcon?: (item: SidebarResource) => VNodeChild;
    renderMenu?: (
      item: SidebarResource,
      controls: SidebarResourceMenuControls,
    ) => VNodeChild;
  }>(),
  {
    defaultItems: () => [],
    defaultActiveId: null,
    defaultExpandedIds: () => [],
    ariaLabel: "Resources",
  },
);
const emit = defineEmits<{
  "update:items": [items: SidebarResource[]];
  itemsChange: [items: SidebarResource[]];
  "update:activeId": [id: string | null];
  activeChange: [id: string];
  moveError: [error: unknown, move: SidebarResourceMove];
  renameError: [error: unknown, item: SidebarResource];
}>();
const forest = ref(props.items ?? props.defaultItems);
const localSelection = ref(props.defaultActiveId);
const selection = computed(() =>
  props.activeId === undefined ? localSelection.value : props.activeId,
);
const expanded = ref(new Set(props.defaultExpandedIds));
const rows = computed(() => flattenResources(forest.value, expanded.value));
const focusId = ref(props.activeId ?? props.defaultActiveId);
const roving = computed(() =>
  rows.value.some((row) => row.item.id === focusId.value)
    ? focusId.value
    : (rows.value[0]?.item.id ?? null),
);
const dragging = ref<string | null>(null),
  menuId = ref<string | null>(null),
  editing = ref<string | null>(null),
  announcement = ref("");
const destination = ref<{
  id: string | null;
  position: SidebarResourceDropPosition;
} | null>(null);
const handles = new Map<string, { focus: () => void }>();
let busy = false,
  alive = true;
let focusFrame: number | undefined, menuFrame: number | undefined;
watch(
  () => props.items,
  (items) => {
    if (items) forest.value = items;
  },
);
watch(
  roving,
  (id) => {
    focusId.value = id;
  },
  { flush: "sync" },
);
watch(menuId, async (id) => {
  if (menuFrame !== undefined) cancelAnimationFrame(menuFrame);
  if (!id) return;
  await nextTick();
  if (!alive || menuId.value !== id) return;
  menuFrame = requestAnimationFrame(() =>
    Array.from(
      document.querySelectorAll<HTMLElement>("[data-sidebar-resource-menu]"),
    )
      .find((node) => node.dataset.sidebarResourceMenu === id)
      ?.querySelector<HTMLElement>("button,a[href]")
      ?.focus(),
  );
});
onBeforeUnmount(() => {
  alive = false;
  if (focusFrame !== undefined) cancelAnimationFrame(focusFrame);
  if (menuFrame !== undefined) cancelAnimationFrame(menuFrame);
  handles.clear();
});
function update(items: SidebarResource[]) {
  forest.value = items;
  emit("update:items", items);
  emit("itemsChange", items);
}
function focus(id: string) {
  focusId.value = id;
  if (focusFrame !== undefined) cancelAnimationFrame(focusFrame);
  focusFrame = requestAnimationFrame(() => {
    if (alive) handles.get(id)?.focus();
  });
}
function select(id: string) {
  if (props.activeId === undefined) localSelection.value = id;
  emit("update:activeId", id);
  emit("activeChange", id);
}
function toggle(id: string) {
  const next = new Set(expanded.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expanded.value = next;
}
async function move(change: SidebarResourceMove) {
  if (busy) {
    announcement.value = "Wait for the current move to finish.";
    return;
  }
  const before = forest.value,
    next = moveResource(before, change);
  if (!next || next === before) return;
  busy = true;
  update(next);
  dragging.value = null;
  destination.value = null;
  const source = findResource(before, change.itemId),
    target = change.targetId
      ? findResource(before, change.targetId)
      : undefined;
  announcement.value = target
    ? `Moved ${source?.label ?? "item"} ${change.position} ${target.label}.`
    : `Moved ${source?.label ?? "item"} to the top level.`;
  try {
    await props.onMove?.(change);
  } catch (error) {
    if (alive) {
      update(before);
      announcement.value = `Move failed. ${source?.label ?? "Item"} was restored.`;
      emit("moveError", error, change);
    }
  } finally {
    busy = false;
  }
}
function commands(row: FlatResource): SidebarResourceMoveCommands {
  if (row.item.disabled) return {};
  const index = rows.value.findIndex((item) => item.item.id === row.item.id),
    previous = rows.value[index - 1],
    next = rows.value[index + 1];
  const result: SidebarResourceMoveCommands = {};
  const relocate =
    (targetId: string, position: SidebarResourceDropPosition) => () => {
      void move({ itemId: row.item.id, targetId, position });
    };
  if (previous) result.up = relocate(previous.item.id, "before");
  if (next) result.down = relocate(next.item.id, "after");
  if (
    previous &&
    canContain(previous.item) &&
    previous.item.id !== row.parentId
  )
    result.into = {
      label: previous.item.label,
      run: () => {
        expanded.value = new Set(expanded.value).add(previous.item.id);
        relocate(previous.item.id, "inside")();
      },
    };
  if (row.parentId) result.out = relocate(row.parentId, "after");
  return result;
}
function keydown(event: KeyboardEvent, row: FlatResource) {
  const index = rows.value.findIndex((item) => item.item.id === row.item.id),
    previous = rows.value[index - 1],
    next = rows.value[index + 1];
  const key = event.key,
    moving = event.altKey && event.shiftKey;
  if (!moving && (key === "ArrowUp" || key === "ArrowDown")) {
    const target = key === "ArrowUp" ? previous : next;
    if (target) {
      event.preventDefault();
      focus(target.item.id);
    }
    return;
  }
  if ((key === "Home" || key === "End") && rows.value.length) {
    event.preventDefault();
    focus(
      (key === "Home" ? rows.value[0] : rows.value[rows.value.length - 1]).item
        .id,
    );
    return;
  }
  if (row.item.disabled) {
    if (key === "ArrowLeft" && row.parentId) {
      event.preventDefault();
      focus(row.parentId);
    } else if (
      moving ||
      ["ArrowRight", "Enter", " ", "F2", "ContextMenu"].includes(key) ||
      (event.shiftKey && key === "F10")
    )
      event.preventDefault();
    return;
  }
  if (moving) {
    const action = commands(row);
    const run =
      key === "ArrowUp"
        ? action.up
        : key === "ArrowDown"
          ? action.down
          : key === "ArrowLeft"
            ? action.out
            : key === "ArrowRight"
              ? action.into?.run
              : undefined;
    if (run) {
      event.preventDefault();
      run();
      return;
    }
  }
  if (key === "ArrowRight" && canContain(row.item)) {
    event.preventDefault();
    if (!expanded.value.has(row.item.id)) toggle(row.item.id);
    else if (next?.parentId === row.item.id) focus(next.item.id);
  } else if (key === "ArrowLeft") {
    event.preventDefault();
    if (expanded.value.has(row.item.id)) toggle(row.item.id);
    else if (row.parentId) focus(row.parentId);
  } else if (key === "Enter" || key === " ") {
    event.preventDefault();
    if (canContain(row.item)) toggle(row.item.id);
    else select(row.item.id);
  } else if (key === "F2") {
    event.preventDefault();
    editing.value = row.item.id;
  } else if (key === "ContextMenu" || (event.shiftKey && key === "F10")) {
    event.preventDefault();
    menuId.value = row.item.id;
  }
}
async function rename(item: SidebarResource, text: string) {
  editing.value = null;
  const label = text.trim();
  if (!label || label === item.label) return;
  const before = forest.value;
  update(renameResource(before, item.id, label));
  try {
    await props.onRename?.(item, label);
  } catch (error) {
    if (alive) {
      update(before);
      announcement.value = `Rename failed. ${item.label} was restored.`;
      emit("renameError", error, item);
    }
  }
}
function dragStart(event: DragEvent, id: string) {
  dragging.value = id;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
  }
}
function dragOver(event: DragEvent, row: FlatResource) {
  if (!dragging.value || dragging.value === row.item.id) return;
  const source = findResource(forest.value, dragging.value);
  if (source && containsResource(source, row.item.id)) return;
  event.preventDefault();
  event.stopPropagation();
  const box = (event.currentTarget as HTMLElement).getBoundingClientRect(),
    fraction = (event.clientY - box.top) / Math.max(1, box.height);
  const position: SidebarResourceDropPosition =
    !row.item.disabled &&
    canContain(row.item) &&
    fraction >= 0.25 &&
    fraction <= 0.75
      ? "inside"
      : fraction < 0.5
        ? "before"
        : "after";
  destination.value = { id: row.item.id, position };
}
function drop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  if (dragging.value && destination.value)
    void move({
      itemId: dragging.value,
      targetId: destination.value.id,
      position: destination.value.position,
    });
}
function menu(open: boolean, id: string) {
  menuId.value = open ? id : null;
  if (!open) focus(id);
}
function clearDrag() {
  dragging.value = null;
  destination.value = null;
}
function outsideOver(event: DragEvent) {
  if (dragging.value && event.target === event.currentTarget) {
    event.preventDefault();
    destination.value = { id: null, position: "after" };
  }
}
</script>
<template>
  <div
    v-bind="$attrs"
    role="tree"
    :aria-label="ariaLabel"
    aria-multiselectable="false"
    :class="
      cn(
        'relative flex min-w-0 flex-col gap-0.5 [overflow-anchor:none] group-data-[state=collapsed]/sidebar:hidden',
        dragging && 'select-none pb-9',
        className,
        $attrs.class,
      )
    "
    @dragover="outsideOver"
    @drop="drop"
  >
    <AnimatePresence :initial="false"
      ><ResourceRow
        v-for="row in rows"
        :key="row.item.id"
        :ref="
          (node) => {
            if (node)
              handles.set(
                row.item.id,
                node as unknown as { focus: () => void },
              );
            else handles.delete(row.item.id);
          }
        "
        :row="row"
        :active="selection === row.item.id"
        :expanded="expanded.has(row.item.id)"
        :focused="roving === row.item.id"
        :dragging-id="dragging"
        :drop-target="destination"
        :menu-open="menuId === row.item.id"
        :moves="commands(row)"
        :renaming="editing === row.item.id"
        :render-icon="renderIcon"
        :render-menu="renderMenu"
        @focus="focusId = row.item.id"
        @select="select(row.item.id)"
        @toggle="toggle(row.item.id)"
        @key="keydown($event, row)"
        @rename-start="editing = row.item.id"
        @rename-cancel="editing = null"
        @rename-commit="rename(row.item, $event)"
        @menu="menu($event, row.item.id)"
        @drag-start="dragStart"
        @drag-end="clearDrag"
        @drag-over="dragOver"
        @drop="drop"
      >
        <template v-if="$slots.icon" #icon="scope"
          ><slot name="icon" v-bind="scope"
            ><RenderNode :node="renderIcon?.(scope.item)" /></slot></template
        ><template v-if="$slots.menu" #menu="scope"
          ><slot name="menu" v-bind="scope"
            ><RenderNode
              :node="renderMenu?.(scope.item, scope.controls)" /></slot
        ></template> </ResourceRow
    ></AnimatePresence>
    <div
      v-if="dragging"
      aria-hidden="true"
      :data-active="destination?.id === null || undefined"
      class="absolute inset-x-1 bottom-0 flex h-8 items-center justify-center rounded-lg border border-dashed border-border text-[10px] text-muted-foreground data-[active=true]:border-primary/50 data-[active=true]:bg-muted data-[active=true]:text-foreground"
    >
      Move to top level
    </div>
  </div>
  <span class="sr-only" aria-live="polite">{{ announcement }}</span>
</template>
