import type { AttachmentUploadItem, AttachmentRejectReason } from "./attachment-types";
import type { AttachmentUploadClassNames } from "./source-types";
type __VLS_Props = {
    modelValue?: AttachmentUploadItem[];
    value?: AttachmentUploadItem[];
    defaultValue?: AttachmentUploadItem[];
    playingId?: string;
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxFileSize?: number;
    disabled?: boolean;
    title?: string;
    description?: string;
    attachmentsLabel?: string;
    className?: string;
    classNames?: AttachmentUploadClassNames;
    onRetry?: (item: AttachmentUploadItem) => void;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (items: AttachmentUploadItem[]) => any;
    valueChange: (items: AttachmentUploadItem[]) => any;
    retry: (item: AttachmentUploadItem) => any;
    remove: (item: AttachmentUploadItem) => any;
    audioToggle: (item: AttachmentUploadItem) => any;
    filesAdded: (items: AttachmentUploadItem[], files: File[]) => any;
    filesRejected: (files: File[], reason: AttachmentRejectReason) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((items: AttachmentUploadItem[]) => any) | undefined;
    onValueChange?: ((items: AttachmentUploadItem[]) => any) | undefined;
    onRetry?: ((item: AttachmentUploadItem) => any) | undefined;
    onRemove?: ((item: AttachmentUploadItem) => any) | undefined;
    onAudioToggle?: ((item: AttachmentUploadItem) => any) | undefined;
    onFilesAdded?: ((items: AttachmentUploadItem[], files: File[]) => any) | undefined;
    onFilesRejected?: ((files: File[], reason: AttachmentRejectReason) => any) | undefined;
}>, {
    title: string;
    disabled: boolean;
    multiple: boolean;
    defaultValue: AttachmentUploadItem[];
    maxFiles: number;
    maxFileSize: number;
    attachmentsLabel: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
