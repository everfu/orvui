import {
  computed, inject, nextTick, onBeforeUnmount, onMounted, ref, shallowRef,
  useId, watch, type InjectionKey, type Ref,
} from "vue";
import { useMotionState } from "../state";
import { useFloatingLayer, useReducedMotion } from "../../lib/composables";

export interface SearchItem {
  value: string;
  label: string;
  keywords: string[];
  disabled: boolean;
  groupId?: string;
  id: string;
  element: HTMLElement | null;
}
export type SearchController = ReturnType<typeof createSearchController>;
export const ComboboxContext: InjectionKey<SearchController> = Symbol("orvui-combobox");
export const MultiSelectContext: InjectionKey<SearchController> = Symbol("orvui-multi-select");
export const ComboboxGroupContext: InjectionKey<string> = Symbol("orvui-combobox-group");
export const MultiSelectGroupContext: InjectionKey<string> = Symbol("orvui-multi-select-group");

export function useSearchContext(multiple = false, name = "Component") {
  const controller = inject(multiple ? MultiSelectContext : ComboboxContext);
  if (!controller) throw new Error(`${name} must be used inside ${multiple ? "MultiSelect" : "Combobox"}`);
  return controller;
}
export function useMultiSelectContext(name = "Component") {
  return useSearchContext(true, name);
}
export function mergeRefs<T>(...destinations: (Ref<T | null> | ((value: T | null) => void) | undefined)[]) {
  return (element: T | null) => {
    destinations.forEach(destination => {
      if (typeof destination === "function") destination(element);
      else if (destination) destination.value = element;
    });
  };
}

function folded(text: string) { return text.toLocaleLowerCase().trim(); }
function subsequence(text: string, query: string) {
  let cursor = 0;
  for (const letter of query) {
    const index = text.indexOf(letter, cursor);
    if (index < 0) return false;
    cursor = index + 1;
  }
  return true;
}
function sameItem(first: SearchItem | undefined, second: SearchItem) {
  if (!first) return false;
  return first.value === second.value && first.label === second.label
    && first.id === second.id && first.element === second.element
    && first.disabled === second.disabled && first.groupId === second.groupId
    && first.keywords.length === second.keywords.length
    && first.keywords.every((word, index) => word === second.keywords[index]);
}

