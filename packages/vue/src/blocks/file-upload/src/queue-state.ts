import { computed, ref, type Ref } from "vue";
export function useUploadList<T>(
  model: () => T[] | undefined,
  legacy: () => T[] | undefined,
  initial: T[],
  changed: (items: T[]) => void,
) {
  const local = ref(initial) as Ref<T[]>;
  const items = computed(() => model() ?? legacy() ?? local.value);
  function commit(next: T[]) {
    if (model() === undefined && legacy() === undefined) local.value = next;
    changed(next);
  }
  return { items, commit };
}
export function acceptsUpload(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase(),
    mime = file.type.toLowerCase();
  for (const token of accept.split(",")) {
    const rule = token.trim().toLowerCase();
    if (
      rule.startsWith(".")
        ? name.endsWith(rule)
        : rule.endsWith("/*")
          ? mime.startsWith(rule.slice(0, -1))
          : mime === rule
    )
      return true;
  }
  return false;
}
export function useFileDrop(
  disabled: () => boolean,
  full: () => boolean,
  receive: (files: File[]) => void,
) {
  const dragging = ref(false);
  let depth = 0;
  function drag(event: DragEvent, action: "enter" | "over" | "leave" | "drop") {
    if (disabled() || full()) return;
    event.preventDefault();
    if (action === "enter") {
      depth++;
      dragging.value = true;
    } else if (action === "over") {
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      dragging.value = true;
    } else if (action === "leave") {
      depth = Math.max(0, depth - 1);
      if (!depth) dragging.value = false;
    } else {
      depth = 0;
      dragging.value = false;
      receive(Array.from(event.dataTransfer?.files ?? []));
    }
  }
  return { dragging, drag };
}
