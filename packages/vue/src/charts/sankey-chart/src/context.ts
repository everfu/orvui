import { computed, reactive, ref, useId } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../lib/composables";
import { activeSelection, context, formatNumber, usePlotSize } from "../../shared";
import {
  cleanSankey,
  layoutSankey,
  SANKEY_COLORS,
  type SankeyNode,
  type SankeyLink,
  type PlacedNode,
  type PlacedLink,
} from "./model";
export interface SankeyChartProps {
  nodes: readonly SankeyNode[];
  links: readonly SankeyLink[];
  label?: string;
  formatValue?: (value: number) => string;
  colors?: readonly string[];
  nodeWidth?: number;
  nodePadding?: number;
  activeId?: string | null;
  defaultActiveId?: string | null;
  className?: string;
}
export type SankeyActive =
  { type: "node"; node: PlacedNode } | { type: "link"; link: PlacedLink };
export function createSankeyModel(
  props: SankeyChartProps,
  emit: (event: any, ...args: any[]) => void,
) {
  const plotRef = ref<HTMLElement | null>(null),
    size = usePlotSize(plotRef, { width: 640, height: 320 });
  const data = computed(() => cleanSankey(props.nodes, props.links));
  const layout = computed(() =>
    layoutSankey(data.value, {
      ...size.value,
      nodeWidth: props.nodeWidth ?? 12,
      nodePadding: props.nodePadding ?? 16,
      colors: props.colors ?? SANKEY_COLORS,
    }),
  );
  const activeId = activeSelection(
    () => props.activeId,
    props.defaultActiveId ?? null,
    computed(() => [
      ...layout.value.nodes.map((node) => node.id),
      ...layout.value.links.map((link) => link.id),
    ]),
    (id) => {
      emit("update:activeId", id);
      emit("activeChange", id);
    },
  );
  const active = computed<SankeyActive | null>(() => {
    const node = layout.value.nodes.find((node) => node.id === activeId.value);
    if (node) return { type: "node", node };
    const link = layout.value.links.find((link) => link.id === activeId.value);
    return link ? { type: "link", link } : null;
  });
  return reactive({
    nodes: computed(() => layout.value.nodes),
    links: computed(() => layout.value.links),
    columns: computed(() => layout.value.columns),
    step: computed(() => layout.value.step),
    size,
    plotRef,
    activeId,
    active,
    setActive(id: string | null) {
      activeId.value = id;
    },
    tooltipOpen: ref(false),
    tooltipId: useId(),
    gradientId: useId().replace(/[^\w-]/g, ""),
    label: computed(() => props.label ?? "Sankey chart"),
    formatValue: computed(() => props.formatValue ?? formatNumber),
    empty: computed(() =>
      data.value.links.length
        ? null
        : props.nodes.length
          ? "No flows to show"
          : "No sankey data",
    ),
    reduce: useReducedMotion(),
    canHover: useMediaQuery("(hover: hover)"),
  });
}
export const sankeyContext =
  context<ReturnType<typeof createSankeyModel>>("SankeyChart");
export const useSankeyChart = sankeyContext.use;
export function emphasis(active: SankeyActive | null) {
  function node(node: PlacedNode) {
    if (!active) return true;
    return active.type === "node"
      ? node.id === active.node.id
      : node.id === active.link.source.id || node.id === active.link.target.id;
  }
  function link(link: PlacedLink) {
    if (!active) return true;
    return active.type === "node"
      ? link.source.id === active.node.id || link.target.id === active.node.id
      : link.id === active.link.id;
  }
  return { node, link };
}
