<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  type VNodeChild,
} from "vue";
import { motion } from "motion-v";
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  FileText,
  Folder,
  FolderInput,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Undo2,
} from "lucide-vue-next";
import {
  MorphPopover,
  MorphPopoverContent,
  MorphPopoverTrigger,
} from "../../../motion/popover";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { cn } from "../../../lib/utils";
import { RenderNode } from "../../shared";
import {
  canContain,
  type FlatResource,
  type SidebarResourceDropPosition,
  type SidebarResourceMenuControls,
  type SidebarResourceMoveCommands,
} from "./tree";
import MarqueeLabel from "./MarqueeLabel.vue";
import { useTouchCapable } from "./useTouchCapable";
const props = defineProps<{
  row: FlatResource;
  active: boolean;
  expanded: boolean;
  focused: boolean;
  draggingId: string | null;
  dropTarget: {
    id: string | null;
    position: SidebarResourceDropPosition;
  } | null;
  menuOpen: boolean;
  moves: SidebarResourceMoveCommands;
  renaming: boolean;
  renderIcon?: (item: FlatResource["item"]) => VNodeChild;
  renderMenu?: (
    item: FlatResource["item"],
    controls: SidebarResourceMenuControls,
  ) => VNodeChild;
}>();
const emit = defineEmits<{
  focus: [];
  key: [e: KeyboardEvent];
  menu: [open: boolean];
  renameStart: [];
  renameCancel: [];
  renameCommit: [label: string];
  select: [];
  toggle: [];
  dragStart: [e: DragEvent, id: string];
  dragEnd: [];
  dragOver: [e: DragEvent, row: FlatResource];
  drop: [e: DragEvent];
}>();
const reduced = useReducedMotion(),
  touch = useTouchCapable();
const element = ref<unknown>(),
  input = ref<HTMLInputElement>(),
  hovered = ref(false),
  draft = ref(props.row.item.label);
const container = computed(() => canContain(props.row.item));
const placement = computed(() =>
  props.dropTarget?.id === props.row.item.id
    ? props.dropTarget.position
    : undefined,
);
const icon = computed(() =>
  container.value
    ? props.expanded
      ? FolderOpen
      : Folder
    : props.row.item.kind === "bookmark"
      ? Bookmark
      : FileText,
);
const customIcon = computed(() => props.renderIcon?.(props.row.item));
const controls = computed<SidebarResourceMenuControls>(() => ({
  close: () => emit("menu", false),
  rename: () => run(() => emit("renameStart")),
  moves: props.moves,
}));
const customMenu = computed(() =>
  props.renderMenu?.(props.row.item, controls.value),
);
const actions = computed(() => {
  const result = [
    { label: "Rename", icon: Pencil, run: () => emit("renameStart") },
  ];
  if (props.moves.up)
    result.push({ label: "Move up", icon: ArrowUp, run: props.moves.up });
  if (props.moves.down)
    result.push({ label: "Move down", icon: ArrowDown, run: props.moves.down });
  if (props.moves.into)
    result.push({
      label: `Move into ${props.moves.into.label}`,
      icon: FolderInput,
      run: props.moves.into.run,
    });
  if (props.moves.out)
    result.push({ label: "Move out", icon: Undo2, run: props.moves.out });
  return result;
});
let blurHandled = false,
  dragged = false;
