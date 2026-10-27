import { type Content } from "../shared";
import type { OverflowActionsClassNames } from "./source-types";
export interface OverflowActionItem {
    id: string;
    label: Content;
    icon?: Content;
    onClick?: () => void;
    disabled?: boolean;
    ariaLabel?: string;
}
type __VLS_Props = {
    primaryActions: OverflowActionItem[];
    overflowActions: OverflowActionItem[];
    expanded?: boolean;
    defaultExpanded?: boolean;
    collapseOnAction?: boolean;
    size?: "sm" | "md";
    openLabel?: string;
    closeLabel?: string;
    classNames?: OverflowActionsClassNames;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    action: (item: OverflowActionItem) => any;
    "update:expanded": (value: boolean) => any;
    expandedChange: (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onAction?: ((item: OverflowActionItem) => any) | undefined;
    "onUpdate:expanded"?: ((value: boolean) => any) | undefined;
    onExpandedChange?: ((value: boolean) => any) | undefined;
}>, {
    size: "sm" | "md";
    expanded: boolean;
    defaultExpanded: boolean;
    collapseOnAction: boolean;
    openLabel: string;
    closeLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
