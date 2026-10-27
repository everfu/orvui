import type { ComputedRef, InjectionKey } from "vue";
export type MessageBubbleVariant =
  "solid" | "soft" | "tint" | "outline" | "ghost" | "danger";
export type MessageBubbleAlign = "start" | "end";
interface BubbleContext {
  align: MessageBubbleAlign;
  variant: MessageBubbleVariant;
  animateIn: boolean;
}
export const bubbleKey = Symbol("orvui-bubble") as InjectionKey<
  ComputedRef<BubbleContext>
>;
export const bubbleLayoutKey = Symbol("orvui-bubble-layout") as InjectionKey<
  () => void
>;
