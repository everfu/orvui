import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
} from "vue";
import { animate } from "motion-v";
import { resolveElement } from "../../../lib/composables";
import { SPRING_TIMELINE } from "../../../lib/ease";

export function clamp(value: number, lower: number, upper: number) {
  return Math.max(lower, Math.min(upper, value));
}

interface TimelineTrackOptions {
  events: { id: string }[];
  itemWidth: number;
}
interface DragSession {
  id: number;
  element: HTMLElement;
  originX: number;
  originPosition: number;
  moved: boolean;
  previousX: number;
  previousTime: number;
  latestX: number;
  latestTime: number;
}

export function useTimelineTrack(
  root: Ref<HTMLElement | null>,
  props: TimelineTrackOptions,
  value: Ref<string>,
  reduced: Ref<boolean>,
) {
  const active = computed(() =>
    Math.max(
      0,
      props.events.findIndex((event) => event.id === value.value),
    ),
  );
  const last = computed(() => Math.max(0, props.events.length - 1));
  // The same fallback is used on the server and while a preview is hidden.
  const width = ref(800);
  const scroll = ref(active.value);
  const cardWidth = computed(() =>
    Math.min(props.itemWidth, width.value * (width.value < 640 ? 0.58 : 0.36)),
  );
  const gap = computed(() => clamp(cardWidth.value * 0.22, 40, 72));
  const step = computed(() => cardWidth.value * 0.72 + gap.value);
  const near = computed(() => cardWidth.value * 0.86 + gap.value);
  const buttons = new Map<string, HTMLButtonElement>();

  let animation: ReturnType<typeof animate> | undefined;
  let destination: number | undefined;
  let disposed = false;
  let revision = 0;
  let focusRevision = 0;
  let pointer: DragSession | undefined;
  let observer: ResizeObserver | undefined;
  let host: HTMLElement | null = null;
  let wheelTimer: ReturnType<typeof setTimeout> | undefined;
  let clickBlocked = false;
  let velocity = 0;
  let samplePosition = scroll.value;
  let sampleTime = 0;
  let requestedId = props.events[active.value]?.id;

  function clearWheel() {
    clearTimeout(wheelTimer);
    wheelTimer = undefined;
  }

  function commit(index: number) {
    const id = props.events[index]?.id;
    // A controlled parent can echo a request later. Emit once per boundary
    // even when several pointer samples arrive before that echo.
    if (id === undefined || id === requestedId) return;
    requestedId = id;
    value.value = id;
  }

  function stop() {
    ++revision;
    destination = undefined;
    animation?.stop();
    animation = undefined;
  }

  function glide(target: number, initialVelocity = velocity, notify = true) {
    stop();
    destination = target;
    if (notify) commit(target);
    if (reduced.value || (scroll.value === target && initialVelocity === 0)) {
      scroll.value = target;
      destination = undefined;
      velocity = 0;
      return;
    }
    const current = revision;
    animation = animate(scroll.value, target, {
      ...SPRING_TIMELINE,
      velocity: initialVelocity,
      restDelta: 0.001,
      onUpdate: (position) => {
        if (!disposed && current === revision) scroll.value = position;
      },
      onComplete: () => {
        if (disposed || current !== revision) return;
        scroll.value = target;
        destination = undefined;
        animation = undefined;
        velocity = 0;
      },
    });
  }

  function settle(releaseVelocity: number) {
    const projected = scroll.value + clamp(releaseVelocity * 0.3, -4, 4);
    glide(clamp(Math.round(projected), 0, last.value), releaseVelocity);
  }

  function release() {
    const current = pointer;
    pointer = undefined;
    if (current) {
      try {
        if (current.element.hasPointerCapture(current.id))
          current.element.releasePointerCapture(current.id);
      } catch {
        /* The browser may already have canceled capture. */
      }
    }
    return current;
  }

  function select(index: number, focus = false) {
    clearWheel();
    release();
    requestedId = props.events[active.value]?.id;
    const target = clamp(index, 0, last.value);
    glide(target);
    if (focus) {
      const current = ++focusRevision;
      void nextTick(() => {
        if (!disposed && current === focusRevision)
          buttons.get(props.events[target]?.id)?.focus({ preventScroll: true });
      });
    }
  }

  function down(event: PointerEvent) {
    if (event.button !== 0 || event.isPrimary === false || pointer) return;
    const element = resolveElement<HTMLElement>(event.currentTarget);
    if (!element) return;
    clearWheel();
    stop();
    clickBlocked = false;
    requestedId = props.events[active.value]?.id;
    const time = performance.now();
    pointer = {
      id: event.pointerId,
      element,
      originX: event.clientX,
      originPosition: scroll.value,
      moved: false,
      previousX: event.clientX,
      latestX: event.clientX,
      previousTime: time,
      latestTime: time,
    };
  }

  function move(event: PointerEvent) {
    const current = pointer;
    if (!current || current.id !== event.pointerId) return;
    const distance = event.clientX - current.originX;
    if (!current.moved) {
      if (Math.abs(distance) < 4) return;
      current.moved = true;
      clickBlocked = true;
      try {
        current.element.setPointerCapture(current.id);
      } catch {
        /* Synthetic or canceled pointer. */
      }
    }
    const raw = current.originPosition - distance / step.value;
    scroll.value =
      raw < 0
        ? raw * 0.3
        : raw > last.value
          ? last.value + (raw - last.value) * 0.3
          : raw;
    current.previousX = current.latestX;
    current.previousTime = current.latestTime;
    current.latestX = event.clientX;
    current.latestTime = performance.now();
  }

  function up(event: PointerEvent) {
    if (pointer?.id !== event.pointerId) return;
    const current = release()!;
    if (!current.moved) return;
    const elapsed = current.latestTime - current.previousTime;
    // A held pointer has no remaining flick velocity.
    const fresh = performance.now() - current.latestTime < 100;
    settle(
      fresh && elapsed > 0
        ? ((-(current.latestX - current.previousX) / elapsed) * 1000) /
            step.value
        : 0,
    );
  }

  function cancel(event: PointerEvent) {
    if (pointer?.id !== event.pointerId) return;
    abandon();
  }

  function abandon() {
    const current = release()!;
    if (current?.moved) settle(0);
  }

  function clickCapture(event: MouseEvent) {
    // Capture normally routes the generated click to the stage. Also guard
    // browsers that release capture before choosing the click target.
    if (!clickBlocked || event.detail === 0) return;
    clickBlocked = false;
    event.preventDefault();
    event.stopPropagation();
  }

  function wheel(event: WheelEvent) {
    if (
      event.ctrlKey ||
      pointer ||
      Math.abs(event.deltaX) <= Math.abs(event.deltaY)
    )
      return;
    event.preventDefault();
    if (wheelTimer === undefined) requestedId = props.events[active.value]?.id;
    stop();
    const pixels =
      event.deltaX *
      (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? width.value : 1);
    scroll.value = clamp(
      scroll.value + pixels / step.value,
      -0.3,
      last.value + 0.3,
    );
    clearWheel();
    wheelTimer = setTimeout(() => {
      wheelTimer = undefined;
      if (!disposed) glide(clamp(Math.round(scroll.value), 0, last.value), 0);
    }, 140);
  }

  watch(
    scroll,
    (position) => {
      const now = performance.now();
      const elapsed = now - sampleTime;
      if (sampleTime && elapsed > 0)
        velocity = ((position - samplePosition) / elapsed) * 1000;
      samplePosition = position;
      sampleTime = now;
      if (destination === undefined)
        commit(clamp(Math.round(position), 0, last.value));
    },
    { flush: "sync" },
  );

  watch(
    [value, () => props.events.map((event) => event.id)],
    ([id, ids], [previousId, previousIds]) => {
      const listChanged =
        ids.length !== previousIds.length ||
        ids.some((entry, index) => entry !== previousIds[index]);
      const external = id !== requestedId && id !== previousId;
      if (!listChanged && !external) return;
      clearWheel();
      release();
      requestedId = props.events[active.value]?.id;
      glide(active.value, 0, false);
    },
  );

  watch(reduced, (reduce) => {
    if (reduce && destination !== undefined) glide(destination, 0, false);
  });

  onMounted(() => {
    host = resolveElement<HTMLElement>(root.value);
    if (!host) return;
    width.value = host.clientWidth || 800;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver((entries) => {
        if (!disposed)
          width.value =
            entries[0]?.contentRect.width || host?.clientWidth || 800;
      });
      observer.observe(host);
    }
    host.addEventListener("wheel", wheel, { passive: false });
    // A press is not captured until it becomes a horizontal drag. Its release
    // can therefore happen outside the stage, or while the window loses focus.
    host.ownerDocument.addEventListener("pointerup", up, true);
    host.ownerDocument.addEventListener("pointercancel", cancel, true);
    host.ownerDocument.defaultView?.addEventListener("blur", abandon);
  });

  onBeforeUnmount(() => {
    disposed = true;
    ++focusRevision;
    clearWheel();
    release();
    stop();
    observer?.disconnect();
    host?.removeEventListener("wheel", wheel);
    host?.ownerDocument.removeEventListener("pointerup", up, true);
    host?.ownerDocument.removeEventListener("pointercancel", cancel, true);
    host?.ownerDocument.defaultView?.removeEventListener("blur", abandon);
    buttons.clear();
  });

  function x(offset: number) {
    const distance = Math.abs(offset);
    return (
      Math.sign(offset) *
      (distance <= 1
        ? distance * near.value
        : near.value + (distance - 1) * step.value)
    );
  }
  function scale(offset: number) {
    return 1 - 0.28 * Math.min(Math.abs(offset), 1);
  }
  function cardStyle(index: number) {
    const offset = index - scroll.value;
    return {
      top: "50%",
      width: `${cardWidth.value}px`,
      marginLeft: `${-cardWidth.value / 2}px`,
      transform: `translateX(${x(offset)}px) scale(${scale(offset)})`,
      zIndex: 100 - Math.round(Math.abs(offset) * 10),
    };
  }
  function cable(index: number) {
    const offset = index - scroll.value;
    const center = width.value / 2 + x(offset);
    const reach = (cardWidth.value / 2) * scale(offset) * 0.8;
    return {
      left: center - reach,
      right: center + reach,
      opacity: clamp((1.6 - Math.abs(offset)) / 0.6, 0, 1),
    };
  }
  function gapX(index: number) {
    const offset = index - scroll.value;
    return (
      (x(offset) +
        (cardWidth.value * scale(offset)) / 2 +
        x(offset + 1) -
        (cardWidth.value * scale(offset + 1)) / 2) /
      2
    );
  }
  return {
    active,
    width,
    scroll,
    cardWidth,
    gap,
    step,
    buttons,
    cardStyle,
    cable,
    gapX,
    down,
    move,
    up,
    cancel,
    clickCapture,
    select,
  };
}
