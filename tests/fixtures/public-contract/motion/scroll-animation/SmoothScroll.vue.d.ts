import { type MotionValue } from "motion-v";
import { type SmoothScrollOptions } from "./useSmoothScroll";
declare var __VLS_1: {}, __VLS_3: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
} & {
    default?: (props: typeof __VLS_3) => any;
};
declare const __VLS_base: import("vue").DefineComponent<SmoothScrollOptions, {
    readonly lenis: import("lenis").default | null;
    scrollY: MotionValue<number>;
    progress: MotionValue<number>;
    velocity: MotionValue<number>;
    scrollTo: (target: import("./useSmoothScroll").ScrollTarget, options?: import("./useSmoothScroll").ScrollToOptions) => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<SmoothScrollOptions> & Readonly<{}>, {
    orientation: "horizontal" | "vertical";
    duration: number;
    root: boolean;
    touch: boolean;
    enabled: boolean;
    lerp: number;
    wheelMultiplier: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
