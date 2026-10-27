import { useBlockDismiss } from "./dismiss";
import { resolveElement, useOverlay } from "../lib/composables";
import {
  computed,
  defineComponent,
  h,
  isVNode,
  onMounted,
  onUnmounted,
  ref,
  type Component,
  type Ref,
  type VNodeChild,
} from "vue";

export type Content = VNodeChild | Component;
export const RenderNode = defineComponent({
  props: ["node"],
  setup(props) {
    return () => {
      const node = props.node;
      if (isVNode(node) || node === null || node === undefined) return node;
      if (typeof node === "function" || typeof node === "object")
        return h(node as Component);
      return node;
    };
  },
});

export function useControllable<T>(
  get: () => T | undefined,
  initial: T,
  emit: (value: T) => void,
) {
  const saved = ref(initial) as Ref<T>;
  return computed<T>({
    get() {
      const value = get();
      return value === undefined ? saved.value : value;
    },
    set(value) {
      if (get() === undefined) saved.value = value;
      emit(value);
    },
  });
}

export function useOutside(
  root: Ref<HTMLElement | undefined>,
  close: () => void,
  open: Ref<boolean>,
) {
  useBlockDismiss(open, root, close);
}

export function useReduced() {
  const reduced = ref(false);
  let detach: (() => void) | undefined;
  onMounted(() => {
    if (typeof matchMedia !== "function") return;
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => {
      reduced.value = query.matches;
    };
    read();
    query.addEventListener("change", read);
    detach = () => query.removeEventListener("change", read);
  });
  onUnmounted(() => detach?.());
  return reduced;
}

export function rove(
  event: KeyboardEvent,
  root: HTMLElement,
  selector = "button:not(:disabled)",
) {
  const items = [...root.querySelectorAll<HTMLElement>(selector)];
  if (!items.length) return;
  const current = items.indexOf(
    root.ownerDocument.activeElement as HTMLElement,
  );
  let destination: number;
  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      destination = (current + 1) % items.length;
      break;
    case "ArrowLeft":
    case "ArrowUp":
      destination = (current - 1 + items.length) % items.length;
      break;
    case "Home":
      destination = 0;
      break;
    case "End":
      destination = items.length - 1;
      break;
    default:
      return;
  }
  event.preventDefault();
  items[destination]?.focus();
}

export function useDialog(
  open: Ref<boolean>,
  root: Ref<HTMLElement | undefined>,
  initial?: () => HTMLElement | undefined,
) {
  const element = computed(() => resolveElement<HTMLElement>(root.value));
  useOverlay(
    open,
    element,
    () => {
      open.value = false;
    },
    initial,
  );
}
