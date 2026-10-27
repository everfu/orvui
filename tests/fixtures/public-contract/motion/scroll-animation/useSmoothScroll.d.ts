import { type Ref, type InjectionKey } from "vue";
import Lenis from "lenis";
import { type MotionValue } from "motion-v";
export type ScrollTarget = number | string | HTMLElement;
export type ScrollToOptions = {
    offset?: number;
    immediate?: boolean;
    duration?: number;
};
export interface SmoothScrollApi {
    readonly lenis: Lenis | null;
    scrollY: MotionValue<number>;
    progress: MotionValue<number>;
    velocity: MotionValue<number>;
    scrollTo: (target: ScrollTarget, options?: ScrollToOptions) => void;
}
export interface SmoothScrollOptions {
    root?: boolean;
    lerp?: number;
    duration?: number;
    orientation?: "vertical" | "horizontal";
    wheelMultiplier?: number;
    touch?: boolean;
    enabled?: boolean;
}
export declare const SmoothScrollKey: InjectionKey<SmoothScrollApi>;
export declare function createScrollApi(props: SmoothScrollOptions, container?: Ref<HTMLElement | null>, content?: Ref<HTMLElement | null>): {
    readonly lenis: Lenis | null;
    scrollY: MotionValue<number>;
    progress: MotionValue<number>;
    velocity: MotionValue<number>;
    scrollTo: (target: ScrollTarget, options?: ScrollToOptions) => void;
};
export declare function useSmoothScroll(): SmoothScrollApi;
