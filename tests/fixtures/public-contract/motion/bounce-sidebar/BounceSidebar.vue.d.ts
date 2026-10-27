export interface BounceSidebarItem {
    id: string;
    label: string;
    href?: string;
    icon?: any;
    disabled?: boolean;
    target?: string;
    rel?: string;
}
type __VLS_Props = {
    items: BounceSidebarItem[];
    modelValue?: string;
    defaultValue?: string;
    ariaLabel?: string;
    listClassName?: string;
    itemClassName?: string;
    indicatorClassName?: string;
};
declare var __VLS_15: {
    item: BounceSidebarItem;
    active: boolean;
};
type __VLS_Slots = {} & {
    item?: (props: typeof __VLS_15) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
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
