<script setup lang="ts">
import { motion } from "motion-v";
import { GripVertical, ChevronUp } from "lucide-vue-next";
import { SPRING_PRESS, EASE_OUT } from "../../../lib/ease";
import Checkbox from "../../checkbox/src/Checkbox.vue";
import RenderContent from "../../../lib/RenderContent";
import { cn } from "../../../lib/utils";
import type { TableColumn, SortState } from "./types";
import type { useTableColumns } from "./useTableColumns";
defineProps<{
  columns: TableColumn<any>[];
  rowHeight: number;
  reduce: boolean;
  selectable: boolean;
  allSelected: boolean;
  someSelected: boolean;
  sort: SortState | null;
  resizable: boolean;
  reorderable: boolean;
  activeColumn: string | null;
  headers: Record<string, HTMLElement | null>;
  controller: ReturnType<typeof useTableColumns>;
  renamable: boolean;
}>();
const emit = defineEmits<{
  toggleAll: [];
  toggleSort: [key: string];
  rename: [key: string, value: string];
  activate: [key: string];
  deactivate: [];
}>();
const gesture =
  "select-none [-webkit-touch-callout:none] [-webkit-user-select:none]";
const justify = (align?: string) =>
  align === "right"
    ? "justify-end"
    : align === "center"
      ? "justify-center"
      : "justify-start";
const align = (align?: string) =>
  align === "right"
    ? "text-right"
    : align === "center"
      ? "text-center"
      : "text-left";
</script>
<template>
  <thead>
    <tr :style="{ height: rowHeight + 'px' }">
      <th
        v-if="selectable"
        class="sticky top-0 z-10 border-border border-b bg-muted"
      >
        <div class="flex items-center justify-center">
          <Checkbox
            :model-value="allSelected"
            :indeterminate="!allSelected && someSelected"
            aria-label="Select all rows"
            class="size-6"
            @update:model-value="emit('toggleAll')"
          />
        </div>
      </th>
      <th
        v-for="(column, index) in columns"
        :key="column.key"
        :ref="
          (node) => {
            headers[column.key] = node as HTMLElement | null;
          }
        "
        :style="
          activeColumn === column.key
            ? { boxShadow: 'inset 0 1px 0 var(--color-primary)' }
            : undefined
        "
        :aria-sort="
          sort?.key === column.key
            ? sort.direction === 'asc'
              ? 'ascending'
              : 'descending'
            : undefined
        "
        :data-drop="
          controller.dragKey.value
            ? controller.dropIndex.value === index
            : undefined
        "
        :data-dropend="
          controller.dragKey.value
            ? controller.dropIndex.value === columns.length &&
              index === columns.length - 1
            : undefined
        "
        class="group sticky top-0 z-10 border-border border-b bg-muted p-0 font-medium text-muted-foreground data-[drop=true]:before:absolute data-[drop=true]:before:inset-y-0 data-[drop=true]:before:left-0 data-[drop=true]:before:w-0.5 data-[drop=true]:before:bg-primary data-[dropend=true]:after:absolute data-[dropend=true]:after:inset-y-0 data-[dropend=true]:after:right-0 data-[dropend=true]:after:w-0.5 data-[dropend=true]:after:bg-primary"
        @pointerenter="emit('activate', column.key)"
        @pointerleave="emit('deactivate')"
      >
        <motion.div
          :class="['flex h-full items-center', justify(column.align)]"
          :style="{ height: rowHeight + 'px' }"
          :animate="
            reduce
              ? { opacity: controller.dragKey.value === column.key ? 0.5 : 1 }
              : {
                  scale: controller.dragKey.value === column.key ? 1.04 : 1,
                  opacity: controller.dragKey.value === column.key ? 0.5 : 1,
                }
          "
          :transition="SPRING_PRESS"
        >
          <button
            v-if="reorderable"
            type="button"
            :aria-label="'Reorder ' + column.key + ' column'"
            :class="
              cn(
                'flex h-full w-6 cursor-grab touch-none items-center justify-center text-muted-foreground/60 transition-colors hover:text-foreground active:cursor-grabbing',
                gesture,
              )
            "
            @pointerdown="controller.startReorder(column.key, $event)"
            @pointermove="controller.moveReorder"
            @pointerup="controller.endReorder"
            @pointercancel="controller.cancel"
            @keydown.left.prevent="controller.keyboardReorder(column.key, -1)"
            @keydown.right.prevent="controller.keyboardReorder(column.key, 1)"
          >
            <GripVertical class="h-3.5 w-3.5" />
          </button>
          <button
            v-if="column.sortable"
            type="button"
            :class="
              cn(
                'flex h-full min-w-0 flex-1 select-none items-center gap-1 px-4 transition-colors hover:text-foreground',
                justify(column.align),
                sort?.key === column.key && 'text-primary',
              )
            "
            @click="emit('toggleSort', column.key)"
          >
            <span class="truncate"><RenderContent :node="column.header" /></span
            ><motion.span
              aria-hidden="true"
              class="inline-flex shrink-0"
              :animate="{
                rotate:
                  sort?.key === column.key && sort.direction === 'desc'
                    ? 180
                    : 0,
                opacity: sort?.key === column.key ? 1 : 0.35,
              }"
              :transition="
                reduce ? { duration: 0 } : { duration: 0.18, ease: EASE_OUT }
              "
              ><ChevronUp class="h-3.5 w-3.5"
            /></motion.span>
          </button>
          <input
            v-else-if="renamable"
            :value="typeof column.header === 'string' ? column.header : ''"
            :aria-label="'Rename ' + column.key + ' column'"
            :size="1"
            :class="
              cn(
                'min-w-0 flex-1 truncate appearance-none rounded-md border-0 bg-transparent px-4 font-medium text-muted-foreground outline-none transition-colors focus:bg-muted focus:text-foreground',
                align(column.align),
              )
            "
            @input="
              emit(
                'rename',
                column.key,
                ($event.target as HTMLInputElement).value,
              )
            " /><span
            v-else
            :class="['min-w-0 flex-1 truncate px-4', align(column.align)]"
            ><RenderContent :node="column.header" /></span
        ></motion.div>
        <button
          v-if="resizable"
          type="button"
          :aria-label="'Resize ' + column.key + ' column'"
          :class="
            cn(
              'absolute top-0 right-0 h-full w-1.5 cursor-col-resize touch-none bg-transparent transition-colors hover:bg-muted',
              gesture,
            )
          "
          @pointerdown="controller.startResize(column.key, $event)"
          @pointermove="controller.moveResize"
          @pointerup="controller.endResize"
          @pointercancel="controller.cancel"
          @keydown.right.prevent="controller.keyboardResize(column.key, 1)"
          @keydown.left.prevent="controller.keyboardResize(column.key, -1)"
        />
      </th>
      <th
        aria-hidden="true"
        class="sticky top-0 z-10 border-border border-b bg-muted"
      />
    </tr>
  </thead>
</template>
