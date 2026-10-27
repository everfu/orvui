<script lang="ts">
import { defineComponent, inject } from "vue";
import { modalControl } from "./control";
import type { CenterModalContext } from "./context";
export default defineComponent({ name: "CenterMorphModalClose", inheritAttrs: false, setup(_, { attrs, slots }) {
  const state = inject<CenterModalContext>("orvui-center-modal");
  if (!state) throw new Error("CenterMorphModalClose must be inside CenterMorphModal");
  return () => modalControl(slots.default?.() ?? [], { ...attrs, onClick(event: MouseEvent) { if (!event.defaultPrevented) state.open.value = false; } });
} });
</script>
