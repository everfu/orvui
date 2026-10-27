import { type Content } from "../shared";
type __VLS_Props = {
    chips?: string[];
    defaultChips?: string[];
    query?: string;
    defaultQuery?: string;
    recents?: string[];
    defaultRecents?: string[];
    storageKey?: string;
    maxRecents?: number;
    suggestions?: string[];
    filter?: ((term: string, query: string) => boolean) | false;
    maxSuggestions?: number;
    loading?: boolean;
    maxChips?: number;
    normalize?: (term: string) => string | null;
    emptyState?: Content;
    side?: "top" | "bottom" | "auto";
    open?: boolean;
    defaultOpen?: boolean;
    disabled?: boolean;
    name?: string;
    placeholder?: string;
    label?: string;
    actions?: Content;
};
declare var __VLS_60: {}, __VLS_113: {};
type __VLS_Slots = {} & {
    empty?: (props: typeof __VLS_60) => any;
} & {
    actions?: (props: typeof __VLS_113) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (open: boolean) => any;
    openChange: (open: boolean) => any;
    queryChange: (query: string) => any;
    "update:chips": (chips: string[]) => any;
    chipsChange: (chips: string[]) => any;
    "update:query": (query: string) => any;
    "update:recents": (recents: string[]) => any;
    recentsChange: (recents: string[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
    onQueryChange?: ((query: string) => any) | undefined;
    "onUpdate:chips"?: ((chips: string[]) => any) | undefined;
    onChipsChange?: ((chips: string[]) => any) | undefined;
    "onUpdate:query"?: ((query: string) => any) | undefined;
    "onUpdate:recents"?: ((recents: string[]) => any) | undefined;
    onRecentsChange?: ((recents: string[]) => any) | undefined;
}>, {
    filter: false | ((term: string, query: string) => boolean);
    label: string;
    open: boolean;
    placeholder: string;
    side: "top" | "auto" | "bottom";
    defaultOpen: boolean;
    actions: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | import("vue").ComponentOptions<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, import("vue").ComponentProvideOptions> | import("vue").FunctionalComponent<any, {}, any, {}> | {
        new (...args: any[]): any;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } | null;
    emptyState: string | number | boolean | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | import("vue").VNodeArrayChildren | import("vue").ComponentOptions<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, any, any, any, string, {}, {}, string, {}, {}, {}, string, import("vue").ComponentProvideOptions> | import("vue").FunctionalComponent<any, {}, any, {}> | {
        new (...args: any[]): any;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } | null;
    defaultChips: string[];
    defaultQuery: string;
    defaultRecents: string[];
    maxRecents: number;
    suggestions: string[];
    maxSuggestions: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
