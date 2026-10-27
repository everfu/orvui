<script lang="ts">
import {
  Comment,
  Fragment,
  Text,
  cloneVNode,
  defineComponent,
  h,
  type VNode,
} from "vue";
import { useTooltip } from "./context";
function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) =>
    node.type === Fragment
      ? flatten(node.children as VNode[])
      : node.type === Comment ||
          (node.type === Text && !String(node.children).trim())
        ? []
        : [node],
  );
}
export default defineComponent({
  name: "TooltipTrigger",
  inheritAttrs: false,
  props: { asChild: Boolean },
  setup(props, { attrs, slots }) {
    const state = useTooltip();
    return () => {
      const describedBy =
        [
          attrs["aria-describedby"],
          state.open.value && !state.empty.value ? state.id : undefined,
        ]
          .filter(Boolean)
          .join(" ") || undefined;
      const a11y = state.props.asLabel
        ? {
            "aria-labelledby": state.empty.value
              ? attrs["aria-labelledby"]
              : state.labelId,
          }
        : { "aria-describedby": describedBy };
      const properties = {
        ...attrs,
        ...a11y,
        "data-state": state.open.value ? "open" : "closed",
        ref: state.setTrigger,
      };
      const children = slots.default?.() ?? [];
      if (!props.asChild)
        return h("button", { type: "button", ...properties }, children);
      const elements = flatten(children);
      return elements.length === 1
        ? cloneVNode(elements[0]!, properties, true)
        : elements.length
          ? elements
          : null;
    };
  },
});
</script>
