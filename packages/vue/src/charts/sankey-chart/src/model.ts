export interface SankeyNode {
  id: string;
  label: string;
  color?: string;
  description?: string;
}
export interface SankeyLink {
  id?: string;
  source: string;
  target: string;
  value: number;
}
export type PlacedNode = Required<
  Pick<SankeyNode, "id" | "label" | "color">
> & {
  description?: string;
  value: number;
  inValue: number;
  outValue: number;
  depth: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};
export type PlacedLink = {
  id: string;
  source: PlacedNode;
  target: PlacedNode;
  value: number;
  share: number;
  width: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  path: string;
};
export type SankeyData = {
  nodes: SankeyNode[];
  links: SankeyLink[];
  dropped: { invalid: SankeyLink[]; cycle: SankeyLink[] };
};
export const SANKEY_COLORS = [
  "#1d4ed8",
  "#7c3aed",
  "#0f766e",
  "#b45309",
  "#be123c",
  "#475569",
] as const;
export const linkId = (link: SankeyLink) =>
  link.id ?? `${link.source}:${link.target}`;

function append<T>(map: Map<string, T[]>, id: string, value: T) {
  const list = map.get(id);
  if (list) list.push(value);
  else map.set(id, [value]);
}

export function cleanSankey(
  nodes: readonly SankeyNode[],
  links: readonly SankeyLink[],
): SankeyData {
  const identities = new Map<string, SankeyNode>();
  nodes.forEach((node) => {
    if (!identities.has(node.id)) identities.set(node.id, node);
  });
  const invalid: SankeyLink[] = [];
  const edges = new Map<string, SankeyLink>();
  for (const edge of links) {
    if (
      !identities.has(edge.source) ||
      !identities.has(edge.target) ||
      edge.source === edge.target ||
      !Number.isFinite(edge.value) ||
      edge.value <= 0
    ) {
      invalid.push(edge);
      continue;
    }
    const key = linkId(edge);
    const previous = edges.get(key);
    if (!previous) edges.set(key, { ...edge, id: key });
    else if (
      edge.id === undefined &&
      previous.source === edge.source &&
      previous.target === edge.target
    )
      previous.value += edge.value;
    else invalid.push(edge);
  }
  const outgoing = new Map<string, SankeyLink[]>();
  edges.forEach((edge) => append(outgoing, edge.source, edge));
  const entered = new Set<string>();
  const finished = new Set<string>();
  const backEdges = new Set<SankeyLink>();
  for (const root of identities.keys()) {
    if (entered.has(root)) continue;
    entered.add(root);
    const traversal: { id: string; next: number }[] = [{ id: root, next: 0 }];
    while (traversal.length) {
      const frame = traversal[traversal.length - 1];
      const edge = outgoing.get(frame.id)?.[frame.next++];
      if (!edge) {
        finished.add(frame.id);
        traversal.pop();
        continue;
      }
      if (!entered.has(edge.target)) {
        entered.add(edge.target);
        traversal.push({ id: edge.target, next: 0 });
      } else if (!finished.has(edge.target)) backEdges.add(edge);
    }
  }
  const kept: SankeyLink[] = [];
  const cycle: SankeyLink[] = [];
  edges.forEach((edge) => (backEdges.has(edge) ? cycle : kept).push(edge));
  return {
    nodes: [...identities.values()],
    links: kept,
    dropped: { invalid, cycle },
  };
}

type LayoutOptions = {
  width: number;
  height: number;
  nodeWidth: number;
  nodePadding: number;
  colors: readonly string[];
};
type Flow = {
  link: SankeyLink;
  source: PlacedNode;
  target: PlacedNode;
  from: number;
  to: number;
};

