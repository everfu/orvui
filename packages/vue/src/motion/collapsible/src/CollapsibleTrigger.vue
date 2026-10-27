<script lang="ts">
import { cloneVNode, Comment, createVNode, defineComponent, inject } from "vue";
import { motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { resolveElement } from "../../../lib/composables";
import type { CollapsibleContext } from "./context";
export default defineComponent({
  name: "CollapsibleTrigger", inheritAttrs: false,
  props: { disabled: Boolean, asChild: Boolean },
  setup(props, { attrs, slots }) {
    const state = inject<CollapsibleContext>("orvui-collapsible");
    if (!state) throw new Error("CollapsibleTrigger must be inside Collapsible");
    return () => {
      const content = slots.default?.().filter(node => node.type !== Comment) ?? [];
      const child = props.asChild ? content[0] : undefined;
      if (child && typeof child.type === "string" && child.type !== "button")
        throw new Error("CollapsibleTrigger asChild requires a button or button component");
      const disabled = !!(props.disabled || state.disabled.value || child?.props?.disabled);
      const bindings = {
        ...attrs, id: `${state.id}-trigger`, type: "button" as const, disabled,
        "aria-expanded": state.open.value, "aria-controls": `${state.id}-content`,
        "data-slot": "collapsible-trigger", "data-state": state.open.value ? "open" : "closed", "data-disabled": disabled || undefined,
        ref: (node: unknown) => { state.triggerRef.value = resolveElement<HTMLButtonElement>(node); },
        onClick(event: MouseEvent) { if (!disabled && !event.defaultPrevented) state.toggle(); },
      };
      if (child) return cloneVNode(child, bindings, true);
      return createVNode(motion.button, {
        ...bindings, layout: state.reduce.value ? false : "position", transition: { layout: SPRING_LAYOUT },
        class: cn("orvui-collapsible-trigger flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", attrs.class as string),
      }, { default: () => content });
    };
  },
});
</script>
<style>
.orvui-collapsible-trigger[data-state="open"] {
  background-color: color-mix(in oklab, var(--primary) 4%, var(--background));
}
.orvui-collapsible-trigger[data-state="open"] [data-slot="collapsible-indicator"] {
  color: var(--primary);
}
</style>
