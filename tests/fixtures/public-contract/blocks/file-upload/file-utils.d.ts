import type { FileUploadItem, FileUploadStatus } from "./types";
export declare function formatBytes(bytes: number): string;
export declare function clampProgress(value: number | undefined, status: FileUploadStatus): number;
export declare function fileKind(item: FileUploadItem): string;
export declare function getFileIcon(item: FileUploadItem): import("vue").FunctionalComponent<import("lucide-vue-next").LucideProps, {}, any, {}>;
export declare const STATUS_LABEL: {
    queued: string;
    uploading: string;
    success: string;
    error: string;
};
export declare const STATUS_TONE: {
    queued: string;
    uploading: string;
    success: string;
    error: string;
};
