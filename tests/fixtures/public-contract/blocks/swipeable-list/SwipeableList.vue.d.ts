import type { SwipeableListClassNames } from "./source-types";
import { type Content } from "../shared";
export type SwipeSide = "left" | "right";
export interface SwipeableListValue {
    id: string;
    side: SwipeSide;
}
export type SwipeActionTone = "neutral" | "primary" | "success" | "warning" | "danger";
export interface SwipeAction {
    id: string;
    label: Content;
    icon: Content;
    tone?: SwipeActionTone;
    disabled?: boolean;
    onClick?: (item: SwipeableListItem) => void;
}
export interface SwipeableListItem {
    id: string;
    title?: Content;
    description?: Content;
    meta?: Content;
    leading?: Content;
    content?: Content;
    leftActions?: SwipeAction[];
    rightActions?: SwipeAction[];
    disabled?: boolean;
}
type __VLS_Props = {
    items: SwipeableListItem[];
    modelValue?: SwipeableListValue | null;
    defaultValue?: SwipeableListValue | null;
    actionWidth?: number;
    revealThreshold?: number;
    closeOnAction?: boolean;
    classNames?: SwipeableListClassNames;
};
declare var __VLS_12: {
    item: SwipeableListItem;
};
type __VLS_Slots = {} & {
    item?: (props: typeof __VLS_12) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    action: (payload: {
        item: SwipeableListItem;
        action: SwipeAction;
        side: SwipeSide;
    }) => any;
    "update:modelValue": (value: SwipeableListValue | null) => any;
    valueChange: (value: SwipeableListValue | null) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onAction?: ((payload: {
        item: SwipeableListItem;
        action: SwipeAction;
        side: SwipeSide;
    }) => any) | undefined;
    "onUpdate:modelValue"?: ((value: SwipeableListValue | null) => any) | undefined;
    onValueChange?: ((value: SwipeableListValue | null) => any) | undefined;
}>, {
    defaultValue: SwipeableListValue | null;
    actionWidth: number;
    revealThreshold: number;
    closeOnAction: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