export function createSearchController(props: Record<string, any>, emit: (...args: any[]) => void, multiple = false) {
  const value = useMotionState<string | string[] | undefined>(props, emit, "modelValue", props.defaultValue ?? (multiple ? [] : undefined));
  const open = useMotionState<boolean>(props, emit, "open", props.defaultOpen ?? false);
  const query = useMotionState<string>(props, emit, "query", props.defaultQuery ?? "");
  const id = useId();
  const triggerId = `${id}-trigger`, inputId = `${id}-input`, listId = `${id}-list`, activeLayoutId = `${id}-active`;
  const inputRef = ref<HTMLInputElement | null>(null);
  const triggerRef = ref<HTMLElement | null>(null);
  const contentRef = ref<HTMLElement | null>(null);
  const items = shallowRef(new Map<string, SearchItem>());
  const layer = useFloatingLayer(open, contentRef);
  const reduce = useReducedMotion();
  const disabled = computed(() => !!props.disabled);
  const visited = ref(open.value);
  const exitQuery = ref(query.value);
  const cursor = ref<{ key: string; query: string } | null>(null);
  const visibleQuery = computed(() => open.value ? query.value : exitQuery.value);
  let disposed = false;

  function isVisible(key: string): boolean {
    const option = items.value.get(key);
    if (!option) return true;
    const search = folded(visibleQuery.value);
    if (props.filter) return props.filter(key, search, [option.label, ...option.keywords]);
    return subsequence(folded([key, option.label, ...option.keywords].join(" ")), search);
  }
  const visible = computed(() => [...items.value.values()].filter(option => isVisible(option.value)));
  const available = computed(() => visible.value.filter(option => !option.disabled));
  const activeValue = computed(() => {
    if (!visited.value) return null;
    const choice = cursor.value;
    if (choice?.query === visibleQuery.value && available.value.some(option => option.value === choice.key)) return choice.key;
    const selected = multiple ? (value.value as string[] | undefined)?.[0] : value.value;
    return available.value.find(option => option.value === selected)?.value ?? available.value[0]?.value ?? null;
  });
  const activeItemId = computed(() => activeValue.value === null ? undefined : items.value.get(activeValue.value)?.id);
  function registerItem(option: SearchItem) {
    if (sameItem(items.value.get(option.value), option)) return;
    items.value = new Map([...items.value, [option.value, option]]);
  }
  function unregisterItem(key: string) {
    if (!items.value.has(key)) return;
    const remaining = new Map(items.value);
    remaining.delete(key);
    items.value = remaining;
  }
  function focusInput() {
    void nextTick(() => { if (!disposed) inputRef.value?.focus({ preventScroll: true }); });
  }
  function setOpen(requested: boolean, restoreFocus = false) {
    if (requested && disabled.value) return;
    if (requested) {
      visited.value = true;
      open.value = true;
      focusInput();
      return;
    }
    exitQuery.value = query.value;
    open.value = false;
    query.value = "";
    if (restoreFocus) focusInput();
  }
  function setActiveValue(key: string | null) {
    cursor.value = key === null ? null : { key, query: visibleQuery.value };
  }
  function moveActive(direction: 1 | -1 | "first" | "last") {
    if (!open.value) return;
    const choices = available.value;
    if (!choices.length) { cursor.value = null; return; }
    const index = choices.findIndex(option => option.value === activeValue.value);
    const destination = direction === "first" ? 0 : direction === "last" ? choices.length - 1 : (index + direction + choices.length) % choices.length;
    setActiveValue(choices[destination]!.value);
  }
  function remove(key: string) {
    if (!disabled.value) value.value = ((value.value ?? []) as string[]).filter(selected => selected !== key);
  }
  function select(key: string) {
    if (disabled.value || items.value.get(key)?.disabled) return;
    if (!multiple) {
      value.value = key;
      setOpen(false, true);
      return;
    }
    const selected = (value.value ?? []) as string[];
    value.value = selected.includes(key) ? selected.filter(entry => entry !== key) : [...selected, key];
    query.value = "";
    focusInput();
  }
  function keydown(event: KeyboardEvent) {
    if (event.defaultPrevented || disabled.value) return;
    if (event.key === "Escape") {
      if (layer.claimEscape(event)) setOpen(false, true);
      return;
    }
    switch (event.key) {
      case "ArrowUp": case "ArrowDown":
        event.preventDefault();
        if (open.value) moveActive(event.key === "ArrowDown" ? 1 : -1);
        else setOpen(true);
        break;
      case "Home": case "End":
        if (!open.value) break;
        event.preventDefault();
        moveActive(event.key === "Home" ? "first" : "last");
        break;
      case "Enter":
        event.preventDefault();
        if (!open.value) setOpen(true);
        else if (activeValue.value !== null) select(activeValue.value);
        break;
      case "Backspace": {
        const selected = value.value as string[] | undefined;
        if (multiple && !query.value && selected?.length) {
          event.preventDefault();
          remove(selected[selected.length - 1]!);
        }
        break;
      }
    }
  }
  function outside(event: Event) {
    if (!open.value || layer.containsHigher(event.target)) return;
    const target = event.target as Node | null;
    if (target && !triggerRef.value?.contains(target) && !contentRef.value?.contains(target)) setOpen(false);
  }
  function escape(event: KeyboardEvent) {
    if (layer.claimEscape(event)) setOpen(false, true);
  }
  function setQuery(requested: string) {
    query.value = requested;
    void nextTick(() => {
      if (disposed || !inputRef.value) return;
      const key = value.value as string | undefined;
      inputRef.value.value = multiple || open.value ? query.value : key === undefined ? "" : (items.value.get(key)?.label ?? key);
    });
  }
  watch([visibleQuery, available], () => {
    if (cursor.value && (cursor.value.query !== visibleQuery.value || !available.value.some(option => option.value === cursor.value!.key))) cursor.value = null;
  }, { flush: "sync" });
  watch(open, opened => {
    if (opened) { visited.value = true; focusInput(); }
    else { exitQuery.value = query.value; query.value = ""; }
  }, { flush: "sync" });
  watch(query, search => { if (open.value) exitQuery.value = search; }, { flush: "sync" });
  watch(activeItemId, () => void nextTick(() => {
    if (disposed || !open.value || activeValue.value === null) return;
    const row = items.value.get(activeValue.value)?.element;
    const viewport = contentRef.value?.querySelector<HTMLElement>("[role=listbox]");
    if (!row || !viewport) return;
    const itemBounds = row.getBoundingClientRect(), viewBounds = viewport.getBoundingClientRect();
    const adjustment = itemBounds.top < viewBounds.top ? itemBounds.top - viewBounds.top : itemBounds.bottom > viewBounds.bottom ? itemBounds.bottom - viewBounds.bottom : 0;
    viewport.scrollTop += adjustment;
  }), { flush: "post" });
  onMounted(() => {
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("keydown", escape);
  });
  onBeforeUnmount(() => {
    disposed = true;
    document.removeEventListener("pointerdown", outside);
    document.removeEventListener("focusin", outside);
    document.removeEventListener("keydown", escape);
  });
  return {
    value, values: computed(() => (value.value ?? []) as string[]), open, query,
    disabled, reduce, triggerId, inputId, listId, activeLayoutId, inputRef, triggerRef,
    contentRef, items, activeValue, activeItemId, visibleCount: computed(() => visible.value.length),
    isVisible, hasVisibleItems: (groupId: string) => visible.value.some(option => option.groupId === groupId),
    labelFor: (key?: string) => key === undefined ? undefined : (items.value.get(key)?.label ?? key),
    registerItem, unregisterItem, setOpen, setQuery, setActiveValue, moveActive, select, remove, focusInput, keydown,
  };
}
