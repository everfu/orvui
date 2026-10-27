export declare function snapSliderValue(next: number, min: number, max: number, step: number): number;
export interface SliderOptions {
    modelValue?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    ariaLabel?: string;
    formatValueText?: (value: number) => string;
}
export declare function useSlider(props: SliderOptions, emit: (...args: any[]) => void): {
    value: import("vue").WritableComputedRef<number, number>;
    current: import("vue").ComputedRef<number>;
    percent: import("vue").ComputedRef<number>;
    dragging: import("vue").Ref<boolean, boolean>;
    min: import("vue").ComputedRef<number>;
    max: import("vue").ComputedRef<number>;
    step: import("vue").ComputedRef<number>;
    commit: (request: number) => void;
    trackRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
    sliderRef: import("vue").Ref<HTMLElement | null, HTMLElement | null>;
    trackProps: {
        onPointerdown: (event: PointerEvent) => void;
        onPointermove: (event: PointerEvent) => void;
        onPointerup: (event: PointerEvent) => void;
        onPointercancel: (event: PointerEvent) => void;
        onLostpointercapture: (event: PointerEvent) => void;
    };
    sliderProps: import("vue").ComputedRef<{
        role: string;
        tabindex: number;
        "aria-label": string | undefined;
        "aria-valuemin": number;
        "aria-valuemax": number;
        "aria-valuenow": number;
        "aria-valuetext": string | undefined;
        "aria-disabled": true | undefined;
        onKeydown: (event: KeyboardEvent) => void;
    }>;
};
