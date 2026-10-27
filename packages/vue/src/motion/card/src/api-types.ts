// Vue public prop types, derived from the actual components.
export type CardActionProps = InstanceType<
  (typeof import("./CardAction.vue"))["default"]
>["$props"];
export type CardContentProps = InstanceType<
  (typeof import("./CardContent.vue"))["default"]
>["$props"];
export type CardDescriptionProps = InstanceType<
  (typeof import("./CardDescription.vue"))["default"]
>["$props"];
export type CardFooterProps = InstanceType<
  (typeof import("./CardFooter.vue"))["default"]
>["$props"];
export type CardHeaderProps = InstanceType<
  (typeof import("./CardHeader.vue"))["default"]
>["$props"];
export type CardProps = InstanceType<
  (typeof import("./Card.vue"))["default"]
>["$props"];
export type CardTitleProps = InstanceType<
  (typeof import("./CardTitle.vue"))["default"]
>["$props"];
