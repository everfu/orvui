import {
  shallowRef,
  watch,
  onMounted,
  onBeforeUnmount,
  useId,
  type VNodeChild,
  type Component,
} from "vue";
export type ToastStatus = "neutral" | "info" | "loading" | "success" | "error";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
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
export type ToastClassNames = Partial<
  Record<
    | "root"
    | "item"
    | "surface"
    | "iconWrap"
    | "content"
    | "title"
    | "description"
    | "action"
    | "close"
    | "progress",
    string
  >
>;
export interface UseAnimatedToastStackOptions {
  initialToasts?: ToastInput[];
  defaultDuration?: number;
  limit?: number;
}
export function useAnimatedToastStack(options: UseAnimatedToastStackOptions = {}) {
  const instanceId = useId();
  const defaultDuration = options.defaultDuration ?? 4200;
  let serial = 0, mounted = false;
  let wakeup: ReturnType<typeof setTimeout> | undefined;
  const deadlines = new Map<string, number>();
  function create(input: ToastInput): AnimatedToast {
    return { duration: defaultDuration, dismissible: true, ...input, id: input.id ?? `${instanceId}-toast-${serial++}`, createdAt: Date.now() };
  }
  const toasts = shallowRef<AnimatedToast[]>((options.initialToasts ?? []).map(create));
  function dismissToast(id: string) { toasts.value = toasts.value.filter(toast => toast.id !== id); }
  function clearToasts() { toasts.value = []; }
  function setToasts(next: AnimatedToast[] | ((current: AnimatedToast[]) => AnimatedToast[])) {
    toasts.value = typeof next === "function" ? next(toasts.value) : next;
  }
  function showToast(input: ToastInput) {
    const toast = create(input);
    const appended = [...toasts.value, toast];
    toasts.value = typeof options.limit === "number" ? appended.slice(-options.limit) : appended;
    return toast.id;
  }
  function updateToast(id: string, patch: Partial<ToastInput>) {
    toasts.value = toasts.value.map(toast => toast.id !== id ? toast : {
      ...toast, ...patch, id, createdAt: patch.duration === undefined ? toast.createdAt : Date.now(),
    });
  }
  function cancelWakeup() {
    if (wakeup !== undefined) clearTimeout(wakeup);
    wakeup = undefined;
  }
  function expire() {
    wakeup = undefined;
    if (!mounted) return;
    const now = Date.now();
    const expired = new Set([...deadlines].filter(([, deadline]) => deadline <= now).map(([id]) => id));
    if (expired.size) toasts.value = toasts.value.filter(toast => !expired.has(toast.id));
    else schedule();
  }
  function schedule() {
    cancelWakeup();
    deadlines.clear();
    if (!mounted) return;
    const now = Date.now();
    toasts.value.forEach(toast => {
      const duration = toast.duration ?? defaultDuration;
      if (duration > 0 && Number.isFinite(duration)) deadlines.set(toast.id, (toast.createdAt ?? now) + duration);
    });
    if (!deadlines.size) return;
    const nextDeadline = Math.min(...deadlines.values());
    wakeup = setTimeout(expire, Math.max(0, Math.min(2147483647, nextDeadline - now)));
  }
  watch(toasts, schedule, { flush: "sync" });
  onMounted(() => { mounted = true; schedule(); });
  onBeforeUnmount(() => { mounted = false; cancelWakeup(); deadlines.clear(); });
  return {
    toasts, showToast, updateToast, dismissToast, clearToasts, setToasts,
    add: showToast, push: showToast, toast: showToast, update: updateToast,
    dismiss: dismissToast, clear: clearToasts,
  };
}
