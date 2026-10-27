// Vue public prop types, derived from the actual components.
export type SignUpFormProps = InstanceType<
  (typeof import("./SignUpForm.vue"))["default"]
>["$props"];
