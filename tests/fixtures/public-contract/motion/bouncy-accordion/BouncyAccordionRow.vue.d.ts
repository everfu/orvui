type __VLS_Props = {
    item: {
        id: string;
        title: any;
        description?: any;
        icon?: any;
        disabled?: boolean;
    };
    open: boolean;
    startsGroup: boolean;
    endsGroup: boolean;
    separatedFromPrevious: boolean;
    contentId: string;
    triggerId: string;
    reduce: boolean;
    layoutTransition: any;
    layoutDependency: string | null;
    classNames?: Record<string, string>;
};
declare var __VLS_26: {
    item: {
        id: string;
        title: any;
        description?: any;
        icon?: any;
        disabled?: boolean;
    };
}, __VLS_50: {
    item: {
        id: string;
        title: any;
        description?: any;
        icon?: any;
        disabled?: boolean;
    };
};
type __VLS_Slots = {} & {
    title?: (props: typeof __VLS_26) => any;
} & {
    content?: (props: typeof __VLS_50) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    toggle: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onToggle?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
