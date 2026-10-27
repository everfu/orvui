import {
  FileArchive,
  FileAudio,
  FileCode2,
  FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
} from "lucide-vue-next";
import type { FileUploadItem, FileUploadStatus } from "./types";
export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"],
    index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    ),
    value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}
export function clampProgress(
  value: number | undefined,
  status: FileUploadStatus,
) {
  if (status === "success") return 100;
  return value === undefined || Number.isNaN(value)
    ? 0
    : Math.max(0, Math.min(100, value));
}
export function fileKind(item: FileUploadItem) {
  const value = item.name.includes(".")
    ? item.name.split(".").at(-1)
    : item.type?.split("/").at(-1);
  return value?.toUpperCase() ?? "FILE";
}
export function getFileIcon(item: FileUploadItem) {
  const extension = item.name.split(".").at(-1)?.toLowerCase() ?? "",
    mime = item.type ?? "";
  if (mime.startsWith("image/")) return FileImage;
  if (mime.startsWith("video/")) return FileVideo;
  if (mime.startsWith("audio/")) return FileAudio;
  if (
    mime.includes("zip") ||
    mime.includes("compressed") ||
    ["zip", "rar", "7z", "tar", "gz"].includes(extension)
  )
    return FileArchive;
  if (
    mime.includes("spreadsheet") ||
    mime.includes("excel") ||
    ["csv", "xls", "xlsx"].includes(extension)
  )
    return FileSpreadsheet;
  if (
    mime.includes("pdf") ||
    mime.startsWith("text/") ||
    ["pdf", "doc", "docx", "md", "txt"].includes(extension)
  )
    return FileText;
  if (
    [
      "css",
      "html",
      "js",
      "jsx",
      "json",
      "mdx",
      "ts",
      "tsx",
      "xml",
      "yaml",
      "yml",
    ].includes(extension)
  )
    return FileCode2;
  return FileIcon;
}
export const STATUS_LABEL = {
  queued: "Queued",
  uploading: "Uploading",
  success: "Uploaded",
  error: "Failed",
};
export const STATUS_TONE = {
  queued: "text-muted-foreground",
  uploading: "text-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  error: "text-destructive",
};
