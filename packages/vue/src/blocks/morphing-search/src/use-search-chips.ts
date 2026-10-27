import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  useId,
  watch,
} from "vue";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
import { useControllable, type Content } from "../../shared";
import { useBlockDismiss } from "../../dismiss";
import { useSearchCursor } from "../../search-cursor";
export interface SearchChipsOptions {
  chips?: string[];
  defaultChips: string[];
  query?: string;
  defaultQuery: string;
  recents?: string[];
  defaultRecents: string[];
  storageKey?: string;
  maxRecents: number;
  suggestions: string[];
  filter?: ((term: string, query: string) => boolean) | false;
  maxSuggestions: number;
  loading?: boolean;
  maxChips?: number;
  normalize?: (term: string) => string | null;
  emptyState?: Content;
  side: "top" | "bottom" | "auto";
  open?: boolean;
  defaultOpen: boolean;
  disabled?: boolean;
}
interface Row {
  id: string;
  label: string;
  kind: "query" | "recent" | "suggestion";
}
interface Events {
  chips(value: string[]): void;
  query(value: string): void;
  recents(value: string[]): void;
  open(value: boolean): void;
}
const canonical = (value: string) => value.trim().toLowerCase();
const includes = (term: string, query: string) =>
  term.toLowerCase().includes(query.toLowerCase());
