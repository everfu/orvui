// Vue public prop types, derived from the actual components.
export type FeedbackWidgetProps = InstanceType<
  (typeof import("./FeedbackWidget.vue"))["default"]
>["$props"];