export function layoutSankey(data: SankeyData, options: LayoutOptions) {
  const { width, height, nodeWidth, nodePadding, colors } = options;
  const incoming = new Map<string, SankeyLink[]>();
  const outgoing = new Map<string, SankeyLink[]>();
  const received = new Map<string, number>();
  const sent = new Map<string, number>();
  for (const edge of data.links) {
    append(incoming, edge.target, edge);
    append(outgoing, edge.source, edge);
    received.set(edge.target, (received.get(edge.target) ?? 0) + edge.value);
    sent.set(edge.source, (sent.get(edge.source) ?? 0) + edge.value);
  }
  const remaining = new Map(
    data.nodes.map((node) => [node.id, incoming.get(node.id)?.length ?? 0]),
  );
  const depth = new Map<string, number>();
  const ready = data.nodes
    .filter((node) => !remaining.get(node.id))
    .map((node) => node.id);
  ready.forEach((id) => depth.set(id, 0));
  for (let index = 0; index < ready.length; index++) {
    const id = ready[index];
    for (const edge of outgoing.get(id) ?? []) {
      depth.set(
        edge.target,
        Math.max(depth.get(edge.target) ?? 0, (depth.get(id) ?? 0) + 1),
      );
      const count = (remaining.get(edge.target) ?? 0) - 1;
      remaining.set(edge.target, count);
      if (count === 0) ready.push(edge.target);
    }
  }
  const linked = data.nodes.filter(
    (node) => received.has(node.id) || sent.has(node.id),
  );
  if (!linked.length || width <= 0 || height <= 0)
    return {
      nodes: [] as PlacedNode[],
      links: [] as PlacedLink[],
      columns: 0,
      step: 0,
    };
  let terminal = 0;
  for (const node of linked)
    terminal = Math.max(terminal, depth.get(node.id) ?? 0);
  const columns = terminal + 1;
  const step = columns > 1 ? (width - nodeWidth) / (columns - 1) : 0;
  const sourceIndices = new Map(
    data.nodes.map((node, index) => [node.id, index]),
  );
  const placed = linked.map((node): PlacedNode => {
    const inValue = received.get(node.id) ?? 0;
    const outValue = sent.get(node.id) ?? 0;
    const column = sent.has(node.id) ? (depth.get(node.id) ?? 0) : terminal;
    return {
      id: node.id,
      label: node.label,
      description: node.description,
      color:
        node.color ?? colors[(sourceIndices.get(node.id) ?? 0) % colors.length],
      value: Math.max(inValue, outValue),
      inValue,
      outValue,
      depth: column,
      x0: column * step,
      x1: column * step + nodeWidth,
      y0: 0,
      y1: 0,
    };
  });
  const nodesById = new Map(placed.map((node) => [node.id, node]));
  const lanes: PlacedNode[][] = Array.from({ length: columns }, () => []);
  for (const node of placed) lanes[node.depth].push(node);
  let padding = nodePadding;
  for (const lane of lanes)
    if (lane.length > 1)
      padding = Math.min(padding, (height * 0.5) / (lane.length - 1));
  let unit = Infinity;
  for (const lane of lanes) {
    if (!lane.length) continue;
    const sum = lane.reduce((value, node) => value + node.value, 0);
    unit = Math.min(unit, (height - (lane.length - 1) * padding) / sum);
  }
  for (const lane of lanes) {
    let cursor = 0;
    for (const node of lane) {
      node.y0 = cursor;
      node.y1 = cursor + node.value * unit;
      cursor = node.y1 + padding;
    }
    const offset = (height - (cursor - padding)) / 2;
    for (const node of lane) {
      node.y0 += offset;
      node.y1 += offset;
    }
  }
  function constrain(lane: PlacedNode[]) {
    let boundary = 0;
    for (const node of lane) {
      const shift = boundary - node.y0;
      if (shift > 0) {
        node.y0 += shift;
        node.y1 += shift;
      }
      boundary = node.y1 + padding;
    }
    boundary = height;
    for (let index = lane.length - 1; index >= 0; index--) {
      const node = lane[index];
      const shift = node.y1 - boundary;
      if (shift > 0) {
        node.y0 -= shift;
        node.y1 -= shift;
      }
      boundary = node.y0 - padding;
    }
  }
  function settle(lane: PlacedNode[], alpha: number, fromIncoming: boolean) {
    for (const node of lane) {
      let weighted = 0;
      let weight = 0;
      for (const edge of (fromIncoming ? incoming : outgoing).get(node.id) ??
        []) {
        const other = nodesById.get(fromIncoming ? edge.source : edge.target);
        if (!other) continue;
        weighted += ((other.y0 + other.y1) / 2) * edge.value;
        weight += edge.value;
      }
      if (weight) {
        const distance = (weighted / weight - (node.y0 + node.y1) / 2) * alpha;
        node.y0 += distance;
        node.y1 += distance;
      }
    }
    constrain(lane);
  }
  for (let iteration = 0; iteration < 6; iteration++) {
    const alpha = 0.99 ** iteration;
    for (let column = 1; column < columns; column++)
      settle(lanes[column], alpha, true);
    for (let column = columns - 2; column >= 0; column--)
      settle(lanes[column], alpha, false);
  }
  const leaving = new Map<string, Flow[]>();
  const arriving = new Map<string, Flow[]>();
  const flows: Flow[] = data.links.map((link) => ({
    link,
    source: nodesById.get(link.source)!,
    target: nodesById.get(link.target)!,
    from: 0,
    to: 0,
  }));
  for (const flow of flows) {
    append(leaving, flow.source.id, flow);
    append(arriving, flow.target.id, flow);
  }
  for (const node of placed) {
    let start = node.y0;
    for (const flow of (leaving.get(node.id) ?? []).sort(
      (a, b) => a.target.y0 - b.target.y0,
    )) {
      flow.from = start;
      start += flow.link.value * unit;
    }
    start = node.y0;
    for (const flow of (arriving.get(node.id) ?? []).sort(
      (a, b) => a.source.y0 - b.source.y0,
    )) {
      flow.to = start;
      start += flow.link.value * unit;
    }
  }
  const links: PlacedLink[] = flows.map(
    ({ link, source, target, from, to }) => {
      const band = link.value * unit;
      const x0 = source.x1,
        x1 = target.x0;
      const y0 = from + band / 2,
        y1 = to + band / 2;
      const middle = (x0 + x1) / 2;
      return {
        id: linkId(link),
        source,
        target,
        value: link.value,
        share: source.value ? link.value / source.value : 0,
        width: band,
        x0,
        x1,
        y0,
        y1,
        path: `M ${x0} ${y0} C ${middle} ${y0} ${middle} ${y1} ${x1} ${y1}`,
      };
    },
  );
  return { nodes: lanes.flat(), links, columns, step };
}
