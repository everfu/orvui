import { type MotionValue } from "motion-v";
type __VLS_Props = {
    dragging: boolean;
    color: string;
    glide: MotionValue<number>;
    x: MotionValue<string>;
    y?: MotionValue<string>;
    setThumb?: (node: HTMLElement | null) => void;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
