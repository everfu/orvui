import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  ref,
  type Ref,
} from "vue";
import { useBlockDismiss } from "../../dismiss";
export function useStackInteraction(
  expanded: Ref<boolean>,
  root: Ref<unknown>,
  viewAll: () => void,
) {
  const instance = getCurrentInstance();
  const contacts = new Set<number>();
  const touchExpanded = ref(false);
  let focused = false;
  let activation: { type: string; expanded: boolean } | null = null;
  const dismissOpen = computed(() => expanded.value && touchExpanded.value);
  function collapse() {
    touchExpanded.value = false;
    expanded.value = false;
  }
  useBlockDismiss(dismissOpen, root, collapse, true);
  function enter(event: PointerEvent) {
    if (event.pointerType !== "touch" && event.buttons === 0) {
      contacts.delete(event.pointerId);
      expanded.value = true;
    } else contacts.add(event.pointerId);
  }
  function leave(event: PointerEvent) {
    const contact = contacts.delete(event.pointerId);
    if (!contact && event.pointerType !== "touch" && !focused) collapse();
  }
  function start(event: PointerEvent) {
    activation = { type: event.pointerType, expanded: expanded.value };
  }
  function cancel() {
    activation = null;
  }
  function activate() {
    const gesture = activation;
    activation = null;
    const wasExpanded = gesture ? gesture.expanded : expanded.value;
    if (!wasExpanded) {
      if (gesture && gesture.type !== "mouse") touchExpanded.value = true;
      expanded.value = true;
    } else if (instance?.vnode.props?.onViewAll) viewAll();
    else collapse();
  }
  function focus() {
    focused = true;
    expanded.value = true;
  }
  function blur(event: FocusEvent) {
    if (
      !(event.currentTarget as HTMLElement).contains(
        event.relatedTarget as Node,
      )
    ) {
      focused = false;
      collapse();
    }
  }
  function keydown(event: KeyboardEvent) {
    cancel();
    if (event.key === "Escape") {
      event.preventDefault();
      collapse();
    }
  }
  onBeforeUnmount(() => {
    contacts.clear();
    activation = null;
  });
  return { enter, leave, start, cancel, activate, focus, blur, keydown };
}
