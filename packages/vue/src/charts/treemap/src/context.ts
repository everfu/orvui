import { computed, reactive, ref, useId } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import { activeSelection, context, formatNumber, usePlotSize } from "../../shared";
import {
  buildTreemap,
  layoutTreemap,
  TREEMAP_COLORS,
  type TreemapNode,
} from "./model";
export interface TreemapProps {
  data: readonly TreemapNode[];
  label?: string;
  formatValue?: (value: number) => string;
  colors?: readonly string[];
  textColor?: string;
  activeId?: string | null;
  defaultActiveId?: string | null;
  className?: string;
}
export function createTreemapModel(
  props: TreemapProps,
  emit: (event: any, ...args: any[]) => void,
) {
  const plotRef = ref<HTMLElement | null>(null);
  const size = usePlotSize(plotRef, { width: 1000, height: 625 });
  const model = computed(() =>
    buildTreemap(
      props.data,
      props.colors ?? TREEMAP_COLORS,
      props.textColor ?? "#ffffff",
    ),
  );
  const tiles = computed(() =>
    layoutTreemap(model.value.nodes, size.value.width, size.value.height),
  );
  const activeId = activeSelection(
    () => props.activeId,
    props.defaultActiveId ?? null,
    computed(() => tiles.value.map((tile) => tile.id)),
    (value) => {
      emit("update:activeId", value);
      emit("activeChange", value);
    },
  );
  const byId = computed(
    () => new Map(tiles.value.map((tile) => [tile.id, tile])),
  );
  return reactive({
    nodes: computed(() => model.value.nodes),
    items: computed(() => model.value.items),
    total: computed(() => model.value.total),
    tiles,
    size,
    plotRef,
    activeId,
    active: computed(() =>
      activeId.value === null ? null : (byId.value.get(activeId.value) ?? null),
    ),
    setActive(value: string | null) {
      activeId.value = value;
    },
    tooltipOpen: ref(false),
    tooltipId: useId(),
    formatValue: computed(() => props.formatValue ?? formatNumber),
    label: computed(() => props.label ?? "Treemap"),
    reduce: useReducedMotion(),
    canHover: useMediaQuery("(hover: hover)"),
  });
}
export const treemapContext =
  context<ReturnType<typeof createTreemapModel>>("Treemap");
export const useTreemap = treemapContext.use;
