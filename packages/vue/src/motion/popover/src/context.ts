import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useId,
  watch,
  type InjectionKey,
  type Ref,
} from "vue";
import { animate, motionValue } from "motion-v";
import {
  resolveElement,
  useFloatingLayer,
  useReducedMotion,
} from "../../../lib/composables";
import type { Side, Align } from "./geometry";
export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  trigger?: "click" | "hover";
  side?: Side;
  align?: Align;
  sideOffset?: number;
  panelRadius?: number;
  gooStrength?: number;
  className?: string;
}
export const GOO_OPEN_SPRING = {
  type: "spring",
  visualDuration: 0.3,
  bounce: 0.15,
} as const;
export const GOO_CLOSE_SPRING = {
  type: "spring",
  visualDuration: 0.21,
  bounce: 0.15,
} as const;
/** A dragged contact is never interpreted as a hovering pointer departure. */
export function hoverGesture() {
  const dragging = new Map<number, boolean>();
  return {
    enter(event: PointerEvent) {
      const hover = event.pointerType !== "touch" && event.buttons === 0;
      dragging.set(event.pointerId, !hover);
      return hover;
    },
    leave(event: PointerEvent) {
      const dragged = dragging.get(event.pointerId);
      dragging.delete(event.pointerId);
      return event.pointerType !== "touch" && !dragged;
    },
  };
}
export function createPopover(
  props: PopoverProps,
  emit: (event: any, ...args: any[]) => void,
  kind: "goo" | "morph" = "goo",
) {
  const id = useId().replace(/[^\w-]/g, "");
  const root = ref<HTMLElement | null>(null);
  const trigger = shallowRef<HTMLElement | null>(null);
  const content = shallowRef<HTMLElement | null>(null);
  const memory = ref(props.defaultOpen ?? false);
  const open = computed({
    get: () => props.open ?? memory.value,
    set: (next: boolean) => {
      if (props.open === undefined) memory.value = next;
      emit("update:open", next);
      emit("openChange", next);
    },
  });
  const anchor = computed(() => trigger.value ?? root.value);
  const reduce = useReducedMotion();
  const progress = motionValue(open.value ? 1 : 0);
  const layer = useFloatingLayer(open, content);
  let mounted = false;
  let disposed = false;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;
  let timerRevision = 0;
  let animation: ReturnType<typeof animate> | undefined;
  let focusIntent = false;
  let clearIntent: (() => void) | undefined;
  const cancelClose = () => {
    ++timerRevision;
    clearTimeout(closeTimer);
    closeTimer = undefined;
  };
  const setOpen = (next: boolean) => {
    open.value = next;
  };
  const toggle = () => {
    open.value = !open.value;
  };
  const openHover = () => {
    cancelClose();
    open.value = true;
  };
  function scheduleClose() {
    cancelClose();
    const version = timerRevision;
    closeTimer = setTimeout(() => {
      if (!disposed && version === timerRevision) open.value = false;
    }, 120);
  }
  function close() {
    cancelClose();
    const current = content.value?.ownerDocument.activeElement;
    const restore = current && content.value?.contains(current);
    open.value = false;
    if (restore)
      (
        trigger.value ??
        (root.value && root.value.tabIndex >= 0 ? root.value : null)
      )?.focus();
  }
  function armFocusOnOpen(armed: boolean) {
    clearIntent?.();
    clearIntent = undefined;
    focusIntent = armed;
    if (!armed || typeof document === "undefined") return;
    const documentScope = anchor.value?.ownerDocument ?? document;
    const cancel = () => {
      focusIntent = false;
      clearIntent?.();
      clearIntent = undefined;
    };
    documentScope.addEventListener("keydown", cancel, true);
    documentScope.addEventListener("pointerdown", cancel, true);
    clearIntent = () => {
      documentScope.removeEventListener("keydown", cancel, true);
      documentScope.removeEventListener("pointerdown", cancel, true);
    };
  }
  function takeFocusOnOpen() {
    const intended = focusIntent;
    armFocusOnOpen(false);
    return intended;
  }
  function animateState() {
    animation?.stop();
    if (!mounted || kind === "morph") return;
    animation = animate(
      progress,
      open.value ? 1 : 0,
      reduce.value
        ? { duration: 0 }
        : open.value
          ? GOO_OPEN_SPRING
          : GOO_CLOSE_SPRING,
    );
  }
  watch([open, reduce], animateState, { flush: "post" });
  const outside = (event: PointerEvent) => {
    if (
      open.value &&
      event.target instanceof Node &&
      !layer.containsHigher(event.target) &&
      !root.value?.contains(event.target) &&
      !content.value?.contains(event.target)
    )
      close();
  };
  const escape = (event: KeyboardEvent) => {
    if (layer.claimEscape(event)) close();
  };
  onMounted(() => {
    mounted = true;
    animateState();
    window.addEventListener("pointerdown", outside, true);
    window.addEventListener("keydown", escape);
  });
  onBeforeUnmount(() => {
    disposed = true;
    mounted = false;
    cancelClose();
    clearIntent?.();
    animation?.stop();
    progress.destroy();
    window.removeEventListener("pointerdown", outside, true);
    window.removeEventListener("keydown", escape);
  });
  return {
    kind,
    p: props,
    root,
    trigger,
    content,
    anchor,
    open,
    progress,
    reduce,
    setOpen,
    toggle,
    close,
    openHover,
    scheduleClose,
    cancelClose,
    armFocusOnOpen,
    takeFocusOnOpen,
    gooId: `${id}-goo`,
    triggerId: `${id}-trigger`,
    contentId: `${id}-content`,
  };
}
export const popoverKey: InjectionKey<ReturnType<typeof createPopover>> =
  Symbol("popover");
export function usePopover() {
  const state = inject(popoverKey);
  if (!state)
    throw Error("Popover parts must be inside Popover or MorphPopover.");
  return state;
}
export type PortalLayout = {
  trigger: { left: number; top: number; width: number; height: number };
  content: { width: number; height: number };
};
export function usePortalPosition(
  anchor: Ref<HTMLElement | null>,
  content: Ref<HTMLElement | null>,
  active: Ref<boolean>,
) {
  const layout = ref<PortalLayout | null>(null);
  let mounted = false;
  let revision = 0;
  let observer: ResizeObserver | undefined;
  let attached = false;
  function update() {
    const source = anchor.value;
    const target = content.value;
    if (!mounted || !source || !target) return;
    const box = source.getBoundingClientRect();
    const next = {
      trigger: {
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height,
      },
      content: { width: target.offsetWidth, height: target.offsetHeight },
    };
    const previous = layout.value;
    if (
      !previous ||
      Object.keys(next.trigger).some(
        (key) =>
          next.trigger[key as keyof typeof next.trigger] !==
          previous.trigger[key as keyof typeof previous.trigger],
      ) ||
      next.content.width !== previous.content.width ||
      next.content.height !== previous.content.height
    )
      layout.value = next;
  }
  function detach() {
    observer?.disconnect();
    observer = undefined;
    if (attached) {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      attached = false;
    }
  }
  async function bind() {
    const version = ++revision;
    detach();
    if (!mounted) return;
    await nextTick();
    if (!mounted || version !== revision) return;
    update();
    if (!active.value) return;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(update);
      if (anchor.value) observer.observe(anchor.value);
      if (content.value) observer.observe(content.value);
    }
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    attached = true;
  }
  watch([active, anchor, content], bind, { flush: "post" });
  onMounted(() => {
    mounted = true;
    void bind();
  });
  onBeforeUnmount(() => {
    mounted = false;
    ++revision;
    detach();
  });
  return layout;
}
