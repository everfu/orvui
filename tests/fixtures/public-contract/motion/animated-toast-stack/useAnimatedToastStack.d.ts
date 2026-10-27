import { type VNodeChild, type Component } from "vue";
export type ToastStatus = "neutral" | "info" | "loading" | "success" | "error";
export type ToastPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
export type AnimatedToastAction = {
    label: VNodeChild;
    onClick: (toast: AnimatedToast) => void;
};
export type AnimatedToast = {
    id: string;
    title: VNodeChild;
    description?: VNodeChild;
    icon?: VNodeChild | Component;
    status?: ToastStatus;
    action?: AnimatedToastAction;
    duration?: number;
    dismissible?: boolean;
    createdAt?: number;
};
export type ToastInput = Omit<AnimatedToast, "id" | "createdAt"> & {
    id?: string;
};
export type ToastClassNames = Partial<Record<"root" | "item" | "surface" | "iconWrap" | "content" | "title" | "description" | "action" | "close" | "progress", string>>;
export interface UseAnimatedToastStackOptions {
    initialToasts?: ToastInput[];
    defaultDuration?: number;
    limit?: number;
}
export declare function useAnimatedToastStack(options?: UseAnimatedToastStackOptions): {
    toasts: import("vue").ShallowRef<AnimatedToast[], AnimatedToast[]>;
    showToast: (input: ToastInput) => string;
    updateToast: (id: string, patch: Partial<ToastInput>) => void;
    dismissToast: (id: string) => void;
    clearToasts: () => void;
    setToasts: (value: AnimatedToast[] | ((current: AnimatedToast[]) => AnimatedToast[])) => void;
    add: (input: ToastInput) => string;
    push: (input: ToastInput) => string;
    toast: (input: ToastInput) => string;
    update: (id: string, patch: Partial<ToastInput>) => void;
    dismiss: (id: string) => void;
    clear: () => void;
};
