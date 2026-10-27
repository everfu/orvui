interface TreemapBase {
  id: string;
  label: string;
  color?: string;
  textColor?: string;
  description?: string;
}
export interface TreemapLeaf extends TreemapBase {
  value: number;
}
export interface TreemapGroup extends TreemapBase {
  children: readonly TreemapNode[];
}
export type TreemapNode = TreemapLeaf | TreemapGroup;
export interface TreemapItem extends TreemapLeaf {
  color: string;
  textColor: string;
  path: readonly string[];
  share: number;
}
export interface ResolvedNode {
  id: string;
  label: string;
  value: number;
  color: string;
  children: ResolvedNode[];
  item: TreemapItem | null;
}
export interface TreemapTile extends TreemapItem {
  x: number;
  y: number;
  width: number;
  height: number;
}
export const TREEMAP_COLORS = [
  "#1d4ed8",
  "#7c3aed",
  "#0f766e",
  "#b45309",
  "#be123c",
  "#475569",
] as const;

type Visit = {
  kind: "visit";
  source: TreemapNode;
  into: ResolvedNode[];
  path: readonly string[];
  color: string;
  text: string;
};
type Finish = { kind: "finish"; target: ResolvedNode };

export function buildTreemap(
  data: readonly TreemapNode[],
  colors: readonly string[],
  textColor: string,
) {
  if (!colors.length)
    throw new Error("Treemap: colors must contain at least one color.");
  const identities = new Set<string>();
  const nodes: ResolvedNode[] = [];
  const items: TreemapItem[] = [];
  const pending: (Visit | Finish)[] = [];
  for (let index = data.length - 1; index >= 0; index--)
    pending.push({
      kind: "visit",
      source: data[index],
      into: nodes,
      path: [],
      color: colors[index % colors.length],
      text: textColor,
    });
  while (pending.length) {
    const task = pending.pop()!;
    if (task.kind === "finish") {
      task.target.value = task.target.children.reduce(
        (sum, child) => sum + child.value,
        0,
      );
      if (!Number.isFinite(task.target.value))
        throw new Error("Treemap: group totals must remain finite.");
      continue;
    }
    const { source } = task;
    if (identities.has(source.id))
      throw new Error(`Treemap: duplicate node ID "${source.id}".`);
    identities.add(source.id);
    const color = source.color ?? task.color;
    const foreground = source.textColor ?? task.text;
    const path = [...task.path, source.label];
    const target: ResolvedNode = {
      id: source.id,
      label: source.label,
      color,
      value: 0,
      children: [],
      item: null,
    };
    task.into.push(target);
    if ("children" in source) {
      pending.push({ kind: "finish", target });
      for (let index = source.children.length - 1; index >= 0; index--)
        pending.push({
          kind: "visit",
          source: source.children[index],
          into: target.children,
          path,
          color,
          text: foreground,
        });
    } else {
      if (!Number.isFinite(source.value) || source.value < 0)
        throw new Error("Treemap: leaf values must be finite and nonnegative.");
      const item: TreemapItem = {
        ...source,
        color,
        textColor: foreground,
        path,
        share: 0,
      };
      target.value = source.value;
      target.item = item;
      items.push(item);
    }
  }
  const total = nodes.reduce((sum, node) => sum + node.value, 0);
  if (!Number.isFinite(total))
    throw new Error("Treemap: the total must remain finite.");
  for (const item of items) item.share = total ? item.value / total : 0;
  return { nodes, items, total };
}

type Region = {
  nodes: readonly ResolvedNode[];
  begin: number;
  end: number;
  x: number;
  y: number;
  width: number;
  height: number;
};
export function layoutTreemap(
  nodes: readonly ResolvedNode[],
  width: number,
  height: number,
) {
  const tiles: TreemapTile[] = [];
  const positive = nodes.filter((node) => node.value > 0);
  const pending: Region[] = [
    {
      nodes: positive,
      begin: 0,
      end: positive.length,
      x: 0,
      y: 0,
      width,
      height,
    },
  ];
  while (pending.length) {
    const region = pending.pop()!;
    const { nodes: siblings, begin, end, x, y, width: w, height: h } = region;
    if (begin === end) continue;
    if (end - begin === 1) {
      const node = siblings[begin];
      if (node.item) {
        if (w > 0 && h > 0)
          tiles.push({ ...node.item, x, y, width: w, height: h });
      } else {
        const children = node.children.filter((child) => child.value > 0);
        pending.push({
          ...region,
          nodes: children,
          begin: 0,
          end: children.length,
        });
      }
      continue;
    }
    let total = 0;
    for (let index = begin; index < end; index++)
      total += siblings[index].value;
    let divide = begin + 1;
    let weight = siblings[begin].value;
    for (let index = begin + 1; index < end - 1; index++) {
      const proposed = weight + siblings[index].value;
      if (Math.abs(proposed - total / 2) > Math.abs(weight - total / 2)) break;
      divide = index + 1;
      weight = proposed;
    }
    const fraction = weight / total;
    if (w >= h) {
      const firstWidth = w * fraction;
      pending.push({
        ...region,
        begin: divide,
        x: x + firstWidth,
        width: w - firstWidth,
      });
      pending.push({ ...region, end: divide, width: firstWidth });
    } else {
      const firstHeight = h * fraction;
      pending.push({
        ...region,
        begin: divide,
        y: y + firstHeight,
        height: h - firstHeight,
      });
      pending.push({ ...region, end: divide, height: firstHeight });
    }
  }
  return tiles;
}
