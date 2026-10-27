import { type InjectionKey, type Ref } from "vue";
import type { Side, Align } from "./geometry";
export interface PopoverProps {
    open?: boolean;
    defaultOpen?: boolean;
    trigger?: "click" | "hover";
    side?: Side;
    align?: Align;
    sideOffset?: number;
    panelRadius?: number;
    gooStrength?: number;
    className?: string;
}
export declare const GOO_OPEN_SPRING: {
    readonly type: "spring";
    readonly visualDuration: 0.3;
    readonly bounce: 0.15;
};
export declare const GOO_CLOSE_SPRING: {
    readonly type: "spring";
    readonly visualDuration: 0.21;
    readonly bounce: 0.15;
};
export declare function hoverGesture(): {
    enter: (e: PointerEvent) => boolean;
    leave: (e: PointerEvent) => boolean;
};
export declare function createPopover(p: PopoverProps, emit: (event: any, ...args: any[]) => void, kind?: "goo" | "morph"): {
    kind: "morph" | "goo";
    p: PopoverProps;
    root: Ref<HTMLElement | null, HTMLElement | null>;
    trigger: import("vue").ShallowRef<HTMLElement | null, HTMLElement | null>;
    content: import("vue").ShallowRef<HTMLElement | null, HTMLElement | null>;
    anchor: import("vue").ComputedRef<HTMLElement | null>;
    open: import("vue").WritableComputedRef<boolean, boolean>;
    progress: import("motion-v").MotionValue<number>;
    reduce: Ref<boolean, boolean>;
    setOpen: (v: boolean) => void;
    toggle: () => void;
    close: () => void;
    openHover: () => void;
    scheduleClose: () => void;
    cancelClose: () => void;
    armFocusOnOpen: (armed: boolean) => void;
    takeFocusOnOpen: () => boolean;
    gooId: string;
    triggerId: string;
    contentId: string;
};
export declare const popoverKey: InjectionKey<ReturnType<typeof createPopover>>;
export declare function usePopover(): {
    kind: "morph" | "goo";
    p: PopoverProps;
    root: Ref<HTMLElement | null, HTMLElement | null>;
    trigger: import("vue").ShallowRef<HTMLElement | null, HTMLElement | null>;
    content: import("vue").ShallowRef<HTMLElement | null, HTMLElement | null>;
    anchor: import("vue").ComputedRef<HTMLElement | null>;
    open: import("vue").WritableComputedRef<boolean, boolean>;
    progress: import("motion-v").MotionValue<number>;
    reduce: Ref<boolean, boolean>;
    setOpen: (v: boolean) => void;
    toggle: () => void;
    close: () => void;
    openHover: () => void;
    scheduleClose: () => void;
    cancelClose: () => void;
    armFocusOnOpen: (armed: boolean) => void;
    takeFocusOnOpen: () => boolean;
    gooId: string;
    triggerId: string;
    contentId: string;
};
export type PortalLayout = {
    trigger: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    content: {
        width: number;
        height: number;
    };
};
export declare function usePortalPosition(anchor: Ref<HTMLElement | null>, content: Ref<HTMLElement | null>, active: Ref<boolean>): Ref<{
    trigger: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    content: {
        width: number;
        height: number;
    };
} | null, PortalLayout | {
    trigger: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    content: {
        width: number;
        height: number;
    };
} | null>;
