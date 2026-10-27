import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from "vue";

const numeric = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
export const formatNumber = (value: number) => numeric.format(value);
export const formatCompact = (value: number) => compact.format(value);

export function context<T>(name: string) {
  const key: InjectionKey<T> = Symbol(name);
  function use(): T {
    const provided = inject(key);
    if (provided === undefined || provided === null)
      throw new Error(`${name} parts must be rendered inside ${name}.`);
    return provided;
  }
  return { key, use };
}

export function selection<T>(
  get: () => T | undefined,
  initial: T,
  change: (value: T) => void,
) {
  const fallback = ref(initial) as Ref<T>;
  return computed<T>({
    get() {
      const supplied = get();
      return supplied === undefined ? fallback.value : supplied;
    },
    set(value) {
      if (get() === undefined) fallback.value = value;
      change(value);
    },
  });
}

export function activeSelection(
  get: () => string | null | undefined,
  initial: string | null,
  ids: ComputedRef<string[]>,
  change: (id: string | null) => void,
) {
  const requested = selection(get, initial, change);
  const available = computed(() => new Set(ids.value));
  watch(available, (current) => {
    const id = requested.value;
    if (get() === undefined && id !== null && !current.has(id))
      requested.value = null;
  });
  return computed<string | null>({
    get() {
      const id = requested.value;
      return id !== null && available.value.has(id) ? id : null;
    },
    set: (id) => {
      requested.value = id;
    },
  });
}

export function usePlotSize(
  element: Ref<HTMLElement | null>,
  initial: { width: number; height: number },
) {
  const size = ref({ ...initial });
  let observer: ResizeObserver | undefined;
  let stop: (() => void) | undefined;
  onMounted(() => {
    if (typeof ResizeObserver === "undefined") return;
    observer = new ResizeObserver((entries) => {
      const entry = entries.find((item) => item.target === element.value);
      const box = entry?.contentRect;
      if (
        box &&
        box.width > 0 &&
        box.height > 0 &&
        (box.width !== size.value.width || box.height !== size.value.height)
      )
        size.value = { width: box.width, height: box.height };
    });
    stop = watch(
      element,
      (current, previous) => {
        if (previous) observer?.unobserve(previous);
        if (current) observer?.observe(current);
      },
      { immediate: true },
    );
  });
  onBeforeUnmount(() => {
    stop?.();
    observer?.disconnect();
  });
  return size;
}

export function moveFocus(
  event: KeyboardEvent,
  index: number,
  count: number,
  columns = 1,
) {
  if (count <= 0) return;
  const stride = Math.max(1, columns);
  const rowStart = Math.floor(index / stride) * stride;
  const destinations: Record<string, number> = {
    ArrowRight: index + 1,
    ArrowLeft: index - 1,
    ArrowDown: index + stride,
    ArrowUp: index - stride,
    Home: event.ctrlKey ? 0 : rowStart,
    End: event.ctrlKey ? count - 1 : rowStart + stride - 1,
  };
  if (!(event.key in destinations)) return;
  event.preventDefault();
  const current = event.currentTarget;
  if (!(current instanceof HTMLElement)) return;
  const entries = current
    .closest("[data-chart-keyboard]")
    ?.querySelectorAll<HTMLElement>("[data-chart-item]");
  const destination = Math.max(0, Math.min(count - 1, destinations[event.key]));
  entries?.[destination]?.focus();
}

export function unwrapModel<T extends object>(model: ComputedRef<T>): T {
  const descriptors = Object.fromEntries(
    Object.keys(model.value).map((key) => [
      key,
      {
        enumerable: true,
        get: () => model.value[key as keyof T],
      },
    ]),
  );
  return Object.defineProperties({} as T, descriptors);
}
