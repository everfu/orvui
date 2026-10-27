// Vue public prop types, derived from the actual components.
export type CardFolderProps = InstanceType<
  (typeof import("./CardFolder.vue"))["default"]
>["$props"];
