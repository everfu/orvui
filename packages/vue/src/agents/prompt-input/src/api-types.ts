// Vue public prop types, derived from the actual components.
export type PromptInputProps = InstanceType<
  (typeof import("./PromptInput.vue"))["default"]
>["$props"];
