// Vue public prop types, derived from the actual components.
export type TodoListProps = InstanceType<
  (typeof import("./TodoList.vue"))["default"]
>["$props"];
