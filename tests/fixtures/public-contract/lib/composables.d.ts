import { type Ref } from "vue";
export declare function useControllable<T>(props: Record<string, any>, key: string, emit: (...args: any[]) => void, fallback: T): import("vue").WritableComputedRef<T, T>;
export declare function useMediaQuery(query: string): Ref<boolean, boolean>;
export declare function useReducedMotion(): Ref<boolean, boolean>;
export declare function useScrollLock(locked: Ref<boolean>): void;
export declare function resolveElement<T extends Element = HTMLElement>(value: unknown): T | null;
export declare function useOverlay(open: Ref<boolean>, panel: Ref<HTMLElement | null>, close: () => void, initialFocus?: () => HTMLElement | undefined): {
    isTop: () => boolean;
    containsHigher: (target: EventTarget | null) => boolean;
    containsOwnedPortal: (target: HTMLElement) => boolean;
};
export declare function useFloatingLayer(open: Ref<boolean>, panel?: {
    readonly value: unknown;
}): {
    isTop: () => boolean;
    claimEscape(event: KeyboardEvent): boolean;
    containsHigher: (target: EventTarget | null) => boolean;
};
export declare function useEventListener(target: () => EventTarget | null | undefined, event: string, handler: EventListener, options?: AddEventListenerOptions): void;
