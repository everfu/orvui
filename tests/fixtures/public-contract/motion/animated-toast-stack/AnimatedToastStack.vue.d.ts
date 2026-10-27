import { type VNodeChild } from "vue";
import type { AnimatedToast, ToastClassNames, ToastPosition, ToastStatus } from "./useAnimatedToastStack";
type __VLS_Props = {
    toasts: AnimatedToast[];
    position?: ToastPosition;
    placement?: "static" | "fixed" | "absolute";
    fixed?: boolean;
    portal?: boolean;
    portalRoot?: Element | null;
    maxVisible?: number;
    className?: string;
    classNames?: ToastClassNames;
    icons?: Partial<Record<ToastStatus, any>>;
    renderToast?: (toast: AnimatedToast) => VNodeChild;
};
declare var __VLS_23: {
    toast: AnimatedToast;
};
type __VLS_Slots = {} & {
    toast?: (props: typeof __VLS_23) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    dismiss: (id: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onDismiss?: ((id: string) => any) | undefined;
}>, {
    position: ToastPosition;
    maxVisible: number;
    portal: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
