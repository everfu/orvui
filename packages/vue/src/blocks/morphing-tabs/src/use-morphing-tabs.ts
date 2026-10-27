import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useId,
  watch,
} from "vue";
import { animate, useMotionValue, type MotionValue } from "motion-v";
import { SPRING_GLIDE } from "../../../lib/ease";
import { useControllable, useReduced, type Content } from "../../shared";
import {
  DRAG_THRESHOLD,
  SURFACE_INSET,
  moveItem,
  sameOrder,
  tabGeometry,
} from "./model";
export interface TabsItem {
  id: string;
  label: string;
  icon?: Content;
  content: Content;
  disabled?: boolean;
}
interface Props {
  items: TabsItem[];
  modelValue?: string | null;
  defaultValue?: string | null;
}
interface Drag {
  id: string;
  pointer: number;
  origin: number;
  from: number;
  to: number;
  slots: number[];
  order: string[];
  moved: boolean;
  finishing: boolean;
}
export function useMorphingTabs(
  props: Props,
  events: { value(id: string | null): void; order(ids: string[]): void },
) {
  const reduce = useReduced(),
    uid = useId(),
    root = ref<HTMLElement>(),
    rail = ref<HTMLElement>();
  const order = ref(props.items.map((item) => item.id));
  const value = useControllable(
    () => props.modelValue,
    props.defaultValue ?? props.items[0]?.id ?? null,
    events.value,
  );
  const lookup = computed(
    () => new Map(props.items.map((item) => [item.id, item])),
  );
  const ordered = computed(() =>
    order.value.flatMap((id) => {
      const item = lookup.value.get(id);
      return item ? [item] : [];
    }),
  );
  const active = computed(() =>
    value.value && lookup.value.has(value.value)
      ? lookup.value.get(value.value)!
      : (ordered.value.find((item) => !item.disabled) ??
        ordered.value[0] ??
        null),
  );
  const surfaceWidth = ref(0),
    gap = ref(12),
    draggingId = ref<string | null>(null),
    targetIndex = ref(-1);
  const dragLeft = useMotionValue(SURFACE_INSET),
    surfaceLeft = useMotionValue(SURFACE_INSET);
  const geometry = computed(() =>
    tabGeometry(surfaceWidth.value, order.value.length, gap.value),
  );
  const slotLefts = computed(() =>
    order.value.map(
      (_, index) =>
        SURFACE_INSET + index * (geometry.value.width + geometry.value.gap),
    ),
  );
  const positions = new Map<string, MotionValue<number>>(),
    tabs = new Map<string, HTMLButtonElement>();
  let session: Drag | null = null,
    disposed = false,
    frame = 0;
  let dragControl: ReturnType<typeof animate> | undefined,
    surfaceControl: ReturnType<typeof animate> | undefined;
  let settleResolve: (() => void) | undefined;
  function visualIndex(index: number) {
    const from = draggingId.value ? order.value.indexOf(draggingId.value) : -1,
      to = targetIndex.value;
    if (from < 0 || to < 0) return index;
    if (index === from) return to;
    return to > from && index > from && index <= to
      ? index - 1
      : to < from && index >= to && index < from
        ? index + 1
        : index;
  }
  function setActive(id: string | null) {
    if (!id || !lookup.value.get(id)?.disabled) value.value = id;
  }
  function commit(ids: string[], notify: boolean) {
    order.value = ids;
    if (notify) events.order(ids);
  }
  function register(id: string, position: MotionValue<number> | null) {
    if (position) positions.set(id, position);
    else positions.delete(id);
  }
  function startDrag(id: string, event: PointerEvent) {
    if (session || event.button !== 0 || lookup.value.get(id)?.disabled) return;
    const from = order.value.indexOf(id);
    if (from < 0) return;
    dragControl?.stop();
    dragControl = undefined;
    const slots = [...slotLefts.value];
    dragLeft.set(slots[from]);
    session = {
      id,
      pointer: event.pointerId,
      origin: event.clientX,
      from,
      to: from,
      slots,
      order: [...order.value],
      moved: false,
      finishing: false,
    };
  }
  function moveDrag(event: PointerEvent) {
    const drag = session;
    if (!drag || drag.finishing || drag.pointer !== event.pointerId) return;
    const offset = event.clientX - drag.origin;
    if (!drag.moved && Math.abs(offset) < DRAG_THRESHOLD) return;
    event.preventDefault();
    if (!drag.moved) {
      drag.moved = true;
      try {
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      } catch {}
      if (active.value?.id === drag.id) {
        surfaceControl?.stop();
        surfaceLeft.set(drag.slots[drag.from]);
      }
      draggingId.value = drag.id;
      targetIndex.value = drag.from;
    }
    const start = drag.slots[drag.from];
    const position = Math.max(
      drag.slots[0],
      Math.min(drag.slots.at(-1)!, start + offset),
    );
    let destination = drag.from;
    if (position >= start) {
      for (let i = drag.from + 1; i < drag.slots.length; i++)
        if (position + geometry.value.width / 2 >= drag.slots[i])
          destination = i;
    } else {
      for (let i = drag.from - 1; i >= 0; i--)
        if (position <= drag.slots[i] + geometry.value.width / 2)
          destination = i;
    }
    dragLeft.set(position);
    drag.to = destination;
    targetIndex.value = destination;
  }
  function waitForSlots(ids: string[], drag: Drag) {
    if (reduce.value) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const start = performance.now();
      settleResolve = resolve;
      const check = () => {
        const done =
          disposed ||
          performance.now() - start > 500 ||
          ids.every((id, index) => {
            const position = positions.get(id);
            return (
              id === drag.id ||
              !position ||
              (Math.abs(position.get() - drag.slots[index]) < 0.5 &&
                Math.abs(position.getVelocity()) < 10)
            );
          });
        if (done) {
          settleResolve = undefined;
          resolve();
        } else frame = requestAnimationFrame(check);
      };
      check();
    });
  }
  function finish(event: PointerEvent) {
    const drag = session;
    if (!drag || drag.pointer !== event.pointerId || drag.finishing) return;
    if (!drag.moved) {
      session = null;
      return;
    }
    drag.finishing = true;
    const destination = drag.slots[drag.to];
    const control = animate(
      dragLeft,
      destination,
      reduce.value ? { duration: 0 } : SPRING_GLIDE,
    );
    dragControl = control;
    void control.then(async () => {
      if (disposed || dragControl !== control) return;
      const ids = moveItem(drag.order, drag.from, drag.to);
      await waitForSlots(ids, drag);
      if (disposed || dragControl !== control) return;
      if (active.value?.id === drag.id) surfaceLeft.set(destination);
      else if (active.value) {
        const position = positions.get(active.value.id);
        if (position) surfaceLeft.set(position.get());
      }
      positions.get(drag.id)?.jump(destination);
      dragControl = undefined;
      session = null;
      commit(ids, !sameOrder(ids, drag.order));
      draggingId.value = null;
      targetIndex.value = -1;
    });
  }
  function clickTab(id: string) {
    if (session?.id !== id || !session.moved) setActive(id);
  }
  function key(event: KeyboardEvent, id: string) {
    const index = order.value.indexOf(id);
    if (index < 0) return;
    if (
      event.altKey &&
      (event.key === "ArrowLeft" || event.key === "ArrowRight")
    ) {
      event.preventDefault();
      const destination = index + (event.key === "ArrowLeft" ? -1 : 1);
      if (
        destination >= 0 &&
        destination < order.value.length &&
        !lookup.value.get(id)?.disabled
      )
        commit(moveItem(order.value, index, destination), true);
      return;
    }
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const enabled = order.value.filter(
      (value) => !lookup.value.get(value)?.disabled,
    );
    if (!enabled.length) return;
    const current = enabled.indexOf(id);
    const next =
      event.key === "Home"
        ? enabled[0]
        : event.key === "End"
          ? enabled.at(-1)!
          : enabled[
              (current +
                (event.key === "ArrowLeft" ? -1 : 1) +
                enabled.length) %
                enabled.length
            ];
    setActive(next);
    void nextTick(() => {
      if (!disposed) tabs.get(next)?.focus();
    });
  }
  watch(
    () => props.items.map((item) => item.id),
    (ids) => {
      const available = new Set(ids),
        existing = order.value.filter((id) => available.has(id)),
        known = new Set(existing);
      order.value = [...existing, ...ids.filter((id) => !known.has(id))];
    },
  );
  watch([active, lookup], () => {
    if (
      (!value.value || !lookup.value.has(value.value)) &&
      active.value &&
      active.value.id !== value.value
    )
      setActive(active.value.id);
  });
  watch(
    [active, slotLefts, draggingId, reduce],
    () => {
      if (!active.value || draggingId.value) return;
      const index = order.value.indexOf(active.value.id);
      if (index < 0) return;
      surfaceControl?.stop();
      surfaceControl = animate(
        surfaceLeft,
        slotLefts.value[index],
        reduce.value ? { duration: 0 } : SPRING_GLIDE,
      );
    },
    { flush: "post" },
  );
  let observer: ResizeObserver | undefined;
  onMounted(() => {
    const measure = () => {
      if (!root.value) return;
      surfaceWidth.value = root.value.clientWidth;
      const measured = rail.value
        ? parseFloat(getComputedStyle(rail.value).columnGap)
        : NaN;
      if (Number.isFinite(measured)) gap.value = measured;
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      if (root.value) observer.observe(root.value);
    }
    window.addEventListener("pointerup", finish, true);
    window.addEventListener("pointercancel", finish, true);
  });
  onUnmounted(() => {
    disposed = true;
    observer?.disconnect();
    dragControl?.stop();
    surfaceControl?.stop();
    cancelAnimationFrame(frame);
    settleResolve?.();
    positions.clear();
    tabs.clear();
    window.removeEventListener("pointerup", finish, true);
    window.removeEventListener("pointercancel", finish, true);
  });
  return {
    reduce,
    uid,
    root,
    rail,
    ordered,
    active,
    surfaceWidth,
    draggingId,
    dragLeft,
    surfaceLeft,
    geometry,
    slotLefts,
    tabs,
    visualIndex,
    register,
    startDrag,
    moveDrag,
    finish,
    clickTab,
    key,
  };
}
