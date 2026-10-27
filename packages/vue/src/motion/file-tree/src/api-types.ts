// Vue public prop types, derived from the actual components.
export type FileTreeFileProps = InstanceType<
  (typeof import("./FileTreeFile.vue"))["default"]
>["$props"];
export type FileTreeFolderProps = InstanceType<
  (typeof import("./FileTreeFolder.vue"))["default"]
>["$props"];
export type FileTreeProps = InstanceType<
  (typeof import("./FileTree.vue"))["default"]
>["$props"];
