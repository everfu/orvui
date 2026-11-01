import { onBeforeUnmount, reactive, toRefs, useId, watch } from "vue";
import { animate, motionValue, useTransform } from "motion-v";
import {
  useMediaQuery,
  useReducedMotion,
} from "../../../../packages/vue/src/lib/composables";
import { DOCS_MOTION } from "../utils/docs/docs-motion";
import { EASE_OUT } from "../../../../packages/vue/src/lib/ease";
export function useMotionGuideScene() {
  const state = reactive({
    replay: 0,
    iconActive: false,
    expanded: false,
    tab: "Preview" as "Preview" | "Code",
  });
  const reduce = useReducedMotion(),
    canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  // One progress value keeps the two layers complementary through completion
  // and interruption, without native animation cleanup restoring old styles.
  const progress = motionValue(0);
  const swapLayers = {
    Preview: {
      opacity: useTransform(progress, (value) => 1 - value),
      y: useTransform(progress, (value) => `${4 * value}px`),
    },
    Code: {
      opacity: progress,
      y: useTransform(progress, (value) => `${4 * (1 - value)}px`),
    },
  };
  let swap: ReturnType<typeof animate> | undefined;
  watch(
    [() => state.tab, reduce],
    ([view]) => {
      swap?.stop();
      swap = animate(progress, view === "Code" ? 1 : 0, {
        duration:
          (reduce.value ? DOCS_MOTION.reduced : DOCS_MOTION.swap) / 1000,
        ease: EASE_OUT,
      });
    },
    { flush: "sync" },
  );
  onBeforeUnmount(() => {
    swap?.stop();
    progress.destroy();
  });
  return {
    ...toRefs(state),
    reduce,
    canHover,
    swapLayers,
    id: useId(),
    setAttention(value: boolean) {
      state.iconActive = value;
    },
    replayScene() {
      ++state.replay;
    },
    toggleExpanded() {
      state.expanded = !state.expanded;
    },
    chooseTab(value: "Preview" | "Code") {
      state.tab = value;
    },
  };
}