export function useSearchChips(props: SearchChipsOptions, events: Events) {
  const chips = useControllable(
    () => props.chips,
    props.defaultChips,
    events.chips,
  );
  const query = useControllable(
    () => props.query,
    props.defaultQuery,
    events.query,
  );
  const openState = useControllable(
    () => props.open,
    props.defaultOpen,
    events.open,
  );
  const localRecents = ref(props.defaultRecents);
  const recents = computed(() => props.recents ?? localRecents.value);
  const open = computed(() => openState.value && !props.disabled);
  const trimmed = computed(() => query.value.trim());
  const marked = ref<string | null>(null);
  const rtl = ref(false);
  const placed = ref<"top" | "bottom">(
    props.side === "bottom" ? "bottom" : "top",
  );
  const root = ref<HTMLElement>();
  const field = ref<unknown>();
  const chipsRow = ref<HTMLElement>();
  const panel = ref<unknown>();
  const rowContainer = ref<HTMLElement>();
  const panelSize = ref({ width: 0, height: 0 });
  const panelFloor = ref(0);
  const announcement = ref({ text: "", count: 0 });
  const reduce = useReducedMotion();
  const id = useId();
  let mounted = false,
    disposed = false;
  const rows = computed<Row[]>(() => {
    const term = trimmed.value;
    if (!term)
      return recents.value.map((label) => ({
        id: `recent:${label}`,
        label,
        kind: "recent",
      }));
    const excluded = new Set([
      term.toLowerCase(),
      ...chips.value.map((value) => value.toLowerCase()),
    ]);
    const matches: Row[] = [];
    const pools = [
      { kind: "recent" as const, terms: recents.value, test: includes },
      {
        kind: "suggestion" as const,
        terms: props.suggestions,
        test: props.filter === false ? () => true : (props.filter ?? includes),
      },
    ];
    for (const pool of pools)
      for (const label of pool.terms) {
        const key = label.toLowerCase();
        if (excluded.has(key) || !pool.test(label, term)) continue;
        excluded.add(key);
        matches.push({ id: `${pool.kind}:${label}`, label, kind: pool.kind });
      }
    return [
      { id: `query:${term}`, label: term, kind: "query" },
      ...matches.slice(0, props.maxSuggestions),
    ];
  });
  const cursor = useSearchCursor(rows, trimmed);
  const active = computed(() => rows.value[cursor.active.value]);
  const panelOpen = computed(
    () =>
      open.value &&
      (!!rows.value.length ||
        !!props.loading ||
        (!trimmed.value && props.emptyState != null)),
  );
  const below = computed(() => placed.value === "bottom");
  const layer = useBlockDismiss(open, root, () => {
    openState.value = false;
  });
  const input = () => resolveElement<HTMLInputElement>(field.value);
  function announce(text: string) {
    announcement.value = { text, count: announcement.value.count + 1 };
  }
  function setRecents(value: string[]) {
    if (props.recents === undefined) localRecents.value = value;
    events.recents(value);
    if (props.storageKey && props.recents === undefined)
      try {
        localStorage.setItem(props.storageKey, JSON.stringify(value));
      } catch {}
  }
  function restore() {
    if (!mounted || !props.storageKey || props.recents !== undefined) return;
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(props.storageKey) ?? "null",
      );
      if (Array.isArray(saved))
        localRecents.value = saved
          .filter((item): item is string => typeof item === "string")
          .slice(0, props.maxRecents);
    } catch {}
  }
  function add(term: string) {
    if (props.disabled) return;
    const value = props.normalize ? props.normalize(term) : term.trim();
    if (!value) return;
    const exists = chips.value.some(
      (chip) => canonical(chip) === canonical(value),
    );
    if (
      !exists &&
      props.maxChips !== undefined &&
      chips.value.length >= props.maxChips
    ) {
      announce(`Up to ${props.maxChips} filters`);
      return;
    }
    if (!exists) {
      chips.value = [...chips.value, value];
      announce(`Added filter ${value}`);
    }
    setRecents(
      [
        value,
        ...recents.value.filter(
          (recent) => canonical(recent) !== canonical(value),
        ),
      ].slice(0, props.maxRecents),
    );
    query.value = "";
  }
  function remove(term: string) {
    chips.value = chips.value.filter((chip) => chip !== term);
    announce(`Removed filter ${term}`);
    input()?.focus();
  }
  function removeRecent(term: string) {
    setRecents(recents.value.filter((recent) => recent !== term));
    announce(`Removed ${term} from recent searches`);
  }
  function stepMark(delta: number) {
    const at =
      marked.value === null
        ? chips.value.length
        : chips.value.indexOf(marked.value);
    const next = at + delta;
    marked.value =
      next >= chips.value.length || !chips.value.length
        ? null
        : chips.value[Math.max(0, next)]!;
  }
  function key(event: KeyboardEvent) {
    if (event.isComposing || event.keyCode === 229) return;
    const field = event.currentTarget as HTMLInputElement;
    const atStart = field.selectionStart === 0 && field.selectionEnd === 0;
    const backward = rtl.value ? "ArrowRight" : "ArrowLeft";
    const forward = rtl.value ? "ArrowLeft" : "ArrowRight";
    if (marked.value !== null) {
      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        const term = marked.value;
        marked.value = null;
        remove(term);
        return;
      }
      if (event.key === backward || event.key === forward) {
        event.preventDefault();
        stepMark(event.key === backward ? -1 : 1);
        return;
      }
      marked.value = null;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    }
    if (event.key === "Escape" && query.value !== "") {
      event.preventDefault();
      event.stopPropagation();
      query.value = "";
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (open.value) cursor.moveActive(event.key === "ArrowDown" ? 1 : -1);
      else openState.value = true;
      return;
    }
    if (event.key === "Enter" && panelOpen.value && active.value) {
      event.preventDefault();
      add(active.value.label);
      return;
    }
    if (
      event.key === "Delete" &&
      panelOpen.value &&
      active.value?.kind === "recent"
    ) {
      event.preventDefault();
      removeRecent(active.value.label);
      return;
    }
    if (atStart && chips.value.length) {
      if (event.key === "Backspace") {
        event.preventDefault();
        marked.value = chips.value.at(-1)!;
        announce(
          `${marked.value} selected. Press Backspace again to remove it.`,
        );
      } else if (event.key === backward) {
        event.preventDefault();
        stepMark(-1);
      }
    }
  }
  function focus(event: PointerEvent) {
    if (props.disabled || (event.target as Element).closest("button,input,a"))
      return;
    event.preventDefault();
    input()?.focus();
    openState.value = true;
  }
  function blur(event: FocusEvent) {
    if (
      root.value?.contains(event.relatedTarget as Node) ||
      layer.containsHigher(event.relatedTarget)
    )
      return;
    marked.value = null;
    openState.value = false;
  }
  let observers: ResizeObserver[] = [];
  function disconnect() {
    for (const observer of observers) observer.disconnect();
    observers = [];
  }
  function observe() {
    disconnect();
    const node = resolveElement<HTMLElement>(panel.value),
      row = rowContainer.value;
    if (disposed || !panelOpen.value || !node || !row) return;
    const measurePanel = () => {
      const width = node.offsetWidth,
        height = node.offsetHeight;
      if (width !== panelSize.value.width || height !== panelSize.value.height)
        panelSize.value = { width, height };
    };
    const measureRows = () => {
      panelFloor.value = Math.max(panelFloor.value, row.offsetHeight + 16);
    };
    measureRows();
    measurePanel();
    if (typeof ResizeObserver !== "undefined") {
      for (const [element, measure] of [
        [node, measurePanel],
        [row, measureRows],
      ] as const) {
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        observers.push(observer);
      }
    }
  }
  watch(
    [() => props.storageKey, () => props.recents, () => props.maxRecents],
    restore,
  );
  watch(open, (value) => {
    if (value) cursor.moveTo(null);
  });
  watch(panelOpen, (value) => {
    if (value) {
      panelFloor.value = 0;
      if (props.side !== "auto") placed.value = props.side;
      else {
        const box = root.value?.getBoundingClientRect();
        if (box) {
          const after = innerHeight - box.bottom;
          placed.value = box.top < 320 && after > box.top ? "bottom" : "top";
        }
      }
    }
    void nextTick(observe);
  });
  watch(
    () => props.side,
    (value) => {
      if (value !== "auto") placed.value = value;
    },
  );
  watch(
    [cursor.active, panelOpen, rows],
    () =>
      void nextTick(() => {
        if (!disposed && panelOpen.value && rows.value.length)
          document
            .getElementById(`${id}-option-${cursor.active.value}`)
            ?.scrollIntoView({ block: "nearest" });
      }),
  );
  watch(chips, (value, before) => {
    if (marked.value && !value.includes(marked.value)) marked.value = null;
    if (value.length > before.length)
      void nextTick(() => {
        const row = chipsRow.value;
        if (!disposed && row && row.scrollWidth > row.clientWidth)
          row.scrollTo({
            left: (rtl.value ? -1 : 1) * row.scrollWidth,
            behavior: reduce.value ? "auto" : "smooth",
          });
      });
  });
  onMounted(() => {
    mounted = true;
    rtl.value =
      !!root.value && getComputedStyle(root.value).direction === "rtl";
    restore();
    observe();
  });
  onUpdated(observe);
  onUnmounted(() => {
    disposed = true;
    disconnect();
  });
  return {
    chips,
    query,
    recents,
    openState,
    open,
    marked,
    rtl,
    announcement,
    root,
    field,
    chipsRow,
    panel,
    rowContainer,
    panelSize,
    panelFloor,
    id,
    trimmed,
    reduce,
    rows,
    cursor,
    panelOpen,
    below,
    input,
    announce,
    setRecents,
    add,
    remove,
    removeRecent,
    key,
    focus,
    blur,
  };
}
