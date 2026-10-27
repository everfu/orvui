import { computed, onBeforeUnmount, ref, useId, watch } from "vue";
import { useReducedMotion } from "../../../lib/composables";
import { useBlockDismiss } from "../../dismiss";
export function useFeedback(
  props: {
    position: "bottom-right" | "bottom-left";
    onSubmit?: (data: { message: string }) => void | Promise<void>;
  },
  success: (data: { message: string }) => void,
  failure: (error: unknown) => void,
) {
  const reduce = useReducedMotion(),
    root = ref<HTMLDivElement>(),
    textarea = ref<HTMLTextAreaElement>(),
    titleId = useId();
  const status = ref<"idle" | "open" | "sending" | "sent" | "error">("idle"),
    message = ref("");
  const open = computed(() => status.value !== "idle"),
    busy = computed(() => status.value === "sending"),
    left = computed(() => props.position === "bottom-left"),
    offset = computed(() => (left.value ? -40 : 40));
  let closeTimer: ReturnType<typeof setTimeout> | undefined,
    focusTimer: ReturnType<typeof setTimeout> | undefined,
    disposed = false;
  function close() {
    clearTimeout(closeTimer);
    status.value = "idle";
    message.value = "";
  }
  function start() {
    clearTimeout(closeTimer);
    status.value = "open";
  }
  useBlockDismiss(
    computed(() => open.value && !busy.value),
    root,
    close,
  );
  watch([status, reduce], () => {
    clearTimeout(focusTimer);
    if (status.value === "open")
      focusTimer = setTimeout(
        () => textarea.value?.focus(),
        reduce.value ? 0 : 400,
      );
  });
  async function submit() {
    if (busy.value || !message.value.trim()) return;
    const data = { message: message.value };
    status.value = "sending";
    try {
      await props.onSubmit?.(data);
      if (disposed) return;
      status.value = "sent";
      success(data);
      clearTimeout(closeTimer);
      closeTimer = setTimeout(close, 1600);
    } catch (error) {
      if (disposed) return;
      status.value = "error";
      failure(error);
    }
  }
  onBeforeUnmount(() => {
    disposed = true;
    clearTimeout(closeTimer);
    clearTimeout(focusTimer);
  });
  return {
    reduce,
    root,
    textarea,
    titleId,
    status,
    message,
    open,
    busy,
    left,
    offset,
    start,
    close,
    submit,
  };
}
