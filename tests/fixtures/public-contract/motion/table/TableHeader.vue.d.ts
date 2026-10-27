import type { TableColumn, SortState } from "./types";
import type { useTableColumns } from "./useTableColumns";
type __VLS_Props = {
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
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    toggleAll: () => any;
    toggleSort: (key: string) => any;
    rename: (key: string, value: string) => any;
    activate: (key: string) => any;
    deactivate: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onToggleAll?: (() => any) | undefined;
    onToggleSort?: ((key: string) => any) | undefined;
    onRename?: ((key: string, value: string) => any) | undefined;
    onActivate?: ((key: string) => any) | undefined;
    onDeactivate?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
