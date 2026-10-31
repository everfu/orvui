import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
} from "vue";
import { animate, useMotionValue } from "motion-v";
import { EASE_OUT } from "../../../lib/ease";
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
  const contentOpacity = useMotionValue(0);
  const clipPath = useMotionValue("inset(45% 34% 45% 34%)");
  let reveal: ReturnType<typeof animate>[] = [];
  let revision = 0;
  const stopReveal = () => { reveal.forEach(animation => animation.stop()); reveal = []; };
  watch(open, async visible => {
    const token = ++revision;
    stopReveal();
    if (!visible) return;
    contentOpacity.jump(0);
    clipPath.jump(reduce.value ? "inset(0% 0% 0% 0%)" : "inset(45% 34% 45% 34%)");
    await nextTick();
    if (disposed || token !== revision || !open.value) return;
    reveal = [
      animate(contentOpacity, 1, { delay: reduce.value ? 0 : 0.12, duration: 0.2 }),
      animate(clipPath, "inset(0% 0% 0% 0%)", { delay: reduce.value ? 0 : 0.08, duration: 0.45, ease: EASE_OUT }),
    ];
  }, { flush: "sync" });
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
    ++revision;
    stopReveal();
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
    contentOpacity,
    clipPath,
  };
}
