<script lang="ts">
import { Comment, Fragment, cloneVNode, defineComponent, h, isVNode, mergeProps, ref, useId, type PropType, type VNode, type VNodeChild } from "vue";
import { AnimatePresence, motion } from "motion-v";
import { cn } from "../../../lib/utils";
import { SPRING_LAYOUT } from "../../../lib/ease";
import { useReducedMotion } from "../../../lib/composables";
export interface SharedLayoutBgProps { as?: "div" | "ul"; pillClassName?: string; inset?: number; pillContainerClassName?: string }
function children(nodes: unknown[]): VNode[] {
  return nodes.flatMap(node => !isVNode(node) || node.type === Comment ? [] : node.type === Fragment && Array.isArray(node.children) ? children(node.children) : typeof node.type === "symbol" ? [] : [node]);
}
function replaceContents(child: VNode, additions: Record<string, unknown>, contents: VNode[]) {
  const result = cloneVNode(child, additions, true);
  const component = (child.shapeFlag & 6) !== 0;
  result.children = component ? { ...(child.children && typeof child.children === "object" && !Array.isArray(child.children) ? child.children : {}), default: () => contents } : contents;
  result.shapeFlag = (result.shapeFlag & ~(8 | 16 | 32)) | (component ? 32 : 16);
  result.patchFlag = -2;
  return result;
}
export default defineComponent({
  name: "SharedLayoutBg", inheritAttrs: false,
  props: { as: { type: String as PropType<"div" | "ul">, default: "div" }, pillClassName: String, inset: { type: Number, default: 20 }, pillContainerClassName: String },
  setup(props, { attrs, slots }) {
    const active = ref<string | null>(null), id = useId(), reduced = useReducedMotion();
    let pointerInside = false;
    function leave(event: MouseEvent) {
      pointerInside = false;
      const root = event.currentTarget as HTMLElement;
      if (!root.contains(root.ownerDocument.activeElement)) active.value = null;
    }
    function blur(event: FocusEvent) {
      if (!pointerInside && !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) active.value = null;
    }
    function presence() {
      const rest = reduced.value ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)" };
      const hidden = reduced.value ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)" };
      return { initial: hidden, animate: rest, exit: (another: unknown) => another ? {} : hidden };
    }
    function row(child: VNode, index: number) {
      const key = child.key == null ? `item-${index}` : String(child.key);
      const slots = child.children && typeof child.children === "object" && !Array.isArray(child.children) ? child.children as { default?: () => VNodeChild } : undefined;
      const body = slots ? slots.default?.() : child.children;
      const pill = h(AnimatePresence, { custom: active.value !== null ? 1 : 0 }, () => active.value === null ? null : h(motion.div, {
        key: "pill-wrapper", variants: presence(), initial: "initial", animate: "animate", exit: "exit", custom: active.value !== null ? 1 : 0,
        class: cn("pointer-events-none absolute inset-y-0", props.pillContainerClassName), style: { left: `${-props.inset}px`, right: `${-props.inset}px` },
      }, () => active.value !== key ? null : h(motion.div, { layoutId: `shared-bg-${id}`, transition: reduced.value ? { duration: 0 } : SPRING_LAYOUT, class: cn("pointer-events-none h-full w-full rounded-2xl bg-muted/80", props.pillClassName) })));
      return replaceContents(child, {
        key, class: cn("relative", child.props?.class), onMouseenter() { pointerInside = true; active.value = key; }, onFocusin() { active.value = key; },
      }, [pill, h("div", { class: "relative z-10" }, body as any)]);
    }
    return () => h(props.as === "ul" ? motion.ul : motion.div,
      mergeProps(attrs, { layoutRoot: true, class: cn("flex w-full flex-col", attrs.class), onMouseleave: leave, onFocusout: blur }),
      () => children(slots.default?.() ?? []).map(row));
  },
});
</script>
