import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  useId,
  watch,
} from "vue";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
import { EASE_OUT } from "../../../lib/ease";
import { useControllable, useDialog, type Content } from "../../shared";
import { useSearchCursor } from "../../search-cursor";
export interface SearchOverlayItem {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
  icon?: Content;
  onSelect?: () => void;
}
interface Options {
  items: SearchOverlayItem[];
  open?: boolean;
  defaultOpen: boolean;
  shortcut: string;
}
type Events = {
  open(value: boolean): void;
  query(value: string): void;
  select(value: SearchOverlayItem): void;
};
export function useSearchOverlay(props: Options, events: Events) {
  const open = useControllable(
    () => props.open,
    props.defaultOpen,
    events.open,
  );
  const reduce = useReducedMotion();
  const query = ref("");
  const present = ref(open.value);
  const ready = ref(false);
  const anchor = ref<HTMLDivElement>();
  const trigger = ref<unknown>();
  const root = ref<HTMLElement>();
  const input = ref<HTMLInputElement>();
  const list = ref<unknown>();
  const id = useId();
  const box = ref({ top: 16, left: 16, width: 288 });
  const viewport = ref({ width: 0, height: 0 });
  const filtered = computed(() => {
    const term = query.value.trim().toLowerCase();
    if (!term) return props.items;
    return props.items.filter((item) =>
      `${item.title} ${item.description ?? ""} ${(item.keywords ?? []).join(" ")}`
        .toLowerCase()
        .includes(term),
    );
  });
  const cursor = useSearchCursor(filtered, query);
  const panelWidth = computed(() =>
    ready.value
      ? Math.max(
          box.value.width,
          Math.min(448, viewport.value.width - box.value.left - 16),
        )
      : box.value.width,
  );
  const resultsHeight = computed(() =>
    ready.value
      ? Math.max(96, Math.min(288, viewport.value.height - box.value.top - 80))
      : 288,
  );
  const collapsedClip = computed(
    () =>
      `inset(0px ${Math.max(0, panelWidth.value - box.value.width)}px ${resultsHeight.value}px 0px round 12px)`,
  );
  const shellStyle = computed(() => ({
    top: `${box.value.top}px`,
    left: `${box.value.left}px`,
    width: `${panelWidth.value}px`,
  }));
  const morph = computed(() =>
    reduce.value
      ? { duration: 0 }
      : { type: "spring" as const, duration: 0.58, bounce: 0.22 },
  );
  const clipTransition = computed(() =>
    reduce.value
      ? { duration: 0 }
      : {
          clipPath: { duration: 0.32, ease: EASE_OUT },
          opacity: { type: "spring" as const, duration: 0.58, bounce: 0.22 },
        },
  );
  let focusBefore: HTMLElement | null = null;
  let disposed = false;
  function measure() {
    if (typeof window === "undefined") return;
    const measured = anchor.value?.getBoundingClientRect();
    if (measured?.width)
      box.value = {
        top: measured.top,
        left: measured.left,
        width: measured.width,
      };
    viewport.value = { width: window.innerWidth, height: window.innerHeight };
  }
  function openSearch() {
    measure();
    focusBefore =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    present.value = true;
    open.value = true;
  }
  function close() {
    if (query.value === "") events.query("");
    query.value = "";
    open.value = false;
  }
  function select(item: SearchOverlayItem) {
    item.onSelect?.();
    events.select(item);
    close();
  }
  function key(event: KeyboardEvent) {
    const direction =
      event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (direction) {
      event.preventDefault();
      cursor.moveActive(direction as 1 | -1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = filtered.value[cursor.active.value];
      if (item) select(item);
    }
  }
  function shortcut(event: KeyboardEvent) {
    if (event.key === "Escape" && open.value) {
      event.preventDefault();
      close();
      return;
    }
    const el = event.target instanceof HTMLElement ? event.target : null;
    if (
      open.value ||
      !props.shortcut ||
      event.repeat ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      el?.isContentEditable ||
      el?.matches("input,textarea,select")
    )
      return;
    if (event.key.toLowerCase() === props.shortcut.toLowerCase()) {
      event.preventDefault();
      openSearch();
    }
  }
  function blockScroll(event: WheelEvent | TouchEvent) {
    if (!present.value) return;
    if (
      event.target instanceof Node &&
      resolveElement<HTMLElement>(list.value)?.contains(event.target)
    )
      return;
    event.preventDefault();
  }
  watch(query, events.query);
  watch(open, (value) => {
    if (value) {
      measure();
      present.value = true;
      query.value = "";
      cursor.moveTo(null);
      events.query("");
    } else
      void nextTick(() => {
        if (disposed) return;
        (focusBefore?.isConnected
          ? focusBefore
          : resolveElement<HTMLElement>(trigger.value)
        )?.focus();
      });
  });
  watch([cursor.active, open], () => {
    if (open.value)
      void nextTick(() => {
        if (!disposed)
          resolveElement<HTMLElement>(list.value)
            ?.querySelector<HTMLElement>(
              `[data-index="${cursor.active.value}"]`,
            )
            ?.scrollIntoView({ block: "nearest" });
      });
  });
  useDialog(open, root, () => input.value);
  let observer: ResizeObserver | undefined;
  onMounted(() => {
    ready.value = true;
    measure();
    if (anchor.value && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(anchor.value);
    }
    window.addEventListener("resize", measure);
    document.addEventListener("scroll", measure, true);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    window.addEventListener("keydown", shortcut);
    document.addEventListener("wheel", blockScroll, { passive: false });
    document.addEventListener("touchmove", blockScroll, { passive: false });
  });
  onUnmounted(() => {
    disposed = true;
    observer?.disconnect();
    window.removeEventListener("resize", measure);
    document.removeEventListener("scroll", measure, true);
    window.visualViewport?.removeEventListener("resize", measure);
    window.visualViewport?.removeEventListener("scroll", measure);
    window.removeEventListener("keydown", shortcut);
    document.removeEventListener("wheel", blockScroll);
    document.removeEventListener("touchmove", blockScroll);
  });
  return {
    open,
    reduce,
    query,
    present,
    anchor,
    trigger,
    root,
    input,
    list,
    id,
    shellId: `${id}-shell`,
    filtered,
    ...cursor,
    panelWidth,
    resultsHeight,
    collapsedClip,
    morph,
    clipTransition,
    shellStyle,
    openSearch,
    close,
    select,
    key,
  };
}
