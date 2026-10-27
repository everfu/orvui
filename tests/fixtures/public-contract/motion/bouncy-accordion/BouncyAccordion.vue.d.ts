type __VLS_Props = {
    items: {
        id: string;
        title: any;
        description?: any;
        icon?: any;
        disabled?: boolean;
    }[];
    modelValue?: string | null;
    defaultValue?: string | null;
    collapsible?: boolean;
    classNames?: Record<string, string>;
};
declare var __VLS_11: {
    item: {
        id: string;
        title: any;
        description?: any;
        icon?: any;
        disabled?: boolean;
    };
}, __VLS_14: {
    item: {
        id: string;
        title: any;
        description?: any;
        icon?: any;
        disabled?: boolean;
    };
};
type __VLS_Slots = {} & {
    title?: (props: typeof __VLS_11) => any;
} & {
    content?: (props: typeof __VLS_14) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    defaultValue: string | null;
    collapsible: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
