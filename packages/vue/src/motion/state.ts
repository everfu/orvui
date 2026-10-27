import { computed, ref, type Ref, type WritableComputedRef } from "vue";

/** A value may move between parent control and local ownership during its life. */
export function useMotionState<T>(
  props: Record<string, any>,
  emit: (...args: any[]) => void,
  key: string,
  fallback: T,
): WritableComputedRef<T> {
  const memory = ref(fallback) as Ref<T>;
  return computed({
    get(): T {
      const supplied = props[key];
      return supplied === undefined ? memory.value : supplied;
    },
    set(requested: T) {
      memory.value = requested;
      emit(`update:${key}`, requested);
      if (key === "modelValue") emit("change", requested);
    },
  });
}

/** Rove focus within the event surface, using its own document. */
export function focusList(event: KeyboardEvent, selector = "button:not(:disabled)") {
  const direction = new Map<string, number>([
    ["ArrowDown", 1], ["ArrowRight", 1], ["ArrowUp", -1], ["ArrowLeft", -1],
  ]).get(event.key);
  if (direction === undefined && event.key !== "Home" && event.key !== "End") return;
  const surface = event.currentTarget as HTMLElement | null;
  if (!surface) return;
  const candidates = [...surface.querySelectorAll<HTMLElement>(selector)];
  if (!candidates.length) return;
  const current = candidates.indexOf(surface.ownerDocument.activeElement as HTMLElement);
  const index = event.key === "Home" ? 0
    : event.key === "End" ? candidates.length - 1
    : current === -1 ? (direction === -1 ? candidates.length - 1 : 0)
    : (current + direction! + candidates.length) % candidates.length;
  event.preventDefault();
  candidates[index]?.focus();
}
