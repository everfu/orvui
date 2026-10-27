import type { OverflowActionItem } from "./OverflowActions.vue";
import type { OverflowActionsClassNames } from "./source-types";
type __VLS_Props = {
    item: OverflowActionItem;
    size: "sm" | "md";
    reduce: boolean;
    canHover: boolean;
    overflow?: boolean;
    visible?: boolean;
    classNames?: OverflowActionsClassNames;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    action: (item: OverflowActionItem) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onAction?: ((item: OverflowActionItem) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
