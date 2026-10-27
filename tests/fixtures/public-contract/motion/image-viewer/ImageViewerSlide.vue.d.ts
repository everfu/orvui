import { type MotionValue } from "motion-v";
import type { LightboxImage } from "./types";
type __VLS_Props = {
    image: LightboxImage;
    zoom: boolean;
    present: boolean;
    direction: number;
    x: MotionValue<number>;
    y: MotionValue<number>;
    pan: {
        x: number;
        y: number;
    };
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    failed: () => any;
    swipe: (direction: 1 | -1) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onFailed?: (() => any) | undefined;
    onSwipe?: ((direction: 1 | -1) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
