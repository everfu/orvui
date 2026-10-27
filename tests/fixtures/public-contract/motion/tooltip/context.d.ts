import { type ComputedRef, type InjectionKey, type Ref } from "vue";
export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";
export type TooltipPoint = {
    x: number;
    y: number;
};
export type TooltipAnchor = HTMLElement | SVGElement;
export interface TooltipTiming {
    delay: number;
    closeDelay: number;
    skipDelay: number;
}
export declare const timingKey: InjectionKey<ComputedRef<TooltipTiming>>;
export interface TooltipRootProps {
    open?: boolean;
    defaultOpen?: boolean;
    delay?: number;
    closeDelay?: number;
    disabled?: boolean;
    asLabel?: boolean;
    followCursor?: boolean;
    anchorRef?: TooltipAnchor | null | Ref<TooltipAnchor | null>;
    id?: string;
}
export interface TooltipContentProps {
    side?: TooltipSide;
    align?: TooltipAlign;
    sideOffset?: number;
    arrow?: boolean;
    anchorPoint?: TooltipPoint;
}
export interface TooltipContext {
    open: ComputedRef<boolean>;
    id: string;
    labelId: string;
    props: Readonly<TooltipRootProps>;
    anchor: Ref<TooltipAnchor | null>;
    floating: Ref<HTMLElement | null>;
    cursor: Ref<TooltipPoint | null>;
    empty: Ref<boolean>;
    setTrigger: (value: unknown) => void;
    setEmpty: (value: boolean) => void;
    close: () => void;
    enterContent: () => void;
    leaveContent: (event: PointerEvent) => void;
}
export declare const tooltipKey: InjectionKey<TooltipContext>;
export declare function useTooltip(): TooltipContext;
export declare function createTooltip(props: Readonly<TooltipRootProps>, emit: (...args: any[]) => void, id: string, initialEmpty?: boolean): TooltipContext;
