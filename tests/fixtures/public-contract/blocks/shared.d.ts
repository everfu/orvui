import { type Component, type Ref, type VNodeChild } from "vue";
export type Content = VNodeChild | Component;
export declare const RenderNode: import("vue").DefineComponent<{
    node?: any;
}, () => any, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{
    node?: any;
}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare function useControllable<T>(get: () => T | undefined, initial: T, emit: (value: T) => void): import("vue").WritableComputedRef<T, T>;
export declare function useOutside(root: Ref<HTMLElement | undefined>, close: () => void, open: Ref<boolean>): void;
export declare function useReduced(): Ref<boolean, boolean>;
export declare function rove(event: KeyboardEvent, root: HTMLElement, selector?: string): void;
export declare function useDialog(open: Ref<boolean>, root: Ref<HTMLElement | undefined>, initial?: () => HTMLElement | undefined): void;
