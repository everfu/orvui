import type { AttachmentUploadItem } from "./attachment-types";
type __VLS_Props = {
    item: AttachmentUploadItem;
    playing: boolean;
    uploading: boolean;
    uploadComplete: boolean;
    failed: boolean;
    removing: boolean;
    arrivalIndex: number;
    imageLayoutId?: string;
    retryable: boolean;
    reduce: boolean;
    className?: string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    retry: (item: AttachmentUploadItem) => any;
    remove: (item: AttachmentUploadItem) => any;
    preview: (item: AttachmentUploadItem) => any;
    audioToggle: (item: AttachmentUploadItem) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onRetry?: ((item: AttachmentUploadItem) => any) | undefined;
    onRemove?: ((item: AttachmentUploadItem) => any) | undefined;
    onPreview?: ((item: AttachmentUploadItem) => any) | undefined;
    onAudioToggle?: ((item: AttachmentUploadItem) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
