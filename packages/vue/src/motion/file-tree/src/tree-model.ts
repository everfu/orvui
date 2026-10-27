import { Fragment, isVNode, type VNodeChild } from "vue";
import FileTreeFile from "./FileTreeFile.vue";
import FileTreeFolder from "./FileTreeFolder.vue";
export interface TreeNode { value: string; name: string; type: "folder" | "file"; icon?: any; disabled: boolean; class?: any; children: TreeNode[] }
export interface TreeRow { item: TreeNode; depth: number; parentId: string | null; position: number; setSize: number }
export function readTree(nodes: VNodeChild[]): TreeNode[] {
  const output: TreeNode[] = [];
  for (const node of nodes) {
    if (!isVNode(node)) continue;
    if (node.type === Fragment) { output.push(...readTree(Array.isArray(node.children) ? node.children as VNodeChild[] : [])); continue; }
    if (node.type !== FileTreeFile && node.type !== FileTreeFolder) continue;
    const p = node.props ?? {};
    const childSlot = (node.children as { default?: () => VNodeChild[] } | null)?.default;
    output.push({ value: p.value, name: p.name, type: node.type === FileTreeFolder ? "folder" : "file", icon: p.icon, disabled: p.disabled === true || p.disabled === "", class: p.class, children: childSlot ? readTree(childSlot()) : [] });
  }
  return output;
}
export function visibleTree(nodes: TreeNode[], expanded: string[]): TreeRow[] {
  const rows: TreeRow[] = [];
  const open = new Set(expanded);
  function visit(siblings: TreeNode[], depth: number, parentId: string | null) {
    siblings.forEach((item, index) => { rows.push({ item, depth, parentId, position: index + 1, setSize: siblings.length }); if (item.type === "folder" && open.has(item.value)) visit(item.children, depth + 1, item.value); });
  }
  visit(nodes, 0, null);
  return rows;
}
