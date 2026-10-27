import { type ComputedRef } from "vue";
import { type MotionValue } from "motion-v";
export type BumpPosition = {
    x: MotionValue<number>;
    y: MotionValue<number>;
};
export type BumpTarget = {
    key: string;
    x: number;
    y: number;
};
export declare const pointKey: (series: string, period: string) => string;
export declare function useBumpGeometry(targets: ComputedRef<BumpTarget[]>, reduce: () => boolean): ComputedRef<Map<string, BumpPosition>>;
