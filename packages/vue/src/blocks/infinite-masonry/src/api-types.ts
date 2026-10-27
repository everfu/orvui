// Vue public prop types, derived from the actual components.
export type InfiniteMasonryProps = Parameters<
  (typeof import("./InfiniteMasonry.vue"))["default"]
>[0];
