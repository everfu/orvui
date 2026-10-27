import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useId,
  watch,
  watchEffect,
} from "vue";
import {
  resolveElement,
  useFloatingLayer,
  useReducedMotion,
} from "../../../lib/composables";
export function useTableMenu(changed: (open: boolean) => void) {
  const trigger = ref<HTMLButtonElement | null>(null),
    panel = ref<HTMLElement | null>(null),
    coords = ref<{ top: number; left: number } | null>(null),
    reduce = useReducedMotion(),
    id = useId();
  const layer = useFloatingLayer(
    computed(() => coords.value !== null),
    panel,
  );
  let disposed = false;
  function close(restore = false) {
    coords.value = null;
    if (restore)
      void nextTick(() => {
        if (!disposed) trigger.value?.focus({ preventScroll: true });
      });
  }
  function dismiss() {
    close();
  }
  function escape(event: KeyboardEvent) {
    if (layer.claimEscape(event)) close(true);
  }
  function toggle() {
    if (coords.value) {
      close();
      return;
    }
    const rect = trigger.value?.getBoundingClientRect();
    if (rect)
      coords.value = {
        top: rect.bottom + 4,
        left: Math.max(8, Math.min(innerWidth - 196, rect.right - 188)),
      };
  }
  function navigate(event: KeyboardEvent) {
    if (event.key === "Tab") {
      close();
      return;
    }
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const buttons = Array.from(
        resolveElement<HTMLElement>(
          panel.value,
        )?.querySelectorAll<HTMLButtonElement>("button") ?? [],
      ),
      index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? buttons.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) %
            buttons.length;
    buttons[next]?.focus();
  }
  watch(coords, (value) => changed(!!value), { flush: "sync" });
  watchEffect((cleanup) => {
    if (!coords.value) return;
    let active = true;
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    window.addEventListener("keydown", escape);
    void nextTick(() => {
      if (active && !disposed)
        resolveElement<HTMLElement>(panel.value)
          ?.querySelector<HTMLButtonElement>("button")
          ?.focus({ preventScroll: true });
    });
    cleanup(() => {
      active = false;
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("keydown", escape);
    });
  });
  onBeforeUnmount(() => {
    disposed = true;
  });
  return { trigger, panel, coords, reduce, id, close, toggle, navigate };
}
