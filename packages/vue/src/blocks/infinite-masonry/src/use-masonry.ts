import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect,
  type ComponentPublicInstance,
} from "vue";
import { useVirtualizer } from "@tanstack/vue-virtual";
import { resolveElement, useReducedMotion } from "../../../lib/composables";
import type { Content } from "../../shared";
export interface MasonryOptions<T> {
  items: readonly T[];
  getItemKey: (item: T, index: number) => string | number | bigint;
  hasMore: boolean;
  onLoadMore?: () => void | Promise<void>;
  loading?: boolean;
  error?: Content;
  estimateSize?: (item: T, index: number) => number;
  minColumnWidth: number;
  maxColumns: number;
  gap: number;
  overscan: number;
  prefetch: number;
}
export function useMasonry<T>(props: MasonryOptions<T>) {
  const root = ref<HTMLElement>(),
    content = ref<HTMLElement>(),
    width = ref(0),
    columns = ref(1),
    mounted = ref(false),
    reduce = useReducedMotion();
  const initialCount = props.items.length,
    revealed = new Set<string | number | bigint>();
  const hasError = computed(
      () => props.error !== undefined && props.error !== null,
    ),
    tailCount = computed(() =>
      hasError.value ? 1 : props.loading ? columns.value : 0,
    );
  const virtualizer = useVirtualizer(
    computed(() => ({
      count: props.items.length + tailCount.value,
      useAnimationFrameWithResizeObserver: true,
      getScrollElement: () => root.value ?? null,
      getItemKey: (index: number) =>
        index < props.items.length
          ? props.getItemKey(props.items[index]!, index)
          : `masonry-tail-${index - props.items.length}`,
      estimateSize: (index: number) =>
        index < props.items.length
          ? (props.estimateSize?.(props.items[index]!, index) ?? 240)
          : 144 + ((index - props.items.length) % 3) * 36,
      gap: props.gap,
      lanes: columns.value,
      overscan: props.overscan * columns.value,
    })),
  );
  const rows = computed(() => virtualizer.value.getVirtualItems()),
    total = computed(() => virtualizer.value.getTotalSize()),
    columnWidth = computed(() =>
      Math.max(
        0,
        (width.value - props.gap * (columns.value - 1)) / columns.value,
      ),
    );
  const lastVisible = computed(() => {
    const bottom =
      (virtualizer.value.scrollOffset ?? 0) +
      (virtualizer.value.scrollRect?.height ?? 0);
    let last = -1;
    for (const row of rows.value)
      if (row.start < bottom) last = Math.max(last, row.index);
    return last;
  });
  let resize: ResizeObserver | undefined,
    frame = 0,
    pending = false,
    disposed = false;
  function metrics() {
    if (!content.value || disposed) return;
    const measured = content.value.getBoundingClientRect().width;
    const count = Math.min(
      props.maxColumns,
      Math.max(
        1,
        Math.floor((measured + props.gap) / (props.minColumnWidth + props.gap)),
      ),
    );
    width.value = measured;
    columns.value = count;
  }
  function measure(node: Element | ComponentPublicInstance | null) {
    const element = resolveElement<HTMLElement>(node);
    if (element) virtualizer.value.measureElement(element);
  }
  watch(
    () => props.loading,
    (value) => {
      if (!value) pending = false;
    },
  );
  watchEffect(
    () => {
      if (
        !mounted.value ||
        hasError.value ||
        props.loading ||
        !props.hasMore ||
        pending ||
        lastVisible.value < Math.max(0, props.items.length - props.prefetch)
      )
        return;
      pending = true;
      Promise.resolve(props.onLoadMore?.())
        .catch(() => {})
        .finally(() => {
          pending = false;
        });
    },
    { flush: "post" },
  );
  watch(
    [() => props.gap, () => props.maxColumns, () => props.minColumnWidth],
    metrics,
  );
  onMounted(() => {
    mounted.value = true;
    metrics();
    if (content.value && typeof ResizeObserver !== "undefined") {
      resize = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(metrics);
      });
      resize.observe(content.value);
    }
  });
  onBeforeUnmount(() => {
    disposed = true;
    resize?.disconnect();
    cancelAnimationFrame(frame);
  });
  return {
    root,
    content,
    reduce,
    initialCount,
    revealed,
    hasError,
    rows,
    total,
    columnWidth,
    measure,
  };
}
