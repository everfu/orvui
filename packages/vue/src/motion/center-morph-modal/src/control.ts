import { Comment, Fragment, Text, cloneVNode, h, isVNode, type VNode } from "vue";
function content(nodes: VNode[]): VNode[] {
  return nodes.flatMap(node => node.type === Comment ? [] : node.type === Fragment && Array.isArray(node.children) ? content(node.children.filter(isVNode)) : [node]);
}
export function modalControl(nodes: VNode[], attributes: Record<string, unknown>) {
  const children = content(nodes);
  const only = children.length === 1 && children[0]!.type !== Text ? children[0]! : h("button", { type: "button" }, children);
  return cloneVNode(only, attributes, true);
}
