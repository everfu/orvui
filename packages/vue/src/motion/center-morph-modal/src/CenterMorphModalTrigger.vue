<script lang="ts">
import { defineComponent, inject } from "vue";
import { modalControl } from "./control";
import type { CenterModalContext } from "./context";
export default defineComponent({ name: "CenterMorphModalTrigger", inheritAttrs: false, setup(_, { attrs, slots }) {
  const state = inject<CenterModalContext>("orvui-center-modal");
  if (!state) throw new Error("CenterMorphModalTrigger must be inside CenterMorphModal");
  return () => modalControl(slots.default?.() ?? [], {
    ...attrs, id: state.triggerId, "aria-haspopup": "dialog", "aria-expanded": state.open.value, "aria-controls": state.open.value ? state.contentId : undefined,
    onClick(event: MouseEvent) { if (!event.defaultPrevented) state.open.value = !state.open.value; },
  });
} });
</script>
