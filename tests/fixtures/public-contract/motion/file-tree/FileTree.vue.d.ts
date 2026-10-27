export interface FileTreeClassNames {
    tree?: string;
    item?: string;
    icon?: string;
    label?: string;
}
type __VLS_Props = {
    modelValue?: string | null;
    defaultValue?: string | null;
    expandedIds?: string[];
    defaultExpandedIds?: string[];
    ariaLabel?: string;
    indent?: number;
    classNames?: FileTreeClassNames;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
    expandedChange: (...args: any[]) => void;
    "update:expandedIds": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onExpandedChange?: ((...args: any[]) => any) | undefined;
    "onUpdate:expandedIds"?: ((...args: any[]) => any) | undefined;
}>, {
    defaultExpandedIds: string[];
    ariaLabel: string;
    defaultValue: string | null;
    indent: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
