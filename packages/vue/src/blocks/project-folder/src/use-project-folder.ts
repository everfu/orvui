import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import {
  resolveElement,
  useMediaQuery,
  useReducedMotion,
} from "../../../lib/composables";
import { useControllable, useDialog, type Content } from "../../shared";
export interface Preview {
  id: string;
  content: Content;
}
interface Props {
  title: string;
  description: string;
  previews: Preview[];
  count?: number;
  itemLabel: string;
  open?: boolean;
  defaultOpen: boolean;
  expanded?: boolean;
  defaultExpanded: boolean;
  disabled?: boolean;
}
export function useProjectFolder(
  props: Props,
  events: {
    open: (value: boolean) => void;
    expanded: (value: boolean) => void;
    click: () => void;
  },
) {
  const open = useControllable(
      () => props.open,
      props.defaultOpen,
      events.open,
    ),
    expanded = useControllable(
      () => props.expanded,
      props.defaultExpanded,
      events.expanded,
    ),
    reduce = useReducedMotion();
  const root = ref<HTMLElement>(),
    folder = ref<unknown>(),
    closeButton = ref<HTMLButtonElement>(),
    closing = ref(false),
    id = useId();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)"),
    isOpen = computed(() => open.value || expanded.value),
    previews = computed(() => props.previews.slice(0, 5));
  const countText = computed(() => {
    const count = props.count ?? props.previews.length;
    return `${count} ${props.itemLabel}${count === 1 ? "" : "s"}`;
  });
  let hovered = false,
    focused = false,
    restoring = false,
    disposed = false,
    timer: ReturnType<typeof setTimeout> | undefined;
  useDialog(expanded, root, () => closeButton.value);
  function setOpen(value: boolean) {
    if (!props.disabled) open.value = value;
  }
  function expand() {
    if (props.disabled) return;
    closing.value = false;
    if (previews.value.length) expanded.value = true;
    setOpen(true);
    events.click();
  }
  function finishClose() {
    clearTimeout(timer);
    closing.value = false;
    const trigger = resolveElement<HTMLElement>(folder.value);
    if (trigger && document.activeElement !== trigger) {
      restoring = true;
      void nextTick(() => {
        if (!disposed) trigger.focus();
      });
    }
  }
  function closingTransition() {
    restoring = true;
    closing.value = true;
    setOpen(false);
    clearTimeout(timer);
    timer = setTimeout(finishClose, reduce.value ? 0 : 1000);
  }
  function close() {
    if (props.disabled) return;
    closingTransition();
    expanded.value = false;
  }
  watch(expanded, (value, previous) => {
    if (previous && !value && !closing.value) closingTransition();
  });
  function enter() {
    if (canHover.value) {
      hovered = true;
      setOpen(true);
    }
  }
  function leave() {
    if (canHover.value) {
      hovered = false;
      if (!expanded.value && !closing.value) setOpen(focused);
    }
  }
  function focus() {
    if (restoring) {
      restoring = false;
      focused = false;
    } else {
      focused = true;
      setOpen(true);
    }
  }
  function blur() {
    focused = false;
    if (!expanded.value && !closing.value) setOpen(hovered);
  }
  function transform(index: number) {
    const offset = index - (previews.value.length - 1) / 2,
      distance = Math.abs(offset);
    const base = {
      x: offset * 44,
      y: 8 - Math.max(0, 2 - distance) * 8,
      rotate: offset * 6,
      scale: distance === 0 ? 1.04 : distance === 1 ? 0.95 : 0.88,
      opacity: distance === 0 ? 1 : distance === 1 ? 0.78 : 0.58,
    };
    return isOpen.value && !reduce.value
      ? {
          x: base.x * 1.4,
          y: base.y - 8,
          rotate: base.rotate * 1.3,
          scale: base.scale * 1.02,
          opacity: Math.min(1, base.opacity + 0.18),
        }
      : base;
  }
  onBeforeUnmount(() => {
    disposed = true;
    clearTimeout(timer);
  });
  return {
    open,
    expanded,
    reduce,
    root,
    folder,
    closeButton,
    closing,
    id,
    isOpen,
    previews,
    countText,
    expand,
    close,
    finishClose,
    enter,
    leave,
    focus,
    blur,
    transform,
  };
}
