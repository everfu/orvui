import { type Content } from "../shared";
declare const __VLS_export: <T>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<{
        items: readonly T[];
        getItemKey: (item: T, index: number) => string | number | bigint;
        hasMore: boolean;
        onLoadMore?: () => void | Promise<void>;
        loading?: boolean;
        error?: Content;
        estimateSize?: (item: T, index: number) => number;
        minColumnWidth?: number;
        maxColumns?: number;
        gap?: number;
        overscan?: number;
        prefetch?: number;
        animateItems?: boolean;
        ariaLabel?: string;
        contentClassName?: string;
        itemClassName?: string;
        emptyState?: Content;
        endState?: Content;
    } & {
        onRetry?: (() => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: {
        empty?: (props: {}) => any;
    } & {
        loading?: (props: {
            index: number;
        }) => any;
    } & {
        default?: (props: {
            item: NonNullable<T>;
            index: number;
        }) => any;
    } & {
        end?: (props: {}) => any;
    };
    emit: (evt: "retry") => void;
}>) => import("vue").VNode & {
    __ctx?: NonNullable<Awaited<typeof __VLS_setup>>;
};
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
