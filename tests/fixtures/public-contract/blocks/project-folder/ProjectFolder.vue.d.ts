import { type Content } from "../shared";
export interface ProjectFolderPreview {
    id: string;
    content: Content;
}
type __VLS_Props = {
    title: string;
    description?: string;
    previews?: ProjectFolderPreview[];
    count?: number;
    itemLabel?: string;
    open?: boolean;
    defaultOpen?: boolean;
    expanded?: boolean;
    defaultExpanded?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
};
declare var __VLS_33: {
    preview: ProjectFolderPreview;
}, __VLS_89: {
    preview: ProjectFolderPreview;
};
type __VLS_Slots = {} & {
    preview?: (props: typeof __VLS_33) => any;
} & {
    preview?: (props: typeof __VLS_89) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: () => any;
    "update:open": (open: boolean) => any;
    openChange: (open: boolean) => any;
    "update:expanded": (expanded: boolean) => any;
    expandedChange: (expanded: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClick?: (() => any) | undefined;
    "onUpdate:open"?: ((open: boolean) => any) | undefined;
    onOpenChange?: ((open: boolean) => any) | undefined;
    "onUpdate:expanded"?: ((expanded: boolean) => any) | undefined;
    onExpandedChange?: ((expanded: boolean) => any) | undefined;
}>, {
    open: boolean;
    expanded: boolean;
    defaultOpen: boolean;
    description: string;
    defaultExpanded: boolean;
    previews: ProjectFolderPreview[];
    itemLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
