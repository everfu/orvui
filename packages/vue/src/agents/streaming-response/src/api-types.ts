// Vue public prop types, derived from the actual components.
export type StreamingResponseProps = InstanceType<
  (typeof import("./StreamingResponse.vue"))["default"]
>["$props"];
