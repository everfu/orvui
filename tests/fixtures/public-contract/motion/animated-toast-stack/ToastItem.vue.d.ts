import { type VNodeChild } from "vue";
import type { AnimatedToast, ToastClassNames, ToastStatus } from "./useAnimatedToastStack";
type __VLS_Props = {
    toast: AnimatedToast;
    index: number;
    classNames?: ToastClassNames;
    icons?: Partial<Record<ToastStatus, any>>;
    canDismiss: boolean;
    renderToast?: (toast: AnimatedToast) => VNodeChild;
};
declare var __VLS_9: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_9) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    dismiss: (id: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onDismiss?: ((id: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
