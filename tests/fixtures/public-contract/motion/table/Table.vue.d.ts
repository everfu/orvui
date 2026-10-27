import type { TableProps, SortState } from "./types";
type __VLS_Props = TableProps<any>;
declare var __VLS_18: {}, __VLS_35: string, __VLS_36: {
    row: any;
    value: any;
    rowId: string;
};
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_35>]?: (props: typeof __VLS_36) => any;
} & {
    empty?: (props: typeof __VLS_18) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    selectionChange: (...args: any[]) => void;
    columnResize: (...args: any[]) => void;
    columnOrderChange: (...args: any[]) => void;
    "update:selectedRowIds": (...args: any[]) => void;
    "update:sort": (...args: any[]) => void;
    sortChange: (...args: any[]) => void;
    cellEdit: (...args: any[]) => void;
    columnRename: (...args: any[]) => void;
    insertRow: (...args: any[]) => void;
    deleteRow: (...args: any[]) => void;
    insertColumn: (...args: any[]) => void;
    deleteColumn: (...args: any[]) => void;
    endReached: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelectionChange?: ((...args: any[]) => any) | undefined;
    onColumnResize?: ((...args: any[]) => any) | undefined;
    onColumnOrderChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:selectedRowIds"?: ((...args: any[]) => any) | undefined;
    "onUpdate:sort"?: ((...args: any[]) => any) | undefined;
    onSortChange?: ((...args: any[]) => any) | undefined;
    onCellEdit?: ((...args: any[]) => any) | undefined;
    onColumnRename?: ((...args: any[]) => any) | undefined;
    onInsertRow?: ((...args: any[]) => any) | undefined;
    onDeleteRow?: ((...args: any[]) => any) | undefined;
    onInsertColumn?: ((...args: any[]) => any) | undefined;
    onDeleteColumn?: ((...args: any[]) => any) | undefined;
    onEndReached?: ((...args: any[]) => any) | undefined;
}>, {
    height: number;
    loading: boolean;
    minColumnWidth: number;
    overscan: number;
    emptyState: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | null;
    selectable: boolean;
    rowHeight: number;
    resizable: boolean;
    reorderable: boolean;
    defaultSelectedRowIds: string[];
    defaultSort: SortState | null;
    skeletonRows: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
