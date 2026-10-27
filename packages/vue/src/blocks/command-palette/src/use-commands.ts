import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
} from "vue";
import { useDialog } from "../../shared";
import { useSearchCursor } from "../../search-cursor";
import { searchCommands } from "./search";
import type { CommandItem } from "./CommandPalette.vue";
export function useCommands(
  options: { items: CommandItem[]; shortcut: string },
  open: Ref<boolean>,
  selected: (item: CommandItem) => void,
) {
  const query = ref(""),
    root = ref<HTMLElement>(),
    input = ref<HTMLInputElement>(),
    list = ref<HTMLDivElement>();
  const matches = computed(() =>
    searchCommands(
      options.items.filter((item) => !item.disabled),
      query.value,
    ),
  );
  const grouped = computed(() => {
    const groups = new Map<string, CommandItem[]>();
    for (const item of matches.value) {
      const name = item.group ?? "Results";
      const members = groups.get(name);
      if (members) members.push(item);
      else groups.set(name, [item]);
    }
    return [...groups];
  });
  const rows = computed(() => grouped.value.flatMap(([, items]) => items));
  const hasIcons = computed(() => options.items.some((item) => item.icon));
  const { active, moveTo, moveActive } = useSearchCursor(rows, query);
  watch(open, (visible) => {
    if (visible) {
      query.value = "";
      moveTo(null);
    }
  });
  watch([active, open], () => {
    if (open.value)
      void nextTick(() =>
        list.value
          ?.querySelector<HTMLElement>(`[data-index="${active.value}"]`)
          ?.scrollIntoView?.({ block: "nearest" }),
      );
  });
  useDialog(open, root, () => input.value);
  function select(item?: CommandItem) {
    if (!item) return;
    item.onSelect?.();
    selected(item);
    open.value = false;
  }
  function keydown(event: KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(event.key === "ArrowDown" ? 1 : -1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      select(rows.value[active.value]);
    }
  }
  function shortcut(event: KeyboardEvent) {
    if (
      (event.metaKey || event.ctrlKey) &&
      event.key.toLowerCase() === options.shortcut.toLowerCase()
    ) {
      event.preventDefault();
      open.value = !open.value;
    }
  }
  onMounted(() => window.addEventListener("keydown", shortcut));
  onBeforeUnmount(() => window.removeEventListener("keydown", shortcut));
  return {
    query,
    root,
    input,
    list,
    grouped,
    rows,
    hasIcons,
    active,
    moveTo,
    select,
    keydown,
  };
}
