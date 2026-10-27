export { default as ExpandableActionBar } from "./src/ExpandableActionBar.vue";
export type { ExpandableActionBarItem } from "./src/ExpandableActionBar.vue";
import { ref, computed, toValue, type MaybeRefOrGetter } from "vue";
import type { ExpandableActionBarItem } from "./src/ExpandableActionBar.vue";
export function useExpandableActionBar(
  items: MaybeRefOrGetter<ExpandableActionBarItem[]>,
) {
  const expanded = ref(false);
  const activeId = ref(toValue(items)[0]?.id);
  const activeItem = computed(() =>
    toValue(items).find((item) => item.id === activeId.value),
  );
  return {
    expanded,
    setExpanded: (value: boolean) => (expanded.value = value),
    activeId,
    setActiveId: (value: string) => (activeId.value = value),
    activeItem,
  };
}

export type * from "./src/api-types";

export type * from "./src/source-types";
