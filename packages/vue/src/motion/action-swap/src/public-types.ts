import type { ActionSwapButtonProps } from "./api-types";
export type ActionSwapAnimation = NonNullable<
  ActionSwapButtonProps["animation"]
>;
export type ActionSwapButtonSize = NonNullable<ActionSwapButtonProps["size"]>;
export type ActionSwapButtonVariant = NonNullable<
  ActionSwapButtonProps["variant"]
>;
export type ActionSwapItem = ActionSwapButtonProps["items"][number];
