import { type Content } from "../shared";
import type { ExpandableActionBarClassNames, ExpandableActionBarSize } from "./source-types";
export interface ExpandableActionBarItem {
    id: string;
    label: Content;
    icon: Content;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
    badge?: Content;
    shortcut?: Content;
}
type __VLS_Props = {
    items: ExpandableActionBarItem[];
    expanded?: boolean;
    defaultExpanded?: boolean;
    activeId?: string;
    size?: ExpandableActionBarSize;
    expandOnHover?: boolean;
    expandOnFocus?: boolean;
    collapseDelay?: number;
    classNames?: ExpandableActionBarClassNames;
};
declare var __VLS_37: {
    item: ExpandableActionBarItem;
    expanded: boolean;
    active: boolean;
};
type __VLS_Slots = {} & {
    item?: (props: typeof __VLS_37) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    action: (item: ExpandableActionBarItem) => any;
    "update:expanded": (value: boolean) => any;
    expandedChange: (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onAction?: ((item: ExpandableActionBarItem) => any) | undefined;
    "onUpdate:expanded"?: ((value: boolean) => any) | undefined;
    onExpandedChange?: ((value: boolean) => any) | undefined;
}>, {
    size: ExpandableActionBarSize;
    expanded: boolean;
    defaultExpanded: boolean;
    expandOnHover: boolean;
    expandOnFocus: boolean;
    collapseDelay: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
