type __VLS_Props = {
    itemSize?: number;
    visibleItems?: number;
    variant?: "concave" | "convex";
    minScale?: number;
    dragSpeed?: number;
    arc?: number;
    snap?: boolean;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    defaultIndex?: number;
    height?: number;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    indexChange: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onIndexChange?: ((...args: any[]) => any) | undefined;
}>, {
    variant: "concave" | "convex";
    itemSize: number;
    snap: boolean;
    visibleItems: number;
    minScale: number;
    dragSpeed: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    defaultIndex: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
