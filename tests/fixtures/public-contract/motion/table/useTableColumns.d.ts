import { type Ref } from "vue";
import type { TableColumn } from "./types";
export declare function absoluteColumnWidth(width: string | undefined, rem: number): number | null;
export declare function useTableColumns(columns: () => TableColumn<any>[], headers: Ref<Record<string, HTMLElement | null>>, min: () => number, emit: (event: "columnResize" | "columnOrderChange", ...args: any[]) => void): {
    ordered: import("vue").ComputedRef<TableColumn<any>[]>;
    widths: Ref<Record<string, number>, Record<string, number>>;
    dragKey: Ref<string | null, string | null>;
    dropIndex: Ref<number | null, number | null>;
    startResize: (key: string, event: PointerEvent) => void;
    moveResize: (event: PointerEvent) => void;
    endResize: () => void;
    startReorder: (key: string, event: PointerEvent) => void;
    moveReorder: (event: PointerEvent) => void;
    endReorder: () => void;
    cancel: () => void;
    keyboardResize: (key: string, direction: -1 | 1) => void;
    keyboardReorder: (key: string, direction: -1 | 1) => void;
};
