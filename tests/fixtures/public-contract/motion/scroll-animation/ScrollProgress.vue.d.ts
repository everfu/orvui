import { type MotionValue } from "motion-v";
type __VLS_Props = {
    variant?: "bar" | "circle";
    progress?: MotionValue<number>;
    spring?: boolean;
    position?: "top" | "bottom";
    height?: number;
    fixed?: boolean;
    size?: number;
    thickness?: number;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    spring: boolean;
    position: "top" | "bottom";
    fixed: boolean;
    size: number;
    height: number;
    variant: "circle" | "bar";
    thickness: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
