<script lang="ts">
import {
  Comment,
  Fragment,
  Text,
  cloneVNode,
  defineComponent,
  h,
  onBeforeUnmount,
  type VNode,
} from "vue";
import { resolveElement } from "../../../lib/composables";
import { usePopover } from "./context";
function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) =>
    node.type === Fragment
      ? flatten(node.children as VNode[])
      : node.type === Comment
        ? []
        : [node],
  );
}
export default defineComponent({
  name: "PopoverTrigger",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const state = usePopover();
    let keyboard = false;
    let contact: { kind: string; opened: boolean } | undefined;
    onBeforeUnmount(() => {
      state.trigger.value = null;
    });
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (state.kind === "morph") {
        state.armFocusOnOpen(
          !state.open.value && keyboard && event.detail === 0,
        );
        keyboard = false;
        state.toggle();
      } else if (state.p.trigger !== "hover") state.toggle();
      else {
        const gesture = contact;
        contact = undefined;
        if (gesture && gesture.kind !== "mouse") state.setOpen(!gesture.opened);
      }
    };
    return () => {
      const nodes = flatten(slots.default?.() ?? []);
      const child =
        nodes.length === 1 && nodes[0]!.type !== Text
          ? nodes[0]!
          : h(
              "button",
              {
                type: "button",
                class:
                  "inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm",
              },
              nodes,
            );
      return cloneVNode(
        child,
        {
          ...attrs,
          ref: (node: unknown) => {
            state.trigger.value = resolveElement<HTMLElement>(node);
          },
          id: state.triggerId,
          "aria-haspopup": "dialog",
          "aria-expanded": state.open.value,
          "aria-controls": state.open.value ? state.contentId : undefined,
          "data-state": state.open.value ? "open" : "closed",
          class: [
            attrs.class,
            state.kind === "goo" ? "relative z-0" : undefined,
          ],
          onPointerdown: (event: PointerEvent) => {
            keyboard = false;
            contact = { kind: event.pointerType, opened: state.open.value };
          },
          onPointercancel: () => {
            contact = undefined;
          },
          onKeydown: (event: KeyboardEvent) => {
            contact = undefined;
            keyboard = event.key === "Enter" || event.key === " ";
          },
          onFocus: (event: FocusEvent) => {
            if (
              !event.defaultPrevented &&
              state.kind === "goo" &&
              state.p.trigger === "hover"
            )
              state.openHover();
          },
          onBlur: (event: FocusEvent) => {
            if (
              !event.defaultPrevented &&
              state.kind === "goo" &&
              state.p.trigger === "hover"
            )
              state.scheduleClose();
          },
          onClick: click,
        },
        true,
      );
    };
  },
});
</script>
