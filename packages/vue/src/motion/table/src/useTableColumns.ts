import { computed, onBeforeUnmount, ref, type Ref } from "vue";
import type { TableColumn } from "./types";
export function absoluteColumnWidth(width: string | undefined, rem: number) {
  const value = parseFloat(width ?? "");
  if (!Number.isFinite(value)) return null;
  return width?.endsWith("px")
    ? value
    : width?.endsWith("rem")
      ? value * rem
      : null;
}
export function useTableColumns(
  source: () => TableColumn<any>[],
  headers: Ref<Record<string, HTMLElement | null>>,
  minimum: () => number,
  emit: (event: "columnResize" | "columnOrderChange", ...args: any[]) => void,
) {
  const sequence = ref(source().map((column) => column.key)),
    widths = ref<Record<string, number>>({}),
    dragKey = ref<string | null>(null),
    dropIndex = ref<number | null>(null);
  const ordered = computed(() => {
    const columns = source(),
      byKey = new Map(columns.map((column) => [column.key, column])),
      keys = sequence.value.filter((key) => byKey.has(key)),
      included = new Set(keys);
    for (let index = 0; index < columns.length; index++) {
      const key = columns[index].key;
      if (included.has(key)) continue;
      const previous = index ? keys.indexOf(columns[index - 1].key) : -1;
      keys.splice(
        index === 0 ? 0 : previous < 0 ? index : previous + 1,
        0,
        key,
      );
      included.add(key);
    }
    return keys.map((key) => byKey.get(key)!);
  });
  let resizing: { key: string; x: number; width: number } | undefined,
    capture: { element: HTMLElement; pointer: number } | undefined;
  function grab(event: PointerEvent) {
    capture = {
      element: event.currentTarget as HTMLElement,
      pointer: event.pointerId,
    };
    try {
      capture.element.setPointerCapture(capture.pointer);
    } catch {}
  }
  function release() {
    const pointer = capture;
    capture = undefined;
    if (pointer)
      try {
        pointer.element.releasePointerCapture(pointer.pointer);
      } catch {}
  }
  function begin(event: PointerEvent) {
    if (event.button !== 0) return false;
    event.preventDefault();
    event.stopPropagation();
    return true;
  }
  function snapshot(round: boolean) {
    return Object.fromEntries(
      ordered.value.map((column) => {
        const measured =
          headers.value[column.key]?.getBoundingClientRect().width ?? 0;
        return [
          column.key,
          (round ? Math.round(measured) : measured) || minimum(),
        ];
      }),
    );
  }
  function startResize(key: string, event: PointerEvent) {
    if (!begin(event)) return;
    const measured = snapshot(true),
      next = { ...widths.value };
    for (const column of ordered.value)
      if (next[column.key] == null) next[column.key] = measured[column.key];
    widths.value = next;
    resizing = { key, x: event.clientX, width: next[key] };
    grab(event);
  }
  function moveResize(event: PointerEvent) {
    if (resizing)
      widths.value = {
        ...widths.value,
        [resizing.key]: Math.max(
          minimum(),
          resizing.width + event.clientX - resizing.x,
        ),
      };
  }
  function endResize() {
    const state = resizing;
    resizing = undefined;
    release();
    if (state)
      emit("columnResize", state.key, widths.value[state.key] ?? state.width);
  }
  function startReorder(key: string, event: PointerEvent) {
    if (!begin(event)) return;
    dragKey.value = key;
    grab(event);
  }
  function moveReorder(event: PointerEvent) {
    if (!dragKey.value) return;
    const index = ordered.value.findIndex((column) => {
      const rect = headers.value[column.key]?.getBoundingClientRect();
      return rect ? event.clientX < rect.left + rect.width / 2 : false;
    });
    dropIndex.value = index < 0 ? ordered.value.length : index;
  }
  function commit(keys: string[]) {
    sequence.value = keys;
    emit("columnOrderChange", keys);
  }
  function endReorder() {
    const key = dragKey.value,
      target = dropIndex.value;
    if (key && target !== null) {
      const keys = ordered.value.map((column) => column.key),
        from = keys.indexOf(key);
      if (from >= 0) {
        keys.splice(from, 1);
        keys.splice(target - (from < target ? 1 : 0), 0, key);
        commit(keys);
      }
    }
    dragKey.value = null;
    dropIndex.value = null;
    release();
  }
  function cancel() {
    resizing = undefined;
    dragKey.value = null;
    dropIndex.value = null;
    release();
  }
  function keyboardResize(key: string, direction: -1 | 1) {
    if (!Object.keys(widths.value).length) widths.value = snapshot(false);
    const width = Math.max(
      minimum(),
      (widths.value[key] ?? minimum()) + 10 * direction,
    );
    widths.value = { ...widths.value, [key]: width };
    emit("columnResize", key, width);
  }
  function keyboardReorder(key: string, direction: -1 | 1) {
    const keys = ordered.value.map((column) => column.key),
      from = keys.indexOf(key),
      to = Math.max(0, Math.min(keys.length - 1, from + direction));
    if (from < 0 || from === to) return;
    keys.splice(to, 0, keys.splice(from, 1)[0]);
    commit(keys);
  }
  onBeforeUnmount(cancel);
  return {
    ordered,
    widths,
    dragKey,
    dropIndex,
    startResize,
    moveResize,
    endResize,
    startReorder,
    moveReorder,
    endReorder,
    cancel,
    keyboardResize,
    keyboardReorder,
  };
}
