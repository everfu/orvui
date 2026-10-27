<script setup lang="ts">
import Checkbox from "../../checkbox/src/Checkbox.vue";
import { cn } from "../../../lib/utils";
import RenderContent from "../../../lib/RenderContent";
import { useTable } from "./use-table";
import type { TableProps } from "./types";
import TableHeader from "./TableHeader.vue";
import TableHandle from "./TableHandle.vue";
import EditableCell from "./EditableCell.vue";
import SkeletonRows from "./SkeletonRows.vue";
const props = withDefaults(defineProps<TableProps<any>>(), {
  selectable: false,
  defaultSelectedRowIds: () => [],
  defaultSort: null,
  resizable: false,
  minColumnWidth: 64,
  reorderable: false,
  rowHeight: 48,
  height: 440,
  overscan: 10,
  loading: false,
  skeletonRows: 3,
  emptyState: "No data",
});
const emit = defineEmits([
  "update:selectedRowIds",
  "selectionChange",
  "update:sort",
  "sortChange",
  "columnResize",
  "columnOrderChange",
  "cellEdit",
  "columnRename",
  "insertRow",
  "deleteRow",
  "insertColumn",
  "deleteColumn",
  "endReached",
]);
const {
  headers,
  rowElements,
  viewport,
  reduce,
  controller,
  columns,
  widths,
  rows,
  selectedSet,
  allSelected,
  someSelected,
  toggleAll,
  toggleRow,
  toggleSort,
  sort,
  virtualRows,
  paddingTop,
  paddingBottom,
  sized,
  minWidth,
  colSpan,
  scroll,
  activeColumn,
  activeRow,
  activeColumnIndex,
  columnItems,
  rowItems,
  activateColumn,
  deactivateColumn,
  activateRow,
  deactivateRow,
} = useTable(props, emit);
const alignment = (align?: string) =>
  align === "right"
    ? "text-right"
    : align === "center"
      ? "text-center"
      : "text-left";
</script>
<template>
  <div
    :class="
      cn(
        'w-full overflow-hidden border border-border bg-background text-sm',
        className,
      )
    "
  >
    <div
      ref="viewport"
      class="overflow-auto"
      :style="{ height: height + 'px' }"
      @scroll.passive="scroll"
    >
      <table
        :aria-rowcount="rows.length + 1"
        :aria-colcount="columns.length + (selectable ? 1 : 0)"
        :aria-busy="loading || undefined"
        :class="cn('border-collapse', sized && 'w-max')"
        :style="{ tableLayout: 'fixed', minWidth: `max(100%, ${minWidth}px)` }"
      >
        <colgroup>
          <col v-if="selectable" style="width: 48px" />
          <col
            v-for="column in columns"
            :key="column.key"
            :style="
              widths[column.key] != null
                ? { width: widths[column.key] + 'px' }
                : column.width
                  ? { width: column.width }
                  : undefined
            "
          />
          <col />
        </colgroup>
        <TableHeader
          :columns="columns"
          :row-height="rowHeight"
          :reduce="reduce"
          :headers="headers"
          :controller="controller"
          :selectable="selectable"
          :all-selected="allSelected"
          :some-selected="someSelected"
          :sort="sort"
          :resizable="resizable"
          :reorderable="reorderable"
          :active-column="activeColumn"
          :renamable="!!onColumnRename"
          @toggle-all="toggleAll"
          @toggle-sort="toggleSort"
          @rename="(key, value) => emit('columnRename', key, value)"
          @activate="activateColumn"
          @deactivate="deactivateColumn"
        />
        <tbody>
          <template v-if="!rows.length"
            ><SkeletonRows
              v-if="loading"
              :count="Math.max(1, Math.ceil(height / rowHeight))"
              :columns="columns"
              :selectable="selectable"
              :row-height="rowHeight" />
            <tr v-else>
              <td
                :colspan="colSpan"
                class="p-10 text-center text-muted-foreground"
              >
                <slot name="empty"><RenderContent :node="emptyState" /></slot>
              </td></tr
          ></template>
          <template v-else
            ><tr
              v-if="paddingTop > 0"
              aria-hidden="true"
              :style="{ height: paddingTop + 'px' }"
            >
              <td :colspan="colSpan" />
            </tr>
            <tr
              v-for="virtual in virtualRows"
              :key="String(virtual.key)"
              :ref="
                (node) => {
                  rowElements[rows[virtual.index].id] =
                    node as HTMLElement | null;
                }
              "
              :data-index="virtual.index"
              :data-selected="selectedSet.has(rows[virtual.index].id)"
              :aria-rowindex="virtual.index + 2"
              :aria-selected="
                selectable ? selectedSet.has(rows[virtual.index].id) : undefined
              "
              :style="{ height: rowHeight + 'px' }"
              class="border-border/60 border-b transition-colors data-[selected=true]:bg-muted/60 hover:bg-muted/50"
              @pointerenter="activateRow(rows[virtual.index].id, virtual.index)"
              @pointerleave="deactivateRow"
              @focusin="activateRow(rows[virtual.index].id, virtual.index)"
            >
              <td v-if="selectable" class="text-center">
                <div class="flex items-center justify-center">
                  <Checkbox
                    :model-value="selectedSet.has(rows[virtual.index].id)"
                    :aria-label="'Select row ' + (virtual.index + 1)"
                    @update:model-value="toggleRow(rows[virtual.index].id)"
                  />
                </div>
              </td>
              <td
                v-for="column in columns"
                :key="column.key"
                :class="[
                  'truncate px-4 text-foreground',
                  alignment(column.align),
                ]"
              >
                <slot
                  :name="'cell-' + column.key"
                  :row="rows[virtual.index].row"
                  :value="rows[virtual.index].row[column.key]"
                  :row-id="rows[virtual.index].id"
                  ><EditableCell
                    v-if="!column.cell && column.editable"
                    :value="String(rows[virtual.index].row[column.key] ?? '')"
                    :label="column.key + ' for row ' + (virtual.index + 1)"
                    @change="
                      emit(
                        'cellEdit',
                        rows[virtual.index].id,
                        column.key,
                        $event,
                      )
                    " /><RenderContent
                    v-else
                    :node="
                      column.cell
                        ? column.cell(rows[virtual.index].row)
                        : rows[virtual.index].row[column.key]
                    "
                /></slot>
              </td>
              <td aria-hidden="true" />
            </tr>
            <tr
              v-if="paddingBottom > 0"
              aria-hidden="true"
              :style="{ height: paddingBottom + 'px' }"
            >
              <td :colspan="colSpan" />
            </tr>
            <SkeletonRows
              v-if="loading"
              :count="skeletonRows"
              :columns="columns"
              :selectable="selectable"
              :row-height="rowHeight"
          /></template>
        </tbody>
      </table>
    </div>
    <TableHandle
      v-if="activeColumn && activeColumnIndex >= 0"
      :anchor="headers[activeColumn] ?? null"
      orientation="column"
      :label="activeColumn + ' column options'"
      :items="columnItems"
      @enter="activateColumn(activeColumn)"
      @leave="deactivateColumn"
    /><TableHandle
      v-if="activeRow"
      :anchor="rowElements[activeRow.id] ?? null"
      orientation="row"
      :label="'Row ' + (activeRow.index + 1) + ' options'"
      :items="rowItems"
      @enter="activateRow(activeRow.id, activeRow.index)"
      @leave="deactivateRow"
    />
  </div>
</template>
