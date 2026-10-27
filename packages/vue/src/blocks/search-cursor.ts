import { computed, shallowRef, watch, type Ref } from "vue";

export function useSearchCursor<T extends { id: string }>(
  rows: Ref<T[]>,
  query: Ref<string>,
) {
  const selected = shallowRef<{ id: string; query: string } | null>(null);
  const positions = computed(() => {
    const indices = new Map<string, number>();
    rows.value.forEach((row, index) => {
      if (!indices.has(row.id)) indices.set(row.id, index);
    });
    return indices;
  });
  const active = computed(() => {
    const selection = selected.value;
    if (!selection || selection.query !== query.value) return 0;
    return positions.value.get(selection.id) ?? 0;
  });
  watch(
    [positions, query],
    () => {
      const selection = selected.value;
      if (
        selection &&
        (selection.query !== query.value || !positions.value.has(selection.id))
      )
        selected.value = null;
    },
    { flush: "sync" },
  );
  function moveTo(id: string | null) {
    selected.value = id === null ? null : { id, query: query.value };
  }
  function moveActive(direction: 1 | -1) {
    const values = rows.value;
    if (!values.length) return;
    const next = Math.max(
      0,
      Math.min(values.length - 1, active.value + direction),
    );
    moveTo(values[next].id);
  }
  return { active, moveTo, moveActive };
}
