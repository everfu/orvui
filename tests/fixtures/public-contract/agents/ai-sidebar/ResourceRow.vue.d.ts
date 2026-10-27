import { type VNodeChild } from "vue";
import { type FlatResource, type SidebarResourceMoveCommands, type SidebarResourceMenuControls, type SidebarResourceDropPosition } from "./tree";
type __VLS_Props = {
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
    renderMenu?: (item: FlatResource["item"], controls: SidebarResourceMenuControls) => VNodeChild;
};
declare var __VLS_18: {
    item: import("./tree").SidebarResource;
}, __VLS_60: {
    item: import("./tree").SidebarResource;
    controls: SidebarResourceMenuControls;
};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_18) => any;
} & {
    menu?: (props: typeof __VLS_60) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {
    focus: () => void | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    focus: () => any;
    menu: (open: boolean) => any;
    select: () => any;
    drop: (e: DragEvent) => any;
    toggle: () => any;
    key: (e: KeyboardEvent) => any;
    renameStart: () => any;
    renameCancel: () => any;
    renameCommit: (label: string) => any;
    dragStart: (e: DragEvent, id: string) => any;
    dragEnd: () => any;
    dragOver: (e: DragEvent, row: FlatResource) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onFocus?: (() => any) | undefined;
    onMenu?: ((open: boolean) => any) | undefined;
    onSelect?: (() => any) | undefined;
    onDrop?: ((e: DragEvent) => any) | undefined;
    onToggle?: (() => any) | undefined;
    onKey?: ((e: KeyboardEvent) => any) | undefined;
    onRenameStart?: (() => any) | undefined;
    onRenameCancel?: (() => any) | undefined;
    onRenameCommit?: ((label: string) => any) | undefined;
    onDragStart?: ((e: DragEvent, id: string) => any) | undefined;
    onDragEnd?: (() => any) | undefined;
    onDragOver?: ((e: DragEvent, row: FlatResource) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
