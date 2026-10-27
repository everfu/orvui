import { type ComputedRef, type InjectionKey, type Ref } from "vue";
export declare const formatNumber: (value: number) => string;
export declare const formatCompact: (value: number) => string;
export declare function context<T>(name: string): {
    key: InjectionKey<T>;
    use: () => T;
};
export declare function selection<T>(get: () => T | undefined, initial: T, change: (value: T) => void): import("vue").WritableComputedRef<T, T>;
export declare function activeSelection(get: () => string | null | undefined, initial: string | null, ids: ComputedRef<string[]>, change: (id: string | null) => void): import("vue").WritableComputedRef<string | null, string | null>;
export declare function usePlotSize(element: Ref<HTMLElement | null>, initial: {
    width: number;
    height: number;
}): Ref<{
    width: number;
    height: number;
}, {
    width: number;
    height: number;
} | {
    width: number;
    height: number;
}>;
export declare function moveFocus(event: KeyboardEvent, index: number, count: number, columns?: number): void;
export declare function unwrapModel<T extends object>(model: ComputedRef<T>): T;
