// Vue public prop types, derived from the actual components.
export type AttachmentUploadProps = InstanceType<
  (typeof import("./AttachmentUpload.vue"))["default"]
>["$props"];
export type FileUploadProps = InstanceType<
  (typeof import("./FileUpload.vue"))["default"]
>["$props"];
