import { type Content } from "../shared";
import type { NotificationStackClassNames } from "./source-types";
export interface NotificationStackItem {
    id: string;
    title: Content;
    description?: Content;
    trailing?: Content;
}
type __VLS_Props = {
    items: NotificationStackItem[];
    expanded?: boolean;
    defaultExpanded?: boolean;
    maxVisible?: number;
    collapsedLabel?: string;
    expandedLabel?: string;
    emptyLabel?: string;
    classNames?: NotificationStackClassNames;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:expanded": (expanded: boolean) => any;
    expandedChange: (expanded: boolean) => any;
    viewAll: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:expanded"?: ((expanded: boolean) => any) | undefined;
    onExpandedChange?: ((expanded: boolean) => any) | undefined;
    onViewAll?: (() => any) | undefined;
}>, {
    expanded: boolean;
    defaultExpanded: boolean;
    maxVisible: number;
    collapsedLabel: string;
    expandedLabel: string;
    emptyLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
