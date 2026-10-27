import type { InjectionKey, ComputedRef } from "vue";
export type MessageBubbleVariant = "solid" | "soft" | "tint" | "outline" | "ghost" | "danger";
export type MessageBubbleAlign = "start" | "end";
export declare const bubbleKey: InjectionKey<ComputedRef<{
    align: MessageBubbleAlign;
    variant: MessageBubbleVariant;
    animateIn: boolean;
}>>;
export declare const bubbleLayoutKey: InjectionKey<() => void>;
