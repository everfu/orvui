import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch,
  type ComponentPublicInstance,
  type Ref,
} from "vue";
import { resolveElement } from "../../../lib/composables";

export function useTabMeasurements(
  items: Ref<readonly { id: string }[]>,
  panel: Ref<HTMLDivElement | undefined>,
) {
  const size = ref<{ width: number; height: number } | null>(null);
  const widths = ref<Record<string, number>>({});
  const labels = new Map<string, HTMLSpanElement>();
  let observer: ResizeObserver | undefined;
  const observed = new Set<Element>();
  let live = false;
  let scheduled = false;
  function measure() {
    if (!live) return;
    if (panel.value) {
      const width = panel.value.offsetWidth,
        height = panel.value.offsetHeight;
      if (size.value?.width !== width || size.value?.height !== height)
        size.value = { width, height };
    }
    const next: Record<string, number> = {};
    for (const item of items.value) {
      const label = labels.get(item.id);
      if (label) next[item.id] = Math.ceil(label.offsetWidth);
    }
    const keys = Object.keys(next);
    if (
      keys.length !== Object.keys(widths.value).length ||
      keys.some((key) => widths.value[key] !== next[key])
    )
      widths.value = next;
  }
  function refresh() {
    if (!live) return;
    const wanted = new Set<Element>(labels.values());
    if (panel.value) wanted.add(panel.value);
    for (const element of observed)
      if (!wanted.has(element)) {
        observer?.unobserve(element);
        observed.delete(element);
      }
    for (const element of wanted)
      if (!observed.has(element)) {
        observer?.observe(element);
        observed.add(element);
      }
    measure();
  }
  function schedule() {
    if (!live || scheduled) return;
    scheduled = true;
    void nextTick(() => {
      scheduled = false;
      refresh();
    });
  }
  function setLabel(
    id: string,
    node: Element | ComponentPublicInstance | null,
  ) {
    const element = resolveElement<HTMLSpanElement>(node);
    if (element) labels.set(id, element);
    else labels.delete(id);
    schedule();
  }
  watch(items, schedule, { deep: true });
  onUpdated(schedule);
  onMounted(() => {
    live = true;
    if (typeof ResizeObserver !== "undefined")
      observer = new ResizeObserver(measure);
    refresh();
    void document.fonts?.ready.then(schedule);
  });
  onBeforeUnmount(() => {
    live = false;
    observer?.disconnect();
    observed.clear();
    labels.clear();
  });
  return { size, widths, setLabel };
}
