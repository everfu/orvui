import { type Ref } from "vue";
type __VLS_Props = {
    variant?: "default" | "info" | "success" | "warning" | "destructive";
    open?: boolean;
    defaultOpen?: boolean;
    contentClassName?: string;
    role?: "alert" | "status";
    returnFocusRef?: HTMLElement | Ref<HTMLElement | null>;
};
declare function dismiss(): void;
declare var __VLS_19: {
    dismiss: typeof dismiss;
};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_19) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:open"?: ((...args: any[]) => any) | undefined;
}>, {
    open: boolean;
    variant: "default" | "success" | "warning" | "info" | "destructive";
    defaultOpen: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
