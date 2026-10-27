import { type WritableComputedRef } from "vue";
export declare function useMotionState<T>(props: Record<string, any>, emit: (...args: any[]) => void, key: string, fallback: T): WritableComputedRef<T>;
export declare function focusList(event: KeyboardEvent, selector?: string): void;
