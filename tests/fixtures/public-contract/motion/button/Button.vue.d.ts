export interface ButtonProps {
    variant?: "primary" | "secondary" | "ghost" | "outline";
    size?: "sm" | "md" | "lg" | "icon";
    pressScale?: number;
    ripple?: boolean;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}
declare var __VLS_17: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_17) => any;
};
declare const __VLS_base: import("vue").DefineComponent<ButtonProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ButtonProps> & Readonly<{}>, {
    size: "icon" | "sm" | "md" | "lg";
    type: "button" | "reset" | "submit";
    variant: "outline" | "primary" | "secondary" | "ghost";
    pressScale: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
