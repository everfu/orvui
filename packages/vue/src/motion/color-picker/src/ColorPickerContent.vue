<script lang="ts">
import {
  Fragment,
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch,
  type VNode,
  type Component,
} from "vue";
import { AnimatePresence, motion } from "motion-v";
import { SPRING_LAYOUT, EASE_OUT } from "../../../lib/ease";
import {
  resolveElement,
  useFloatingLayer,
  useReducedMotion,
} from "../../../lib/composables";
import { cn } from "../../../lib/utils";
import { usePicker } from "./context";
import ColorPickerArea from "./ColorPickerArea.vue";
const flatten = (nodes: VNode[]): VNode[] =>
  nodes.flatMap((node) =>
    node.type === Fragment ? flatten(node.children as VNode[]) : [node],
  );
export default defineComponent({
  inheritAttrs: false,
  props: { align: { type: String as () => "start" | "end", default: "start" } },
  setup(props, { attrs, slots }) {
    const state = usePicker();
    const reduced = useReducedMotion();
    const panel = ref<unknown>(null);
    const layer = useFloatingLayer(state.open, panel);
    provide("orvui-color-morph", true);
    let disposed = false;
    let revision = 0;
    const element = () => resolveElement<HTMLElement>(panel.value);
    function position() {
      const target = element();
      if (!target || !state.open.value) return;
      target.style.marginLeft = "0px";
      const box = target.getBoundingClientRect();
      const end = target.ownerDocument.documentElement.clientWidth - 8;
      let delta = Math.min(0, end - box.right);
      if (box.left + delta < 8) delta = 8 - box.left;
      target.style.marginLeft = `${delta}px`;
    }
    const outside = (event: PointerEvent) => {
      if (
        state.open.value &&
        event.target instanceof Node &&
        !layer.containsHigher(event.target) &&
        !element()?.contains(event.target) &&
        !state.anchor.value?.contains(event.target)
      )
        state.open.value = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (layer.claimEscape(event)) state.open.value = false;
    };
    watch(
      state.open,
      async (opened, previous) => {
        const version = ++revision;
        const target = element();
        if (target) {
          target.inert = !opened;
          target.style.pointerEvents = opened ? "auto" : "none";
        }
        await nextTick();
        if (disposed || version !== revision) return;
        if (opened) {
          position();
          if (previous !== undefined)
            element()
              ?.querySelector<HTMLElement>(
                '[role="slider"]:not([aria-disabled]),input:not(:disabled),button:not(:disabled)',
              )
              ?.focus({ preventScroll: true });
        } else {
          const active = document.activeElement;
          if (
            !active ||
            active === document.body ||
            element()?.contains(active)
          )
            state.anchor.value?.focus({ preventScroll: true });
        }
      },
      { flush: "post" },
    );
    onMounted(() => {
      document.addEventListener("pointerdown", outside);
      document.addEventListener("keydown", escape);
      window.addEventListener("resize", position);
      void nextTick(() => {
        if (!disposed) position();
      });
    });
    onBeforeUnmount(() => {
      disposed = true;
      ++revision;
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", position);
    });
    function rows() {
      let ordinal = 0;
      return flatten(slots.default?.() ?? []).map((child, index) => {
        if (child.type === ColorPickerArea) return child;
        const delay = 0.1 + ++ordinal * 0.035;
        return h(
          motion.div as Component,
          {
            key: child.key ?? index,
            initial: reduced.value
              ? { opacity: 0 }
              : { opacity: 0, y: -6, filter: "blur(4px)" },
            animate: reduced.value
              ? { opacity: 1 }
              : { opacity: 1, y: 0, filter: "blur(0px)" },
            exit: { opacity: 0, transition: { duration: 0.1 } },
            transition: { ...SPRING_LAYOUT, delay },
          },
          () => child,
        );
      });
    }
    return () =>
      h(AnimatePresence, null, {
        default: () =>
          state.open.value
            ? [
                h(
                  motion.div as Component,
                  {
                    ...attrs,
                    ref: panel,
                    id: `${state.id}-content`,
                    role: "dialog",
                    "aria-label": String(attrs["aria-label"] ?? "Color picker"),
                    inert: !state.open.value,
                    class: cn(
                      "absolute top-full z-50 mt-2 flex w-72 flex-col gap-3 p-3",
                      props.align === "end" ? "right-0" : "left-0",
                      attrs.class as string,
                    ),
                  },
                  () => [
                    h(motion.div as Component, {
                      "aria-hidden": true,
                      class:
                        "absolute inset-0 -z-10 rounded-2xl border border-border bg-background shadow-[0_12px_32px_-8px_rgb(0_0_0/0.25)]",
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      exit: { opacity: 0 },
                      transition: {
                        duration: 0.16,
                        ease: EASE_OUT,
                        delay: 0.1,
                      },
                    }),
                    ...rows(),
                  ],
                ),
              ]
            : [],
      });
  },
});
</script>
