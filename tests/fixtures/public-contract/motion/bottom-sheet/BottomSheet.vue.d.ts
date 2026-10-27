type __VLS_Props = {
    open: boolean;
    snapPoints?: (number | "auto")[];
    defaultSnap?: number;
    title?: string;
    description?: string;
    dismissThreshold?: number;
};
declare function onDragEnd(_event: unknown, info: {
    velocity: {
        y: number;
    };
    offset: {
        y: number;
    };
}): void;
declare var __VLS_28: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_28) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {
    snap: import("vue").Ref<number, number>;
    onDragEnd: typeof onDragEnd;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (open: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
}>, {
    snapPoints: (number | "auto")[];
    defaultSnap: number;
    dismissThreshold: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
