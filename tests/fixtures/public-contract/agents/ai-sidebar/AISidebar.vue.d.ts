import { type VNodeChild } from "vue";
import { type SidebarResource, type SidebarResourceMove, type SidebarResourceMenuControls } from "./tree";
type __VLS_Props = {
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
    renderMenu?: (item: SidebarResource, controls: SidebarResourceMenuControls) => VNodeChild;
};
declare var __VLS_28: {
    item: SidebarResource;
}, __VLS_36: {
    item: SidebarResource;
    controls: SidebarResourceMenuControls;
};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_28) => any;
} & {
    menu?: (props: typeof __VLS_36) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:items": (items: SidebarResource[]) => any;
    itemsChange: (items: SidebarResource[]) => any;
    "update:activeId": (id: string | null) => any;
    activeChange: (id: string) => any;
    moveError: (error: unknown, move: SidebarResourceMove) => any;
    renameError: (error: unknown, item: SidebarResource) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:items"?: ((items: SidebarResource[]) => any) | undefined;
    onItemsChange?: ((items: SidebarResource[]) => any) | undefined;
    "onUpdate:activeId"?: ((id: string | null) => any) | undefined;
    onActiveChange?: ((id: string) => any) | undefined;
    onMoveError?: ((error: unknown, move: SidebarResourceMove) => any) | undefined;
    onRenameError?: ((error: unknown, item: SidebarResource) => any) | undefined;
}>, {
    defaultItems: SidebarResource[];
    defaultActiveId: string | null;
    defaultExpandedIds: string[];
    ariaLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
