export type TimelineEvent = {
    id: string;
    date: string | Date;
    title: string;
    media?: any;
    meta?: any;
    [key: string]: any;
};
type __VLS_Props = {
    events: TimelineEvent[];
    modelValue?: string;
    defaultValue?: string;
    itemWidth?: number;
    height?: number;
    years?: boolean;
    ruler?: boolean;
    cables?: boolean;
    formatDate?: (date: Date) => string;
    formatYear?: (date: Date) => string;
    ariaLabel?: string;
};
declare var __VLS_6: {
    event: TimelineEvent;
    active: boolean;
}, __VLS_13: {
    event: TimelineEvent;
};
type __VLS_Slots = {} & {
    media?: (props: typeof __VLS_6) => any;
} & {
    meta?: (props: typeof __VLS_13) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}>, {
    height: number;
    ariaLabel: string;
    years: boolean;
    itemWidth: number;
    ruler: boolean;
    cables: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
