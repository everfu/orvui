type __VLS_Props = {
    open?: boolean;
    defaultOpen?: boolean;
    openMobile?: boolean;
    defaultOpenMobile?: boolean;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
    sidebarWidth?: string;
    collapseSidebarBelow?: number;
    shortcut?: boolean;
};
declare var __VLS_16: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_16) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (open: boolean) => any;
    openChange: (open: boolean) => any;
    "update:openMobile": (open: boolean) => any;
    openMobileChange: (open: boolean) => any;
    "update:mobileOpen": (open: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
    "onUpdate:openMobile"?: ((open: boolean) => any) | undefined;
    onOpenMobileChange?: ((open: boolean) => any) | undefined;
    "onUpdate:mobileOpen"?: ((open: boolean) => any) | undefined;
}>, {
    open: boolean;
    defaultOpen: boolean;
    openMobile: boolean;
    defaultOpenMobile: boolean;
    mobileOpen: boolean;
    defaultMobileOpen: boolean;
    shortcut: boolean;
    sidebarWidth: string;
    collapseSidebarBelow: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
