import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
} from "vue";
import {
  resolveElement,
  useFloatingLayer,
  useReducedMotion,
} from "../../../lib/composables";
export function useBloom(labels: () => string[]) {
  const open = ref(false),
    root = ref<HTMLElement>(),
    active = ref(0),
    reduce = useReducedMotion(),
    id = useId(),
    buttons = new Map<string, HTMLButtonElement>();
  const layer = useFloatingLayer(open, root);
  let restore = false,
    disposed = false;
  const morph = computed(() =>
    reduce.value
      ? { duration: 0.15 }
      : { type: "spring" as const, stiffness: 300, damping: 32, mass: 0.9 },
  );
  const focus = () =>
    buttons.get(labels()[active.value])?.focus({ preventScroll: true });
  function close(returnFocus: boolean) {
    restore = returnFocus && !!root.value?.contains(document.activeElement);
    open.value = false;
  }
  function setTrigger(value: unknown) {
    if (restore && value) {
      restore = false;
      void nextTick(() => {
        if (!disposed) resolveElement<HTMLElement>(value)?.focus();
      });
    }
  }
  function show() {
    active.value = 0;
    open.value = true;
  }
  function gridKey(event: KeyboardEvent) {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"],
      steps = [1, -1, 3, -3],
      at = keys.indexOf(event.key);
    let next =
      at >= 0
        ? active.value + steps[at]
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? labels().length - 1
            : undefined;
    if (next === undefined) return;
    event.preventDefault();
    active.value = next < 0 || next >= labels().length ? active.value : next;
    focus();
  }
  function blur(event: FocusEvent) {
    if (
      event.relatedTarget instanceof Node &&
      !root.value?.contains(event.relatedTarget)
    )
      close(false);
  }
  function shortcut(event: KeyboardEvent) {
    if (open.value && layer.claimEscape(event)) close(true);
  }
  function outside(event: PointerEvent) {
    if (
      open.value &&
      !root.value?.contains(event.target as Node) &&
      !layer.containsHigher(event.target)
    )
      close(false);
  }
  watch(
    [open, active],
    () =>
      void nextTick(() => {
        if (!disposed && open.value) focus();
      }),
  );
  onMounted(() => {
    document.addEventListener("keydown", shortcut, true);
    document.addEventListener("pointerdown", outside);
  });
  onBeforeUnmount(() => {
    disposed = true;
    buttons.clear();
    document.removeEventListener("keydown", shortcut, true);
    document.removeEventListener("pointerdown", outside);
  });
  const delay = (index: number) =>
    0.1 +
    Math.hypot(
      (index % 3) - 1,
      Math.floor(index / 3) - (Math.ceil(labels().length / 3) - 1) / 2,
    ) *
      0.07;
  return {
    open,
    root,
    active,
    reduce,
    id,
    buttons,
    morph,
    close,
    setTrigger,
    show,
    gridKey,
    blur,
    delay,
  };
}
