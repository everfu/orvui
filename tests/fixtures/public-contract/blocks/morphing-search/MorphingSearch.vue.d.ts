import { type Content } from "../shared";
export interface MorphingSearchItem {
    id: string;
    title: string;
    description?: string;
    keywords?: string[];
    icon?: Content;
    onSelect?: () => void;
}
type __VLS_Props = {
    items: MorphingSearchItem[];
    placeholder?: string;
    shortcut?: string;
    iconOnly?: boolean;
    emptyMessage?: string;
    open?: boolean;
    defaultOpen?: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    select: (item: MorphingSearchItem) => any;
    "update:open": (open: boolean) => any;
    openChange: (open: boolean) => any;
    queryChange: (query: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((item: MorphingSearchItem) => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
    onQueryChange?: ((query: string) => any) | undefined;
}>, {
    open: boolean;
    placeholder: string;
    defaultOpen: boolean;
    shortcut: string;
    emptyMessage: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
