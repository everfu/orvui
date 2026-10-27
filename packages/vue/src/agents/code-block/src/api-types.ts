// Vue public prop types, derived from the actual components.
export type CodeBlockProps = InstanceType<
  (typeof import("./CodeBlock.vue"))["default"]
>["$props"];
