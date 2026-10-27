<script setup lang="ts">
import { h, renderSlot, useAttrs } from "vue";
import { cn } from "../../../lib/utils";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{ placeholder?: boolean }>(), {
  placeholder: false,
});
const slots = defineSlots<{ default?(props: {}): any }>();
const attrs = useAttrs();
const frame =
  "grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-muted text-xs font-medium text-muted-foreground [&_img]:size-full [&_img]:object-cover [&_svg]:size-3.5";
const RenderFrame = () => {
  const presentation = props.placeholder
    ? { class: "invisible", hidden: true }
    : { class: undefined, hidden: undefined };
  return h(
    "div",
    {
      "data-slot": "message-avatar",
      ...attrs,
      "aria-hidden": presentation.hidden,
      class: cn(frame, presentation.class, attrs.class),
    },
    [renderSlot(slots, "default")],
  );
};
</script>
<template><RenderFrame /></template>
