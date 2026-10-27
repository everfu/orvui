import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from "vue";
import {
  resolveElement,
  useControllable,
  useFloatingLayer,
} from "../../../lib/composables";
import { graceArea, inBox, inPolygon } from "./grace";
export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";
export type TooltipPoint = { x: number; y: number };
export type TooltipAnchor = HTMLElement | SVGElement;
export interface TooltipTiming {
  delay: number;
  closeDelay: number;
  skipDelay: number;
}
export const timingKey: InjectionKey<ComputedRef<TooltipTiming>> =
  Symbol("tooltip-timing");
export interface TooltipRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  delay?: number;
  closeDelay?: number;
  disabled?: boolean;
  asLabel?: boolean;
  followCursor?: boolean;
  anchorRef?: TooltipAnchor | null | Ref<TooltipAnchor | null>;
  id?: string;
}
export interface TooltipContentProps {
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  arrow?: boolean;
  anchorPoint?: TooltipPoint;
}
export interface TooltipContext {
  open: ComputedRef<boolean>;
  id: string;
  labelId: string;
  props: Readonly<TooltipRootProps>;
  anchor: Ref<TooltipAnchor | null>;
  floating: Ref<HTMLElement | null>;
  cursor: Ref<TooltipPoint | null>;
  empty: Ref<boolean>;
  setTrigger: (value: unknown) => void;
  setEmpty: (value: boolean) => void;
  close: () => void;
  enterContent: () => void;
  leaveContent: (event: PointerEvent) => void;
}
export const tooltipKey: InjectionKey<TooltipContext> = Symbol("tooltip");
export function useTooltip() {
  const context = inject(tooltipKey);
  if (!context)
    throw new Error("Tooltip parts must be rendered inside Tooltip");
  return context;
}

