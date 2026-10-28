import { reactive, toRefs, useId } from "vue";
import { useMediaQuery, useReducedMotion } from "../../../../packages/vue/src/lib/composables";
export function useMotionGuideScene() {
  const state = reactive({ replay: 0, iconActive: false, expanded: false, tab: "Preview" as "Preview" | "Code" });
  const reduce = useReducedMotion(), canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  return { ...toRefs(state), reduce, canHover, id: useId(),
    setAttention(value: boolean) { state.iconActive = value; },
    replayScene() { ++state.replay; },
    toggleExpanded() { state.expanded = !state.expanded; },
    chooseTab(value: "Preview" | "Code") { state.tab = value; },
  };
}
