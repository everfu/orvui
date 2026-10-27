import type { InjectionKey, ComputedRef } from "vue";
export type MessageFrom = "user" | "assistant";
export declare const messageKey: InjectionKey<ComputedRef<MessageFrom>>;
