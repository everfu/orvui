import type { ComputedRef, InjectionKey } from "vue";
export type MessageFrom = "user" | "assistant";
export const messageKey = Symbol("orvui-message") as InjectionKey<
  ComputedRef<MessageFrom>
>;
