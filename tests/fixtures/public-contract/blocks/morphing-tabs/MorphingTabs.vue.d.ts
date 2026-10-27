import type { MorphingTabsClassNames } from "./source-types";
import { type Content } from "../shared";
export interface MorphingTabsItem {
    id: string;
    label: string;
    icon?: Content;
    content: Content;
    disabled?: boolean;
}
type __VLS_Props = {
    items: MorphingTabsItem[];
    modelValue?: string | null;
    defaultValue?: string | null;
    ariaLabel?: string;
    closable?: boolean;
    classNames?: MorphingTabsClassNames;
};
declare var __VLS_37: {
    item: MorphingTabsItem;
};
type __VLS_Slots = {} & {
    content?: (props: typeof __VLS_37) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: (id: string) => any;
    "update:modelValue": (id: string | null) => any;
    valueChange: (id: string | null) => any;
    orderChange: (ids: string[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClose?: ((id: string) => any) | undefined;
    "onUpdate:modelValue"?: ((id: string | null) => any) | undefined;
    onValueChange?: ((id: string | null) => any) | undefined;
    onOrderChange?: ((ids: string[]) => any) | undefined;
}>, {
    ariaLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
