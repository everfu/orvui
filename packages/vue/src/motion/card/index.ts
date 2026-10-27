export { default as Card } from "./src/Card.vue";
export { default as CardHeader } from "./src/CardHeader.vue";
export { default as CardDescription } from "./src/CardDescription.vue";
export { default as CardAction } from "./src/CardAction.vue";
export { default as CardContent } from "./src/CardContent.vue";
export { default as CardFooter } from "./src/CardFooter.vue";
export { default as CardTitle } from "./src/CardTitle.vue";
export const CARD_TARGET_CLASS = "after:absolute after:inset-0";
export type CardVariant = "outlined" | "muted";
export type CardSize = "default" | "compact";

export type * from "./src/api-types";
