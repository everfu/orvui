import type { SwipeAction, SwipeableListItem, SwipeableListValue, SwipeSide } from "./SwipeableList.vue";
import type { SwipeableListClassNames } from "./source-types";
type __VLS_Props = {
    item: SwipeableListItem;
    actionWidth: number;
    revealThreshold: number;
    openValue: SwipeableListValue | null;
    closeOnAction: boolean;
    classNames?: SwipeableListClassNames;
};
declare var __VLS_22: {
    item: SwipeableListItem;
};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_22) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: SwipeableListValue | null) => any;
    action: (payload: {
        item: SwipeableListItem;
        action: SwipeAction;
        side: SwipeSide;
    }) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((value: SwipeableListValue | null) => any) | undefined;
    onAction?: ((payload: {
        item: SwipeableListItem;
        action: SwipeAction;
        side: SwipeSide;
    }) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
