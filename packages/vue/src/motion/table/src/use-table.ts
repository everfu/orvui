import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useVirtualizer } from "@tanstack/vue-virtual";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUpToLine,
  ArrowDownToLine,
  Trash2,
} from "lucide-vue-next";
import { useMotionState } from "../../state";
import { useReducedMotion } from "../../../lib/composables";
import { useTableColumns, absoluteColumnWidth } from "./useTableColumns";
import type { TableProps, SortState } from "./types";
export function useTable(
  props: TableProps<any> & {
    defaultSelectedRowIds: string[];
    defaultSort: SortState | null;
    minColumnWidth: number;
    rowHeight: number;
    overscan: number;
    selectable: boolean;
  },
  emit: (name: any, ...args: any[]) => void,
) {
  const selected = useMotionState<string[]>(
      props,
      emit,
      "selectedRowIds",
      props.defaultSelectedRowIds,
    ),
    sort = useMotionState<SortState | null>(
      props,
      emit,
      "sort",
      props.defaultSort,
    );
  const headers = ref<Record<string, HTMLElement | null>>({}),
    rowElements = ref<Record<string, HTMLElement | null>>({}),
    viewport = ref<HTMLElement | null>(null),
    reduce = useReducedMotion(),
    rootFontSize = ref(16);
  const controller = useTableColumns(
      () => props.columns,
      headers,
      () => props.minColumnWidth,
      emit,
    ),
    columns = controller.ordered,
    widths = controller.widths;
  onMounted(() => {
    const measured = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    if (measured > 0) rootFontSize.value = measured;
  });
  const rows = computed(() => {
    const entries = props.data.map((row, index) => ({
        row,
        id: props.getRowId?.(row, index) ?? String(index),
      })),
      sorting = sort.value;
    const column = sorting
      ? props.columns.find((column) => column.key === sorting.key)
      : undefined;
    if (!sorting || !column) return entries;
    const read = (row: any) =>
      column.sortValue ? column.sortValue(row) : row[column.key];
    return entries.sort((a, b) => {
      const first = read(a.row),
        second = read(b.row);
      return (
        (sorting.direction === "asc" ? 1 : -1) *
        (typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first).localeCompare(String(second)))
      );
    });
  });
  const selectedSet = computed(() => new Set(selected.value)),
    allSelected = computed(
      () =>
        rows.value.length > 0 &&
        rows.value.every((entry) => selectedSet.value.has(entry.id)),
    ),
    someSelected = computed(() =>
      rows.value.some((entry) => selectedSet.value.has(entry.id)),
    );
  function select(ids: Set<string>) {
    const next = Array.from(ids);
    selected.value = next;
    emit("selectionChange", next);
  }
  function toggleAll() {
    const ids = new Set(selectedSet.value),
      remove = allSelected.value;
    for (const { id } of rows.value)
      if (remove) ids.delete(id);
      else ids.add(id);
    select(ids);
  }
  function toggleRow(id: string) {
    const ids = new Set(selectedSet.value);
    if (ids.has(id)) ids.delete(id);
    else ids.add(id);
    select(ids);
  }
  function toggleSort(key: string) {
    const current = sort.value,
      next =
        current?.key !== key
          ? { key, direction: "asc" as const }
          : current.direction === "asc"
            ? { key, direction: "desc" as const }
            : null;
    sort.value = next;
    emit("sortChange", next);
  }
  const virtualizer = useVirtualizer(
    computed(() => ({
      count: rows.value.length,
      getScrollElement: () => viewport.value,
      estimateSize: () => props.rowHeight,
      overscan: props.overscan,
      getItemKey: (index: number) => rows.value[index]?.id ?? index,
    })),
  );
  // A filtered data set can render before the virtualizer receives its new count.
  const virtualRows = computed(() =>
      virtualizer.value
        .getVirtualItems()
        .filter((item) => item.index < rows.value.length),
    ),
    total = computed(() => virtualizer.value.getTotalSize()),
    paddingTop = computed(() => virtualRows.value[0]?.start ?? 0),
    paddingBottom = computed(() =>
      virtualRows.value.length
        ? total.value - virtualRows.value.at(-1)!.end
        : 0,
    );
  const sized = computed(
    () =>
      columns.value.length > 0 &&
      columns.value.every((column) => widths.value[column.key] != null),
  );
  const minWidth = computed(() =>
    Math.round(
      columns.value.reduce(
        (sum, column) =>
          sum +
          (widths.value[column.key] ??
            absoluteColumnWidth(column.width, rootFontSize.value) ??
            (props.onColumnRename || (!column.cell && column.editable)
              ? Math.max(props.minColumnWidth, 120)
              : props.minColumnWidth)),
        props.selectable ? 48 : 0,
      ),
    ),
  );
  const colSpan = computed(
    () => columns.value.length + (props.selectable ? 1 : 0) + 1,
  );
  let reached = false;
  watch(
    () => props.loading,
    (loading) => {
      if (!loading) reached = false;
    },
  );
  function scroll() {
    const node = viewport.value;
    if (
      node &&
      !props.loading &&
      !reached &&
      node.scrollHeight - node.scrollTop - node.clientHeight <
        props.rowHeight * 4
    ) {
      reached = true;
      emit("endReached");
    }
  }
  const activeColumn = ref<string | null>(null),
    activeRow = ref<{ id: string; index: number } | null>(null);
  let columnTimer: ReturnType<typeof setTimeout> | undefined,
    rowTimer: ReturnType<typeof setTimeout> | undefined;
  function activateColumn(key: string) {
    if (!props.onInsertColumn && !props.onDeleteColumn) return;
    clearTimeout(columnTimer);
    activeColumn.value = key;
  }
  function deactivateColumn() {
    clearTimeout(columnTimer);
    columnTimer = setTimeout(() => {
      activeColumn.value = null;
    }, 100);
  }
  function activateRow(id: string, index: number) {
    if (!props.onInsertRow && !props.onDeleteRow) return;
    clearTimeout(rowTimer);
    activeRow.value = { id, index };
  }
  function deactivateRow() {
    clearTimeout(rowTimer);
    rowTimer = setTimeout(() => {
      activeRow.value = null;
    }, 100);
  }
  onBeforeUnmount(() => {
    clearTimeout(columnTimer);
    clearTimeout(rowTimer);
  });
  const activeColumnIndex = computed(() =>
    columns.value.findIndex((column) => column.key === activeColumn.value),
  );
  const columnItems = computed(() => {
    const index = activeColumnIndex.value,
      column = columns.value[index];
    if (!column) return [];
    return [
      ...(props.onInsertColumn
        ? [
            {
              label: "Insert before",
              icon: ArrowLeftToLine,
              onSelect: () => emit("insertColumn", index, "before"),
            },
            {
              label: "Insert after",
              icon: ArrowRightToLine,
              onSelect: () => emit("insertColumn", index, "after"),
            },
          ]
        : []),
      ...(props.onDeleteColumn
        ? [
            {
              label: "Delete column",
              icon: Trash2,
              destructive: true,
              onSelect: () => emit("deleteColumn", column.key, index),
            },
          ]
        : []),
    ];
  });
  const rowItems = computed(() => {
    const row = activeRow.value;
    if (!row) return [];
    return [
      ...(props.onInsertRow
        ? [
            {
              label: "Insert before",
              icon: ArrowUpToLine,
              onSelect: () => emit("insertRow", row.index, "before"),
            },
            {
              label: "Insert after",
              icon: ArrowDownToLine,
              onSelect: () => emit("insertRow", row.index, "after"),
            },
          ]
        : []),
      ...(props.onDeleteRow
        ? [
            {
              label: "Delete row",
              icon: Trash2,
              destructive: true,
              onSelect: () => emit("deleteRow", row.id, row.index),
            },
          ]
        : []),
    ];
  });
  return {
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
  };
}
