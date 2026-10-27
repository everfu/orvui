// Vue public prop types, derived from the actual components.
export type CitationListProps = InstanceType<
  (typeof import("./CitationList.vue"))["default"]
>["$props"];
export type CitationProps = InstanceType<
  (typeof import("./Citation.vue"))["default"]
>["$props"];
export type CitationStackProps = InstanceType<
  (typeof import("./CitationStack.vue"))["default"]
>["$props"];
export type CitationsProps = InstanceType<
  (typeof import("./Citations.vue"))["default"]
>["$props"];
