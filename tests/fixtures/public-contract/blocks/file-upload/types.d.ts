export type FileUploadStatus = "queued" | "uploading" | "success" | "error";
export type FileUploadVariant = "default" | "centered";
export interface FileUploadItem {
    id: string;
    name: string;
    size: number;
    type?: string;
    progress?: number;
    status?: FileUploadStatus;
    error?: string;
    file?: File;
}
export declare function createFileUploadItem(file: File, index?: number): FileUploadItem;
