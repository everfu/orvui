<script setup lang="ts">
import { h, renderSlot, useAttrs } from "vue";
import { cn } from "../../../lib/utils";
defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<{ spacing?: "compact" | "default" }>(), {
  spacing: "compact",
});
const slots = defineSlots<{ default?(props: {}): any }>();
const attrs = useAttrs();
const gaps = { compact: "gap-1.5", default: "gap-3" } as const;
const RenderFrame = () =>
  h(
    "div",
    {
      "data-slot": "message-bubble-group",
      ...attrs,
      class: cn(
        "flex w-full flex-col",
        gaps[props.spacing === "compact" ? "compact" : "default"],
        attrs.class,
      ),
    },
    [renderSlot(slots, "default")],
  );
</script>
<template><RenderFrame /></template>
