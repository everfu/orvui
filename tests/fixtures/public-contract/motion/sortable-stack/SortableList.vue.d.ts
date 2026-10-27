type __VLS_Props = {
    modelValue?: any[];
    items?: any[];
    defaultItems?: any[];
    getItemLabel?: (item: any) => string;
    label?: string;
    disabled?: boolean;
    showUndo?: boolean;
    itemClassName?: string;
};
declare function move(id: string, d: -1 | 1 | "first" | "last"): void;
declare function undo(): void;
declare var __VLS_1: {
    items: any[];
    moveItem: typeof move;
    undo: typeof undo;
}, __VLS_27: {
    item: any;
    index: number;
};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
} & {
    item?: (props: typeof __VLS_27) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:items": (...args: any[]) => void;
    itemsChange: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:items"?: ((...args: any[]) => any) | undefined;
    onItemsChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    label: string;
    defaultItems: any[];
    showUndo: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
