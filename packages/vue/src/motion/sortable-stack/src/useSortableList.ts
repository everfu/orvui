import { computed } from "vue";
import { sortableContext } from "./context";
export function useSortableList() {
  const list = sortableContext("useSortableList");
  return { ids: list.ids, disabled: computed(() => !!list.props.disabled), canUndo: list.canUndo, moveItem: list.move, undo: list.undo };
}
