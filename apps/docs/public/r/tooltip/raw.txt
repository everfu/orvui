<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { defineComponent, provide, useId, watch, type VNodeChild } from "vue";
import {
  createTooltip,
  tooltipKey,
  type TooltipRootProps,
  type TooltipContentProps,
} from "./context";
import TooltipTrigger from "./TooltipTrigger.vue";
import TooltipContent from "./TooltipContent.vue";
export interface TooltipProps extends TooltipRootProps, TooltipContentProps {
  content?: VNodeChild;
}
const props = withDefaults(defineProps<TooltipProps>(), {
  open: undefined,
  content: undefined,
  defaultOpen: false,
});
const emit = defineEmits(["update:open", "openChange"]);
const state = createTooltip(
  props,
  emit,
  props.id ?? useId(),
  props.content === null || props.content === "",
);
provide(tooltipKey, state);
watch(
  () => props.content,
  (content) => {
    if (content !== undefined)
      state.setEmpty(content === null || content === false || content === "");
  },
  { immediate: true },
);
const ContentValue = defineComponent({
  props: ["value"],
  setup: (props) => () => props.value,
});
</script>
<template>
  <template v-if="content !== undefined"
    ><TooltipTrigger v-if="$slots.default" as-child><slot /></TooltipTrigger
    ><TooltipContent
      v-bind="$attrs"
      :side="side"
      :align="align"
      :side-offset="sideOffset"
      :arrow="arrow"
      :anchor-point="anchorPoint"
      ><ContentValue :value="content" /></TooltipContent></template
  ><slot v-else />
</template>
