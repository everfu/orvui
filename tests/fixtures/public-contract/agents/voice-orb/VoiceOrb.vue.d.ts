import { type MotionValue } from "motion-v";
type __VLS_Props = {
    activity?: number | MotionValue<number>;
    analyser?: AnalyserNode | null;
    colors?: readonly [
        string,
        string,
        string
    ];
    active?: boolean;
    speed?: number;
    label?: string;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    fallback?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    error: (error: Error) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onError?: ((error: Error) => any) | undefined;
}>, {
    speed: number;
    colors: readonly [
        string,
        string,
        string
    ];
    active: boolean;
    activity: number | MotionValue<number>;
    analyser: AnalyserNode | null;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
