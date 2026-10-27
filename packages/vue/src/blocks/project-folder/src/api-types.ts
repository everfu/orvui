// Vue public prop types, derived from the actual components.
export type ProjectFolderProps = InstanceType<
  (typeof import("./ProjectFolder.vue"))["default"]
>["$props"];
