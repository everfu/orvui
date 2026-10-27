import { type Content } from "../shared";
import type { ExpandableTabsClassNames } from "./source-types";
export interface ExpandableTabsItem {
    id: string;
    label: string;
    icon: Content;
    content: Content;
}
type __VLS_Props = {
    items: ExpandableTabsItem[];
    modelValue?: string | null;
    defaultValue?: string | null;
    classNames?: ExpandableTabsClassNames;
};
declare var __VLS_8: {
    item: ExpandableTabsItem;
}, __VLS_27: {
    item: ExpandableTabsItem;
};
type __VLS_Slots = {} & {
    content?: (props: typeof __VLS_8) => any;
} & {
    content?: (props: typeof __VLS_27) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string | null) => any;
    valueChange: (value: string | null) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | null) => any) | undefined;
    onValueChange?: ((value: string | null) => any) | undefined;
}>, {
    defaultValue: string | null;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