type Session = {
  mode: "keyboard" | "pointer";
  closedAt: number;
  owner?: { close(): void };
};
const sessions = new WeakMap<Document, Session>();
function sessionFor(document: Document) {
  let session = sessions.get(document);
  if (!session) {
    session = { mode: "keyboard", closedAt: 0 };
    sessions.set(document, session);
  }
  return session;
}
export function createTooltip(
  props: Readonly<TooltipRootProps>,
  emit: (...args: any[]) => void,
  id: string,
  initialEmpty = false,
): TooltipContext {
  const timing = inject(
    timingKey,
    computed(() => ({ delay: 120, closeDelay: 0, skipDelay: 300 })),
  );
  const requested = useControllable(
    props,
    "open",
    emit,
    props.defaultOpen ?? false,
  );
  const anchor = ref<TooltipAnchor | null>(null);
  const floating = ref<HTMLElement | null>(null);
  const cursor = ref<TooltipPoint | null>(null);
  const empty = ref(initialEmpty);
  const open = computed(
    () => requested.value && !props.disabled && !empty.value,
  );
  const layer = useFloatingLayer(open, floating);
  let documentScope: Document | undefined;
  let session: Session | undefined;
  let mounted = false;
  let disposed = false;
  let epoch = 0;
  let waitingToShow = false;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  let detachAnchor: (() => void) | undefined;
  let detachCorridor: (() => void) | undefined;
  const self = { close };
  function cancelTimers() {
    ++epoch;
    for (const timer of timers) clearTimeout(timer);
    timers.clear();
    waitingToShow = false;
  }
  function cancelCorridor() {
    detachCorridor?.();
    detachCorridor = undefined;
  }
  function later(task: () => void, delay: number) {
    const version = epoch;
    const timer = setTimeout(() => {
      timers.delete(timer);
      if (!disposed && version === epoch) task();
    }, delay);
    timers.add(timer);
  }
  function commit(next: boolean) {
    if (requested.value === next) return;
    requested.value = next;
    emit("openChange", next);
  }
  function close() {
    cancelTimers();
    cancelCorridor();
    if (session && open.value) session.closedAt = Date.now();
    if (session?.owner === self) session.owner = undefined;
    commit(false);
  }
  function show() {
    cancelTimers();
    cancelCorridor();
    if (
      disposed ||
      props.disabled ||
      empty.value ||
      anchor.value?.matches(':disabled,[aria-disabled="true"]')
    )
      return;
    if (session?.owner !== self) session?.owner?.close();
    if (session) session.owner = self;
    commit(true);
  }
  function hover() {
    cancelTimers();
    if (open.value || props.disabled || empty.value) return;
    const delay =
      session && Date.now() - session.closedAt < timing.value.skipDelay
        ? 0
        : (props.delay ?? timing.value.delay);
    if (delay <= 0) show();
    else {
      waitingToShow = true;
      later(show, delay);
    }
  }
  function hide() {
    cancelTimers();
    const delay = props.closeDelay ?? timing.value.closeDelay;
    if (delay > 0) later(close, delay);
    else close();
  }
  function bridge(
    event: PointerEvent,
    source: Element,
    destination: Element | null,
  ) {
    cancelCorridor();
    if (!destination || !documentScope) {
      hide();
      return;
    }
    const from = source.getBoundingClientRect();
    const to = destination.getBoundingClientRect();
    const polygon = graceArea({ x: event.clientX, y: event.clientY }, to);
    const track = (event: PointerEvent) => {
      const point = { x: event.clientX, y: event.clientY };
      if (
        !inBox(point, from) &&
        !inBox(point, to) &&
        !inPolygon(point, polygon)
      )
        hide();
    };
    const document = documentScope;
    document.addEventListener("pointermove", track);
    detachCorridor = () => document.removeEventListener("pointermove", track);
  }
  function bind(element: TooltipAnchor | null) {
    detachAnchor?.();
    detachAnchor = undefined;
    if (!mounted || !element || props.anchorRef) return;
    let pressed:
      { type: string; opened: boolean; x: number; y: number } | undefined;
    let suppressHover = false;
    let keyboardFocus = false;
    const updateCursor = (event: PointerEvent) => {
      if (props.followCursor)
        cursor.value = { x: event.clientX, y: event.clientY };
    };
    const events: Record<string, EventListener> = {
      pointerenter: (raw) => {
        const event = raw as PointerEvent;
        if (event.pointerType === "touch") return;
        updateCursor(event);
        cancelCorridor();
        if (!suppressHover) hover();
        else cancelTimers();
      },
      pointerleave: (raw) => {
        const event = raw as PointerEvent;
        if (event.pointerType === "touch") return;
        suppressHover = false;
        cursor.value = null;
        if (keyboardFocus) return;
        if (waitingToShow) {
          cancelTimers();
          return;
        }
        if (open.value && !props.followCursor)
          bridge(event, element, floating.value);
        else hide();
      },
      pointerdown: (raw) => {
        const event = raw as PointerEvent;
        pressed = {
          type: event.pointerType,
          opened: open.value,
          x: event.clientX,
          y: event.clientY,
        };
        updateCursor(event);
        if (event.pointerType === "mouse") {
          suppressHover = true;
          close();
        }
      },
      pointermove: (raw) => {
        const event = raw as PointerEvent;
        updateCursor(event);
        if (
          pressed &&
          Math.hypot(event.clientX - pressed.x, event.clientY - pressed.y) > 8
        )
          pressed = undefined;
      },
      pointercancel: () => {
        pressed = undefined;
        cursor.value = null;
      },
      click: () => {
        const gesture = pressed;
        pressed = undefined;
        if (gesture && gesture.type !== "mouse")
          gesture.opened ? close() : show();
      },
      keydown: () => {
        pressed = undefined;
        cursor.value = null;
      },
      focusin: () => {
        if (session?.mode === "keyboard") {
          keyboardFocus = true;
          cursor.value = null;
          show();
        }
      },
      focusout: (raw) => {
        if (
          !element.contains((raw as FocusEvent).relatedTarget as Node | null)
        ) {
          keyboardFocus = false;
          close();
        }
      },
    };
    for (const [name, listener] of Object.entries(events))
      element.addEventListener(name, listener);
    const observer =
      typeof MutationObserver === "undefined"
        ? undefined
        : new MutationObserver(() => {
            if (element.matches(':disabled,[aria-disabled="true"]')) close();
          });
    observer?.observe(element, {
      attributes: true,
      attributeFilter: ["disabled", "aria-disabled"],
    });
    detachAnchor = () => {
      observer?.disconnect();
      for (const [name, listener] of Object.entries(events))
        element.removeEventListener(name, listener);
    };
  }
  watch(anchor, bind, { flush: "post" });
  watch(
    () => props.anchorRef,
    (external) => {
      if (external)
        anchor.value = resolveElement<TooltipAnchor>(
          "value" in external ? external.value : external,
        );
    },
    { immediate: true, deep: true },
  );
  watch(
    () => [props.disabled, empty.value],
    () => {
      if (props.disabled || (empty.value && !props.anchorRef)) close();
    },
  );
  watch(open, (visible) => {
    if (!session) return;
    if (visible) {
      if (session.owner !== self) session.owner?.close();
      session.owner = self;
    } else if (session.owner === self) {
      session.closedAt = Date.now();
      session.owner = undefined;
    }
  });
  const keyboard = (event: KeyboardEvent) => {
    if (session) session.mode = "keyboard";
    if (layer.claimEscape(event)) close();
  };
  const pointer = (event: PointerEvent) => {
    if (session) session.mode = "pointer";
    if (
      open.value &&
      !layer.containsHigher(event.target) &&
      event.target instanceof Node &&
      !anchor.value?.contains(event.target) &&
      !floating.value?.contains(event.target)
    )
      close();
  };
  const scroll = () => {
    if (props.followCursor && cursor.value) close();
  };
  onMounted(() => {
    mounted = true;
    documentScope = anchor.value?.ownerDocument ?? document;
    session = sessionFor(documentScope);
    documentScope.addEventListener("keydown", keyboard, true);
    documentScope.addEventListener("pointerdown", pointer, true);
    window.addEventListener("blur", close);
    window.addEventListener("scroll", scroll, true);
    bind(anchor.value);
    if (open.value) {
      session.owner?.close();
      session.owner = self;
    }
  });
  onBeforeUnmount(() => {
    disposed = true;
    mounted = false;
    cancelTimers();
    cancelCorridor();
    detachAnchor?.();
    if (session?.owner === self) session.owner = undefined;
    documentScope?.removeEventListener("keydown", keyboard, true);
    documentScope?.removeEventListener("pointerdown", pointer, true);
    window.removeEventListener("blur", close);
    window.removeEventListener("scroll", scroll, true);
  });
  return {
    open,
    id,
    labelId: id + "-label",
    props,
    anchor,
    floating,
    cursor,
    empty,
    setTrigger: (value) => {
      if (!props.anchorRef) anchor.value = resolveElement<TooltipAnchor>(value);
    },
    setEmpty: (value) => {
      empty.value = value;
    },
    close,
    enterContent: () => {
      cancelCorridor();
      cancelTimers();
    },
    leaveContent: (event) => {
      if (props.anchorRef) {
        cancelTimers();
        later(close, 100);
      } else if (floating.value) bridge(event, floating.value, anchor.value);
    },
  };
}