let renameFrame: number | undefined, dragFrame: number | undefined;
const seen = new WeakSet<MouseEvent>();
watch(
  () => [props.renaming, props.row.item.label] as const,
  async ([renaming]) => {
    if (!renaming) return;
    blurHandled = false;
    draft.value = props.row.item.label;
    await nextTick();
    if (renameFrame !== undefined) cancelAnimationFrame(renameFrame);
    renameFrame = requestAnimationFrame(() => {
      input.value?.focus();
      input.value?.select();
    });
  },
);
function activate(event: MouseEvent) {
  if (
    seen.has(event) ||
    event.defaultPrevented ||
    dragged ||
    props.renaming ||
    props.row.item.disabled
  )
    return;
  seen.add(event);
  if (container.value) emit("toggle");
  else emit("select");
}
function run(action: () => void, event?: MouseEvent) {
  if (event) activate(event);
  emit("menu", false);
  action();
}
function renameKey(event: KeyboardEvent) {
  event.stopPropagation();
  if (event.key === "Enter" || event.key === "Escape") {
    blurHandled = true;
    if (event.key === "Enter") emit("renameCommit", draft.value);
    else emit("renameCancel");
  }
}
function doubleClick(event: MouseEvent) {
  if (!container.value && !props.row.item.disabled) {
    event.preventDefault();
    emit("renameStart");
  }
}
function dragStart(event: DragEvent) {
  dragged = true;
  emit("dragStart", event, props.row.item.id);
}
function dragEnd() {
  emit("dragEnd");
  dragFrame = requestAnimationFrame(() => {
    dragged = false;
  });
}
onBeforeUnmount(() => {
  if (renameFrame !== undefined) cancelAnimationFrame(renameFrame);
  if (dragFrame !== undefined) cancelAnimationFrame(dragFrame);
});
defineExpose({
  focus: () => resolveElement<HTMLElement>(element.value)?.focus(),
});
</script>
<template>
  <motion.div
    ref="element"
    layout="position"
    :transition="reduced ? { duration: 0 } : SPRING_LAYOUT"
    role="treeitem"
    :aria-level="row.depth + 1"
    :aria-selected="container ? undefined : active"
    :aria-expanded="container ? expanded : undefined"
    :aria-disabled="row.item.disabled || undefined"
    :tabindex="focused ? 0 : -1"
    :draggable="!row.item.disabled && !renaming"
    :data-resource-id="row.item.id"
    :data-menu-open="menuOpen || undefined"
    :data-drop="placement"
    :data-dragging="draggingId === row.item.id || undefined"
    @focus="emit('focus')"
    @keydown="emit('key', $event)"
    @click="activate"
    @dblclick="doubleClick"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @dragstart.capture="dragStart"
    @dragend.capture="dragEnd"
    @dragover="emit('dragOver', $event, row)"
    @drop="emit('drop', $event)"
    :class="
      cn(
        'group/resource relative flex min-h-9 min-w-0 cursor-pointer items-center gap-2.5 rounded-xl pr-3 text-sm outline-none',
        'text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
        'focus-visible:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
        'data-[menu-open=true]:bg-muted data-[menu-open=true]:text-foreground',
        'data-[dragging=true]:opacity-40',
        'data-[drop=inside]:bg-muted data-[drop=inside]:ring-1 data-[drop=inside]:ring-primary/45',
        'data-[drop=before]:before:absolute data-[drop=before]:before:-top-0.5 data-[drop=before]:before:right-2 data-[drop=before]:before:left-2 data-[drop=before]:before:h-0.5 data-[drop=before]:before:rounded-full data-[drop=before]:before:bg-primary',
        'data-[drop=after]:after:absolute data-[drop=after]:after:-bottom-0.5 data-[drop=after]:after:right-2 data-[drop=after]:after:left-2 data-[drop=after]:after:h-0.5 data-[drop=after]:after:rounded-full data-[drop=after]:after:bg-primary',
        !container && active && 'bg-muted text-foreground',
        row.item.disabled && 'cursor-not-allowed opacity-45',
      )
    "
    :style="{ paddingLeft: `${12 + row.depth * 16}px` }"
  >
    <span aria-hidden="true" class="grid size-5 shrink-0 place-items-center"
      ><slot name="icon" :item="row.item"
        ><RenderNode v-if="customIcon != null" :node="customIcon" /><component
          v-else
          :is="icon"
          class="size-4" /></slot
    ></span>
    <input
      v-if="renaming"
      ref="input"
      v-model="draft"
      :aria-label="`Rename ${row.item.label}`"
      :draggable="false"
      @click.stop
      @dblclick.stop
      @blur="!blurHandled && emit('renameCommit', draft)"
      @keydown="renameKey"
      class="mx-1 h-7 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
    <MarqueeLabel
      v-else
      :active="hovered || menuOpen"
      :label="row.item.label"
    />
    <MorphPopover
      v-if="!renaming && !row.item.disabled"
      :open="menuOpen"
      @update:open="emit('menu', $event)"
      ><MorphPopoverTrigger
        ><button
          type="button"
          :draggable="false"
          :tabindex="-1"
          :aria-label="`Actions for ${row.item.label}`"
          @click.stop
          :class="
            cn(
              'grid size-7 shrink-0 place-items-center rounded-lg outline-none transition-opacity hover:bg-foreground/5 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring group-hover/resource:opacity-100 group-focus-visible/resource:opacity-100 group-data-[menu-open=true]/resource:opacity-100',
              touch ? 'opacity-100' : 'opacity-0',
            )
          "
        >
          <MoreHorizontal aria-hidden="true" class="size-4" /></button
      ></MorphPopoverTrigger>
      <MorphPopoverContent
        side="bottom"
        align="end"
        :side-offset="8"
        :radius="12"
        class="w-40 p-1.5"
        ><div :data-sidebar-resource-menu="row.item.id" @click="activate">
          <slot name="menu" :item="row.item" :controls="controls"
            ><RenderNode
              v-if="customMenu != null"
              :node="customMenu"
            /><template
              v-for="(action, index) in customMenu != null ? [] : actions"
              :key="action.label"
              ><div
                v-if="index === 1"
                aria-hidden="true"
                class="my-1 h-px bg-border"
              />
              <button
                type="button"
                @click="run(action.run, $event)"
                class="flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs text-foreground outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <component
                  :is="action.icon"
                  aria-hidden="true"
                  class="size-3.5 shrink-0"
                /><span class="min-w-0 truncate">{{ action.label }}</span>
              </button></template
            ></slot
          >
        </div></MorphPopoverContent
      >
    </MorphPopover>
  </motion.div>
</template>
