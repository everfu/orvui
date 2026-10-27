<script lang="ts">
import { Comment, defineComponent, Fragment, h, isVNode, type VNode } from "vue";
import { AnimatePresence } from "motion-v";
import { cn } from "../../../lib/utils";
import BreadcrumbEllipsis from "./BreadcrumbEllipsis.vue";
import BreadcrumbItem from "./BreadcrumbItem.vue";
import BreadcrumbSeparator from "./BreadcrumbSeparator.vue";
function paths(nodes: unknown[]): VNode[] {
  return nodes.flatMap(node => !isVNode(node) || node.type === Comment ? [] : node.type === Fragment && Array.isArray(node.children) ? paths(node.children) : [node]);
}
export default defineComponent({
  name: "BreadcrumbList", inheritAttrs: false,
  props: { maxItems: { type: Number, default: 4 }, overflowLabel: { type: String, default: "Show hidden paths" } },
  setup(props, { attrs, slots }) {
    return () => {
      const nodes = paths(slots.default?.() ?? []);
      const limit = Number.isFinite(props.maxItems) ? Math.max(3, Math.floor(props.maxItems)) : 4;
      let visible = nodes;
      if (props.maxItems !== Infinity && nodes.length > limit) {
        const tailCount = limit - 2;
        const parents = nodes.slice(1, nodes.length - tailCount);
        const overflow = h(BreadcrumbItem, { key: "breadcrumb-overflow" }, () => [h(BreadcrumbSeparator), h(BreadcrumbEllipsis, { label: props.overflowLabel }, () => parents)]);
        visible = [nodes[0]!, overflow, ...nodes.slice(-tailCount)];
      }
      return h("ol", { ...attrs, class: cn("relative flex flex-wrap items-center gap-x-1 gap-y-1 text-sm", attrs.class as string) },
        h(AnimatePresence, { initial: false, mode: "popLayout" }, () => visible));
    };
  },
});
</script>
