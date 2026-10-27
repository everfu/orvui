import type { FileUploadItem } from "./types";
import type { FileUploadClassNames } from "./source-types";
type __VLS_Props = {
    item: FileUploadItem;
    classNames?: FileUploadClassNames;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    retry: (item: FileUploadItem) => any;
    remove: (item: FileUploadItem) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onRetry?: ((item: FileUploadItem) => any) | undefined;
    onRemove?: ((item: FileUploadItem) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
