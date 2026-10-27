interface RailItem {
    id: string;
    label: string;
    description?: string;
    href?: string;
    ariaLabel?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
    rel?: string;
}
type __VLS_Props = {
    items: RailItem[];
    label?: string;
    orientation?: "vertical" | "horizontal";
    activeId?: string;
    defaultActiveId?: string;
    showPreview?: boolean;
    previewSide?: "before" | "after";
    highlightActive?: boolean;
    itemSize?: number;
    railClassName?: string;
    previewContainerClassName?: string;
    previewClassName?: string;
};
declare var __VLS_40: {
    item: RailItem;
}, __VLS_42: {};
type __VLS_Slots = {} & {
    preview?: (props: typeof __VLS_40) => any;
} & {
    default?: (props: typeof __VLS_42) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:activeId": (id: string) => any;
    activeChange: (id: string) => any;
    itemSelect: (item: RailItem) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:activeId"?: ((id: string) => any) | undefined;
    onActiveChange?: ((id: string) => any) | undefined;
    onItemSelect?: ((item: RailItem) => any) | undefined;
}>, {
    label: string;
    orientation: "horizontal" | "vertical";
    showPreview: boolean;
    previewSide: "before" | "after";
    highlightActive: boolean;
    itemSize: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
