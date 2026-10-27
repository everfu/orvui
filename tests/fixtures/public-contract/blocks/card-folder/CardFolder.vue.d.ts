import { type Content } from "../shared";
type __VLS_Props = {
    title: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    card?: Content;
    open?: boolean;
    defaultOpen?: boolean;
    detailsVisible?: boolean;
    defaultDetailsVisible?: boolean;
    actionLabel?: string;
    ariaLabel?: string;
    disabled?: boolean;
    cardClassName?: string;
};
declare var __VLS_20: {};
type __VLS_Slots = {} & {
    card?: (props: typeof __VLS_20) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: () => any;
    "update:open": (open: boolean) => any;
    openChange: (open: boolean) => any;
    action: () => any;
    "update:detailsVisible": (visible: boolean) => any;
    detailsVisibleChange: (visible: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClick?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
    onAction?: (() => any) | undefined;
    "onUpdate:detailsVisible"?: ((visible: boolean) => any) | undefined;
    onDetailsVisibleChange?: ((visible: boolean) => any) | undefined;
}>, {
    open: boolean;
    defaultOpen: boolean;
    detailsVisible: boolean;
    defaultDetailsVisible: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
