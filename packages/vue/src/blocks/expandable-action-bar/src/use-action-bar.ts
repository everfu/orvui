import { computed, onBeforeUnmount, ref, watch, type Ref } from "vue";
import { useBlockDismiss } from "../../dismiss";
import { rove } from "../../shared";
import type { ExpandableActionBarItem } from "./ExpandableActionBar.vue";
type Options = {
  items: ExpandableActionBarItem[];
  activeId?: string;
  expandOnHover: boolean;
  expandOnFocus: boolean;
  collapseDelay: number;
};
export function useActionBar(
  options: Options,
  expanded: Ref<boolean>,
  track: Ref<unknown>,
  selected: (item: ExpandableActionBarItem) => void,
) {
  const hovered = ref<string | null>(null),
    touchExpanded = ref(false);
  const contacts = new Set<number>();
  let gesture: { pointerType: string; wasExpanded: boolean } | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const highlightId = computed(
    () =>
      hovered.value ??
      options.activeId ??
      options.items.find((item) => item.active)?.id,
  );
  function cancel() {
    clearTimeout(timer);
    timer = undefined;
  }
  function open() {
    cancel();
    expanded.value = true;
  }
  function collapse() {
    cancel();
    expanded.value = false;
    hovered.value = null;
    touchExpanded.value = false;
  }
  function close() {
    cancel();
    timer = setTimeout(collapse, options.collapseDelay);
  }
  function hovering(event: PointerEvent) {
    if (event.pointerType !== "touch" && event.buttons === 0) {
      contacts.delete(event.pointerId);
      return true;
    }
    contacts.add(event.pointerId);
    return false;
  }
  function enter(event: PointerEvent) {
    if (hovering(event) && options.expandOnHover) open();
  }
  function leave(event: PointerEvent) {
    const contact = contacts.delete(event.pointerId);
    if (contact || event.pointerType === "touch") return;
    hovered.value = null;
    if (options.expandOnHover) close();
  }
  function itemEnter(event: PointerEvent, item: ExpandableActionBarItem) {
    if (hovering(event)) {
      cancel();
      hovered.value = item.id;
    }
  }
  function start(event: PointerEvent) {
    gesture = { pointerType: event.pointerType, wasExpanded: expanded.value };
  }
  function resetGesture() {
    gesture = null;
  }
  function run(event: MouseEvent, item: ExpandableActionBarItem) {
    if (item.disabled) return;
    (event.currentTarget as HTMLButtonElement).blur();
    const activation = gesture;
    gesture = null;
    if (
      activation &&
      activation.pointerType !== "mouse" &&
      !activation.wasExpanded &&
      !touchExpanded.value &&
      options.expandOnHover
    ) {
      touchExpanded.value = true;
      open();
      hovered.value = item.id;
      return;
    }
    item.onClick?.();
    selected(item);
  }
  function keydown(event: KeyboardEvent) {
    resetGesture();
    if (event.key === "Escape") collapse();
    else rove(event, event.currentTarget as HTMLElement);
  }
  function blur(event: FocusEvent) {
    if (
      options.expandOnFocus &&
      !(event.currentTarget as HTMLElement).contains(
        event.relatedTarget as Node,
      )
    )
      close();
  }
  watch(expanded, (value, previous) => {
    if (previous && !value) touchExpanded.value = false;
  });
  useBlockDismiss(
    computed(() => touchExpanded.value && expanded.value),
    track,
    close,
    true,
  );
  onBeforeUnmount(() => {
    cancel();
    contacts.clear();
  });
  return {
    highlightId,
    enter,
    leave,
    itemEnter,
    start,
    resetGesture,
    run,
    keydown,
    blur,
    open,
  };
}
