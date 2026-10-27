import { type FileUploadItem, type FileUploadVariant } from "./types";
import type { FileUploadClassNames } from "./source-types";
type __VLS_Props = {
    modelValue?: FileUploadItem[];
    value?: FileUploadItem[];
    defaultValue?: FileUploadItem[];
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    disabled?: boolean;
    variant?: FileUploadVariant;
    title?: string;
    description?: string;
    browseLabel?: string;
    className?: string;
    classNames?: FileUploadClassNames;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (items: FileUploadItem[]) => any;
    reject: (files: File[]) => any;
    valueChange: (items: FileUploadItem[]) => any;
    retry: (item: FileUploadItem) => any;
    remove: (item: FileUploadItem) => any;
    filesAdded: (items: FileUploadItem[], files: File[]) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((items: FileUploadItem[]) => any) | undefined;
    onReject?: ((files: File[]) => any) | undefined;
    onValueChange?: ((items: FileUploadItem[]) => any) | undefined;
    onRetry?: ((item: FileUploadItem) => any) | undefined;
    onRemove?: ((item: FileUploadItem) => any) | undefined;
    onFilesAdded?: ((items: FileUploadItem[], files: File[]) => any) | undefined;
}>, {
    title: string;
    variant: FileUploadVariant;
    disabled: boolean;
    multiple: boolean;
    defaultValue: FileUploadItem[];
    description: string;
    browseLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
