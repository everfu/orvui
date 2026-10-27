export type SidebarResourceKind = "folder" | "project" | "file" | "bookmark";
export interface SidebarResource {
  id: string;
  label: string;
  kind: SidebarResourceKind;
  children?: SidebarResource[];
  disabled?: boolean;
}
export type SidebarResourceDropPosition = "before" | "inside" | "after";
export interface SidebarResourceMove {
  itemId: string;
  targetId: string | null;
  position: SidebarResourceDropPosition;
}
export interface SidebarResourceMoveCommands {
  up?: () => void;
  down?: () => void;
  into?: { label: string; run: () => void };
  out?: () => void;
}
export interface SidebarResourceMenuControls {
  close: () => void;
  rename: () => void;
  moves: SidebarResourceMoveCommands;
}
export interface FlatResource {
  item: SidebarResource;
  depth: number;
  parentId: string | null;
}

export function canContain(item: SidebarResource) {
  return ["folder", "project"].includes(item.kind);
}

function pathTo(forest: SidebarResource[], id: string): number[] | undefined {
  const pending = forest
    .map((item, index) => ({ item, path: [index] }))
    .reverse();
  while (pending.length) {
    const cursor = pending.pop()!;
    if (cursor.item.id === id) return cursor.path;
    const children = cursor.item.children ?? [];
    for (let index = children.length - 1; index >= 0; index--)
      pending.push({ item: children[index], path: [...cursor.path, index] });
  }
}
function at(forest: SidebarResource[], path: number[]): SidebarResource {
  let nodes = forest;
  let node = nodes[path[0]];
  path.forEach((index, level) => {
    node = nodes[index];
    if (level < path.length - 1) nodes = node.children ?? [];
  });
  return node;
}
function editSiblings(
  forest: SidebarResource[],
  parentPath: number[],
  edit: (siblings: SidebarResource[]) => SidebarResource[],
): SidebarResource[] {
  if (!parentPath.length) return edit(forest);
  const [head, ...tail] = parentPath;
  const result = forest.slice();
  result[head] = {
    ...forest[head],
    children: editSiblings(forest[head].children ?? [], tail, edit),
  };
  return result;
}
export function flattenResources(
  items: SidebarResource[],
  expanded: Set<string>,
  depth = 0,
  parentId: string | null = null,
): FlatResource[] {
  const result: FlatResource[] = [];
  const pending = items.map((item) => ({ item, depth, parentId })).reverse();
  while (pending.length) {
    const row = pending.pop()!;
    result.push(row);
    if (!expanded.has(row.item.id)) continue;
    const children = row.item.children ?? [];
    for (let index = children.length - 1; index >= 0; index--)
      pending.push({
        item: children[index],
        parentId: row.item.id,
        depth: row.depth + 1,
      });
  }
  return result;
}
export function findResource(
  items: SidebarResource[],
  id: string,
): SidebarResource | undefined {
  const path = pathTo(items, id);
  return path ? at(items, path) : undefined;
}
export function containsResource(item: SidebarResource, id: string): boolean {
  return pathTo([item], id) !== undefined;
}
export function removeResource(
  items: SidebarResource[],
  id: string,
): { items: SidebarResource[]; removed?: SidebarResource } {
  const path = pathTo(items, id);
  if (!path) return { items: items.slice() };
  const removed = at(items, path);
  const index = path[path.length - 1];
  return {
    removed,
    items: editSiblings(items, path.slice(0, -1), (siblings) =>
      siblings.filter((_, cursor) => cursor !== index),
    ),
  };
}
export function insertResource(
  items: SidebarResource[],
  resource: SidebarResource,
  targetId: string | null,
  position: SidebarResourceDropPosition,
): SidebarResource[] {
  if (targetId === null) return items.concat(resource);
  const path = pathTo(items, targetId);
  if (!path) return items.slice();
  if (position === "inside")
    return editSiblings(items, path, (children) => children.concat(resource));
  const index = path[path.length - 1] + Number(position === "after");
  return editSiblings(items, path.slice(0, -1), (siblings) => [
    ...siblings.slice(0, index),
    resource,
    ...siblings.slice(index),
  ]);
}
export function moveResource(
  items: SidebarResource[],
  move: SidebarResourceMove,
): SidebarResource[] | null {
  const source = findResource(items, move.itemId);
  if (!source || source.disabled) return null;
  const target =
    move.targetId === null ? undefined : findResource(items, move.targetId);
  if (
    move.targetId !== null &&
    (!target || containsResource(source, move.targetId))
  )
    return null;
  if (
    move.position === "inside" &&
    (!target || target.disabled || !canContain(target))
  )
    return null;
  const detached = removeResource(items, move.itemId);
  return insertResource(detached.items, source, move.targetId, move.position);
}
export function renameResource(
  items: SidebarResource[],
  id: string,
  label: string,
): SidebarResource[] {
  const path = pathTo(items, id);
  if (!path) return items.slice();
  const index = path[path.length - 1];
  return editSiblings(items, path.slice(0, -1), (siblings) =>
    siblings.map((item, cursor) =>
      cursor === index ? { ...item, label } : item,
    ),
  );
}
