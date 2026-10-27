import { type Ref } from "vue";
import type { Hsva, Rgba } from "./color";
export declare const CHECKERBOARD = "repeating-conic-gradient(#d4d4d8 0% 25%, #fafafa 0% 50%) 0 0 / 8px 8px";
export declare const COLOR_MORPH: {
    readonly type: "spring";
    readonly duration: 0.5;
    readonly bounce: 0.2;
};
export interface ColorContext {
    id: string;
    hsva: Ref<Hsva>;
    rgba: Ref<Rgba>;
    hex: Ref<string>;
    open: Ref<boolean>;
    anchor: Ref<HTMLElement | null>;
    alpha: Ref<boolean>;
    disabled: Ref<boolean>;
    update: (next: Partial<Hsva>) => void;
    setColor: (value: string) => void;
    commit: () => void;
}
export declare function usePicker(): ColorContext;
export declare function useGlide(target: Ref<number>): {
    spring: import("motion-v").MotionValue<number>;
    offset: import("motion-v").MotionValue<string>;
};
export declare function useColorDrag(onPoint: (x: number, y: number) => void, onEnd: () => void, disabled: Ref<boolean>): {
    rail: Ref<unknown, unknown>;
    thumb: Ref<HTMLElement | null, HTMLElement | null>;
    dragging: Ref<boolean, boolean>;
    down: (event: PointerEvent) => void;
    move: (event: PointerEvent) => void;
    end: (event: PointerEvent) => void;
};
export declare function keyStep(event: KeyboardEvent, big?: number): {
    axis: "x" | "y";
    delta: number;
} | "min" | "max" | null;
