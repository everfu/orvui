// Vue public prop types, derived from the actual components.
export type CommandPaletteProps = InstanceType<
  (typeof import("./CommandPalette.vue"))["default"]
>["$props"];
