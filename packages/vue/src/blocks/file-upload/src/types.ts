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
export function createFileUploadItem(file: File, index = 0): FileUploadItem {
  const { name, size, type } = file;
  return {
    id: `${Date.now()}-${index}-${name}`,
    name,
    size,
    type,
    status: "uploading",
    progress: 0,
    file,
  };
}
