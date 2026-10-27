import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { animate, useMotionValue, type PanInfo } from "motion-v";
import { useReducedMotion } from "../../../lib/composables";
import { resolveSwipeSide } from "./gesture";
import type {
  SwipeAction,
  SwipeableListItem,
  SwipeableListValue,
  SwipeSide,
} from "./SwipeableList.vue";
type Options = {
  item: SwipeableListItem;
  actionWidth: number;
  revealThreshold: number;
  openValue: SwipeableListValue | null;
  closeOnAction: boolean;
};
export function useSwipeRow(
  options: Options,
  change: (value: SwipeableListValue | null) => void,
  action: (payload: {
    item: SwipeableListItem;
    action: SwipeAction;
    side: SwipeSide;
  }) => void,
) {
  const reduce = useReducedMotion(),
    x = useMotionValue(0);
  const rail = ref<HTMLDivElement>(),
    toggle = ref<HTMLButtonElement>();
  const left = computed(() => options.item.leftActions ?? []),
    right = computed(() => options.item.rightActions ?? []);
  const leftWidth = computed(() => left.value.length * options.actionWidth),
    rightWidth = computed(() => right.value.length * options.actionWidth);
  const openSide = computed(() =>
    options.openValue?.id === options.item.id ? options.openValue.side : null,
  );
  const offset = (side: SwipeSide | null) =>
    side === "left"
      ? leftWidth.value
      : side === "right"
        ? -rightWidth.value
        : 0;
  const target = computed(() => offset(openSide.value));
  let animation: ReturnType<typeof animate> | undefined,
    commanded = 0,
    live = false,
    focusPending = false,
    generation = 0;
  function settle(value: number, velocity = 0) {
    const current = ++generation;
    commanded = value;
    animation?.stop();
    if (reduce.value) {
      x.set(value);
      return;
    }
    animation = animate(x, value, {
      type: "spring",
      stiffness: 560,
      damping: 48,
      mass: 0.82,
      restDelta: 0.5,
      restSpeed: 8,
      velocity: Math.max(-1500, Math.min(1500, velocity)),
      onComplete() {
        if (current === generation && live) x.set(value);
      },
    });
  }
  function snap(side: SwipeSide | null, velocity = 0) {
    change(side ? { id: options.item.id, side } : null);
    settle(offset(side), velocity);
  }
  watch([target, reduce], () => {
    if (live && (reduce.value || commanded !== target.value))
      settle(target.value);
  });
  watch(openSide, (side) => {
    if (!side || !focusPending) return;
    focusPending = false;
    void nextTick(() => {
      if (live)
        rail.value
          ?.querySelector<HTMLButtonElement>(
            `[data-side="${side}"] button:not(:disabled)`,
          )
          ?.focus();
    });
  });
  onMounted(() => {
    live = true;
    if (target.value) settle(target.value);
  });
  onBeforeUnmount(() => {
    live = false;
    generation++;
    animation?.stop();
  });
  function dragStart() {
    animation?.stop();
    if (options.openValue && options.openValue.id !== options.item.id)
      change(null);
  }
  function dragEnd(_: PointerEvent, info: PanInfo) {
    snap(
      resolveSwipeSide(
        x.get(),
        info.velocity.x,
        openSide.value,
        leftWidth.value,
        rightWidth.value,
        options.revealThreshold,
      ),
      info.velocity.x,
    );
  }
  function run(selected: SwipeAction, side: SwipeSide) {
    if (selected.disabled || options.item.disabled) return;
    selected.onClick?.(options.item);
    action({ item: options.item, action: selected, side });
    if (options.closeOnAction) {
      if (rail.value?.contains(document.activeElement)) toggle.value?.focus();
      snap(null);
    }
  }
  function keyboardOpen(side: SwipeSide) {
    if (!offset(side)) return;
    focusPending = true;
    snap(side);
  }
  function keydown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (openSide.value === "left") snap(null);
      else keyboardOpen("right");
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      if (openSide.value === "right") snap(null);
      else keyboardOpen("left");
    } else if (event.key === "Escape" && openSide.value) {
      event.preventDefault();
      snap(null);
    }
  }
  function railKey(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      toggle.value?.focus();
      snap(null);
    }
  }
  return {
    rail,
    toggle,
    left,
    right,
    leftWidth,
    rightWidth,
    openSide,
    x,
    dragStart,
    dragEnd,
    run,
    snap,
    keyboardOpen,
    keydown,
    railKey,
  };
}
