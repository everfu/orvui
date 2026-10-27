import { type Content } from "../shared";
export interface CommandItem {
    id: string;
    label: string;
    group?: string;
    hint?: string;
    keywords?: string[];
    icon?: Content;
    badge?: Content;
    onSelect?: () => void;
    disabled?: boolean;
}
type __VLS_Props = {
    items: CommandItem[];
    shortcut?: string;
    placeholder?: string;
    emptyMessage?: string;
    open?: boolean;
    defaultOpen?: boolean;
};
declare var __VLS_1: {
    open: () => boolean;
};
type __VLS_Slots = {} & {
    trigger?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    select: (item: CommandItem) => any;
    "update:open": (open: boolean) => any;
    openChange: (open: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((item: CommandItem) => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
}>, {
    open: boolean;
    placeholder: string;
    defaultOpen: boolean;
    shortcut: string;
    emptyMessage: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
