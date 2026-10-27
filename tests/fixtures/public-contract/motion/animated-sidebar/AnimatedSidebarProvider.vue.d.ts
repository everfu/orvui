type __VLS_Props = {
    open?: boolean;
    defaultOpen?: boolean;
    openMobile?: boolean;
    defaultOpenMobile?: boolean;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
    shortcut?: boolean;
    expandedWidth?: number;
    collapsedWidth?: number;
};
declare function toggle(): void;
declare var __VLS_1: {
    open: boolean;
    toggle: typeof toggle;
};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (...args: any[]) => void;
    openChange: (...args: any[]) => void;
    "update:openMobile": (...args: any[]) => void;
    openMobileChange: (...args: any[]) => void;
    "update:mobileOpen": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:open"?: ((...args: any[]) => any) | undefined;
    onOpenChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:openMobile"?: ((...args: any[]) => any) | undefined;
    onOpenMobileChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:mobileOpen"?: ((...args: any[]) => any) | undefined;
}>, {
    open: boolean;
    defaultOpen: boolean;
    openMobile: boolean;
    defaultOpenMobile: boolean;
    mobileOpen: boolean;
    defaultMobileOpen: boolean;
    shortcut: boolean;
    expandedWidth: number;
    collapsedWidth: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
