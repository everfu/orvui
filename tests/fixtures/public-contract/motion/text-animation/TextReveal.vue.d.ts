type __VLS_Props = {
    text: string | string[];
    as?: string;
    split?: "word" | "char";
    stagger?: number;
    delay?: number;
    blur?: number;
    yOffset?: string | number;
    spring?: {
        stiffness?: number;
        damping?: number;
        mass?: number;
    };
    once?: boolean;
    whileInView?: boolean;
};
declare var __VLS_22: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_22) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    blur: number;
    once: boolean;
    split: "word" | "char";
    as: string;
    whileInView: boolean;
    delay: number;
    stagger: number;
    yOffset: string | number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
